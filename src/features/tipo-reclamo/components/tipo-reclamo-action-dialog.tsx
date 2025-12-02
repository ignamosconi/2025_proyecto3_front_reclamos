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
import { tipoReclamoService, type CreateTipoReclamoDto, type UpdateTipoReclamoDto } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { toast } from 'sonner'
import { type TipoReclamo } from '../data/schema'

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  descripcion: z.string().optional(),
})

type TipoReclamoForm = z.infer<typeof formSchema>

type TipoReclamoActionDialogProps = {
  currentRow?: TipoReclamo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TipoReclamoActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: TipoReclamoActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<TipoReclamoForm>({
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

  const onSubmit = async (values: TipoReclamoForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        const updateData: UpdateTipoReclamoDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }
        
        await tipoReclamoService.update(currentRow._id, updateData)
        toast.success('Tipo de reclamo actualizado correctamente')
      } else {
        const createData: CreateTipoReclamoDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }
        
        await tipoReclamoService.create(createData)
        toast.success('Tipo de reclamo creado correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar tipo de reclamo:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar el tipo de reclamo'
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
          <DialogTitle>{isEdit ? 'Editar tipo de reclamo' : 'Agregar nuevo tipo de reclamo'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Actualiza la información del tipo de reclamo. Haz clic en guardar cuando termines.' 
              : 'Crea un nuevo tipo de reclamo. El nombre debe ser único en el sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='tipo-reclamo-form'
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
                      placeholder='Ej: Error de Facturación'
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
                      placeholder='Ej: Problemas en el cobro o datos de la factura'
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
          <Button type='submit' form='tipo-reclamo-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

