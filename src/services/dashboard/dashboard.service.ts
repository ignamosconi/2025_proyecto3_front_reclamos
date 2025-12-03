import api from '@/lib/axios'
import { DASHBOARD_ENDPOINTS } from '../endpoints'
import { EstadoReclamo } from '../reclamos/reclamos.service'

export type ExportFormat = 'xlsx' | 'csv'

// Helper function to download file from blob
const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Client Dashboard Interfaces
export interface ClaimsPerProjectDto {
  proyectoId: string
  proyectoNombre: string
  cantidad: number
}

export interface ClaimsByStatusDto {
  estado: string
  cantidad: number
}

export interface DashboardClienteResponseDto {
  claimsPerProject: ClaimsPerProjectDto[]
  claimsByStatus: ClaimsByStatusDto[]
  averageResolutionTime: number
  dateRange: {
    start: string
    end: string
  }
  totalClaims: number
}

export interface DashboardClienteQueryDto {
  startDate?: string
  endDate?: string
  specificDay?: string
  proyectoId?: string
}

// Encargado Dashboard Interfaces
export interface ClaimsPerMonthDto {
  year: number
  month: number
  resueltos: number
  noResueltos: number
  total: number
}

export interface ClaimsByTypeDto {
  tipoReclamoId: string
  tipoReclamoNombre: string
  cantidad: number
}

export interface AverageResolutionTimeByTypeDto {
  tipoReclamoId: string
  tipoReclamoNombre: string
  promedioDias: number
}

export interface ResolvedClaimsPeriodDto {
  periodo: string
  cantidad: number
}

export interface DashboardEncargadoResponseDto {
  claimsPerMonth: ClaimsPerMonthDto[]
  claimsByType: ClaimsByTypeDto[]
  averageResolutionTimeByType: AverageResolutionTimeByTypeDto[]
  resolvedClaimsByPeriod: ResolvedClaimsPeriodDto[]
  averageResolvedPerPeriod: number
  dateRange: {
    start: string
    end: string
  }
  totalClaims: number
}

export interface DashboardEncargadoQueryDto {
  startDate?: string
  endDate?: string
  specificDay?: string
  clienteId?: string
  proyectoId?: string
  tipoReclamoId?: string
  estado?: EstadoReclamo
  areaId?: string
}

// Gerente Dashboard Interfaces
export interface WorkloadByAreaDto {
  areaId: string
  areaNombre: string
  cantidad: number
}

export interface TopEmployeeByResolvedDto {
  empleadoId: string
  empleadoNombre: string
  empleadoEmail: string
  cantidadResueltos: number
}

export interface TopEmployeeByEfficiencyDto {
  empleadoId: string
  empleadoNombre: string
  empleadoEmail: string
  promedioDias: number
}

export interface DistributionByTypeDto {
  tipoReclamoId: string
  tipoReclamoNombre: string
  cantidad: number
  porcentaje: number
}

export interface DashboardGerenteResponseDto {
  workloadByArea: WorkloadByAreaDto[]
  totalClaims: number
  topEmployeesByResolved: TopEmployeeByResolvedDto[]
  topEmployeesByEfficiency: TopEmployeeByEfficiencyDto[]
  stateChangesCount: number
  distributionByType: DistributionByTypeDto[]
  percentageCriticalClaims: number
  dateRange: {
    start: string
    end: string
  }
}

export interface DashboardGerenteQueryDto {
  startDate?: string
  endDate?: string
  estado?: EstadoReclamo
  proyectoId?: string
  tipoReclamoId?: string
  criticidad?: string
  topLimit?: number
}

// Client Dashboard Service
export const clientDashboardService = {
  async getClientDashboardMetrics(
    query?: DashboardClienteQueryDto
  ): Promise<DashboardClienteResponseDto> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.specificDay) {
      params.append('specificDay', query.specificDay)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }

    const url = `${DASHBOARD_ENDPOINTS.CLIENT_METRICS}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url)
    return response.data
  },

  async exportDashboard(
    query?: DashboardClienteQueryDto,
    format: ExportFormat = 'xlsx'
  ): Promise<void> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.specificDay) {
      params.append('specificDay', query.specificDay)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }
    params.append('format', format)

    const url = `${DASHBOARD_ENDPOINTS.CLIENT_EXPORT}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const filename = `dashboard-cliente.${format}`
    downloadFile(response.data, filename)
  },
}

// Encargado Dashboard Service
export const encargadoDashboardService = {
  async getEncargadoDashboardMetrics(
    query?: DashboardEncargadoQueryDto
  ): Promise<DashboardEncargadoResponseDto> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.specificDay) {
      params.append('specificDay', query.specificDay)
    }
    if (query?.clienteId) {
      params.append('clienteId', query.clienteId)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }
    if (query?.tipoReclamoId) {
      params.append('tipoReclamoId', query.tipoReclamoId)
    }
    if (query?.estado) {
      params.append('estado', query.estado)
    }
    if (query?.areaId) {
      params.append('areaId', query.areaId)
    }

    const url = `${DASHBOARD_ENDPOINTS.ENCARGADO_METRICS}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url)
    return response.data
  },

  async exportDashboard(
    query?: DashboardEncargadoQueryDto,
    format: ExportFormat = 'xlsx'
  ): Promise<void> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.specificDay) {
      params.append('specificDay', query.specificDay)
    }
    if (query?.clienteId) {
      params.append('clienteId', query.clienteId)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }
    if (query?.tipoReclamoId) {
      params.append('tipoReclamoId', query.tipoReclamoId)
    }
    if (query?.estado) {
      params.append('estado', query.estado)
    }
    if (query?.areaId) {
      params.append('areaId', query.areaId)
    }
    params.append('format', format)

    const url = `${DASHBOARD_ENDPOINTS.ENCARGADO_EXPORT}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const filename = `dashboard-encargado.${format}`
    downloadFile(response.data, filename)
  },
}

// Gerente Dashboard Service
export const gerenteDashboardService = {
  async getGerenteDashboardMetrics(
    query?: DashboardGerenteQueryDto
  ): Promise<DashboardGerenteResponseDto> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.estado) {
      params.append('estado', query.estado)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }
    if (query?.tipoReclamoId) {
      params.append('tipoReclamoId', query.tipoReclamoId)
    }
    if (query?.criticidad) {
      params.append('criticidad', query.criticidad)
    }
    if (query?.topLimit !== undefined) {
      params.append('topLimit', query.topLimit.toString())
    }

    const url = `${DASHBOARD_ENDPOINTS.GERENTE_METRICS}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url)
    return response.data
  },

  async exportDashboard(
    query?: DashboardGerenteQueryDto,
    format: ExportFormat = 'xlsx'
  ): Promise<void> {
    const params = new URLSearchParams()

    if (query?.startDate) {
      params.append('startDate', query.startDate)
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate)
    }
    if (query?.estado) {
      params.append('estado', query.estado)
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId)
    }
    if (query?.tipoReclamoId) {
      params.append('tipoReclamoId', query.tipoReclamoId)
    }
    if (query?.criticidad) {
      params.append('criticidad', query.criticidad)
    }
    if (query?.topLimit !== undefined) {
      params.append('topLimit', query.topLimit.toString())
    }
    params.append('format', format)

    const url = `${DASHBOARD_ENDPOINTS.GERENTE_EXPORT}${params.toString() ? `?${params.toString()}` : ''}`
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const filename = `dashboard-gerente.${format}`
    downloadFile(response.data, filename)
  },
}
