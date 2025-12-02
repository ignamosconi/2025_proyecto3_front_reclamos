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
import { type Purchase } from '../data/schema'

import { CreditCard, ArrowRightLeft, DollarSign, MoreHorizontal, FileCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreatePurchaseDto, purchasesService, UpdatePurchaseDto } from '@/services/purchases/purchases.service'
import { PurchaseDetailsTable } from './purchases-details-table'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Esquema para los detalles de compra
const purchaseDetailSchema = z.object({
  idProducto: z.number().min(1, 'Producto requerido'),
  cantidad: z.number().min(1, 'Cantidad mínima 1'),
  precio: z.number().optional(),
  nombreProducto: z.string().optional(),
})

export type PurchaseDetail = z.infer<typeof purchaseDetailSchema>

// Esquema del formulario
const formSchema = z.object({
  idProveedor: z.number().min(1, 'El proveedor es requerido'),
  metodoPago: z.string().min(1, 'El método de pago es requerido'),
  detalles: z.array(purchaseDetailSchema).min(1, 'Debe agregar al menos un producto'),
})

type PurchaseForm = z.infer<typeof formSchema>

type PurchaseMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Purchase
  onSuccess?: () => void
}

const metodoPagoOptions = [
  { value: 'Efectivo', label: 'Efectivo', icon: DollarSign },
  { value: 'Tarjeta de débito', label: 'Tarjeta de débito', icon: CreditCard },
  { value: 'Tarjeta de crédito', label: 'Tarjeta de crédito', icon: CreditCard },
  { value: 'Transferencia', label: 'Transferencia', icon: ArrowRightLeft },
  { value: 'Crédito', label: 'Crédito', icon: FileCheck },
  { value: 'Cheque', label: 'Cheque', icon: MoreHorizontal },
]

export function PurchasesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: PurchaseMutateDrawerProps) {
  const isUpdate = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [details, setDetails] = useState<PurchaseDetail[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  const form = useForm<PurchaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idProveedor: 0,
      metodoPago: '',
      detalles: [],
    },
  })

  // Cargar productos al abrir el drawer
  useEffect(() => {
    if (open) {
      loadProducts()
      loadSuppliers()
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

  const loadSuppliers = async () => {
    try {
      const data = await suppliersService.getAll()
      setSuppliers(data)
    } catch (error) {
      console.error('Error loading suppliers:', error)
    }
  }

  // Cargar datos cuando se edita una compra
  useEffect(() => {
    if (currentRow && open && products.length > 0) {
      // Transformar los detalles del backend al formato del frontend
      const transformedDetails: PurchaseDetail[] = currentRow.detalles
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
        idProveedor: currentRow.proveedor?.idProveedor || currentRow.idProveedor || 0,
        metodoPago: currentRow.metodoPago || '',
        detalles: transformedDetails,
      })
      setDetails(transformedDetails)
    } else if (!open) {
      form.reset({
        idProveedor: 0,
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

  // Limpiar detalles cuando cambia el proveedor (solo en modo creación o después de cargar)
  useEffect(() => {
    const subscription = form.watch((_value, { name }) => {
      if (name === 'idProveedor' && !currentRow) {
        // Solo limpiar detalles si no estamos editando
        setDetails([])
      }
    })
    return () => subscription.unsubscribe()
  }, [form, currentRow])

  const onSubmit = async (values: PurchaseForm) => {
    try {
      setIsSubmitting(true)

      if (isUpdate && currentRow) {
        // Actualizar compra
        const updateData: UpdatePurchaseDto = {
          idProveedor: values.idProveedor,
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

        await purchasesService.update(currentRow.id, updateData)
        toast.success('Compra actualizada correctamente')
      } else {
        // Crear nueva compra
        const createData: CreatePurchaseDto = {
          idProveedor: values.idProveedor,
          metodoPago: values.metodoPago,
          detalles: values.detalles.map(d => ({
            idProducto: d.idProducto,
            cantidad: d.cantidad,
          })),
        }

        await purchasesService.create(createData)
        toast.success('Compra creada correctamente')
      }

      form.reset()
      setDetails([])
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar compra:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar la compra'
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
          <SheetTitle>{isUpdate ? 'Editar' : 'Crear'} compra</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Actualiza la información de la compra.'
              : 'Crea una nueva compra agregando productos.'} {""}
             Haz clic en guardar cuando termines.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='purchase-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='idProveedor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Seleccionar proveedor' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem 
                          key={supplier.idProveedor} 
                          value={String(supplier.idProveedor)}
                        >
                          {supplier.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <PurchaseDetailsTable 
                details={details} 
                setDetails={setDetails}
                idProveedor={form.watch('idProveedor')}
              />
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
          <Button form='purchase-form' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
