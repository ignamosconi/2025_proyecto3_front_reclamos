import { z } from 'zod'

export const areaSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  updatedAt: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
})

export type Area = z.infer<typeof areaSchema>

export const areaListSchema = z.array(areaSchema)

export interface ReclamoActivo {
  id: string;
  titulo: string;
  estado: string;
}


