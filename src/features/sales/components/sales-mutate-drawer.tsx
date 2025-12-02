'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { type Sale } from '../data/schema'
import { CreateSaleDto, salesService, UpdateSaleDto } from '@/services/sales/sales.service'
import { SaleDetailsTable } from './sale-details-table'
import { CreditCard, ArrowRightLeft, DollarSign, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// Esquema para los detalles de venta
const saleDetailSchema = z.object({
  idProducto: z.number().min(1, 'Producto requerido'),
  cantidad: z.number().min(1, 'Cantidad mínima 1'),
  precio: z.number().optional(),
  nombreProducto: z.string().optional(),
})

export type SaleDetail = z.infer<typeof saleDetailSchema>

// Esquema del formulario
const formSchema = z.object({
  metodoPago: z.string().min(1, 'El método de pago es requerido'),
  detalles: z.array(saleDetailSchema).min(1, 'Debe agregar al menos un producto'),
})

type SaleForm = z.infer<typeof formSchema>

type SaleMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Sale
  onSuccess?: () => void
}

const metodoPagoOptions = [
  { value: 'Tarjeta de Crédito', label: 'Tarjeta de crédito', icon: CreditCard },
  { value: 'Tarjeta de Débito', label: 'Tarjeta de débito', icon: CreditCard },
  { value: 'Transferencia', label: 'Transferencia', icon: ArrowRightLeft },
  { value: 'Efectivo', label: 'Efectivo', icon: DollarSign },
  { value: 'Otro', label: 'Otro', icon: MoreHorizontal },
]

export function SalesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: SaleMutateDrawerProps) {
  const isUpdate = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [details, setDetails] = useState<SaleDetail[]>([])
  const [products, setProducts] = useState<any[]>([])

  const form = useForm<SaleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metodoPago: '',
      detalles: [],
    },
  })

  // Cargar productos al abrir el drawer
  useEffect(() => {
    if (open) {
      loadProducts()
    }
  }, [open])

  const loadProducts = async () => {
    try {
      const { productsService } = await import('@/services/products/products.service')
      const data = await productsService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  // Cargar datos cuando se edita una venta
  useEffect(() => {
    if (currentRow && open && products.length > 0) {
      // Transformar los detalles del backend al formato del frontend
      const transformedDetails: SaleDetail[] = currentRow.detalles
        ?.filter((detalle: any) => detalle.idProducto !== undefined && detalle.idProducto !== null)
        .map((detalle: any) => {
          // Buscar el producto en la lista de productos para obtener su nombre
          const product = products.find((p: any) => p.idProducto === detalle.idProducto)
          
          return {
            idProducto: Number(detalle.idProducto),
            cantidad: Number(detalle.cantidad),
            precio: Number(detalle.precioUnitario),
            nombreProducto: product?.nombre || detalle.producto?.nombre || `Producto ${detalle.idProducto}`,
          }
        }) || []

      form.reset({
        metodoPago: currentRow.metodoPago || '',
        detalles: transformedDetails,
      })
      setDetails(transformedDetails)
    } else if (!open) {
      form.reset({
        metodoPago: '',
        detalles: [],
      })
      setDetails([])
    }
  }, [currentRow, open, products, form])

  // Actualizar el formulario cuando cambian los detalles
  useEffect(() => {
    form.setValue('detalles', details)
  }, [details, form])

  const onSubmit = async (values: SaleForm) => {
    try {
      setIsSubmitting(true)

      if (isUpdate && currentRow) {
        // Actualizar venta
        const updateData: UpdateSaleDto = {
          metodoPago: values.metodoPago,
        }

        // Solo enviar detalles si hay cambios en los productos
        if (values.detalles && values.detalles.length > 0) {
          updateData.detalles = values.detalles
            .filter(d => d.idProducto && d.cantidad) // Filtrar detalles válidos
            .map(d => ({
              idProducto: Number(d.idProducto),
              cantidad: Number(d.cantidad),
            }))
        }

        await salesService.update(currentRow.id, updateData)
        toast.success('Venta actualizada correctamente')
      } else {
        // Crear nueva venta
        const createData: CreateSaleDto = {
          metodoPago: values.metodoPago,
          detalles: values.detalles.map(d => ({
            idProducto: d.idProducto,
            cantidad: d.cantidad,
          })),
        }

        await salesService.create(createData)
        toast.success('Venta creada correctamente')
      }

      form.reset()
      setDetails([])
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar venta:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar la venta'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          form.reset()
          setDetails([])
        }
        onOpenChange(v)
      }}
    >
      <SheetContent className='flex flex-col sm:max-w-2xl'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Editar' : 'Crear'} venta</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Actualiza la información de la venta.'
              : 'Crea una nueva venta agregando productos.'} {""}
             Haz clic en guardar cuando termines.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='sale-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='metodoPago'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pago</FormLabel>
                  <FormControl>
                    <div className='grid grid-cols-2 gap-3'>
                      {metodoPagoOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            type='button'
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              'flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                              field.value === option.value
                                ? 'border-primary bg-primary/10 shadow-md'
                                : 'border-muted bg-background'
                            )}
                          >
                            <Icon className='h-6 w-6' />
                            <span className='text-sm font-medium'>{option.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <FormLabel>Productos</FormLabel>
              <SaleDetailsTable details={details} setDetails={setDetails} />
              {form.formState.errors.detalles && (
                <p className='text-sm font-medium text-destructive'>
                  {form.formState.errors.detalles.message}
                </p>
              )}
            </div>
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline' disabled={isSubmitting}>
              Cancelar
            </Button>
          </SheetClose>
          <Button form='sale-form' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
