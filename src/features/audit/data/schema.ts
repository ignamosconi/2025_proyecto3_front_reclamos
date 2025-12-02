import { z } from 'zod'

// Schema for audit user
const auditUserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  role: z.string(),
})

// Schema for audit log
const auditSchema = z.object({
  idAuditoria: z.number(),
  fecha_hora: z.coerce.date(),
  tipo_evento: z.string(),
  detalle: z.string().nullable().optional(),
  user: auditUserSchema,
})

export type Audit = z.infer<typeof auditSchema>
export type AuditUser = z.infer<typeof auditUserSchema>

export const auditListSchema = z.array(auditSchema)
