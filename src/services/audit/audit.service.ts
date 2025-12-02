import api from '@/lib/axios';
import { AUDIT_ENDPOINTS, buildQueryParams } from '../endpoints';

export interface AuditFilters {
  userId?: number;
  tipo_evento?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

// Servicio de auditoría 
export const auditService = {
  // Obtener todos los registros de auditoría con filtros opcionales
  async getAll(filters?: AuditFilters) {
    let url = AUDIT_ENDPOINTS.GET_ALL;
    
    // Construir URL con parámetros de consulta si hay filtros
    if (filters) {
      const params: Record<string, string | number | undefined> = {};
      
      if (filters.userId) params.userId = filters.userId;
      if (filters.tipo_evento) params.tipo_evento = filters.tipo_evento;
      if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
      if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
      
      // Si hay parámetros, construir la URL
      if (Object.keys(params).length > 0) {
        url = buildQueryParams(url, params);
      }
    }
    
    const response = await api.get(url);
    return response.data;
  },

  // Obtener tipos de eventos disponibles
  async getEventTypes() {
    const response = await api.get(AUDIT_ENDPOINTS.GET_EVENT_TYPES);
    return response.data;
  },
};