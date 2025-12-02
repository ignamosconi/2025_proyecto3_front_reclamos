import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Audit } from '../data/schema'
import { Badge } from '@/components/ui/badge'

export const auditColumns: ColumnDef<Audit>[] = [
  {
    accessorKey: 'idAuditoria',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[50px]'>{row.getValue('idAuditoria')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'fecha_hora',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha y hora' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('fecha_hora'))
      return (
        <div className='min-w-[140px]'>
          {date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}{' '}
          {date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'tipo_evento',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo de evento' />
    ),
    cell: ({ row }) => {
      const tipoEvento = row.getValue('tipo_evento') as string
      const eventColors: Record<string, string> = {
        'login-usuario': 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        'crear-empleado': 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
        'crear-duenio': 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
        'registrar-venta': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
        'registrar-compra': 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
        'modificar-venta': 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20',
        'modificar-compra': 'bg-amber-600/10 text-amber-600 hover:bg-amber-600/20',
      }
      return (
        <Badge variant='outline' className={eventColors[tipoEvento] || 'bg-gray-500/10'}>
          {tipoEvento}
        </Badge>
      )
    },
    enableSorting: false,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Usuario' />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as Audit['user'] | null
      if (!user) {
        return <div className='min-w-[150px] text-muted-foreground'>Usuario eliminado</div>
      }
      return (
        <div className='min-w-[150px]'>
          <div className='font-medium'>
            {user.firstName} {user.lastName}
          </div>
          <div className='text-sm text-muted-foreground'>{user.email}</div>
        </div>
      )
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      const user = row.getValue(id) as Audit['user'] | null
      if (!user) return false
      const searchValue = value.toLowerCase()
      return (
        user.firstName.toLowerCase().includes(searchValue) ||
        user.lastName.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
      )
    },
  },
  {
    accessorKey: 'user.role',
    id: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rol' />
    ),
    cell: ({ row }) => {
      const role = row.original.user?.role || 'N/A'
      return <Badge variant='secondary'>{role}</Badge>
    },
    enableSorting: false,
    filterFn: (row, _id, value) => {
      const role = row.original.user?.role
      return role ? value.includes(role) : false
    },
  },
  {
    accessorKey: 'detalle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Detalle' />
    ),
    cell: ({ row }) => {
      const detalle = row.getValue('detalle') as string | null
      return (
        <div className='max-w-[300px] truncate' title={detalle || ''}>
          {detalle || '-'}
        </div>
      )
    },
    enableSorting: false,
  },
]
