'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { proyectosService } from '@/services/proyectos/proyectos.service'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Proyecto } from '../data/schema'

type ProyectoDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Proyecto
  onSuccess?: () => void
}

export function ProyectoDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: ProyectoDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await proyectosService.delete(currentRow._id)
      toast.success('Proyecto eliminado correctamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar proyecto:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar el proyecto'
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
      disabled={isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Eliminar proyecto
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Estás seguro que deseas eliminar el proyecto{' '}
            <span className='font-bold'>{currentRow.nombre}</span>?
            <br />
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Advertencia!</AlertTitle>
            <AlertDescription>
              Por favor ten cuidado, esta operación no se puede deshacer.
              El proyecto será eliminado de forma lógica (soft delete).
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar proyecto'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}

