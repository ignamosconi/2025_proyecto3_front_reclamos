import { z } from 'zod'

const lineaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
})

export type Linea = z.infer<typeof lineaSchema>

const brandLineaSchema = z.object({
  marcaId: z.number(),
  lineaId: z.number(),
  linea: lineaSchema,
})

export type BrandLinea = z.infer<typeof brandLineaSchema>

const brandSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  lineas: z.array(brandLineaSchema).optional(),
})
export type Brand = z.infer<typeof brandSchema>

export const brandListSchema = z.array(brandSchema)
