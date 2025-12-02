import { createFileRoute, redirect } from '@tanstack/react-router'
import { Encuesta } from '@/features/encuesta'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/reclamos/$reclamoId/encuesta')({
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth

    // Permitir acceso a Clientes, Encargados y Gerentes
    if (!hasRole(['Cliente', 'Encargado', 'Gerente'])) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Encuesta,
})
