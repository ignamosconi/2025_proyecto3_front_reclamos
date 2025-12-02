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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  reclamosService,
  EstadoReclamo,
  type ChangeStateDto,
  type UpdateAreaDto,
} from '@/services/reclamos/reclamos.service'
import { areasService } from '@/services/areas/areas.service'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Info } from 'lucide-react'
import { type Reclamo } from '../data/schema'
import { useAuthStore } from '@/stores/auth-store'

const formSchema = z.object({
  estado: z.nativeEnum(EstadoReclamo),
  sintesis: z.string().max(1000, 'La síntesis no puede exceder 1000 caracteres.').optional(),
  nombre: z.string().max(255, 'El nombre no puede exceder 255 caracteres.').optional(),
  fkArea: z.string().optional(),
}).refine(
  (data) => {
    // Síntesis es obligatoria cuando se cambia a Resuelto o Rechazado
    if (
      (data.estado === EstadoReclamo.RESUELTO || data.estado === EstadoReclamo.RECHAZADO) &&
      (!data.sintesis || data.sintesis.trim().length === 0)
    ) {
      return false
    }
    return true
  },
  {
    message: 'La síntesis es obligatoria al resolver o rechazar el reclamo.',
    path: ['sintesis'],
  }
)

type ReclamoForm = z.infer<typeof formSchema>

type ReclamoChangeStateDialogProps = {
  currentRow: Reclamo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

// Función para obtener estados válidos según el estado actual
const getValidNextStates = (currentState: EstadoReclamo): EstadoReclamo[] => {
  switch (currentState) {
    case EstadoReclamo.PENDIENTE:
      return [EstadoReclamo.EN_REVISION]
    case EstadoReclamo.EN_REVISION:
      return [EstadoReclamo.RESUELTO, EstadoReclamo.RECHAZADO]
    case EstadoReclamo.RESUELTO:
    case EstadoReclamo.RECHAZADO:
      return [] // Estados finales, no se puede cambiar
    default:
      return []
  }
}

export function ReclamoChangeStateDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ReclamoChangeStateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { auth } = useAuthStore()
  const isManager = auth.hasRole(['Encargado', 'Gerente'])
  const isFinalState = currentRow.estado === EstadoReclamo.RESUELTO || currentRow.estado === EstadoReclamo.RECHAZADO
  const validNextStates = getValidNextStates(currentRow.estado)

  // Obtener áreas para el selector
  const { data: areasResponse } = useQuery({
    queryKey: ['areas-list'],
    queryFn: () => areasService.getAll({ page: 1, limit: 100 }),
    enabled: open && isManager,
  })

  const form = useForm<ReclamoForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      estado: currentRow.estado,
      sintesis: '',
      nombre: '',
      fkArea: currentRow.fkArea,
    },
  })

  const selectedEstado = form.watch('estado')
  const requiresSynthesis = selectedEstado === EstadoReclamo.RESUELTO || selectedEstado === EstadoReclamo.RECHAZADO

  useEffect(() => {
    if (open) {
      form.reset({
        estado: currentRow.estado,
        sintesis: '',
        nombre: '',
        fkArea: currentRow.fkArea,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = async (values: ReclamoForm) => {
    if (isFinalState) {
      toast.error('No se puede modificar un reclamo en estado final (Resuelto o Rechazado)')
      return
    }

    if (!validNextStates.includes(values.estado)) {
      toast.error(`No se puede cambiar de "${currentRow.estado}" a "${values.estado}". Transición inválida.`)
      return
    }

    try {
      setIsSubmitting(true)

      // Si el estado cambió, actualizar estado con síntesis
      if (values.estado !== currentRow.estado) {
        const changeStateData: ChangeStateDto = {
          estado: values.estado,
          sintesis: values.sintesis || undefined,
          nombre: values.nombre || undefined,
        }
        await reclamosService.changeState(currentRow._id, changeStateData)
      }

      // Si el área cambió, actualizar área
      if (values.fkArea && values.fkArea !== currentRow.fkArea) {
        const updateAreaData: UpdateAreaDto = {
          fkArea: values.fkArea,
        }
        await reclamosService.updateArea(currentRow._id, updateAreaData)
      }

      toast.success('Reclamo actualizado correctamente')
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al actualizar reclamo:', error)
      const errorMessage = error.response?.data?.message || 'Error al actualizar el reclamo'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const areas = areasResponse?.data || []

  if (!isManager) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!isSubmitting) {
          form.reset()
          onOpenChange(state)
        }
      }}
    >
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='text-start'>
          <DialogTitle>Cambiar estado del reclamo</DialogTitle>
          <DialogDescription>
            {isFinalState
              ? 'Este reclamo está en estado final y no puede ser modificado.'
              : 'Modifica el estado del reclamo y añade una síntesis si es necesario.'}
          </DialogDescription>
        </DialogHeader>

        {isFinalState && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Este reclamo está en estado "{currentRow.estado}" y no puede ser modificado.
            </AlertDescription>
          </Alert>
        )}

        {!isFinalState && validNextStates.length === 0 && (
          <Alert>
            <Info className='h-4 w-4' />
            <AlertDescription>
              No hay transiciones de estado válidas disponibles para este reclamo.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            id='reclamo-change-state-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='estado'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nuevo Estado <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isFinalState || validNextStates.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione un estado' />
                      </SelectTrigger>
                      <SelectContent>
                        {validNextStates.map((estado) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                        {validNextStates.length === 0 && (
                          <SelectItem value={currentRow.estado} disabled>
                            {currentRow.estado} (Estado actual)
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                  {validNextStates.length > 0 && (
                    <p className='text-xs text-muted-foreground'>
                      Estados válidos: {validNextStates.join(', ')}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='fkArea'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área Responsable</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isFinalState}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione un área' />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area._id} value={area._id}>
                            {area.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nombre'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la síntesis (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Ej: Resolución del problema'
                      autoComplete='off'
                      disabled={isFinalState}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='sintesis'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Síntesis{' '}
                    {requiresSynthesis && <span className='text-destructive'>*</span>}
                    {!requiresSynthesis && <span className='text-muted-foreground'>(Opcional)</span>}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        requiresSynthesis
                          ? 'Describe la resolución o motivo del rechazo...'
                          : 'Describe los cambios realizados...'
                      }
                      className='min-h-[120px]'
                      disabled={isFinalState}
                      maxLength={1000}
                      {...field}
                    />
                  </FormControl>
                  <div className='flex justify-between items-center'>
                    <FormMessage />
                    <span className='text-xs text-muted-foreground'>
                      {field.value?.length || 0}/1000 caracteres
                    </span>
                  </div>
                  {requiresSynthesis && (
                    <p className='text-xs text-muted-foreground'>
                      La síntesis es obligatoria al resolver o rechazar el reclamo.
                    </p>
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type='submit'
            form='reclamo-change-state-form'
            disabled={isSubmitting || isFinalState || validNextStates.length === 0}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


