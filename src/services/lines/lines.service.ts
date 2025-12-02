import api from '@/lib/axios';
import { CATALOG_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateLineDto {
  nombre: string;
}

export interface UpdateLineDto {
  nombre?: string;
}

// Servicio de líneas
export const linesService = {
  // Obtener todas las líneas
  async getAll() {
     const response = await api.get(CATALOG_ENDPOINTS.LINES_ENDPOINTS.GET_ALL);
     return response.data;
  },

  // Crear una nueva línea
  async create(data: CreateLineDto) {
    const response = await api.post(CATALOG_ENDPOINTS.LINES_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar una línea existente
  async update(id: string | number, data: UpdateLineDto) {
    const response = await api.put(CATALOG_ENDPOINTS.LINES_ENDPOINTS.UPDATE(String(id)), data);
    return response.data;
  },

  // Obtener una línea por ID
  async getById(id: string | number) {
    const response = await api.get(CATALOG_ENDPOINTS.LINES_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar una línea
  async delete(id: string | number) {
    const response = await api.delete(CATALOG_ENDPOINTS.LINES_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },
};