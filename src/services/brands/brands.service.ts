import api from '@/lib/axios';
import { CATALOG_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateBrandDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateBrandDto {
  nombre?: string;
  descripcion?: string;
}

// Servicio de marcas
export const brandsService = {
  // Obtener todas las marcas
  async getAll() {
     const response = await api.get(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.GET_ALL);
     return response.data;
  },

  // Crear una nueva marca
  async create(data: CreateBrandDto) {
    const response = await api.post(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar una marca existente
  async update(id: string | number, data: UpdateBrandDto) {
    const response = await api.put(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.UPDATE(String(id)), data);
    return response.data;
  },

  // Obtener una marca por ID
  async getById(id: string | number) {
    const response = await api.get(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar una marca
  async delete(id: string | number) {
    const response = await api.delete(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },

  // Obtener líneas asociadas a una marca
  async getAssociatedLines(brandId: string | number) {
    const response = await api.get(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.GET_LINES(brandId));
    return response.data;
  },

  // Asociar una línea a una marca
  async assignLine(brandId: string | number, lineId: string | number) {
    const response = await api.post(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.ASSIGN_LINE(brandId, lineId));
    return response.data;
  },

  // Desasociar una línea de una marca
  async unassignLine(brandId: string | number, lineId: string | number) {
    const response = await api.delete(CATALOG_ENDPOINTS.BRANDS_ENDPOINTS.UNASSIGN_LINE(brandId, lineId));
    return response.data;
  },
};
