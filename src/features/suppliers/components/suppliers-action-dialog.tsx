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
import { suppliersService, type CreateSupplierDto, type UpdateSupplierDto } from '@/services/suppliers/suppliers.service'
import { toast } from 'sonner'
import { type Supplier } from '../data/schema'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
  })
  .extend({
    isEdit: z.boolean(),
  })

type SupplierForm = z.infer<typeof formSchema>

type SupplierActionDialogProps = {
  currentRow?: Supplier
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SuppliersActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: SupplierActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<SupplierForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          direccion: currentRow.direccion ?? '',
          telefono: currentRow.telefono ?? '',
          isEdit,
        }
      : {
          nombre: '',
          direccion: '',
          telefono: '',
          isEdit,
        },
  })

  const onSubmit = async (values: SupplierForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar proveedor
        const updateData: UpdateSupplierDto = {
          nombre: values.nombre,
          direccion: values.direccion ?? "",
          telefono: values.telefono ?? "",
        }

        await suppliersService.update(currentRow.idProveedor, updateData)
        toast.success('Proveedor actualizado correctamente')
      } else {
        // Crear nuevo proveedor 
        const createData: CreateSupplierDto = {
          nombre: values.nombre,
          direccion: values.direccion ?? "",
          telefono: values.telefono ?? "",
        }
        
        await suppliersService.create(createData)
        toast.success('Proveedor creado correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar proveedor:', error)
      
      // Manejar errores específicos
      if (error.response?.status === 409) {
        toast.error('Ya existe un proveedor con ese nombre')
      } else {
        const errorMessage = error.response?.data?.message || 'Error al guardar el proveedor'
        toast.error(errorMessage)
      }
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
          <DialogTitle>{isEdit ? 'Editar proveedor' : 'Agregar nuevo proveedor'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información del proveedor. Haz clic en guardar cuando termines.'
              : 'Crea un nuevo proveedor. Haz clic en guardar cuando termines.'}
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
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Proveedor S.A.'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='direccion'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Dirección
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Calle Falsa 123'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='telefono'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Teléfono
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123456789'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
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
