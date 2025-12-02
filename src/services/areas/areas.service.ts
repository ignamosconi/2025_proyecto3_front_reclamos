import api from '@/lib/axios';
import { AREAS_ENDPOINTS } from '../endpoints';

export interface Area {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export interface PaginatedAreasResponse {
  data: Area[];
  total: number;
  page: number;
  limit: number;
}

export const areasService = {
  // Obtener todas las áreas activas
  async getAll(query?: { page?: number; limit?: number }): Promise<PaginatedAreasResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString() || '100');
    
    const url = `${AREAS_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un área por ID
  async getById(id: string): Promise<Area> {
    const response = await api.get(AREAS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },
};

