import { z } from 'zod'

const tipoReclamoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
  updatedAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
})

export type TipoReclamo = z.infer<typeof tipoReclamoSchema>

export const tipoReclamoListSchema = z.array(tipoReclamoSchema)

