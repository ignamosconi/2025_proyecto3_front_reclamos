import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Proyecto } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const proyectosColumns: ColumnDef<Proyecto>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap font-medium'>{row.getValue('nombre')}</div>
    ),
  },
  {
    accessorKey: 'cliente',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cliente' />
    ),
    cell: ({ row }) => {
      const cliente = row.original.cliente
      if (typeof cliente === 'string') {
        return <div className='text-muted-foreground text-sm'>-</div>
      }
      const nombreCompleto = cliente.nombre && cliente.apellido
        ? `${cliente.nombre} ${cliente.apellido}`
        : cliente.email
      return <div className='text-nowrap'>{nombreCompleto}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'areaResponsable',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Área Responsable' />
    ),
    cell: ({ row }) => {
      const area = row.original.areaResponsable
      if (typeof area === 'string') {
        return <div className='text-muted-foreground text-sm'>-</div>
      }
      return <div className='text-nowrap'>{area.nombre}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creado en' />
    ),
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      if (!createdAt) return <div className='text-muted-foreground'>-</div>
      return (
        <div>
          {new Date(createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]

