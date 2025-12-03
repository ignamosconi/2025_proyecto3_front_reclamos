import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Reclamo } from '../data/schema'
import { EstadoReclamo, Prioridad, Criticidad } from '@/services/reclamos/reclamos.service'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'

const getEstadoBadgeVariant = (estado: EstadoReclamo) => {
  switch (estado) {
    case EstadoReclamo.PENDIENTE:
      return 'default'
    case EstadoReclamo.EN_REVISION:
      return 'secondary'
    case EstadoReclamo.RESUELTO:
      return 'default'
    case EstadoReclamo.RECHAZADO:
      return 'destructive'
    default:
      return 'default'
  }
}

const getPrioridadBadgeVariant = (prioridad: Prioridad) => {
  switch (prioridad) {
    case Prioridad.ALTA:
      return 'destructive'
    case Prioridad.MEDIA:
      return 'default'
    case Prioridad.BAJA:
      return 'secondary'
    default:
      return 'default'
  }
}

export const reclamosColumns: ColumnDef<Reclamo>[] = [
  {
    accessorKey: 'titulo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Título' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap font-medium'>{row.getValue('titulo')}</div>
    ),
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Descripción' />
    ),
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion') as string
      return (
        <LongText className='max-w-64'>{descripcion}</LongText>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'estado',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const estado = row.getValue('estado') as EstadoReclamo
      return (
        <Badge variant={getEstadoBadgeVariant(estado)}>
          {estado}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'prioridad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Prioridad' />
    ),
    cell: ({ row }) => {
      const prioridad = row.getValue('prioridad') as Prioridad
      return (
        <Badge variant={getPrioridadBadgeVariant(prioridad)}>
          {prioridad.toUpperCase()}
        </Badge>
      )
    },
    sortingFn: (rowA, rowB) => {
      const prioridadA = rowA.getValue('prioridad') as Prioridad
      const prioridadB = rowB.getValue('prioridad') as Prioridad
      
      // Mapear prioridades a números para ordenamiento correcto
      const prioridadOrder: Record<Prioridad, number> = {
        [Prioridad.BAJA]: 1,
        [Prioridad.MEDIA]: 2,
        [Prioridad.ALTA]: 3,
      }
      
      const orderA = prioridadOrder[prioridadA] ?? 0
      const orderB = prioridadOrder[prioridadB] ?? 0
      
      return orderA - orderB
    },
  },
  {
    accessorKey: 'criticidad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Criticidad' />
    ),
    cell: ({ row }) => {
      const criticidad = row.getValue('criticidad') as Criticidad
      return (
        <Badge variant={criticidad === Criticidad.SI ? 'destructive' : 'secondary'}>
          {criticidad}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fecha' />
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


