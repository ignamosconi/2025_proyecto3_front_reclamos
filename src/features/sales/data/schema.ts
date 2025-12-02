import { z } from 'zod'

const detalleVentaSchema = z.object({
  idProducto: z.number(),
  cantidad: z.number(),
  precio: z.number().optional(),
  precioUnitario: z.number().optional(), // Para datos del backend
  nombreProducto: z.string().optional(),
  producto: z.object({
    nombre: z.string(),
  }).optional(), // Para datos del backend
  subtotal: z.number().optional(), // Para datos del backend
})

const saleSchema = z.object({
  id: z.number(),
  idVenta: z.number().optional(), // El backend usa idVenta
  metodoPago: z.string().optional(),
  total: z.number().optional(),
  fechaCreacion: z.coerce.date().optional(),
  detalles: z.array(detalleVentaSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})
export type Sale = z.infer<typeof saleSchema>

export const saleListSchema = z.array(saleSchema)
