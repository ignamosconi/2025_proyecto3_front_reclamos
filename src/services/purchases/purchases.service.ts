import api from '@/lib/axios';
import { PURCHASES_ENDPOINTS } from '../endpoints';

// Interfaces para los detalles de compra
export interface CreateDetalleCompraDto {
  idProducto: number;
  cantidad: number;
}

export interface UpdateDetalleCompraDto {
  idProducto: number;
  cantidad: number;
}

// Interfaces para los DTOs
export interface CreatePurchaseDto {
  idProveedor: number;
  metodoPago: string;
  detalles: CreateDetalleCompraDto[];
  // Optional name for compatibility with UI forms that may send a 'nombre' field
  nombre?: string;
}

export interface UpdatePurchaseDto {
  idProveedor?: number;
  metodoPago?: string;
  detalles?: UpdateDetalleCompraDto[];
  // Optional name for compatibility with UI forms that may send a 'nombre' field
  nombre?: string;
}

// Servicio de compras
export const purchasesService = {
  // Obtener todas las compras
  async getAll() {
     const response = await api.get(PURCHASES_ENDPOINTS.GET_ALL);
     // Transformar idCompra a id para compatibilidad con el frontend
     return response.data.map((compra: any) => ({
       ...compra,
       id: compra.idCompra || compra.id,
     }));
  },

  // Crear una nueva compra
  async create(data: CreatePurchaseDto) {
    const response = await api.post(PURCHASES_ENDPOINTS.CREATE, data);
    return {
      ...response.data,
      id: response.data.idCompra || response.data.id,
    };
  },

  // Actualizar una compra existente
  async update(id: string | number, data: UpdatePurchaseDto) {
    const response = await api.put(PURCHASES_ENDPOINTS.UPDATE(String(id)), data);
    return {
      ...response.data,
      id: response.data.idCompra || response.data.id,
    };
  },

  // Obtener una compra por ID
  async getById(id: string | number) {
    const response = await api.get(PURCHASES_ENDPOINTS.GET_BY_ID(String(id)));
    return {
      ...response.data,
      id: response.data.idCompra || response.data.id,
    };
  },
};