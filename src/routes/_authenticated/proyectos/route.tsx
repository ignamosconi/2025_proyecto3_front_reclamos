import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Proyectos } from '@/features/proyectos'

const proyectosSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  sort: z.string().optional().catch('createdAt'),
  search: z.string().optional().catch(''),
  cliente: z.string().optional().catch(undefined),
  areaResponsable: z.string().optional().catch(undefined),
  estado: z.enum(['activo', 'inactivo']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/proyectos')({
  validateSearch: proyectosSearchSchema,
  component: Proyectos,
})
