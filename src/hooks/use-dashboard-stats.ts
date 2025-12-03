import { useQuery } from '@tanstack/react-query'
import {
  clientDashboardService,
  DashboardClienteQueryDto,
  encargadoDashboardService,
  DashboardEncargadoQueryDto,
  gerenteDashboardService,
  DashboardGerenteQueryDto,
} from '@/services/dashboard/dashboard.service'
import { EstadoReclamo, Criticidad } from '@/services/reclamos/reclamos.service'

export interface DashboardFilters {
  dateFrom?: Date
  dateTo?: Date
  specificDay?: Date
  proyectoId?: string
  // Filtros adicionales para encargado
  clienteId?: string
  tipoReclamoId?: string
  estado?: EstadoReclamo
  areaId?: string
  // Filtros adicionales para gerente
  topLimit?: number
  criticidad?: Criticidad
}

// Función helper para serializar los filtros en el queryKey
const serializeFilters = (filters?: DashboardFilters) => {
  if (!filters) return {}

  return {
    dateFrom: filters.dateFrom?.toISOString(),
    dateTo: filters.dateTo?.toISOString(),
    specificDay: filters.specificDay?.toISOString(),
    proyectoId: filters.proyectoId,
    clienteId: filters.clienteId,
    tipoReclamoId: filters.tipoReclamoId,
    estado: filters.estado,
    areaId: filters.areaId,
    topLimit: filters.topLimit,
    criticidad: filters.criticidad,
  }
}

// Helper function to convert DashboardFilters to DashboardClienteQueryDto
const convertFiltersToClientQuery = (
  filters?: DashboardFilters
): DashboardClienteQueryDto => {
  if (!filters) return {}

  const query: DashboardClienteQueryDto = {}

  // If specificDay is provided, use it and ignore dateFrom/dateTo
  if (filters.specificDay) {
    query.specificDay = filters.specificDay.toISOString().split('T')[0]
  } else {
    if (filters.dateFrom) {
      query.startDate = filters.dateFrom.toISOString().split('T')[0]
    }
    if (filters.dateTo) {
      query.endDate = filters.dateTo.toISOString().split('T')[0]
    }
  }

  if (filters.proyectoId) {
    query.proyectoId = filters.proyectoId
  }

  return query
}

// Helper function to convert DashboardFilters to DashboardEncargadoQueryDto
const convertFiltersToEncargadoQuery = (
  filters?: DashboardFilters
): DashboardEncargadoQueryDto => {
  if (!filters) return {}

  const query: DashboardEncargadoQueryDto = {}

  // If specificDay is provided, use it and ignore dateFrom/dateTo
  if (filters.specificDay) {
    query.specificDay = filters.specificDay.toISOString().split('T')[0]
  } else {
    if (filters.dateFrom) {
      query.startDate = filters.dateFrom.toISOString().split('T')[0]
    }
    if (filters.dateTo) {
      query.endDate = filters.dateTo.toISOString().split('T')[0]
    }
  }

  if (filters.clienteId) {
    query.clienteId = filters.clienteId
  }
  if (filters.proyectoId) {
    query.proyectoId = filters.proyectoId
  }
  if (filters.tipoReclamoId) {
    query.tipoReclamoId = filters.tipoReclamoId
  }
  if (filters.estado) {
    query.estado = filters.estado
  }
  if (filters.areaId) {
    query.areaId = filters.areaId
  }

  return query
}

export function useClientDashboardMetrics(filters?: DashboardFilters) {
  const query = convertFiltersToClientQuery(filters)

  return useQuery({
    queryKey: ['client-dashboard-metrics', serializeFilters(filters)],
    queryFn: () => clientDashboardService.getClientDashboardMetrics(query),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useEncargadoDashboardMetrics(
  filters?: DashboardFilters,
  enabled: boolean = true
) {
  const query = convertFiltersToEncargadoQuery(filters)

  return useQuery({
    queryKey: ['encargado-dashboard-metrics', serializeFilters(filters)],
    queryFn: () =>
      encargadoDashboardService.getEncargadoDashboardMetrics(query),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Helper function to convert DashboardFilters to DashboardGerenteQueryDto
const convertFiltersToGerenteQuery = (
  filters?: DashboardFilters
): DashboardGerenteQueryDto => {
  if (!filters) return {}

  const query: DashboardGerenteQueryDto = {}

  // Gerente only uses date range, not specific day
  if (filters.dateFrom) {
    query.startDate = filters.dateFrom.toISOString().split('T')[0]
  }
  if (filters.dateTo) {
    query.endDate = filters.dateTo.toISOString().split('T')[0]
  }

  if (filters.estado) {
    query.estado = filters.estado
  }

  if (filters.proyectoId) {
    query.proyectoId = filters.proyectoId
  }

  if (filters.tipoReclamoId) {
    query.tipoReclamoId = filters.tipoReclamoId
  }

  if (filters.criticidad) {
    query.criticidad = filters.criticidad
  }

  if (filters.topLimit !== undefined) {
    query.topLimit = filters.topLimit
  }

  return query
}

export function useGerenteDashboardMetrics(
  filters?: DashboardFilters,
  enabled: boolean = true
) {
  const query = convertFiltersToGerenteQuery(filters)

  return useQuery({
    queryKey: ['gerente-dashboard-metrics', serializeFilters(filters)],
    queryFn: () => gerenteDashboardService.getGerenteDashboardMetrics(query),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
