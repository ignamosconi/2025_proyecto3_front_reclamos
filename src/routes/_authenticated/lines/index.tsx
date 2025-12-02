import { createFileRoute, redirect } from '@tanstack/react-router'
import { Lines } from '@/features/lines'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/lines/')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Dueño"
    if (!hasRole('Dueño')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Lines,
})
