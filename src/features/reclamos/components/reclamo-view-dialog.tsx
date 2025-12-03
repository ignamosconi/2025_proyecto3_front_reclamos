'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstadoReclamo, Prioridad, Criticidad } from '@/services/reclamos/reclamos.service'
import { type Reclamo } from '../data/schema'
import { ReclamoSynthesisList } from './reclamo-synthesis-list'
import { ReclamoImagesList } from './reclamo-images-list'
import { ReclamoHistorialTimeline } from './reclamo-historial-timeline'
import { EncuestaDisplay } from '@/features/encuesta/components/encuesta-display'
import { useReclamos } from './reclamos-provider'
import { useAuthStore } from '@/stores/auth-store'
import { Settings, GitBranch, UserPlus } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { encuestaService } from '@/services/encuesta/encuesta.service'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'

type ReclamoViewDialogProps = {
  currentRow: Reclamo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReclamoViewDialog({
  currentRow,
  open,
  onOpenChange,
}: ReclamoViewDialogProps) {
  const { setOpen } = useReclamos()
  const { auth } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isStaff = auth.hasRole(['Encargado', 'Gerente'])
  const isClient = auth.hasRole('Cliente')
  const isFinalState = currentRow.estado === EstadoReclamo.RESUELTO || currentRow.estado === EstadoReclamo.RECHAZADO

  const [encargados, setEncargados] = useState<any[]>([])

  // Fetch survey if claim is in final state
  const { data: encuesta, isLoading: isLoadingEncuesta } = useQuery({
    queryKey: ['encuesta', currentRow._id],
    queryFn: () => encuestaService.getByReclamoId(currentRow._id),
    enabled: open && isFinalState,
  })

  // Fetch encargados asignados al reclamo
  const { data: encargadosData, isLoading: isLoadingEncargados } = useQuery({
    queryKey: ['encargados', currentRow._id],
    queryFn: () => reclamosService.getEncargados(currentRow._id),
    enabled: open && isStaff,
  })

  useEffect(() => {
    if (encargadosData) {
      setEncargados(encargadosData)
    }
  }, [encargadosData])

  // Mutation para autoasignarse
  const autoAssignMutation = useMutation({
    mutationFn: () => reclamosService.autoAssign(currentRow._id, auth.user?.id || ''),
    onSuccess: () => {
      toast.success('Te has asignado exitosamente al reclamo')
      queryClient.invalidateQueries({ queryKey: ['reclamos'] })
      queryClient.invalidateQueries({ queryKey: ['encargados', currentRow._id] })
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al autoasignarse al reclamo')
    },
  })

  const handleChangeState = () => {
    setOpen('change-state')
  }

  const handleReassignArea = () => {
    setOpen('reassign-area')
  }

  const handleCompleteSurvey = () => {
    navigate({ to: '/reclamos/$reclamoId/encuesta', params: { reclamoId: currentRow._id } })
    onOpenChange(false)
  }

  const handleAutoAssign = () => {
    autoAssignMutation.mutate()
  }

  // Verificar si el usuario puede autoasignarse
  // 1. Debe ser Encargado o Gerente
  // 2. El reclamo debe estar en estado Pendiente
  // 3. No debe tener encargados asignados
  // 4. El área del usuario debe coincidir con el área responsable del reclamo
  const canAutoAssign = () => {
    if (!isStaff || !auth.user) return false
    if (currentRow.estado !== EstadoReclamo.PENDIENTE) return false
    if (encargados && encargados.length > 0) return false
    
    // Verificar si el usuario pertenece al área del reclamo
    const reclamoAreaId = typeof currentRow.fkArea === 'string' 
      ? currentRow.fkArea 
      : (currentRow.fkArea as any)?._id
    
    // Si el usuario tiene áreas asignadas, verificar que el área del reclamo esté entre ellas
    // Las áreas pueden venir como strings (IDs) o como objetos completos
    if (auth.user.areas && auth.user.areas.length > 0) {
      const userAreaIds = auth.user.areas.map(area => 
        typeof area === 'string' ? area : (area as any)._id
      )
      return userAreaIds.includes(reclamoAreaId)
    }
    
    // Si el usuario es Gerente, puede autoasignarse a cualquier reclamo
    if (auth.hasRole('Gerente')) {
      return true
    }
    
    return false
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <div className='flex items-start justify-between'>
            <div>
              <DialogTitle>{currentRow.titulo}</DialogTitle>
              <DialogDescription>
                Detalles del reclamo
              </DialogDescription>
            </div>
            {isStaff && !isFinalState && (
              <div className='flex gap-2'>
                {canAutoAssign() && (
                  <Button
                    variant='default'
                    size='sm'
                    onClick={handleAutoAssign}
                    className='gap-2'
                    disabled={autoAssignMutation.isPending || isLoadingEncargados}
                  >
                    <UserPlus className='h-4 w-4' />
                    {autoAssignMutation.isPending ? 'Asignando...' : 'Asignarme'}
                  </Button>
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleReassignArea}
                  className='gap-2'
                >
                  <GitBranch className='h-4 w-4' />
                  Reasignar área
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleChangeState}
                  className='gap-2'
                >
                  <Settings className='h-4 w-4' />
                  Cambiar estado
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue='details' className='w-full'>
          <TabsList className={`grid w-full ${isFinalState ? 'grid-cols-5' : 'grid-cols-4'}`}>
            <TabsTrigger value='details'>Detalles</TabsTrigger>
            <TabsTrigger value='images'>Imágenes</TabsTrigger>
            <TabsTrigger value='synthesis'>Síntesis</TabsTrigger>
            <TabsTrigger value='historial'>Historial</TabsTrigger>
            {isFinalState && <TabsTrigger value='encuesta'>Encuesta</TabsTrigger>}
          </TabsList>
          
          <TabsContent value='details' className='space-y-4 mt-4'>
            <div>
              <h4 className='text-sm font-medium mb-2'>Descripción</h4>
              <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{currentRow.descripcion}</p>
            </div>

            <Separator />

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h4 className='text-sm font-medium mb-2'>Estado</h4>
                <Badge variant={
                  currentRow.estado === EstadoReclamo.PENDIENTE ? 'default' :
                  currentRow.estado === EstadoReclamo.EN_REVISION ? 'secondary' :
                  currentRow.estado === EstadoReclamo.RESUELTO ? 'default' : 'destructive'
                }>
                  {currentRow.estado}
                </Badge>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-2'>Prioridad</h4>
                <Badge variant={
                  currentRow.prioridad === Prioridad.ALTA ? 'destructive' :
                  currentRow.prioridad === Prioridad.MEDIA ? 'default' : 'secondary'
                }>
                  {currentRow.prioridad.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-2'>Criticidad</h4>
                <Badge variant={currentRow.criticidad === Criticidad.SI ? 'destructive' : 'secondary'}>
                  {currentRow.criticidad}
                </Badge>
              </div>

              <div>
                <h4 className='text-sm font-medium mb-2'>Fecha de creación</h4>
                <p className='text-sm text-muted-foreground'>
                  {new Date(currentRow.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='images' className='mt-4'>
            <ReclamoImagesList reclamoId={currentRow._id} />
          </TabsContent>
          <TabsContent value='synthesis' className='mt-4'>
            <ReclamoSynthesisList reclamoId={currentRow._id} />
          </TabsContent>

          <TabsContent value='historial' className='mt-4'>
            <ReclamoHistorialTimeline reclamoId={currentRow._id} />
          </TabsContent>

          {isFinalState && (
            <TabsContent value='encuesta' className='mt-4'>
              {isLoadingEncuesta ? (
                <div className='text-sm text-muted-foreground'>Cargando encuesta...</div>
              ) : encuesta ? (
                <EncuestaDisplay reclamoId={currentRow._id} />
              ) : isClient && auth.user?.id && (typeof currentRow.fkCliente === 'string' ? currentRow.fkCliente : (currentRow.fkCliente as any)?._id || (currentRow.fkCliente as any)?.id) === auth.user.id ? (
                <div className='space-y-4'>
                  <div className='text-sm text-muted-foreground'>
                    Aún no has completado la encuesta de satisfacción para este reclamo.
                  </div>
                  <Button onClick={handleCompleteSurvey} className='w-full sm:w-auto'>
                    Completar Encuesta
                  </Button>
                </div>
              ) : (
                <div className='text-sm text-muted-foreground'>
                  La encuesta aún no ha sido completada por el cliente.
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

