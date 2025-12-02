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
import { type Proyecto } from '../data/schema'

type ProyectoViewDialogProps = {
  currentRow: Proyecto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProyectoViewDialog({
  currentRow,
  open,
  onOpenChange,
}: ProyectoViewDialogProps) {
  const clienteNombre = typeof currentRow.cliente === 'string'
    ? '-'
    : currentRow.cliente.firstName && currentRow.cliente.lastName
    ? `${currentRow.cliente.firstName} ${currentRow.cliente.lastName}`
    : currentRow.cliente.email

  const clienteEmail = typeof currentRow.cliente === 'string'
    ? '-'
    : currentRow.cliente.email

  const areaNombre = typeof currentRow.areaResponsable === 'string'
    ? '-'
    : currentRow.areaResponsable.nombre

  const estado = currentRow.deletedAt ? 'Inactivo' : 'Activo'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{currentRow.nombre}</DialogTitle>
          <DialogDescription>
            Detalles del proyecto
          </DialogDescription>
        </DialogHeader>
        
        <div className='space-y-4'>
          <div>
            <h4 className='text-sm font-medium mb-2'>Estado</h4>
            <Badge variant={estado === 'Activo' ? 'default' : 'secondary'}>
              {estado}
            </Badge>
          </div>

          <Separator />

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium mb-2'>Cliente</h4>
              <p className='text-sm text-muted-foreground'>{clienteNombre}</p>
              {clienteEmail !== '-' && (
                <p className='text-xs text-muted-foreground mt-1'>{clienteEmail}</p>
              )}
            </div>

            <div>
              <h4 className='text-sm font-medium mb-2'>Área Responsable</h4>
              <p className='text-sm text-muted-foreground'>{areaNombre}</p>
            </div>

            {currentRow.createdAt && (
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
            )}

            {currentRow.updatedAt && (
              <div>
                <h4 className='text-sm font-medium mb-2'>Última actualización</h4>
                <p className='text-sm text-muted-foreground'>
                  {new Date(currentRow.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


