import { z } from 'zod'

const productoSchema = z.object({
  idProducto: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
})

export type Producto = z.infer<typeof productoSchema>

const supplierProductSchema = z.object({
  idProductoProveedor: z.number(),
  proveedorId: z.number(),
  productoId: z.number(),
  codigoProveedor: z.string(),
  producto: productoSchema,
})

export type SupplierProduct = z.infer<typeof supplierProductSchema>

export const supplierSchema = z.object({
  idProveedor: z.number(),
  nombre: z.string(),
  direccion: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  productos: z.array(supplierProductSchema).optional(),
})

export type Supplier = z.infer<typeof supplierSchema>

export const supplierListSchema = z.array(supplierSchema)

export const createSupplierSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  direccion: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
})

export type CreateSupplierValues = z.infer<typeof createSupplierSchema>

export const updateSupplierSchema = createSupplierSchema.partial()

export type UpdateSupplierValues = z.infer<typeof updateSupplierSchema>