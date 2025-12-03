import api from '@/lib/axios';
import { RECLAMOS_ENDPOINTS } from '../endpoints';

export enum Prioridad {
  ALTA = 'alta',
  MEDIA = 'media',
  BAJA = 'baja',
}

export enum Criticidad {
  SI = 'SÍ',
  NO = 'NO',
}

export enum EstadoReclamo {
  PENDIENTE = 'Pendiente',
  EN_REVISION = 'En Revisión',
  RESUELTO = 'Resuelto',
  RECHAZADO = 'Rechazado',
}

export interface Reclamo {
  _id: string;
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  criticidad: Criticidad;
  estado: EstadoReclamo;
  fkCliente: string;
  fkProyecto: string;
  fkTipoReclamo: string;
  fkArea: string;
  createdAt: string;
  updatedAt: string;
  encargados?: any[];
  sintesis?: any[];
}

export interface CreateReclamoDto {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  criticidad: Criticidad;
  fkProyecto: string;
  fkTipoReclamo: string;
}

export interface UpdateReclamoDto {
  titulo?: string;
  descripcion?: string;
}

export interface GetReclamosQuery {
  page?: number;
  limit?: number;
  estado?: EstadoReclamo;
  fkTipoReclamo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  fkArea?: string;
}

export interface ChangeStateDto {
  estado: EstadoReclamo;
  sintesis?: string;
  nombre?: string;
}

export interface CreadorInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AreaInfo {
  _id: string;
  nombre: string;
  descripcion?: string;
}

export interface Sintesis {
  _id: string;
  nombre?: string;
  descripcion: string;
  fkReclamo: string;
  fkCreador: CreadorInfo;
  fkArea: AreaInfo;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReclamoResponse {
  data: Reclamo[];
  total: number;
  page: number;
  limit: number;
}

export const reclamosService = {
  // Obtener todos los reclamos (paginados)
  async getAll(query?: GetReclamosQuery): Promise<PaginatedReclamoResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.estado) params.append('estado', query.estado);
    if (query?.fkTipoReclamo) params.append('fkTipoReclamo', query.fkTipoReclamo);
    // Formatear fechas a ISO 8601 si están presentes
    if (query?.fechaInicio) {
      // Si viene en formato YYYY-MM-DD, agregar hora para ISO 8601
      const fecha = query.fechaInicio.includes('T') 
        ? query.fechaInicio 
        : `${query.fechaInicio}T00:00:00.000Z`;
      params.append('fechaInicio', fecha);
    }
    if (query?.fechaFin) {
      // Si viene en formato YYYY-MM-DD, agregar hora para ISO 8601
      const fecha = query.fechaFin.includes('T') 
        ? query.fechaFin 
        : `${query.fechaFin}T23:59:59.999Z`;
      params.append('fechaFin', fecha);
    }
    if (query?.fkArea) params.append('fkArea', query.fkArea);
    
    const url = `${RECLAMOS_ENDPOINTS.GET_ALL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un reclamo por ID
  async getById(id: string): Promise<Reclamo> {
    const response = await api.get(RECLAMOS_ENDPOINTS.GET_BY_ID(id));
    return response.data;
  },

  // Crear un nuevo reclamo
  async create(data: CreateReclamoDto, imagen?: File): Promise<Reclamo> {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descripcion', data.descripcion);
    formData.append('prioridad', data.prioridad);
    formData.append('criticidad', data.criticidad);
    formData.append('fkProyecto', data.fkProyecto);
    formData.append('fkTipoReclamo', data.fkTipoReclamo);
    
    if (imagen) {
      formData.append('imagen', imagen);
    }
    
    const response = await api.post(RECLAMOS_ENDPOINTS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Actualizar un reclamo
  async update(id: string, data: UpdateReclamoDto): Promise<Reclamo> {
    const response = await api.put(RECLAMOS_ENDPOINTS.UPDATE(id), data);
    return response.data;
  },

  // Eliminar un reclamo
  async delete(id: string): Promise<void> {
    await api.delete(RECLAMOS_ENDPOINTS.DELETE(id));
  },

  // Cambiar estado de un reclamo (Encargado/Gerente)
  async changeState(id: string, data: ChangeStateDto): Promise<Reclamo> {
    const response = await api.patch(RECLAMOS_ENDPOINTS.CHANGE_STATE(id), data);
    return response.data;
  },

  // Reasignar área de un reclamo (US 8 - Encargado/Gerente)
  async reassignArea(id: string, nuevaAreaId: string): Promise<Reclamo> {
    const response = await api.post(RECLAMOS_ENDPOINTS.REASSIGN_AREA(id, nuevaAreaId));
    return response.data;
  },

  // Obtener todas las síntesis de un reclamo
  async getSynthesis(reclamoId: string): Promise<Sintesis[]> {
    const response = await api.get(RECLAMOS_ENDPOINTS.GET_SYNTHESIS(reclamoId));
    return response.data;
  },

  // Obtener una síntesis específica
  async getSynthesisById(reclamoId: string, sintesisId: string): Promise<Sintesis> {
    const response = await api.get(RECLAMOS_ENDPOINTS.GET_SYNTHESIS_BY_ID(reclamoId, sintesisId));
    return response.data;
  },

  // Autoasignar un encargado a un reclamo (US 11)
  async autoAssign(reclamoId: string, encargadoId: string): Promise<Reclamo> {
    const response = await api.post(RECLAMOS_ENDPOINTS.AUTO_ASSIGN(reclamoId), { encargadoId });
    return response.data;
  },

  // Obtener encargados asignados a un reclamo
  async getEncargados(reclamoId: string): Promise<any[]> {
    const response = await api.get(RECLAMOS_ENDPOINTS.GET_ENCARGADOS(reclamoId));
    return response.data;
  },
};

