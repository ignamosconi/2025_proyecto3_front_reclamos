'use client'

import { useQuery } from '@tanstack/react-query'
import { reclamosService, EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Calendar, FileText, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'

interface RecentSynthesisProps {
  limit?: number
}

export function RecentSynthesis({ limit = 10 }: RecentSynthesisProps) {
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')

  // Fetch closed claims (Resuelto or Rechazado)
  const { data: closedClaimsResponse, isLoading: claimsLoading } = useQuery({
    queryKey: ['closed-claims'],
    queryFn: async () => {
      const resuelto = await reclamosService.getAll({
        page: 1,
        limit: 100,
        estado: EstadoReclamo.RESUELTO,
      })
      const rechazado = await reclamosService.getAll({
        page: 1,
        limit: 100,
        estado: EstadoReclamo.RECHAZADO,
      })
      return {
        data: [...resuelto.data, ...rechazado.data],
        total: resuelto.total + rechazado.total,
      }
    },
    enabled: isClient,
  })

  // Fetch synthesis for all closed claims
  const { data: allSynthesis, isLoading: synthesisLoading } = useQuery({
    queryKey: ['all-synthesis', closedClaimsResponse?.data],
    queryFn: async () => {
      if (!closedClaimsResponse?.data) return []

      const synthesisPromises = closedClaimsResponse.data.map(async (claim) => {
        try {
          const synthesis = await reclamosService.getSynthesis(claim._id)
          return synthesis.map((s) => ({
            ...s,
            claimId: claim._id,
            claimTitle: claim.titulo,
            claimEstado: claim.estado,
          }))
        } catch (error) {
          console.error(`Error fetching synthesis for claim ${claim._id}:`, error)
          return []
        }
      })

      const results = await Promise.all(synthesisPromises)
      return results.flat()
    },
    enabled: !!closedClaimsResponse?.data && closedClaimsResponse.data.length > 0,
  })

  if (!isClient) {
    return null
  }

  if (claimsLoading || synthesisLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className='pb-3'>
              <Skeleton className='h-5 w-48' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-16 w-full' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!allSynthesis || allSynthesis.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 px-4'>
        <div className='rounded-full bg-muted p-4 mb-4'>
          <FileText className='h-8 w-8 text-muted-foreground' />
        </div>
        <p className='text-muted-foreground text-sm text-center max-w-md'>
          No hay síntesis disponibles en este momento.
          Los reclamos cerrados mostrarán sus síntesis aquí cuando estén disponibles.
        </p>
      </div>
    )
  }

  // Sort by date (newest first) and limit
  const sortedSynthesis = [...allSynthesis]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    .slice(0, limit)

  return (
    <div className='space-y-4'>
      {sortedSynthesis.map((sintesis) => (
        <Card
          key={sintesis._id}
          className='hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/50'
        >
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-md bg-primary/10 p-1.5'>
                    <FileText className='h-4 w-4 text-primary' />
                  </div>
                  <CardTitle className='text-base font-semibold'>
                    {sintesis.nombre || 'Síntesis del Reclamo'}
                  </CardTitle>
                </div>
                <div className='flex items-center gap-2 flex-wrap'>
                  <Badge
                    variant={
                      sintesis.claimEstado === EstadoReclamo.RESUELTO
                        ? 'default'
                        : 'destructive'
                    }
                    className='text-xs font-medium'
                  >
                    {sintesis.claimEstado}
                  </Badge>
                  <span className='text-sm text-muted-foreground font-medium'>
                    {sintesis.claimTitle}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-foreground/80 leading-relaxed line-clamp-3'>
              {sintesis.descripcion}
            </p>
            <div className='flex items-center justify-between pt-2 border-t'>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <Calendar className='h-4 w-4' />
                <span className='font-medium'>
                  {new Date(sintesis.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='h-8 text-xs font-medium'
                asChild
              >
                <Link
                  to='/reclamos'
                  search={{ page: 1, pageSize: 10 }}
                  className='flex items-center gap-1.5'
                >
                  Ver detalles
                  <ArrowRight className='h-3.5 w-3.5' />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


