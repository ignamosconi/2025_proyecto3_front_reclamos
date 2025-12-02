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
import { Textarea } from '@/components/ui/textarea'
import { areasService, type CreateAreaDto, type UpdateAreaDto } from '@/services/areas/areas.service'
import { toast } from 'sonner'
import { type Area } from '../data/schema'

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  descripcion: z.string().optional(),
})

type AreaForm = z.infer<typeof formSchema>

type AreaActionDialogProps = {
  currentRow?: Area
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AreaActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: AreaActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<AreaForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          descripcion: currentRow.descripcion || '',
        }
      : {
          nombre: '',
          descripcion: '',
        },
  })

  const onSubmit = async (values: AreaForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        const updateData: UpdateAreaDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }
        
        await areasService.update(currentRow._id, updateData)
        toast.success('Área actualizada correctamente')
      } else {
        const createData: CreateAreaDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }
        
        await areasService.create(createData)
        toast.success('Área creada correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar área:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar el área'
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
          <DialogTitle>{isEdit ? 'Editar área' : 'Agregar nueva área'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Actualiza la información del área. Haz clic en guardar cuando termines.' 
              : 'Crea una nueva área responsable. El nombre debe ser único en el sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='area-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Ventas'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='descripcion'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ej: Área encargada de ventas y clientes'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='area-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

