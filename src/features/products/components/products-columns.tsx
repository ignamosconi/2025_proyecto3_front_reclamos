import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Product } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export function getProductsColumns(cacheBuster: number = Date.now()): ColumnDef<Product>[] {
  return [
    {
      accessorKey: 'foto',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Imagen' />
      ),
      cell: ({ row }) => {
        const foto = row.getValue('foto') as string | null
        // Usar cacheBuster en lugar de updatedAt para forzar recarga de imagen
        const imageUrl = foto ? `${foto}?t=${cacheBuster}` : null
        
        return (
          <div className='flex items-center justify-center'>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={row.getValue('nombre')}
                className='h-12 w-12 object-cover rounded-md border'
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/50?text=Sin+Imagen'
                }}
              />
            ) : (
              <div className='h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 border'>
                Sin imagen
              </div>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('nombre')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion') as string | null
      return (
        <div className='max-w-xs truncate text-sm text-muted-foreground' title={descripcion || ''}>
          {descripcion || '-'}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'marca',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Marca' />
    ),
    cell: ({ row }) => {
      const marca = row.original.marca
      return <div className='text-sm'>{marca?.nombre || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'linea',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Línea' />
    ),
    cell: ({ row }) => {
      const linea = row.original.linea
      return <div className='text-sm'>{linea?.nombre || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'precio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio' />
    ),
    cell: ({ row }) => {
      const precio = row.getValue('precio') as number
      return <div className='text-right font-medium'>${precio.toFixed(2)}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      const alertaStock = row.original.alertaStock
      const isLowStock = stock <= alertaStock
      return (
        <div className={`text-center font-medium ${isLowStock ? 'text-red-600' : ''}`}>
          {stock}
          {isLowStock && (
            <span className='ml-1 text-xs'>⚠️</span>
          )}
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
}

// Exportar también como constante para compatibilidad
export const productsColumns = getProductsColumns()
