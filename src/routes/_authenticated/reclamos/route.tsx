import z from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Reclamos } from '@/features/reclamos'
import { useAuthStore } from '@/stores/auth-store'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'

const reclamosSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  sort: z.enum(['asc', 'desc']).optional().catch('asc'),
  search: z.string().optional().catch(''),
  estado: z.nativeEnum(EstadoReclamo).optional().catch(undefined),
  fkTipoReclamo: z.string().optional().catch(undefined),
  fechaInicio: z.string().optional().catch(undefined),
  fechaFin: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/reclamos')({
  validateSearch: reclamosSearchSchema,
  beforeLoad: () => {
    const { hasRole } = useAuthStore.getState().auth
    
    // Permitir acceso a Clientes y Encargados (US 7, US 10)
    if (!hasRole(['Cliente', 'Encargado', 'Gerente'])) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Reclamos,
})
