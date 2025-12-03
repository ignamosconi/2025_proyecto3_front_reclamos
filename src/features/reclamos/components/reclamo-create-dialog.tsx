'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reclamosService, Prioridad, Criticidad, type CreateReclamoDto } from '@/services/reclamos/reclamos.service'
import { tipoReclamoService } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { proyectosService } from '@/services/proyectos/proyectos.service'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  descripcion: z.string().min(3, 'La descripción debe tener al menos 3 caracteres.'),
  prioridad: z.nativeEnum(Prioridad),
  criticidad: z.nativeEnum(Criticidad),
  fkProyecto: z.string().min(1, 'Debe seleccionar un proyecto.'),
  fkTipoReclamo: z.string().min(1, 'Debe seleccionar un tipo de reclamo.'),
  imagen: z.instanceof(File).optional(),
})

type ReclamoForm = z.infer<typeof formSchema>

type ReclamoCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReclamoCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: ReclamoCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // Obtener tipos de reclamo
  const { data: tiposReclamoResponse } = useQuery({
    queryKey: ['tipo-reclamo-list'],
    queryFn: () => tipoReclamoService.getAll({ page: 1, limit: 100 }),
    enabled: open,
  })

  // Obtener proyectos activos del cliente
  const { data: proyectosResponse } = useQuery({
    queryKey: ['proyectos-activos'],
    queryFn: () => proyectosService.getAll({ page: 1, limit: 100, estado: 'activo' }),
    enabled: open,
  })

  const form = useForm<ReclamoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      prioridad: Prioridad.MEDIA,
      criticidad: Criticidad.NO,
      fkProyecto: '',
      fkTipoReclamo: '',
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedFile(null)
    }
  }, [open, form])

  const onSubmit = async (values: ReclamoForm) => {
    try {
      setIsSubmitting(true)
      
      const createData: CreateReclamoDto = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        prioridad: values.prioridad,
        criticidad: values.criticidad,
        fkProyecto: values.fkProyecto,
        fkTipoReclamo: values.fkTipoReclamo,
      }
      
      await reclamosService.create(createData, selectedFile || undefined)
      toast.success('Reclamo creado correctamente')
      
      form.reset()
      setSelectedFile(null)
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al crear reclamo:', error)
      const errorMessage = error.response?.data?.message || 'Error al crear el reclamo'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue('imagen', file)
    }
  }

  const tiposReclamo = tiposReclamoResponse?.data || []
  const proyectos = proyectosResponse?.data || []

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isSubmitting) {
          form.reset()
          setSelectedFile(null)
          onOpenChange(state)
        }
      }}
    >
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>Crear nuevo reclamo</DialogTitle>
          <DialogDescription>
            Completa el formulario para crear un nuevo reclamo. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='reclamo-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='titulo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Fallo en la carga del módulo A'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='fkProyecto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Proyecto <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione un proyecto' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {proyectos.map((proyecto) => (
                          <SelectItem key={proyecto._id} value={proyecto._id}>
                            {proyecto.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='fkTipoReclamo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de Reclamo <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione un tipo' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposReclamo.map((tipo) => (
                          <SelectItem key={tipo._id} value={tipo._id}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='prioridad'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prioridad <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione prioridad' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Prioridad.ALTA}>Alta</SelectItem>
                        <SelectItem value={Prioridad.MEDIA}>Media</SelectItem>
                        <SelectItem value={Prioridad.BAJA}>Baja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='criticidad'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Criticidad <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Seleccione criticidad' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Criticidad.SI}>SÍ - Urgente</SelectItem>
                        <SelectItem value={Criticidad.NO}>NO - No urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='descripcion'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ej: Al intentar ingresar al módulo, aparece un error 500 y no carga la pantalla de clientes.'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-2'>
              <Label>Imagen (Opcional)</Label>
              <Input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className='text-sm text-muted-foreground'>
                  Archivo seleccionado: {selectedFile.name}
                </p>
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='reclamo-form' disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear reclamo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


