import api from '@/lib/axios';
import { AUTH_ENDPOINTS, USERS_ENDPOINTS } from '../endpoints';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phone?: string;
  role: string;
}

export interface AuthResponse extends TokenPair {
  user?: User;
}

// Servicio de autenticación
export const authService = {
  // Login con email y password
  async login({ email, password }: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<TokenPair>(AUTH_ENDPOINTS.LOGIN, { email, password });
    
    // Obtenemos los tokens
    const { accessToken, refreshToken } = response.data;
    
    // Note: Tokens are saved to cookies by the auth store's setTokens method
    // Don't save them here to avoid duplication
    
    // Opcionalmente, también podemos obtener información del usuario inmediatamente
    // We need to manually set the token for this request since store hasn't been updated yet
    try {
      const userResponse = await api.get<User>(AUTH_ENDPOINTS.ME, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return {
        accessToken,
        refreshToken,
        user: userResponse.data,
      };
    } catch (error) {
      // Si falla la obtención del usuario, devolvemos solo los tokens
      return { accessToken, refreshToken };
    }
  },

  // Refrescar tokens
  // Note: This is now handled automatically by the axios interceptor
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const response = await api.post<TokenPair>(AUTH_ENDPOINTS.REFRESH_TOKEN, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });
    
    // Note: Tokens are saved by the axios interceptor automatically
    // No need to save them here
    
    return response.data;
  },

  // Obtener información del usuario autenticado
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(AUTH_ENDPOINTS.ME);
    return response.data;
  },
  
  // Olvidó contraseña
  async forgotPassword(email: string): Promise<{ message: string; success: boolean }> {
    const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
    return { ...response.data, success: response.status === 201 };
  },
  
  // Restablecer contraseña
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, { token, password });
    return response.data;
  },
  
  // Cerrar sesión (solo en cliente, no requiere petición al servidor)
  logout(): void {
    // La lógica de eliminación de tokens se maneja en el auth-store
  },

  async register(userData: { firstName: string; lastName: string; email: string; password: string; address?: string; phone?: string; role?: string; }): Promise<any> {
    const response = await api.post<TokenPair>(USERS_ENDPOINTS.REGISTER_EMPLOYEE, userData);
    let flag = false;

    if (response.data) {
      flag = true;
    }

    return flag;
  }
};