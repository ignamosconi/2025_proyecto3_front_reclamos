import api from '@/lib/axios';
import { USERS_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: 'Dueño' | 'Empleado';
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: 'Dueño' | 'Empleado';
  password?: string;
}

// Servicio de usuarios
export const usersService = {
  // Obtener todos los usuarios
  async getAll() {
     const response = await api.get(USERS_ENDPOINTS.GET_ALL);
     return response.data;
  },

  // Crear un nuevo usuario
  async create(data: CreateUserDto) {
    const response = await api.post(USERS_ENDPOINTS.REGISTER_OWNER, data);
    return response.data;
  },

  // Actualizar un usuario existente
  async update(id: string, data: UpdateUserDto) {
    const response = await api.post(USERS_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  // Obtener un usuario por ID
  async getById(id: string) {
    const response = await api.get(USERS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Eliminar un usuario
  async delete(id: string) {
    const response = await api.delete(USERS_ENDPOINTS.DELETE(id));
    return response.data;
  },
};