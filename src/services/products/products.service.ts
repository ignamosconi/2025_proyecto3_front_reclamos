import api from '@/lib/axios';
import { PRODUCT_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs (nombres en camelCase como espera el backend)
export interface CreateProductDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  alertaStock: number;
  foto?: string;
  idLinea?: number;
  idMarca: number;
}

export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  alertaStock?: number;
  foto?: string;
  idLinea?: number;
  idMarca?: number;
}

// Servicio de productos
export const productsService = {
  // Obtener todos los productos
  async getAll() {
    const response = await api.get(PRODUCT_ENDPOINTS.GET_ALL);
    return response.data;
  },

  // Crear un nuevo producto
  async create(data: CreateProductDto, file?: File) {
    console.log('Creating product with data:', data);
    
    // Crear FormData para enviar al backend
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    // Si hay un archivo, añadirlo al FormData
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.post(PRODUCT_ENDPOINTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar un producto existente
  async update(id: string | number, data: UpdateProductDto, file?: File) {
    // Crear FormData para enviar al backend
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    // Si hay un archivo, añadirlo al FormData
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.put(PRODUCT_ENDPOINTS.UPDATE(String(id)), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Obtener un producto por ID
  async getById(id: string | number) {
    const response = await api.get(PRODUCT_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar un producto (soft delete)
  async delete(id: string | number) {
    const response = await api.delete(PRODUCT_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },
};