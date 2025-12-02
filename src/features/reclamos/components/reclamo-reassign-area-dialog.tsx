'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { areasService, type Area } from '@/services/areas/areas.service'
import { handleServerError } from '@/lib/handle-server-error'
import { type Reclamo } from '../data/schema'
import { Loader2 } from 'lucide-react'

const reassignAreaSchema = z.object({
  nuevaAreaId: z.string().min(1, { message: 'Debe seleccionar un área' }),
})

type ReassignAreaFormValues = z.infer<typeof reassignAreaSchema>

type ReclamoReassignAreaDialogProps = {
  currentRow: Reclamo
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReclamoReassignAreaDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ReclamoReassignAreaDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(false)

  const form = useForm<ReassignAreaFormValues>({
    resolver: zodResolver(reassignAreaSchema),
    defaultValues: {
      nuevaAreaId: '',
    },
  })

  // Cargar las áreas disponibles
  useEffect(() => {
    if (open) {
      loadAreas()
    }
  }, [open])

  const loadAreas = async () => {
    try {
      setIsLoadingAreas(true)
      const response = await areasService.getAll({ limit: 100 })
      // Filtrar el área actual del reclamo
      const availableAreas = response.data.filter(
        (area) => area._id !== currentRow.fkArea
      )
      setAreas(availableAreas)
    } catch (error) {
      handleServerError(error)
      toast.error('Error al cargar las áreas disponibles')
    } finally {
      setIsLoadingAreas(false)
    }
  }

  const onSubmit = async (values: ReassignAreaFormValues) => {
    try {
      setIsLoading(true)
      await reclamosService.reassignArea(currentRow._id, values.nuevaAreaId)
      toast.success('Área reasignada exitosamente')
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      handleServerError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Reasignar área del reclamo</DialogTitle>
          <DialogDescription>
            Selecciona el área a la que deseas reasignar este reclamo. Los
            encargados actuales serán removidos y el estado cambiará a Pendiente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-4'>
              <div className='rounded-lg bg-muted p-3 text-sm'>
                <p className='font-medium'>Reclamo: {currentRow.titulo}</p>
                <p className='text-muted-foreground mt-1'>
                  Estado actual: {currentRow.estado}
                </p>
              </div>

              <FormField
                control={form.control}
                name='nuevaAreaId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva área</FormLabel>
                    <Select
                      disabled={isLoadingAreas || isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un área' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAreas ? (
                          <div className='flex items-center justify-center py-2'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                          </div>
                        ) : areas.length === 0 ? (
                          <div className='py-2 text-center text-sm text-muted-foreground'>
                            No hay áreas disponibles
                          </div>
                        ) : (
                          areas.map((area) => (
                            <SelectItem key={area._id} value={area._id}>
                              {area.nombre}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='rounded-lg bg-amber-50 dark:bg-amber-950 p-3 text-sm border border-amber-200 dark:border-amber-800'>
                <p className='font-medium text-amber-900 dark:text-amber-100'>
                  Importante:
                </p>
                <ul className='mt-1 text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1'>
                  <li>Los encargados actuales serán removidos</li>
                  <li>El estado cambiará a "Pendiente"</li>
                  <li>Los comentarios se mantendrán para contexto</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isLoading || isLoadingAreas}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Reasignar área
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
