'use client'

import { useQuery } from '@tanstack/react-query'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Building2 } from 'lucide-react'

type ReclamoSynthesisListProps = {
  reclamoId: string
}

export function ReclamoSynthesisList({ reclamoId }: ReclamoSynthesisListProps) {
  const { data: synthesis, isLoading, error } = useQuery({
    queryKey: ['synthesis', reclamoId],
    queryFn: () => reclamosService.getSynthesis(reclamoId),
    enabled: !!reclamoId,
  })

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-sm text-muted-foreground'>
        Error al cargar las síntesis
      </div>
    )
  }

  if (!synthesis || synthesis.length === 0) {
    return (
      <div className='text-sm text-muted-foreground text-center py-8'>
        No hay síntesis registradas para este reclamo.
      </div>
    )
  }

  // Ordenar por fecha (más reciente primero)
  const sortedSynthesis = [...synthesis].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  return (
    <div className='space-y-4'>
      {sortedSynthesis.map((sintesis) => (
        <Card key={sintesis._id}>
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between'>
              <CardTitle className='text-base'>
                {sintesis.nombre || 'Síntesis'}
              </CardTitle>
              <Badge variant='secondary' className='text-xs'>
                {new Date(sintesis.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {sintesis.descripcion}
            </p>
            
            <Separator />
            
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <User className='h-4 w-4' />
                <span>
                  {sintesis.fkCreador.firstName} {sintesis.fkCreador.lastName}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Building2 className='h-4 w-4' />
                <span>{sintesis.fkArea.nombre}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>
                  {new Date(sintesis.createdAt).toLocaleString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


