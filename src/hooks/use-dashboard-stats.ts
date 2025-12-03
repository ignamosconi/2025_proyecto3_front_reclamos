import { useQuery } from '@tanstack/react-query';
import { clientDashboardService, DashboardClienteQueryDto } from '@/services/dashboard/dashboard.service';

export interface DashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  specificDay?: Date;
  proyectoId?: string;
}

// Función helper para serializar los filtros en el queryKey
const serializeFilters = (filters?: DashboardFilters) => {
  if (!filters) return {};
  
  return {
    dateFrom: filters.dateFrom?.toISOString(),
    dateTo: filters.dateTo?.toISOString(),
    specificDay: filters.specificDay?.toISOString(),
    proyectoId: filters.proyectoId,
  };
};

// Helper function to convert DashboardFilters to DashboardClienteQueryDto
const convertFiltersToClientQuery = (filters?: DashboardFilters): DashboardClienteQueryDto => {
  if (!filters) return {};
  
  const query: DashboardClienteQueryDto = {};
  
  // If specificDay is provided, use it and ignore dateFrom/dateTo
  if (filters.specificDay) {
    query.specificDay = filters.specificDay.toISOString().split('T')[0];
  } else {
    if (filters.dateFrom) {
      query.startDate = filters.dateFrom.toISOString().split('T')[0];
    }
    if (filters.dateTo) {
      query.endDate = filters.dateTo.toISOString().split('T')[0];
    }
  }
  
  if (filters.proyectoId) {
    query.proyectoId = filters.proyectoId;
  }
  
  return query;
};

export function useClientDashboardMetrics(filters?: DashboardFilters) {
  const query = convertFiltersToClientQuery(filters);
  
  return useQuery({
    queryKey: ['client-dashboard-metrics', serializeFilters(filters)],
    queryFn: () => clientDashboardService.getClientDashboardMetrics(query),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
