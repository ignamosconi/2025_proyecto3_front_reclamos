import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
   beforeLoad: () => {
      const { hasRole } = useAuthStore.getState().auth
      
      // Solo permitir acceso a usuarios con rol "Dueño"
      if (!hasRole('Dueño')) {
        throw redirect({
          to: '/sales',
        })
      }
    },
  component: Dashboard,
})
