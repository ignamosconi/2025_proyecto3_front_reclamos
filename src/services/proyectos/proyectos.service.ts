import api from '@/lib/axios';
import { PROYECTOS_ENDPOINTS } from '../endpoints';

export interface ClienteInfo {
  _id: string;
  nombre?: string;
  apellido?: string;
  email: string;
  rol?: string;
}

export interface AreaInfo {
  _id: string;
  nombre: string;
}

export interface Proyecto {
  _id: string;
  nombre: string;
  cliente: ClienteInfo | string; // Puede ser objeto poblado o string ID
  areaResponsable: AreaInfo | string; // Puede ser objeto poblado o string ID
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProyectoDto {
  nombre: string;
  cliente: string; // ID del cliente
  areaResponsable: string; // ID del área
}

export interface UpdateProyectoDto {
  nombre?: string;
  cliente?: string; // ID del cliente
  areaResponsable?: string; // ID del área
}

export interface GetProyectosQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  cliente?: string; // ID del cliente para filtrar
  areaResponsable?: string; // ID del área para filtrar
  estado?: 'activo' | 'inactivo';
}

export interface PaginatedProyectoResponse {
  data: Proyecto[];
  total: number;
  page: number;
  limit: number;
}

export const proyectosService = {
  // Obtener todos los proyectos
  async getAll(query?: GetProyectosQuery): Promise<PaginatedProyectoResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.sort) params.append('sort', query.sort);
    if (query?.search) params.append('search', query.search);
    if (query?.cliente) params.append('cliente', query.cliente);
    if (query?.areaResponsable) params.append('areaResponsable', query.areaResponsable);
    if (query?.estado) params.append('estado', query.estado);
    
    const url = `${PROYECTOS_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un proyecto por ID
  async getById(id: string): Promise<Proyecto> {
    const response = await api.get(PROYECTOS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Crear un nuevo proyecto
  async create(data: CreateProyectoDto): Promise<Proyecto> {
    const response = await api.post(PROYECTOS_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un proyecto
  async update(id: string, data: UpdateProyectoDto): Promise<Proyecto> {
    const response = await api.patch(PROYECTOS_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  // Eliminar un proyecto (soft delete)
  async delete(id: string): Promise<void> {
    await api.delete(PROYECTOS_ENDPOINTS.DELETE(id));
  },

  // Restaurar un proyecto eliminado
  async restore(id: string): Promise<Proyecto> {
    const response = await api.patch(PROYECTOS_ENDPOINTS.RESTORE(id));
    return response.data;
  },
};

