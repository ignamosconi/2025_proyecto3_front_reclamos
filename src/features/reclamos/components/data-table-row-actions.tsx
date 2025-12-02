import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, UserPen, Eye, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Reclamo } from '../data/schema'
import { useReclamos } from './reclamos-provider'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { useAuthStore } from '@/stores/auth-store'

type DataTableRowActionsProps = {
  row: Row<Reclamo>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useReclamos()
  const { auth } = useAuthStore()
  const reclamo = row.original
  const isClient = auth.hasRole('Cliente')
  const isManager = auth.hasRole(['Encargado', 'Gerente'])
  const canEdit = reclamo.estado === EstadoReclamo.PENDIENTE && isClient
  const canDelete = reclamo.estado === EstadoReclamo.PENDIENTE && isClient
  const canChangeState = isManager && reclamo.estado !== EstadoReclamo.RESUELTO && reclamo.estado !== EstadoReclamo.RECHAZADO

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('view')
            }}
            className='cursor-pointer'
          >
            Ver detalles
            <DropdownMenuShortcut>
              <Eye size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          
          {isClient && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('edit')
                }}
                className='cursor-pointer'
                disabled={!canEdit}
              >
                Editar
                <DropdownMenuShortcut>
                  <UserPen size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('delete')
                }}
                className='text-red-500! cursor-pointer'
                disabled={!canDelete}
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash2 size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}

          {isManager && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original)
                  setOpen('change-state')
                }}
                className='cursor-pointer'
                disabled={!canChangeState}
              >
                Cambiar estado
                <DropdownMenuShortcut>
                  <Settings size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

