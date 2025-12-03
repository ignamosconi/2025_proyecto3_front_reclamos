import { z } from 'zod'
import { Prioridad, Criticidad, EstadoReclamo } from '@/services/reclamos/reclamos.service'

const creadorSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
})

const areaInfoSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
})

export const sintesisSchema = z.object({
  _id: z.string(),
  nombre: z.string().optional(),
  descripcion: z.string(),
  fkReclamo: z.string(),
  fkCreador: creadorSchema,
  fkArea: areaInfoSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

const imagenSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  tipo: z.string(),
  url: z.string(),
  fkReclamo: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})

// Helper para transformar fk que pueden venir como string o objeto
const fkTransform = z.preprocess(
  (val) => {
    if (typeof val === 'string') return val
    if (typeof val === 'object' && val !== null && '_id' in val) {
      return (val as { _id: string })._id
    }
    return val
  },
  z.string()
)

export const reclamoSchema = z.object({
  _id: z.string(),
  titulo: z.string(),
  descripcion: z.string(),
  prioridad: z.nativeEnum(Prioridad),
  criticidad: z.nativeEnum(Criticidad),
  estado: z.nativeEnum(EstadoReclamo),
  // Aceptar tanto string como objeto (con _id) y transformar a string
  fkCliente: fkTransform,
  fkProyecto: fkTransform,
  fkTipoReclamo: fkTransform,
  fkArea: fkTransform,
  createdAt: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  updatedAt: z.union([z.string(), z.date()]).transform((val) => typeof val === 'string' ? new Date(val) : val),
  encargados: z.array(z.any()).optional(),
  sintesis: z.array(sintesisSchema).optional(),
  imagenes: z.array(imagenSchema).optional(),
})

export type Reclamo = z.infer<typeof reclamoSchema>
export type Sintesis = z.infer<typeof sintesisSchema>

export const reclamoListSchema = z.array(reclamoSchema)

