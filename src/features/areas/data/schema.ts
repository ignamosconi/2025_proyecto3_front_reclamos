import { z } from 'zod'

export const areaSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Area = z.infer<typeof areaSchema>

export const areaListSchema = z.array(areaSchema)

export interface ReclamoActivo {
  id: string;
  titulo: string;
  estado: string;
}

