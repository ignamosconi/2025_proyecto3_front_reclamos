import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { User } from '@/services/auth/auth.service'
import { jwtDecode } from 'jwt-decode'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'
const USER_DATA = 'user_data'

// Interfaz para los datos decodificados del JWT
interface JwtPayload {
  email: string
  role: string
  exp: number
  iat: number
}

// Interfaz para el usuario autenticado
interface AuthUser {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  role: string
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: User | null) => void
    accessToken: string
    refreshToken: string
    getAccessToken: () => string
    getRefreshToken: () => string
    setTokens: (accessToken: string, refreshToken?: string) => void
    resetTokens: () => void
    reset: () => void
    logout: () => void
    isAuthenticated: () => boolean
    hasRole: (role: string | string[]) => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  // Obtenemos los tokens iniciales de las cookies
  const accessTokenCookie = getCookie(ACCESS_TOKEN) || '';
  const refreshTokenCookie = getCookie(REFRESH_TOKEN) || '';
  
  // Intentamos extraer el usuario del token si existe
  let initialUser: AuthUser | null = null;
  
  // Primero intentamos obtener los datos completos del usuario desde la cookie
  const userDataCookie = getCookie(USER_DATA);
  if (userDataCookie) {
    try {
      initialUser = JSON.parse(userDataCookie);
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
    }
  }
  
  // Si no hay datos de usuario en cookie, intentamos extraerlos del token
  if (!initialUser && accessTokenCookie && accessTokenCookie.length > 0 && accessTokenCookie.includes('.')) {
    try {
      // Decodificamos el token para obtener la información del usuario
      const decoded = jwtDecode<JwtPayload>(accessTokenCookie);
      initialUser = {
        email: decoded.email,
        role: decoded.role,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      // Clear invalid token
      removeCookie(ACCESS_TOKEN);
    }
  }
  
  return {
    auth: {
      user: initialUser,
      setUser: (user) => {
        if (!user) {
          // Removemos los datos del usuario de la cookie
          removeCookie(USER_DATA);
          set((state) => ({ ...state, auth: { ...state.auth, user: null } }));
          return;
        }
        
        // Convertimos el usuario de la API a nuestro formato AuthUser
        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          // Si no tenemos exp del token, usamos un tiempo por defecto (1 hora)
          exp: Math.floor(Date.now() / 1000) + 60 * 60 
        };
        
        // Guardamos los datos del usuario en una cookie
        setCookie(USER_DATA, JSON.stringify(authUser), 7 * 24 * 60 * 60); // 7 días
        
        set((state) => ({ ...state, auth: { ...state.auth, user: authUser } }));
      },
      accessToken: accessTokenCookie,
      refreshToken: refreshTokenCookie,
      getAccessToken: () => {
        // Always get fresh token from cookie
        return getCookie(ACCESS_TOKEN) || '';
      },
      getRefreshToken: () => {
        // Always get fresh token from cookie
        return getCookie(REFRESH_TOKEN) || '';
      },
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          // Validate tokens before saving
          if (!accessToken || typeof accessToken !== 'string' || accessToken.length === 0) {
            console.error('Invalid access token provided to setTokens');
            return state;
          }

          // Guardamos el access token en una cookie
          setCookie(ACCESS_TOKEN, accessToken);
          
          // Si tenemos refresh token, también lo guardamos
          if (refreshToken && typeof refreshToken === 'string' && refreshToken.length > 0) {
            setCookie(REFRESH_TOKEN, refreshToken, 7 * 24 * 60 * 60); // 7 días
          }
          
          // Intentamos extraer y guardar la información del usuario del token
          // Validate token format before decoding (JWT has 3 parts separated by dots)
          if (accessToken.includes('.')) {
            try {
              const decoded = jwtDecode<JwtPayload>(accessToken);
              
              // Creamos el objeto de usuario a partir del payload
              const authUser: AuthUser = {
                email: decoded.email,
                role: decoded.role,
                exp: decoded.exp
              };
              
              // Guardamos los datos del usuario en cookie
              setCookie(USER_DATA, JSON.stringify(authUser), 7 * 24 * 60 * 60); // 7 días
              
              return { 
                ...state, 
                auth: { 
                  ...state.auth, 
                  accessToken, 
                  refreshToken: refreshToken || state.auth.refreshToken,
                  user: authUser
                } 
              };
            } catch (error) {
              console.error('Error decoding JWT token:', error);
              // Still save the token even if decoding fails
              return { 
                ...state, 
                auth: { 
                  ...state.auth, 
                  accessToken, 
                  refreshToken: refreshToken || state.auth.refreshToken 
                } 
              };
            }
          } else {
            console.error('Invalid token format: token does not contain dots');
            return { 
              ...state, 
              auth: { 
                ...state.auth, 
                accessToken, 
                refreshToken: refreshToken || state.auth.refreshToken 
              } 
            };
          }
        }),
      resetTokens: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          removeCookie(USER_DATA);
          return { ...state, auth: { ...state.auth, accessToken: '', refreshToken: '' } };
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN);
          removeCookie(REFRESH_TOKEN);
          removeCookie(USER_DATA);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
          };
        }),
      logout: () => {
        // Clear all auth state
        removeCookie(ACCESS_TOKEN);
        removeCookie(REFRESH_TOKEN);
        removeCookie(USER_DATA);
        localStorage.clear();
        
        set((state) => ({
          ...state,
          auth: { ...state.auth, user: null, accessToken: '', refreshToken: '' },
        }));
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      },
      isAuthenticated: () => {
        const { user } = get().auth;
        
        if (!user) return false;
        
        // Verificamos si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        return user.exp > currentTime;
      },
      hasRole: (role) => {
        const { user } = get().auth;
        
        if (!user) return false;
        
        // Si role es un array, verificamos si el usuario tiene alguno de los roles
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        
        // Si es un string, verificamos si coincide con el rol del usuario
        return user.role === role;
      }
    },
  };
});
