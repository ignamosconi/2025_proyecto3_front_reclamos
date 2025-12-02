import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Trash2, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { brandsService } from '@/services/brands/brands.service'
import type { BrandLinea } from '../data/schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BrandLinesExpandButtonProps {
  isExpanded: boolean
  onToggle: () => void
  isLoading: boolean
}

export function BrandLinesExpandButton({
  isExpanded,
  onToggle,
  isLoading,
}: BrandLinesExpandButtonProps) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-8 w-8 p-0'
      onClick={onToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : isExpanded ? (
        <ChevronDown className='h-4 w-4' />
      ) : (
        <ChevronRight className='h-4 w-4' />
      )}
      <span className='sr-only'>
        {isExpanded ? 'Contraer' : 'Expandir'}
      </span>
    </Button>
  )
}

interface BrandLinesExpandedRowProps {
  brandId: number
  brandName: string
  onUpdate?: () => void
  refreshTrigger?: number
  onAssignLine?: () => void
}

export function BrandLinesExpandedRow({
  brandId,
  brandName,
  onUpdate,
  refreshTrigger,
  onAssignLine,
}: BrandLinesExpandedRowProps) {
  const [lines, setLines] = useState<BrandLinea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingLineId, setDeletingLineId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [lineToDelete, setLineToDelete] = useState<BrandLinea | null>(null)

  const loadLines = async () => {
    try {
      setIsLoading(true)
      const data = await brandsService.getAssociatedLines(brandId)
      setLines(data)
    } catch (error) {
      console.error('Error al cargar líneas asociadas:', error)
      toast.error('Error al cargar las líneas asociadas')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLines()
  }, [])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadLines()
    }
  }, [refreshTrigger])

  const handleDeleteLine = async (line: BrandLinea) => {
    try {
      setDeletingLineId(line.lineaId)
      await brandsService.unassignLine(brandId, line.lineaId)
      toast.success('Línea desasociada correctamente')
      await loadLines()
      onUpdate?.()
    } catch (error: any) {
      console.error('Error al desasociar línea:', error)
      const errorMessage = error.response?.data?.message || 'Error al desasociar la línea'
      toast.error(errorMessage)
    } finally {
      setDeletingLineId(null)
      setShowDeleteDialog(false)
      setLineToDelete(null)
    }
  }

  const openDeleteDialog = (line: BrandLinea) => {
    setLineToDelete(line)
    setShowDeleteDialog(true)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className='py-4'>
          <div className='mb-3 px-4 flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-muted-foreground'>
            Líneas de producto asociadas
          </h4>
          <Button
            size='sm'
            onClick={onAssignLine}
            className='h-8 gap-1'
          >
            <Plus className='h-4 w-4' />
            Asociar línea
          </Button>
        </div>
        <div className='py-8 text-center text-sm text-muted-foreground'>
          No hay líneas asociadas a esta marca
        </div>
      </div>
     
    )
  }

  return (
    <>
      <div className='py-4'>
        <div className='mb-3 px-4 flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-muted-foreground'>
            Líneas de producto asociadas
          </h4>
          <Button
            size='sm'
            onClick={onAssignLine}
            className='h-8 gap-1'
          >
            <Plus className='h-4 w-4' />
            Asociar línea
          </Button>
        </div>
        <div className='divide-y'>
          {lines.map((brandLine) => (
            <div
              key={brandLine.lineaId}
              className='flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors'
            >
              <span className='font-medium'>{brandLine.linea.nombre}</span>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50'
                onClick={() => openDeleteDialog(brandLine)}
                disabled={deletingLineId === brandLine.lineaId}
              >
                {deletingLineId === brandLine.lineaId ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='h-4 w-4' />
                )}
                <span className='sr-only'>Eliminar</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desasociar la línea "{lineToDelete?.linea.nombre}" de la marca "{brandName}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => lineToDelete && handleDeleteLine(lineToDelete)}
              className='bg-red-500 hover:bg-red-600'
            >
              Desasociar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
