'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { usersService } from '@/services/users/users.service'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
  onSuccess?: () => void
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (value.trim() !== currentRow.email) return

    try {
      setIsDeleting(true)
      await usersService.delete(currentRow.id)
      toast.success('Usuario eliminado correctamente')
      onOpenChange(false)
      setValue('')
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar usuario:', error)
      const errorMessage = error.response?.data?.message || 'Error al eliminar el usuario'
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
      disabled={value.trim() !== currentRow.email || isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Eliminar usuario
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            ¿Estas seguro que deseas eliminar <span className='font-bold'>{currentRow.email}</span>?
            <br />
          </p>

          <Label className='my-2'>
            Correo electrónico del usuario:{' '}
          </Label>
           <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Escribe el correo electrónico para confirmar'
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
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar usuario'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}
