/**
 * Este archivo centraliza todos los endpoints de la API
 * para facilitar su mantenimiento y reutilización
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/tokens`,
  ME: `${API_BASE_URL}/auth/me`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
};

// Endpoints de usuarios
export const USERS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/users`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/users/id/${id}`,
  GET_BY_EMAIL: (email: string) => `${API_BASE_URL}/users/email/${email}`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  REGISTER_STAFF: `${API_BASE_URL}/users/register-staff`,
  REGISTER_CLIENT: `${API_BASE_URL}/users/register-client`,
  UPDATE_STAFF: (id: string) => `${API_BASE_URL}/users/staff/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/users/${id}`,
};

// Endpoints de áreas responsables
export const AREAS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/area-reclamo`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/area-reclamo/${id}`,
};

// Endpoints de catalogo
export const CATALOG_ENDPOINTS = {
  LINES_ENDPOINTS: {
    GET_ALL: `${API_BASE_URL}/lineas`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/lineas/${id}`,
    CREATE: `${API_BASE_URL}/lineas`,
  },
  BRANDS_ENDPOINTS: {
    GET_ALL: `${API_BASE_URL}/marcas`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/marcas/${id}`,
    CREATE: `${API_BASE_URL}/marcas`,
    GET_LINES: (brandId: string | number) => `${API_BASE_URL}/marca/${brandId}/linea`,
    ASSIGN_LINE: (brandId: string | number, lineId: string | number) => `${API_BASE_URL}/marca/${brandId}/linea/${lineId}`,
    UNASSIGN_LINE: (brandId: string | number, lineId: string | number) => `${API_BASE_URL}/marca/${brandId}/linea/${lineId}`,
  },
};

// Endpoints de proveedores (suppliers)
export const SUPPLIER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/proveedor`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/proveedor/${id}`,
  CREATE: `${API_BASE_URL}/proveedor`,
  UPDATE: (id: string) => `${API_BASE_URL}/proveedor/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/proveedor/${id}`,
  GET_PRODUCTS: (supplierId: string | number) => `${API_BASE_URL}/producto-proveedor/proveedor/${supplierId}`,
  ASSIGN_PRODUCT: `${API_BASE_URL}/producto-proveedor`,
  UNASSIGN_PRODUCT: (relationId: string | number) => `${API_BASE_URL}/producto-proveedor/${relationId}`,
};

// Endpoints de productos (products)
export const PRODUCT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/producto`,
  GET_BY_ID: (id: string) => `${API_BASE_URL}/producto/${id}`,
  CREATE: `${API_BASE_URL}/producto`,
  UPDATE: (id: string) => `${API_BASE_URL}/producto/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/producto/${id}`,
};

// Endpoints de auditoría (audit)
export const AUDIT_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/auditoria`,
  GET_EVENT_TYPES: `${API_BASE_URL}/auditoria/enum`,
};

// Función auxiliar para crear URLs con parámetros de consulta
export const buildQueryParams = (baseUrl: string, params: Record<string, string | number | boolean | null | undefined>) => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};
