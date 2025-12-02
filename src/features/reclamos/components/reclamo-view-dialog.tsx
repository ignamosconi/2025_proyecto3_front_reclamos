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
import { useReclamos } from './reclamos-provider'
import { useAuthStore } from '@/stores/auth-store'
import { Settings } from 'lucide-react'

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
  const isManager = auth.hasRole(['Encargado', 'Gerente'])
  const isFinalState = currentRow.estado === EstadoReclamo.RESUELTO || currentRow.estado === EstadoReclamo.RECHAZADO

  const handleChangeState = () => {
    setOpen('change-state')
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
            {isManager && !isFinalState && (
              <Button
                variant='outline'
                size='sm'
                onClick={handleChangeState}
                className='gap-2'
              >
                <Settings className='h-4 w-4' />
                Cambiar estado
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue='details' className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='details'>Detalles</TabsTrigger>
            <TabsTrigger value='images'>Imágenes</TabsTrigger>
            <TabsTrigger value='synthesis'>Síntesis</TabsTrigger>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

