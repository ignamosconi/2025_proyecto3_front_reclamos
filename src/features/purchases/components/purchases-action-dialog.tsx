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
import { type Purchase } from '../data/schema'
import { CreatePurchaseDto, purchasesService, UpdatePurchaseDto } from '@/services/purchases/purchases.service'


const formSchema = z
  .object({
    idProveedor: z.number().min(1, 'El proveedor es requerido.'),
    metodoPago: z.string().min(1, 'El método de pago es requerido.'),
    isEdit: z.boolean(),
  })

type PurchaseForm = z.infer<typeof formSchema>

type PurchaseActionDialogProps = {
  currentRow?: Purchase
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function PurchasesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: PurchaseActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<PurchaseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          idProveedor: currentRow.idProveedor || 0,
          metodoPago: currentRow.metodoPago || '',
          isEdit,
        }
      : {
          idProveedor: 0,
          metodoPago: '',
          isEdit,
        },
  })

  const onSubmit = async (values: PurchaseForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar compra
        const updateData: UpdatePurchaseDto = {
          idProveedor: values.idProveedor,
          metodoPago: values.metodoPago,
        }

        await purchasesService.update(currentRow.id, updateData)
        toast.success('Compra actualizada correctamente')
      } else {
        // Crear nueva compra   
        const createData: CreatePurchaseDto = {
          idProveedor: values.idProveedor,
          metodoPago: values.metodoPago,
          detalles: [], // Detalles vacíos por ahora
        }
        
        await purchasesService.create(createData)
        toast.success('Compra creada correctamente')
      }
      
      form.reset()
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
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar compra' : 'Agregar nueva compra'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información de la compra. Haz clic en guardar cuando termines.'
              : 'Crea una nueva compra. Haz clic en guardar cuando termines.'}
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
                name='idProveedor'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Proveedor ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='ID del proveedor'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
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
