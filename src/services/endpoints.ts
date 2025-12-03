/**
 * Este archivo centraliza todos los endpoints de la API
 * para facilitar su mantenimiento y reutilización
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/tokens`,
  ME: `${API_BASE_URL}/auth/me`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
}

// Endpoints de usuarios
export const USERS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/users/id/${id}`,
  GET_BY_EMAIL: (email: string) => `${API_BASE_URL}/users/email/${email}`,
  GET_ENCARGADOS_BY_AREA: (areaId: string) => `${API_BASE_URL}/users/encargados/area/${areaId}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  REGISTER_STAFF: `${API_BASE_URL}/users/register-staff`,
  REGISTER_CLIENT: `${API_BASE_URL}/users/register-client`,
  UPDATE_STAFF: (id: string) => `${API_BASE_URL}/users/staff/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
}

// Endpoints de áreas responsables
export const AREAS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/area-reclamo`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/area-reclamo/${id}`,
  GET_BY_NAME: (nombre: string) =>
    `${API_BASE_URL}/area-reclamo/name/${nombre}`,
  CREATE: `${API_BASE_URL}/area-reclamo`,
  UPDATE: (id: string) => `${API_BASE_URL}/area-reclamo/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/area-reclamo/${id}`,
}

// Endpoints de tipos de reclamos
export const TIPO_RECLAMO_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/tipo-reclamo`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/tipo-reclamo/${id}`,
  GET_BY_NAME: (nombre: string) =>
    `${API_BASE_URL}/tipo-reclamo/name/${nombre}`,
  CREATE: `${API_BASE_URL}/tipo-reclamo`,
  UPDATE: (id: string) => `${API_BASE_URL}/tipo-reclamo/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/tipo-reclamo/${id}`,
}

// Endpoints de reclamos
export const RECLAMOS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/reclamos`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/reclamos/${id}`,
  CREATE: `${API_BASE_URL}/reclamos`,
  UPDATE: (id: string) => `${API_BASE_URL}/reclamos/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/reclamos/${id}`,
  CHANGE_STATE: (id: string) => `${API_BASE_URL}/reclamos/${id}/estado`,
  REASSIGN_AREA: (id: string, nuevaAreaId: string) => `${API_BASE_URL}/reclamos/${id}/reassign-area/${nuevaAreaId}`,
  AUTO_ASSIGN: (id: string) => `${API_BASE_URL}/reclamos/${id}/encargados/auto-assign`,
  GET_ENCARGADOS: (id: string) => `${API_BASE_URL}/reclamos/${id}/encargados`,
  ADD_ENCARGADO: (id: string) => `${API_BASE_URL}/reclamos/${id}/encargados`,
  REMOVE_ENCARGADO: (id: string) => `${API_BASE_URL}/reclamos/${id}/encargados`,
  GET_SYNTHESIS: (reclamoId: string) =>
    `${API_BASE_URL}/reclamos/${reclamoId}/sintesis`,
  GET_SYNTHESIS_BY_ID: (reclamoId: string, sintesisId: string) =>
    `${API_BASE_URL}/reclamos/${reclamoId}/sintesis/${sintesisId}`,
}

// Endpoints de proyectos
export const PROYECTOS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/proyectos`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/proyectos/${id}`,
  CREATE: `${API_BASE_URL}/proyectos`,
  UPDATE: (id: string) => `${API_BASE_URL}/proyectos/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/proyectos/${id}`,
  RESTORE: (id: string) => `${API_BASE_URL}/proyectos/${id}/restore`,
}

// Endpoints de historial
export const HISTORIAL_ENDPOINTS = {
  GET_BY_RECLAMO: (reclamoId: string) => `${API_BASE_URL}/historial/${reclamoId}`,
  ADD_COMENTARIO: (reclamoId: string) => `${API_BASE_URL}/historial/${reclamoId}/comentario`,
}

// Endpoints de encuestas
export const ENCUESTA_ENDPOINTS = {
  CREATE: (reclamoId: string) => `${API_BASE_URL}/reclamos/${reclamoId}/encuesta`,
  GET_BY_RECLAMO: (reclamoId: string) => `${API_BASE_URL}/reclamos/${reclamoId}/encuesta`,
}

// Endpoints de productos
export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/products`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/products/${id}`,
  CREATE: `${API_BASE_URL}/products`,
  UPDATE: (id: string) => `${API_BASE_URL}/products/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/products/${id}`,
}

// Endpoints de dashboard
export const DASHBOARD_ENDPOINTS = {
  CLIENT_METRICS: `${API_BASE_URL}/dashboard/cliente`,
  CLIENT_EXPORT: `${API_BASE_URL}/dashboard/cliente/export`,
  ENCARGADO_METRICS: `${API_BASE_URL}/dashboard/encargado`,
  ENCARGADO_EXPORT: `${API_BASE_URL}/dashboard/encargado/export`,
  GERENTE_METRICS: `${API_BASE_URL}/dashboard/gerente`,
  GERENTE_EXPORT: `${API_BASE_URL}/dashboard/gerente/export`,
}

// Función auxiliar para crear URLs con parámetros de consulta
export const buildQueryParams = (
  baseUrl: string,
  params: Record<string, string | number | boolean | null | undefined>
) => {
  const url = new URL(baseUrl)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}
