'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Supplier } from '../data/schema'
import { suppliersService } from '@/services/suppliers/suppliers.service'

type SupplierDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Supplier
  onSuccess?: () => void
}

export function SuppliersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: SupplierDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.nombre) return

    try {
      setIsDeleting(true)
      await suppliersService.delete(currentRow.idProveedor)
      toast.success('Proveedor eliminado correctamente')
      onOpenChange(false)
      setValue('')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar proveedor:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar el proveedor'
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
          Eliminar proveedor
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Estas seguro que deseas eliminar <span className='font-bold'>{currentRow.nombre}</span>?
            <br />
          </p>

          <Label className='my-2'>
            Nombre del proveedor:{' '}
          </Label>
           <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Escribe el nombre del proveedor para confirmar'
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
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar proveedor'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}
