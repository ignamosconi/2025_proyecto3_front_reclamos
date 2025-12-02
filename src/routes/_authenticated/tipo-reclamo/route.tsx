import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { TipoReclamo } from '@/features/tipo-reclamo'
import { useAuthStore } from '@/stores/auth-store'

const tipoReclamoSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  sort: z.enum(['asc', 'desc']).optional().catch('asc'),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/tipo-reclamo')({
  validateSearch: tipoReclamoSearchSchema,
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Solo permitir acceso a usuarios con rol "Gerente" (US 5)
    if (!hasRole('Gerente')) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: TipoReclamo,
})
