'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { encuestaService, type CreateEncuestaDto } from '@/services/encuesta/encuesta.service'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'

const formSchema = z.object({
  calificacion: z.number().min(1, 'Debes seleccionar una calificación.').max(5),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres.')
    .max(1000, 'La descripción no puede exceder 1000 caracteres.'),
})

type EncuestaFormType = z.infer<typeof formSchema>

type EncuestaFormProps = {
  reclamoId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function EncuestaForm({ reclamoId, onSuccess, onCancel }: EncuestaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<EncuestaFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calificacion: 0,
      descripcion: '',
    },
  })


  const onSubmit = async (values: EncuestaFormType) => {
    try {
      setIsSubmitting(true)

      const data: CreateEncuestaDto = {
        calificacion: values.calificacion,
        descripcion: values.descripcion.trim(),
      }

      await encuestaService.create(reclamoId, data)
      toast.success('Encuesta enviada correctamente. ¡Gracias por tu retroalimentación!')

      // Invalidar la query de encuesta para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['encuesta', reclamoId] })
      queryClient.invalidateQueries({ queryKey: ['reclamos'] })

      form.reset()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al enviar encuesta:', error)
      const errorMessage =
        error.response?.data?.message || 'Error al enviar la encuesta. Por favor, intenta nuevamente.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (rating: number) => {
    form.setValue('calificacion', rating, { shouldValidate: true })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1
      return (
        <button
          key={index}
          type='button'
          onClick={() => handleStarClick(starValue)}
          disabled={isSubmitting}
          className='focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded'
          aria-label={`Calificar con ${starValue} estrella${starValue > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              starValue <= rating
                ? 'fill-yellow-400 text-yellow-400 hover:fill-yellow-500 hover:text-yellow-500'
                : 'fill-gray-200 text-gray-200 hover:fill-gray-300 hover:text-gray-300 dark:fill-gray-700 dark:text-gray-700'
            } ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          />
        </button>
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='calificacion'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Calificación <span className='text-destructive'>*</span>
              </FormLabel>
              <FormDescription>
                ¿Qué tan satisfecho estás con la gestión de este reclamo? (1 = Muy insatisfecho, 5 =
                Excelente)
              </FormDescription>
              <FormControl>
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-2'>{renderStars(field.value || 0)}</div>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    value={field.value?.toString() || ''}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Selecciona una calificación' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='1'>1 - Muy insatisfecho</SelectItem>
                      <SelectItem value='2'>2 - Insatisfecho</SelectItem>
                      <SelectItem value='3'>3 - Neutral</SelectItem>
                      <SelectItem value='4'>4 - Satisfecho</SelectItem>
                      <SelectItem value='5'>5 - Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <FormDescription>
                Por favor, comparte tus comentarios sobre cómo percibiste la gestión del reclamo.
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder='Escribe tus comentarios aquí...'
                  className='min-h-[120px]'
                  maxLength={1000}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <div className='flex justify-between items-center'>
                <FormMessage />
                <span className='text-xs text-muted-foreground'>
                  {field.value?.length || 0}/1000 caracteres
                </span>
              </div>
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-3'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Encuesta'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

