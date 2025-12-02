/**
 * Centralized Axios instance with authentication interceptors
 * Handles automatic token attachment and refresh on 401 errors
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getCookie } from './cookies'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent infinite loops during token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failedQueue = []
}

// Request interceptor: Add access token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie('access_token')

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle 401 errors and refresh tokens
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getCookie('refresh_token')

      if (!refreshToken) {
        // No refresh token available, redirect to login
        isRefreshing = false
        processQueue(new Error('No refresh token available'))
        
        // Clear auth and redirect to login only if NOT already on login page
        if (typeof window !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0'
          document.cookie = 'refresh_token=; path=/; max-age=0'
          
          // Only redirect if not already on sign-in page
          if (!window.location.pathname.includes('/sign-in')) {
            window.location.href = '/sign-in'
          }
        }
        
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh the token
        const response = await axios.post(
          `${API_BASE_URL}/auth/tokens`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data

        // Update cookies with new tokens
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 15}` // 15 minutes
          if (newRefreshToken) {
            document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
          }
        }

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        // Process queued requests
        processQueue(null)
        isRefreshing = false

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        processQueue(refreshError as Error)
        isRefreshing = false

        if (typeof window !== 'undefined') {
          document.cookie = 'access_token=; path=/; max-age=0'
          document.cookie = 'refresh_token=; path=/; max-age=0'
          
          // Only redirect if not already on sign-in page
          if (!window.location.pathname.includes('/sign-in')) {
            window.location.href = '/sign-in'
          }
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

