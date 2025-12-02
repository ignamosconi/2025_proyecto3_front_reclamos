import { createFileRoute, redirect } from '@tanstack/react-router'
import { Brands } from '@/features/brands'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/brands/')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Dueño"
    if (!hasRole('Dueño')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Brands,
})
