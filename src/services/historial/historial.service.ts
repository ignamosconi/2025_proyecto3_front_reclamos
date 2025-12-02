import api from '@/lib/axios';

// Enums que coinciden con el backend
export enum AccionesHistorial {
  AUTOASIGNAR = 'autoasignar-reclamo',
  AGREGAR_ENCARGADO = 'agregar-encargado-reclamo',
  ELIMINAR_ENCARGADO = 'eliminar-encargado-reclamo',
  COMENTAR = 'comentar-proyecto', // deprecated
  COMENTAR_RECLAMO = 'comentar-reclamo',
  CAMBIO_ESTADO = 'modificar-estado-reclamo',
  CAMBIO_AREA = 'modificar-area-reclamo',
  CREACION = 'creacion-reclamo',
}

// Interfaces
export interface Responsable {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface HistorialEvent {
  _id: string;
  fecha_hora: string;
  responsable: Responsable;
  accion: AccionesHistorial;
  detalle: string;
  metadata?: Record<string, any>;
  reclamoId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateComentarioDto {
  comentario: string;
}

// Función auxiliar para obtener el texto descriptivo de la acción
export const getAccionLabel = (accion: AccionesHistorial): string => {
  const labels: Record<AccionesHistorial, string> = {
    [AccionesHistorial.AUTOASIGNAR]: 'Autoasignación',
    [AccionesHistorial.AGREGAR_ENCARGADO]: 'Encargado agregado',
    [AccionesHistorial.ELIMINAR_ENCARGADO]: 'Encargado eliminado',
    [AccionesHistorial.COMENTAR]: 'Comentario',
    [AccionesHistorial.COMENTAR_RECLAMO]: 'Comentario',
    [AccionesHistorial.CAMBIO_ESTADO]: 'Cambio de estado',
    [AccionesHistorial.CAMBIO_AREA]: 'Cambio de área',
    [AccionesHistorial.CREACION]: 'Creación del reclamo',
  };
  return labels[accion] || accion;
};

// Función auxiliar para obtener el componente de icono de la acción (lucide-react)
export const getAccionIconName = (accion: AccionesHistorial): string => {
  const icons: Record<AccionesHistorial, string> = {
    [AccionesHistorial.AUTOASIGNAR]: 'UserCheck',
    [AccionesHistorial.AGREGAR_ENCARGADO]: 'UserPlus',
    [AccionesHistorial.ELIMINAR_ENCARGADO]: 'UserMinus',
    [AccionesHistorial.COMENTAR]: 'MessageSquare',
    [AccionesHistorial.COMENTAR_RECLAMO]: 'MessageSquare',
    [AccionesHistorial.CAMBIO_ESTADO]: 'RefreshCw',
    [AccionesHistorial.CAMBIO_AREA]: 'FolderSync',
    [AccionesHistorial.CREACION]: 'Sparkles',
  };
  return icons[accion] || 'Pin';
};

// Función auxiliar para obtener el color de la acción
export const getAccionColor = (accion: AccionesHistorial): string => {
  const colors: Record<AccionesHistorial, string> = {
    [AccionesHistorial.AUTOASIGNAR]: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    [AccionesHistorial.AGREGAR_ENCARGADO]: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
    [AccionesHistorial.ELIMINAR_ENCARGADO]: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
    [AccionesHistorial.COMENTAR]: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
    [AccionesHistorial.COMENTAR_RECLAMO]: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
    [AccionesHistorial.CAMBIO_ESTADO]: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700',
    [AccionesHistorial.CAMBIO_AREA]: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
    [AccionesHistorial.CREACION]: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700',
  };
  return colors[accion] || 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700';
};

// Servicio de historial
export const historialService = {
  // Obtener el historial de un reclamo
  async getByReclamoId(reclamoId: string): Promise<HistorialEvent[]> {
    const response = await api.get(`/historial/${reclamoId}`);
    return response.data;
  },

  // Agregar un comentario al historial (solo Encargados y Gerentes)
  async addComentario(reclamoId: string, comentario: string): Promise<HistorialEvent> {
    const response = await api.post(`/historial/${reclamoId}/comentario`, {
      comentario,
    });
    return response.data;
  },
};
