import { z } from 'zod'

const tipoReclamoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

export type TipoReclamo = z.infer<typeof tipoReclamoSchema>

export const tipoReclamoListSchema = z.array(tipoReclamoSchema)

