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
import { linesService, type CreateLineDto, type UpdateLineDto } from '@/services/lines/lines.service'
import { toast } from 'sonner'
import { type Line } from '../data/schema'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    isEdit: z.boolean(),
  })

type LineForm = z.infer<typeof formSchema>

type LineActionDialogProps = {
  currentRow?: Line
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function LinesActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: LineActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<LineForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          isEdit,
        }
      : {
          nombre: '',
          isEdit,
        },
  })

  const onSubmit = async (values: LineForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar línea
        const updateData: UpdateLineDto = {
          nombre: values.nombre,
        }

        await linesService.update(currentRow.id, updateData)
        toast.success('Línea de producto actualizada correctamente')
      } else {
        // Crear nueva línea
        const createData: CreateLineDto = {
          nombre: values.nombre,
        }
        
        await linesService.create(createData)
        toast.success('Línea de producto creada correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar línea de producto:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar la línea de producto'
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
          <DialogTitle>{isEdit ? 'Editar línea de producto' : 'Agregar nueva línea de producto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información de la línea de producto. Haz clic en guardar cuando termines.'
              : 'Crea una nueva línea de producto. Haz clic en guardar cuando termines.'}
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
                        placeholder='Ej: Línea Premium'
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
