import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Area } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const areasColumns: ColumnDef<Area>[] = [
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
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion') as string | undefined
      return descripcion ? (
        <LongText className='max-w-64'>{descripcion}</LongText>
      ) : (
        <span className='text-muted-foreground text-sm'>Sin descripción</span>
      )
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

