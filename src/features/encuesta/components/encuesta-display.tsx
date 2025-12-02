'use client'

import { useQuery } from '@tanstack/react-query'
import { encuestaService, type Encuesta } from '@/services/encuesta/encuesta.service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Star, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type EncuestaDisplayProps = {
  reclamoId: string
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-5 w-5 ${
        index < rating
          ? 'fill-yellow-400 text-yellow-400'
          : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
      }`}
    />
  ))
}

export function EncuestaDisplay({ reclamoId }: EncuestaDisplayProps) {
  const { data: encuesta, isLoading, error } = useQuery<Encuesta | null>({
    queryKey: ['encuesta', reclamoId],
    queryFn: () => encuestaService.getByReclamoId(reclamoId),
    enabled: !!reclamoId,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Encuesta de Satisfacción</CardTitle>
          <CardDescription>Cargando encuesta...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Encuesta de Satisfacción</CardTitle>
          <CardDescription className='text-destructive'>
            Error al cargar la encuesta
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!encuesta) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encuesta de Satisfacción</CardTitle>
        <CardDescription>
          Retroalimentación del cliente sobre la gestión del reclamo
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Calificación:</span>
            <div className='flex items-center gap-1'>
              {renderStars(encuesta.calificacion)}
            </div>
            <span className='text-sm text-muted-foreground'>
              ({encuesta.calificacion}/5)
            </span>
          </div>
        </div>

        <Separator />

        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm font-medium'>
            <User className='h-4 w-4' />
            <span>Comentario del Cliente:</span>
          </div>
          <p className='text-sm text-muted-foreground whitespace-pre-wrap pl-6'>
            {encuesta.descripcion}
          </p>
        </div>

        <Separator />

        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Calendar className='h-3 w-3' />
          <span>
            Completada el{' '}
            {format(new Date(encuesta.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
              locale: es,
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

