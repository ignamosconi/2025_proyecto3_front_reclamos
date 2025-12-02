import api from '@/lib/axios';
import { SALES_ENDPOINTS } from '../endpoints';

// Interfaces para los detalles de venta
export interface CreateDetalleVentaDto {
  idProducto: number;
  cantidad: number;
}

export interface UpdateDetalleVentaDto {
  idProducto: number;
  cantidad: number;
}

// Interfaces para los DTOs
export interface CreateSaleDto {
  metodoPago: string;
  detalles: CreateDetalleVentaDto[];
  // Optional name for compatibility with UI forms that may send a 'nombre' field
  nombre?: string;
}

export interface UpdateSaleDto {
  metodoPago?: string;
  detalles?: UpdateDetalleVentaDto[];
  // Optional name for compatibility with UI forms that may send a 'nombre' field
  nombre?: string;
}

// Servicio de ventas
export const salesService = {
  // Obtener todas las ventas
  async getAll() {
     const response = await api.get(SALES_ENDPOINTS.GET_ALL);
     // Transformar idVenta a id para compatibilidad con el frontend
     return response.data.map((venta: any) => ({
       ...venta,
       id: venta.idVenta || venta.id,
     }));
  },

  // Crear una nueva venta
  async create(data: CreateSaleDto) {
    const response = await api.post(SALES_ENDPOINTS.CREATE, data);
    return {
      ...response.data,
      id: response.data.idVenta || response.data.id,
    };
  },

  // Actualizar una venta existente
  async update(id: string | number, data: UpdateSaleDto) {
    const response = await api.put(SALES_ENDPOINTS.UPDATE(String(id)), data);
    return {
      ...response.data,
      id: response.data.idVenta || response.data.id,
    };
  },

  // Obtener una venta por ID
  async getById(id: string | number) {
    const response = await api.get(SALES_ENDPOINTS.GET_BY_ID(String(id)));
    return {
      ...response.data,
      id: response.data.idVenta || response.data.id,
    };
  },
};