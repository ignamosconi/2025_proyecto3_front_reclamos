import api from '@/lib/axios';
import { USERS_ENDPOINTS } from '../endpoints';

// Interfaces para los DTOs
export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Encargado' | 'Gerente';
  areaIds: string[];
  password: string;
  passwordConfirmation: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
}

export interface UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'Cliente' | 'Encargado' | 'Gerente';
  areaIds?: string[];
}

export interface DeleteUserDto {
  emailConfirmation: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Cliente' | 'Encargado' | 'Gerente';
  areas?: Array<{ _id: string; nombre: string; descripcion?: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

// Servicio de usuarios
export const usersService = {
  // Obtener todos los usuarios (paginados)
  async getAll(query?: { page?: number; limit?: number; sort?: 'asc' | 'desc'; role?: string; search?: string }): Promise<PaginatedUsersResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.sort) params.append('sort', query.sort);
    if (query?.role) params.append('role', query.role);
    if (query?.search) params.append('search', query.search);
    
    const url = `${USERS_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un usuario por ID
  async getById(id: string): Promise<User> {
    const response = await api.get(USERS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Obtener un usuario por email
  async getByEmail(email: string): Promise<User> {
    const response = await api.get(USERS_ENDPOINTS.GET_BY_EMAIL(email));
    return response.data;
  },

  // Crear un nuevo staff (Gerente o Encargado)
  async createStaff(data: CreateStaffDto): Promise<User> {
    const response = await api.post(USERS_ENDPOINTS.REGISTER_STAFF, data);
    return response.data;
  },

  // Actualizar perfil del usuario autenticado
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await api.patch(USERS_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  // Actualizar un staff (solo Gerente)
  async updateStaff(id: string, data: UpdateStaffDto): Promise<User> {
    const response = await api.patch(USERS_ENDPOINTS.UPDATE_STAFF(id), data);
    return response.data;
  },

  // Eliminar un usuario (requiere confirmación de email)
  async delete(id: string, emailConfirmation: string): Promise<User> {
    const response = await api.delete(USERS_ENDPOINTS.DELETE(id), {
      data: { emailConfirmation },
    });
    return response.data;
  },
};
