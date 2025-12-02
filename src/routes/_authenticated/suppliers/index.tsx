import { createFileRoute, redirect } from '@tanstack/react-router'
import { Suppliers } from '@/features/suppliers'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/suppliers/')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Dueño"
    if (!hasRole('Dueño')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Suppliers,
})