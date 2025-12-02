import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Supplier } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { SupplierProductsExpandButton } from './supplier-products-expandable'
import { useState } from 'react'

export const suppliersColumns = (
  _onUpdate?: () => void,
  _refreshTrigger?: number,
  expanded?: Record<string, boolean>,
  setExpanded?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
): ColumnDef<Supplier>[] => [
  {
    id: 'expand',
    cell: ({ row }) => {
      const [isLoading] = useState(false)
      const isExpanded = expanded?.[row.original.idProveedor] || false

      const handleToggle = () => {
        if (setExpanded) {
          setExpanded((prev) => ({
            ...prev,
            [row.original.idProveedor]: !prev[row.original.idProveedor],
          }))
        }
      }

      return (
        <SupplierProductsExpandButton
          isExpanded={isExpanded}
          onToggle={handleToggle}
          isLoading={isLoading}
        />
      )
    },
    meta: {
      className: 'w-[50px]',
    },
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'direccion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dirección' />
    ),
    cell: ({ row }) => <div>{row.getValue('direccion') == "" || null ? '-' : row.getValue('direccion')}</div>,
    enableSorting: false,
  },
   {
    accessorKey: 'telefono',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teléfono' />
    ),
    cell: ({ row }) => <div>{row.getValue('telefono') == "" || null ? '-' : row.getValue('telefono')}</div>,
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
