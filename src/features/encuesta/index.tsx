'use client'

import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { EncuestaForm } from './components/encuesta-form'
import { EncuestaDisplay } from './components/encuesta-display'
import { encuestaService } from '@/services/encuesta/encuesta.service'
import { reclamosService, EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const route = getRouteApi('/_authenticated/reclamos/$reclamoId/encuesta')

export function Encuesta() {
  const { reclamoId } = route.useParams()
  const navigate = useNavigate()
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')

  // Fetch claim data
  const {
    data: reclamo,
    isLoading: isLoadingReclamo,
    error: errorReclamo,
  } = useQuery({
    queryKey: ['reclamo', reclamoId],
    queryFn: () => reclamosService.getById(reclamoId),
    enabled: !!reclamoId,
  })

  // Fetch survey if exists
  const {
    data: encuesta,
    isLoading: isLoadingEncuesta,
  } = useQuery({
    queryKey: ['encuesta', reclamoId],
    queryFn: () => encuestaService.getByReclamoId(reclamoId),
    enabled: !!reclamoId,
  })

  const handleSuccess = () => {
    navigate({ to: '/reclamos' })
  }

  const handleCancel = () => {
    navigate({ to: '/reclamos' })
  }

  if (isLoadingReclamo) {
    return (
      <>
        <Header fixed className='border-b'>
          <div className='ms-auto flex items-center space-x-4' />
        </Header>
        <Main>
          <div className='container mx-auto py-8'>
            <Skeleton className='h-96 w-full' />
          </div>
        </Main>
      </>
    )
  }

  if (errorReclamo || !reclamo) {
    return (
      <>
        <Header fixed className='border-b'>
          <div className='ms-auto flex items-center space-x-4' />
        </Header>
        <Main>
          <div className='container mx-auto py-8'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                No se pudo cargar la información del reclamo. Por favor, intenta nuevamente.
              </AlertDescription>
            </Alert>
          </div>
        </Main>
      </>
    )
  }

  // Check if claim is in final state
  const isFinalState =
    reclamo.estado === EstadoReclamo.RESUELTO || reclamo.estado === EstadoReclamo.RECHAZADO

  if (!isFinalState) {
    return (
      <>
        <Header fixed className='border-b'>
          <div className='ms-auto flex items-center space-x-4' />
        </Header>
        <Main>
          <div className='container mx-auto py-8 max-w-2xl'>
            <Card>
              <CardHeader>
                <CardTitle>Encuesta no disponible</CardTitle>
                <CardDescription>
                  La encuesta solo está disponible para reclamos cerrados (Resuelto o Rechazado)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-4'>
                  El reclamo se encuentra en estado: <strong>{reclamo.estado}</strong>
                </p>
                <Button variant='outline' onClick={() => navigate({ to: '/reclamos' })}>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Volver a reclamos
                </Button>
              </CardContent>
            </Card>
          </div>
        </Main>
      </>
    )
  }

  // Check if client owns the claim
  const userId = auth.user?.id
  const reclamoClienteId = typeof reclamo.fkCliente === 'string' 
    ? reclamo.fkCliente 
    : (reclamo.fkCliente as any)?._id || (reclamo.fkCliente as any)?.id

  if (isClient && userId && reclamoClienteId !== userId) {
    return (
      <>
        <Header fixed className='border-b'>
          <div className='ms-auto flex items-center space-x-4' />
        </Header>
        <Main>
          <div className='container mx-auto py-8 max-w-2xl'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                No tienes permiso para acceder a esta encuesta.
              </AlertDescription>
            </Alert>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header fixed className='border-b'>
        <div className='ms-auto flex items-center space-x-4' />
      </Header>
      <Main>
        <div className='container mx-auto py-8 max-w-3xl'>
          <div className='mb-6'>
            <Button
              variant='ghost'
              onClick={() => navigate({ to: '/reclamos' })}
              className='mb-4'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver a reclamos
            </Button>
            <h1 className='text-3xl font-bold'>Encuesta de Satisfacción</h1>
            <p className='text-muted-foreground mt-2'>
              Reclamo: <strong>{reclamo.titulo}</strong>
            </p>
          </div>

          {isLoadingEncuesta ? (
            <Skeleton className='h-96 w-full' />
          ) : encuesta ? (
            <div className='space-y-4'>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  Ya has completado la encuesta para este reclamo. Solo se permite una encuesta por
                  reclamo.
                </AlertDescription>
              </Alert>
              <EncuestaDisplay reclamoId={reclamoId} />
              <div className='flex justify-end'>
                <Button variant='outline' onClick={() => navigate({ to: '/reclamos' })}>
                  Volver a reclamos
                </Button>
              </div>
            </div>
          ) : isClient && userId && reclamoClienteId === userId ? (
            <Card>
              <CardHeader>
                <CardTitle>Completar Encuesta</CardTitle>
                <CardDescription>
                  Tu opinión es muy importante para nosotros. Por favor, tómate un momento para
                  compartir tu experiencia.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EncuestaForm
                  reclamoId={reclamoId}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                La encuesta aún no ha sido completada por el cliente.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Main>
    </>
  )
}

