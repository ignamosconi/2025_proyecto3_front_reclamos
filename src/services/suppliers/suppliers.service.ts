import api from '@/lib/axios';
import { SUPPLIER_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateSupplierDto {
  nombre: string;
  direccion: string;
  telefono: string;
}

export interface UpdateSupplierDto {
  nombre?: string;
  direccion?: string;
  telefono?: string;
}

// Servicio de suppliers (proveedores)
export const suppliersService = {
  // Obtener todos los proveedores
  async getAll() {
    const response = await api.get(SUPPLIER_ENDPOINTS.GET_ALL);
    return response.data;
  },

  // Crear un nuevo proveedor
  async create(data: CreateSupplierDto) {
    console.log('Creating supplier with data:', data);
    const response = await api.post(SUPPLIER_ENDPOINTS.CREATE, data);
    return response.data;
  },

  // Actualizar un proveedor existente
  async update(id: string | number, data: UpdateSupplierDto) {
    const response = await api.put(SUPPLIER_ENDPOINTS.UPDATE(String(id)), data);
    return response.data;
  },

  // Obtener un proveedor por ID
  async getById(id: string | number) {
    const response = await api.get(SUPPLIER_ENDPOINTS.GET_BY_ID(String(id)));
    return response.data;
  },

  // Eliminar un proveedor (soft delete)
  async delete(id: string | number) {
    const response = await api.delete(SUPPLIER_ENDPOINTS.DELETE(String(id)));
    return response.data;
  },

  // Obtener productos asociados a un proveedor
  async getAssociatedProducts(supplierId: string | number) {
    const response = await api.get(SUPPLIER_ENDPOINTS.GET_PRODUCTS(supplierId));
    return response.data;
  },

  // Asociar un producto a un proveedor
  async assignProduct(supplierId: string | number, productId: string | number, codigoProveedor: string) {
    const response = await api.post(SUPPLIER_ENDPOINTS.ASSIGN_PRODUCT, {
      idProveedor: Number(supplierId),
      idProducto: Number(productId),
      codigoProveedor,
    });
    return response.data;
  },

  // Desasociar un producto de un proveedor
  async unassignProduct(relationId: string | number) {
    const response = await api.delete(SUPPLIER_ENDPOINTS.UNASSIGN_PRODUCT(relationId));
    return response.data;
  },
};