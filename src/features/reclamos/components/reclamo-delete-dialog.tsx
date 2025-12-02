'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { reclamosService, EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { type Reclamo } from '../data/schema'

type ReclamoDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Reclamo
  onSuccess?: () => void
}

export function ReclamoDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: ReclamoDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const canDelete = currentRow.estado === EstadoReclamo.PENDIENTE

  const handleDelete = async () => {
    if (!canDelete) {
      toast.error('Solo se pueden eliminar reclamos en estado Pendiente')
      return
    }

    try {
      setIsDeleting(true)
      await reclamosService.delete(currentRow._id)
      toast.success('Reclamo eliminado correctamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar reclamo:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar el reclamo'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!isDeleting) {
          onOpenChange(state)
        }
      }}
      handleConfirm={handleDelete}
      disabled={isDeleting || !canDelete}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Eliminar reclamo
        </span>
      }
      desc={
        <div className='space-y-4'>
          {!canDelete ? (
            <Alert variant='destructive'>
              <AlertTitle>No se puede eliminar</AlertTitle>
              <AlertDescription>
                Este reclamo está en estado "{currentRow.estado}" y no puede ser eliminado. 
                Solo los reclamos en estado Pendiente pueden ser eliminados.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <p className='mb-2'>
                ¿Estás seguro que deseas eliminar el reclamo{' '}
                <span className='font-bold'>{currentRow.titulo}</span>?
                <br />
              </p>

              <Alert variant='destructive'>
                <AlertTitle>Advertencia!</AlertTitle>
                <AlertDescription>
                  Por favor ten cuidado, esta operación no se puede deshacer.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      }
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar reclamo'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}


