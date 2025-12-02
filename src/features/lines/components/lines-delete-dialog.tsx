'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { linesService } from '@/services/lines/lines.service'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Line } from '../data/schema'

type LineDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Line
  onSuccess?: () => void
}

export function LinesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: LineDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.nombre) return

    try {
      setIsDeleting(true)
      await linesService.delete(currentRow.id)
      toast.success('Línea de producto eliminada correctamente')
      onOpenChange(false)
      setValue('')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar línea de producto:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar la línea de producto'
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
          setValue('')
          onOpenChange(state)
        }
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.nombre || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Eliminar línea de producto
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Estas seguro que deseas eliminar <span className='font-bold'>{currentRow.nombre}</span>?
            <br />
          </p>

          <Label className='my-2'>
            Nombre de la línea de producto:{' '}
          </Label>
           <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Escribe el nombre de la línea de producto para confirmar'
              disabled={isDeleting}
            />

          <Alert variant='destructive'>
            <AlertTitle>Advertencia!</AlertTitle>
            <AlertDescription>
              Por favor ten cuidado, esta operación no se puede deshacer.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar línea de producto'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}
