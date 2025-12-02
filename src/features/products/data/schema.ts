import { z } from 'zod'

// Schema para Marca y Línea anidadas
const marcaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
})

const lineaSchema = z.object({
  id: z.number(),
  nombre: z.string(),
})

export const productSchema = z.object({
  idProducto: z.number(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  precio: z.number().min(0),
  stock: z.number().min(0),
  alertaStock: z.number().min(0),
  foto: z.string().nullable().optional(),
  idLinea: z.number().optional(),
  idMarca: z.number().optional(),
  marca: marcaSchema.optional().nullable(),
  linea: lineaSchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
})

export type Product = z.infer<typeof productSchema>

export const productListSchema = z.array(productSchema)

export const createProductSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  descripcion: z.string().optional().nullable(),
  precio: z.number().min(0),
  stock: z.number().min(0),
  alertaStock: z.number().min(0),
  foto: z.string().nullable().optional(),
  idLinea: z.number().optional(),
  idMarca: z.number().optional(),
})

export type CreateProductValues = z.infer<typeof createProductSchema>

export const updateProductSchema = createProductSchema.partial()

export type UpdateProductValues = z.infer<typeof updateProductSchema>