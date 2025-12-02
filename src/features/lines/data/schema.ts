import { z } from 'zod'

const lineSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})
export type Line = z.infer<typeof lineSchema>

export const lineListSchema = z.array(lineSchema)
