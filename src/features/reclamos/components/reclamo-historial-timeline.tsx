'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Loader2, 
  MessageSquare, 
  User, 
  Calendar, 
  Clock,
  UserCheck,
  UserPlus,
  UserMinus,
  RefreshCw,
  FolderSync,
  Sparkles,
  Pin,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  historialService,
  type HistorialEvent,
  getAccionLabel,
  getAccionIconName,
  getAccionColor,
  AccionesHistorial,
} from '@/services/historial'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

type ReclamoHistorialTimelineProps = {
  reclamoId: string
}

export function ReclamoHistorialTimeline({ reclamoId }: ReclamoHistorialTimelineProps) {
  const { auth } = useAuthStore()
  const isStaff = auth.hasRole(['Encargado', 'Gerente'])
  const [comentario, setComentario] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: historial,
    isLoading,
    error,
    refetch,
  } = useQuery<HistorialEvent[]>({
    queryKey: ['historial', reclamoId],
    queryFn: () => historialService.getByReclamoId(reclamoId),
    enabled: !!reclamoId,
  })

  const handleSubmitComentario = async () => {
    if (!comentario.trim()) {
      toast.error('El comentario no puede estar vacío')
      return
    }

    setIsSubmitting(true)
    try {
      await historialService.addComentario(reclamoId, comentario.trim())
      toast.success('Comentario agregado exitosamente')
      setComentario('')
      refetch()
    } catch (error) {
      console.error('Error al agregar comentario:', error)
      toast.error('Error al agregar el comentario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  }

  const formatHora = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAccionIcon = (accion: AccionesHistorial) => {
    const iconName = getAccionIconName(accion)
    const iconProps = { className: 'h-6 w-6' }
    
    switch (iconName) {
      case 'UserCheck': return <UserCheck {...iconProps} />
      case 'UserPlus': return <UserPlus {...iconProps} />
      case 'UserMinus': return <UserMinus {...iconProps} />
      case 'MessageSquare': return <MessageSquare {...iconProps} />
      case 'RefreshCw': return <RefreshCw {...iconProps} />
      case 'FolderSync': return <FolderSync {...iconProps} />
      case 'Sparkles': return <Sparkles {...iconProps} />
      default: return <Pin {...iconProps} />
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-sm text-destructive'>Error al cargar el historial</p>
      </div>
    )
  }

  if (!historial || historial.length === 0) {
    return (
      <div className='text-center py-8'>
        <p className='text-sm text-muted-foreground'>No hay eventos en el historial</p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Formulario para agregar comentarios (solo staff) */}
      {isStaff && (
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm font-medium'>
                <MessageSquare className='h-4 w-4' />
                Agregar comentario
              </div>
              <Textarea
                placeholder='Escribe un comentario sobre este reclamo...'
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
                className='resize-none'
              />
              <div className='flex justify-end'>
                <Button
                  size='sm'
                  onClick={handleSubmitComentario}
                  disabled={isSubmitting || !comentario.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Enviando...
                    </>
                  ) : (
                    'Agregar comentario'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline de eventos */}
      <div className='relative'>
        {/* Línea vertical del timeline */}
        <div className='absolute left-[29px] top-0 bottom-0 w-0.5 bg-border' />

        {/* Eventos */}
        <div className='space-y-6'>
          {historial.map((evento) => (
            <div key={evento._id} className='relative flex gap-4'>
              {/* Icono del evento */}
              <div
                className={`flex-shrink-0 w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center z-10 ${getAccionColor(
                  evento.accion
                )}`}
              >
                {getAccionIcon(evento.accion)}
              </div>

              {/* Contenido del evento */}
              <Card className='flex-1'>
                <CardContent className='pt-4 pb-4'>
                  <div className='space-y-3'>
                    {/* Header: Acción y fecha */}
                    <div className='flex items-center justify-between gap-4'>
                      <Badge variant='outline' className='font-semibold'>
                        {getAccionLabel(evento.accion)}
                      </Badge>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {formatFecha(evento.fecha_hora)}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='h-3 w-3' />
                          {formatHora(evento.fecha_hora)}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Responsable */}
                    <div className='flex items-center gap-2 text-sm'>
                         <User className='h-4 w-4 text-muted-foreground' />
                         <span className='text-muted-foreground'>Responsable: </span>
                      <span className='font-medium'>
                          {evento.responsable.firstName} {evento.responsable.lastName}
                      </span>
                      <span>
                        ({evento.responsable.email})
                      </span>
                    </div>

                    {/* Detalle */}
                    <div className='space-y-2'>
                      <p className='text-sm font-medium'>Detalle:</p>
                      <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                        {evento.detalle}
                      </p>
                    </div>

                    {/* Metadata (si existe) */}
                    {evento.metadata && Object.keys(evento.metadata).length > 0 && (
                      <div className='space-y-2'>
                        <p className='text-xs font-medium text-muted-foreground'>
                          Información adicional:
                        </p>
                        <div className='bg-muted/50 rounded-md p-3 space-y-1'>
                          {evento.metadata.estadoAnterior && (
                            <div className='text-xs'>
                              <span className='font-medium'>Estado anterior:</span>{' '}
                              <span className='text-muted-foreground'>
                                {evento.metadata.estadoAnterior}
                              </span>
                            </div>
                          )}
                          {evento.metadata.estadoNuevo && (
                            <div className='text-xs'>
                              <span className='font-medium'>Estado nuevo:</span>{' '}
                              <span className='text-muted-foreground'>
                                {evento.metadata.estadoNuevo}
                              </span>
                            </div>
                          )}
                          {evento.metadata.areaAnterior && (
                            <div className='text-xs'>
                              <span className='font-medium'>Área anterior:</span>{' '}
                              <span className='text-muted-foreground'>
                                {evento.metadata.areaAnterior}
                              </span>
                            </div>
                          )}
                          {evento.metadata.areaNueva && (
                            <div className='text-xs'>
                              <span className='font-medium'>Área nueva:</span>{' '}
                              <span className='text-muted-foreground'>
                                {evento.metadata.areaNueva}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
