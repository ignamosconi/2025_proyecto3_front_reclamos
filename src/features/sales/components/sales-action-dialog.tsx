'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { type Sale } from '../data/schema'
import { CreateSaleDto, salesService, UpdateSaleDto } from '@/services/sales/sales.service'

const formSchema = z
  .object({
    metodoPago: z.string().min(1, 'El método de pago es requerido.'),
    isEdit: z.boolean(),
  })

type SaleForm = z.infer<typeof formSchema>

type SaleActionDialogProps = {
  currentRow?: Sale
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SalesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: SaleActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<SaleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          metodoPago: currentRow.metodoPago || '',
          isEdit,
        }
      : {
          metodoPago: '',
          isEdit,
        },
  })

  const onSubmit = async (values: SaleForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar venta
        const updateData: UpdateSaleDto = {
          metodoPago: values.metodoPago,
        }

        await salesService.update(currentRow.id, updateData)
        toast.success('Venta actualizada correctamente')
      } else {
        // Crear nueva venta
        const createData: CreateSaleDto = {
          metodoPago: values.metodoPago,
          detalles: [], // Detalles vacíos por ahora
        }
        
        await salesService.create(createData)
        toast.success('Venta creada correctamente')
      }
      
      form.reset()
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
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar venta' : 'Agregar nueva venta'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información de la venta. Haz clic en guardar cuando termines.'
              : 'Crea una nueva venta. Haz clic en guardar cuando termines.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='line-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='metodoPago'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Método de Pago
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Efectivo, Tarjeta'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='line-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
