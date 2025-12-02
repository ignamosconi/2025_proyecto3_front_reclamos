'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { tipoReclamoService, type ActiveClaim } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type TipoReclamo } from '../data/schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type TipoReclamoDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: TipoReclamo
  onSuccess?: () => void
}

export function TipoReclamoDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: TipoReclamoDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeClaims, setActiveClaims] = useState<ActiveClaim[] | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await tipoReclamoService.delete(currentRow._id)
      toast.success('Tipo de reclamo eliminado correctamente')
      onOpenChange(false)
      setActiveClaims(null)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al eliminar tipo de reclamo:', error)
      
      // Verificar si el error contiene información de reclamos activos
      if (error.response?.data?.reclamosActivos) {
        setActiveClaims(error.response.data.reclamosActivos)
        const errorMessage = error.response.data.message || 'No se puede eliminar el tipo de reclamo'
        toast.error(errorMessage)
      } else {
        const errorMessage = error.response?.data?.message || 'Error al eliminar el tipo de reclamo'
        toast.error(errorMessage)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(state) => {
        if (!isDeleting) {
          setActiveClaims(null)
          onOpenChange(state)
        }
      }}
      handleConfirm={handleDelete}
      disabled={isDeleting || (activeClaims !== null && activeClaims.length > 0)}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Eliminar tipo de reclamo
        </span>
      }
      desc={
        <div className='space-y-4'>
          {activeClaims && activeClaims.length > 0 ? (
            <>
              <Alert variant='destructive'>
                <AlertTitle>No se puede eliminar</AlertTitle>
                <AlertDescription>
                  Este tipo de reclamo tiene {activeClaims.length} reclamo(s) activo(s) asociado(s).
                  Debe resolver o rechazar todos los reclamos activos antes de poder eliminar este tipo.
                </AlertDescription>
              </Alert>
              
              <div className='max-h-60 overflow-y-auto rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className='font-medium'>{claim.titulo}</TableCell>
                        <TableCell>
                          <span className='inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'>
                            {claim.estado}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <>
              <p className='mb-2'>
                ¿Estás seguro que deseas eliminar el tipo de reclamo{' '}
                <span className='font-bold'>{currentRow.nombre}</span>?
                <br />
              </p>

              <Alert variant='destructive'>
                <AlertTitle>Advertencia!</AlertTitle>
                <AlertDescription>
                  Por favor ten cuidado, esta operación no se puede deshacer.
                  El sistema verificará automáticamente que no existan reclamos activos asociados.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      }
      confirmText={isDeleting ? 'Eliminando...' : 'Eliminar tipo de reclamo'}
      cancelBtnText='Cancelar'
      destructive
    />
  )
}

