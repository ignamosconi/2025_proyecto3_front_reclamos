import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Brand } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const brandsColumns = (
  _onUpdate?: () => void,
  _refreshTrigger?: number
): ColumnDef<Brand>[] => [
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion') as string | null
      if (!descripcion) {
        return <div className='text-muted-foreground italic'>Sin descripción</div>
      }
      const truncated = descripcion.length > 25 
        ? `${descripcion.substring(0, 25)}...` 
        : descripcion
      return (
        <div title={descripcion}>
          {truncated}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Creado en' />
    ),
    cell: ({ row }) => <div>{
      new Date(row.getValue('createdAt')).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      }</div>,
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
