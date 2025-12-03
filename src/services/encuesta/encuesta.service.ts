import api from '@/lib/axios';
import { ENCUESTA_ENDPOINTS } from '../endpoints';

export interface CreateEncuestaDto {
  calificacion: number;
  descripcion: string;
}

export interface Encuesta {
  _id: string;
  calificacion: number;
  descripcion: string;
  fkReclamo: string;
  fkClienteCreador: string;
  createdAt: string;
  updatedAt: string;
}

export const encuestaService = {
  // Crear una nueva encuesta
  async create(reclamoId: string, data: CreateEncuestaDto): Promise<Encuesta> {
    const response = await api.post(ENCUESTA_ENDPOINTS.CREATE(reclamoId), data);
    return response.data;
  },

  // Obtener encuesta por ID de reclamo
  async getByReclamoId(reclamoId: string): Promise<Encuesta | null> {
    try {
      const response = await api.get(ENCUESTA_ENDPOINTS.GET_BY_RECLAMO(reclamoId));
      return response.data;
    } catch (error: any) {
      // Si la encuesta no existe, el backend retorna 404 o null
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

