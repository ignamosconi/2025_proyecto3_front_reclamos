'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { brandsService } from '@/services/brands/brands.service'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Brand } from '../data/schema'

type BrandDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Brand
  onSuccess?: () => void
}

export function BrandsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: BrandDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.nombre) return

    try {
      setIsDeleting(true)
      await brandsService.delete(currentRow.id)
      toast.success('Marca eliminada correctamente')
      onOpenChange(false)
      setValue('')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar marca:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar la marca'
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
          Eliminar marca
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Estas seguro que deseas eliminar <span className='font-bold'>{currentRow.nombre}</span>?
            <br />
          </p>

          <Label className='my-2'>
            Nombre de la marca:{' '}
          </Label>
           <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Escribe el nombre de la marca para confirmar'
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
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar marca'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}
