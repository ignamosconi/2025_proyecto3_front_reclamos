import { z } from 'zod'

const userRoleSchema = z.union([
  z.literal('Cliente'),
  z.literal('Encargado'),
  z.literal('Gerente'),
])

const areaSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
})

const userSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: userRoleSchema,
  areas: z.array(areaSchema).optional(),
  createdAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
  updatedAt: z.union([z.string(), z.date()]).optional().transform((val) => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
})

export type User = z.infer<typeof userSchema>
export type Area = z.infer<typeof areaSchema>

export const userListSchema = z.array(userSchema)
