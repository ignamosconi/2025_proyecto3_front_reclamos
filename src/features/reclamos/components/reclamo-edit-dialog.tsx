'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
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
import { reclamosService, EstadoReclamo, type UpdateReclamoDto } from '@/services/reclamos/reclamos.service'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { type Reclamo } from '../data/schema'

const formSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  descripcion: z.string().min(3, 'La descripción debe tener al menos 3 caracteres.'),
})

type ReclamoForm = z.infer<typeof formSchema>

type ReclamoEditDialogProps = {
  currentRow: Reclamo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReclamoEditDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ReclamoEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canEdit = currentRow.estado === EstadoReclamo.PENDIENTE

  const form = useForm<ReclamoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: currentRow.titulo,
      descripcion: currentRow.descripcion,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        titulo: currentRow.titulo,
        descripcion: currentRow.descripcion,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = async (values: ReclamoForm) => {
    if (!canEdit) {
      toast.error('Solo se pueden editar reclamos en estado Pendiente')
      return
    }

    try {
      setIsSubmitting(true)
      
      const updateData: UpdateReclamoDto = {
        titulo: values.titulo,
        descripcion: values.descripcion,
      }
      
      await reclamosService.update(currentRow._id, updateData)
      toast.success('Reclamo actualizado correctamente')
      
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al actualizar reclamo:', error)
      const errorMessage = error.response?.data?.message || 'Error al actualizar el reclamo'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isSubmitting) {
          form.reset()
          onOpenChange(state)
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Editar reclamo</DialogTitle>
          <DialogDescription>
            Solo puedes editar el título y la descripción de reclamos en estado Pendiente.
          </DialogDescription>
        </DialogHeader>
        
        {!canEdit && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Este reclamo está en estado "{currentRow.estado}" y no puede ser editado. 
              Solo los reclamos en estado Pendiente pueden ser modificados.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            id='reclamo-edit-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='titulo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Fallo en la carga del módulo A'
                      autoComplete='off'
                      disabled={!canEdit}
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
                  <FormLabel>
                    Descripción <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Descripción del problema'
                      className='min-h-[100px]'
                      disabled={!canEdit}
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
          <Button 
            type='submit' 
            form='reclamo-edit-form' 
            disabled={isSubmitting || !canEdit}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


