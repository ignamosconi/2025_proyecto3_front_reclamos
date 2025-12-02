import api from '@/lib/axios';
import { AREAS_ENDPOINTS } from '../endpoints';
import { buildQueryParams } from '../endpoints';

export interface Area {
  _id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAreaDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateAreaDto {
  nombre?: string;
  descripcion?: string;
}

export interface PaginatedAreaResponse {
  data: Area[];
  total: number;
  page: number;
  limit: number;
}

export interface ActiveClaim {
  id: string;
  titulo: string;
  estado: string;
}

export interface DeleteErrorResponse {
  message: string;
  reclamosActivos: ActiveClaim[];
}

export interface GetAreasQuery {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  search?: string;
}

export const areasService = {
  // Obtener todas las áreas (paginadas)
  async getAll(query?: GetAreasQuery): Promise<PaginatedAreaResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.sort) params.append('sort', query.sort);
    if (query?.search) params.append('search', query.search);
    
    const url = `${AREAS_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un área por ID
  async getById(id: string): Promise<Area> {
    const response = await api.get(AREAS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Obtener un área por nombre
  async getByName(nombre: string): Promise<Area> {
    const response = await api.get(AREAS_ENDPOINTS.GET_BY_NAME(nombre));
    return response.data;
  },

  // Crear una nueva área
  async create(data: CreateAreaDto): Promise<Area> {
    const response = await api.post(AREAS_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un área
  async update(id: string, data: UpdateAreaDto): Promise<Area> {
    const response = await api.patch(AREAS_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  // Eliminar un área
  async delete(id: string): Promise<Area> {
    const response = await api.delete(AREAS_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
