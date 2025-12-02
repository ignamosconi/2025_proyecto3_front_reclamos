import api from '@/lib/axios';
import { TIPO_RECLAMO_ENDPOINTS } from '../endpoints';

export interface CreateTipoReclamoDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoReclamoDto {
  nombre?: string;
  descripcion?: string;
}

export interface TipoReclamo {
  _id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedTipoReclamoResponse {
  data: TipoReclamo[];
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

export const tipoReclamoService = {
  // Obtener todos los tipos de reclamos (paginados)
  async getAll(query?: { page?: number; limit?: number; sort?: 'asc' | 'desc'; search?: string }): Promise<PaginatedTipoReclamoResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.sort) params.append('sort', query.sort);
    if (query?.search) params.append('search', query.search);
    
    const url = `${TIPO_RECLAMO_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un tipo de reclamo por ID
  async getById(id: string): Promise<TipoReclamo> {
    const response = await api.get(TIPO_RECLAMO_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Obtener un tipo de reclamo por nombre
  async getByName(nombre: string): Promise<TipoReclamo> {
    const response = await api.get(TIPO_RECLAMO_ENDPOINTS.GET_BY_NAME(nombre));
    return response.data;
  },

  // Crear un nuevo tipo de reclamo
  async create(data: CreateTipoReclamoDto): Promise<TipoReclamo> {
    const response = await api.post(TIPO_RECLAMO_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un tipo de reclamo
  async update(id: string, data: UpdateTipoReclamoDto): Promise<TipoReclamo> {
    const response = await api.patch(TIPO_RECLAMO_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  // Eliminar un tipo de reclamo
  async delete(id: string): Promise<TipoReclamo> {
    const response = await api.delete(TIPO_RECLAMO_ENDPOINTS.DELETE(id));
    return response.data;
  },
};

