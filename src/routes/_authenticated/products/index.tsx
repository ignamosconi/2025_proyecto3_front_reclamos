import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Products } from '@/features/products'

export const Route = createFileRoute('/_authenticated/products/')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Dueño"
    if (!hasRole('Dueño')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Products,
})