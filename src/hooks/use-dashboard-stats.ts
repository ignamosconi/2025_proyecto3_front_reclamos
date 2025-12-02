import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard/dashboard.service';

export interface DashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
}

// Función helper para serializar los filtros en el queryKey
const serializeFilters = (filters?: DashboardFilters) => {
  if (!filters) return {};
  
  return {
    dateFrom: filters.dateFrom?.toISOString(),
    dateTo: filters.dateTo?.toISOString(),
  };
};

export function useDashboardStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['dashboard-stats', serializeFilters(filters)],
    queryFn: () => dashboardService.getStats(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useMonthlySales(filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['monthly-sales', serializeFilters(filters)],
    queryFn: () => dashboardService.getMonthlySales(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRecentSales(limit?: number, filters?: DashboardFilters) {
  return useQuery({
    queryKey: ['recent-sales', limit, serializeFilters(filters)],
    queryFn: () => dashboardService.getRecentSales(limit, filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}
