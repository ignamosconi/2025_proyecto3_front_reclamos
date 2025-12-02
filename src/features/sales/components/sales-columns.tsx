import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Sale } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const salesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div>#{row.getValue('id')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'metodoPago',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Método de pago' />
    ),
    cell: ({ row }) => <div>{row.getValue('metodoPago') || 'N/A'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total' />
    ),
    cell: ({ row }) => {
      const total = row.getValue('total') as number
      const formatted = total?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0,00'
      return <div className='font-medium'>${formatted}</div>
    },
    enableSorting: false,
  },
  {
    id: 'fechaCreacion',
    accessorFn: (row) => (row.fechaCreacion ? new Date(row.fechaCreacion).getTime() : 0),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
    ),
    cell: ({ row }) => {
      const fecha = row.original.fechaCreacion
      if (!fecha) return <div>N/A</div>
      return <div>{
        new Date(fecha as Date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }</div>
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
