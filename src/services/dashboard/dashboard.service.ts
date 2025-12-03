import api from '@/lib/axios';
import { DASHBOARD_ENDPOINTS } from '../endpoints';

// Client Dashboard Interfaces
export interface ClaimsPerProjectDto {
  proyectoId: string;
  proyectoNombre: string;
  cantidad: number;
}

export interface ClaimsByStatusDto {
  estado: string;
  cantidad: number;
}

export interface DashboardClienteResponseDto {
  claimsPerProject: ClaimsPerProjectDto[];
  claimsByStatus: ClaimsByStatusDto[];
  averageResolutionTime: number;
  dateRange: {
    start: string;
    end: string;
  };
  totalClaims: number;
}

export interface DashboardClienteQueryDto {
  startDate?: string;
  endDate?: string;
  specificDay?: string;
  proyectoId?: string;
}

// Client Dashboard Service
export const clientDashboardService = {
  async getClientDashboardMetrics(
    query?: DashboardClienteQueryDto
  ): Promise<DashboardClienteResponseDto> {
    const params = new URLSearchParams();
    
    if (query?.startDate) {
      params.append('startDate', query.startDate);
    }
    if (query?.endDate) {
      params.append('endDate', query.endDate);
    }
    if (query?.specificDay) {
      params.append('specificDay', query.specificDay);
    }
    if (query?.proyectoId) {
      params.append('proyectoId', query.proyectoId);
    }
    
    const url = `${DASHBOARD_ENDPOINTS.CLIENT_METRICS}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },
};
