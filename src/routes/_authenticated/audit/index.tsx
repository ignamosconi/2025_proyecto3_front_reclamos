
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Audit } from '@/features/audit'

export const Route = createFileRoute('/_authenticated/audit/')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Dueño"
    if (!hasRole('Dueño')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Audit,
})
