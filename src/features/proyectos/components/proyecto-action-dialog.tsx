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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { proyectosService, type CreateProyectoDto, type UpdateProyectoDto } from '@/services/proyectos/proyectos.service'
import { usersService } from '@/services/users/users.service'
import { areasService } from '@/services/areas/areas.service'
import { toast } from 'sonner'
import { type Proyecto } from '../data/schema'
import { useQuery } from '@tanstack/react-query'

const formSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.').max(100, 'El nombre no puede exceder los 100 caracteres.'),
  cliente: z.string().min(1, 'Debe seleccionar un cliente.'),
  areaResponsable: z.string().min(1, 'Debe seleccionar un área responsable.'),
})

type ProyectoForm = z.infer<typeof formSchema>

type ProyectoActionDialogProps = {
  currentRow?: Proyecto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProyectoActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ProyectoActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: clientesResponse } = useQuery({
    queryKey: ['clientes-list'],
    queryFn: () => usersService.getAll({ page: 1, limit: 100, role: 'Cliente' }),
  })

  const { data: areasResponse } = useQuery({
    queryKey: ['areas-list'],
    queryFn: () => areasService.getAll({ page: 1, limit: 100 }),
  })

  const clientes = clientesResponse?.data || []
  const areas = areasResponse?.data || []

  // Obtener el ID del cliente y área del proyecto actual
  const getClienteId = (proyecto: Proyecto): string => {
    if (typeof proyecto.cliente === 'string') return proyecto.cliente
    return proyecto.cliente._id
  }

  const getAreaId = (proyecto: Proyecto): string => {
    if (typeof proyecto.areaResponsable === 'string') return proyecto.areaResponsable
    return proyecto.areaResponsable._id
  }

  const form = useForm<ProyectoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      cliente: '',
      areaResponsable: '',
    },
  })

  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        nombre: currentRow.nombre,
        cliente: getClienteId(currentRow),
        areaResponsable: getAreaId(currentRow),
      })
    } else {
      form.reset({
        nombre: '',
        cliente: '',
        areaResponsable: '',
      })
    }
  }, [isEdit, currentRow, form])

  const onSubmit = async (values: ProyectoForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        const updateData: UpdateProyectoDto = {
          nombre: values.nombre,
          cliente: values.cliente,
          areaResponsable: values.areaResponsable,
        }
        
        await proyectosService.update(currentRow._id, updateData)
        toast.success('Proyecto actualizado correctamente')
      } else {
        const createData: CreateProyectoDto = {
          nombre: values.nombre,
          cliente: values.cliente,
          areaResponsable: values.areaResponsable,
        }
        
        await proyectosService.create(createData)
        toast.success('Proyecto creado correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar proyecto:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar el proyecto'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar proyecto' : 'Agregar nuevo proyecto'}</DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Actualiza la información del proyecto. Haz clic en guardar cuando termines.' 
              : 'Crea un nuevo proyecto. El nombre debe ser único en el sistema.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='proyecto-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Implementación de Plataforma E-commerce'
                      autoComplete='off'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='cliente'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cliente <span className='text-destructive'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione un cliente' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente._id} value={cliente._id}>
                          {cliente.firstName && cliente.lastName
                            ? `${cliente.firstName} ${cliente.lastName}`
                            : cliente.email}
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
              name='areaResponsable'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Área Responsable <span className='text-destructive'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione un área' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area._id} value={area._id}>
                          {area.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='proyecto-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

