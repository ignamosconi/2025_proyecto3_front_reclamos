import { z } from 'zod'

const detalleCompraSchema = z.object({
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

const purchaseSchema = z.object({
  id: z.number(),
  idCompra: z.number().optional(), // El backend usa idCompra
  idProveedor: z.number().optional(),
  proveedor: z.object({
    idProveedor: z.number(),
    nombre: z.string(),
  }).optional(),
  metodoPago: z.string().optional(),
  total: z.union([z.number(), z.string()]).optional(),
  fechaCreacion: z.coerce.date().optional(),
  detalles: z.array(detalleCompraSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})
export type Purchase = z.infer<typeof purchaseSchema>

export const purchaseListSchema = z.array(purchaseSchema)
