import { z } from 'zod'

const proyectoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  cliente: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      nombre: z.string().optional(),
      apellido: z.string().optional(),
      email: z.string(),
      rol: z.string().optional(),
    }),
  ]),
  areaResponsable: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      nombre: z.string(),
    }),
  ]),
  deletedAt: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

export type Proyecto = z.infer<typeof proyectoSchema>

export const proyectoListSchema = z.array(proyectoSchema)


