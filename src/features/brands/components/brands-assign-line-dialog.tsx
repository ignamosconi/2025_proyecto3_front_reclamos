import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { type Brand } from '../data/schema'
import { brandsService } from '@/services/brands/brands.service'
import { linesService } from '@/services/lines/lines.service'

const assignLineSchema = z.object({
  brandId: z.number(),
  brandName: z.string(),
  lineId: z.string().min(1, 'Debe seleccionar una línea'),
})

type AssignLineFormValues = z.infer<typeof assignLineSchema>

interface BrandsAssignLineDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: Brand
  onSuccess?: () => void
}

interface Line {
  id: number
  nombre: string
}

export function BrandsAssignLineDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: BrandsAssignLineDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lines, setLines] = useState<Line[]>([])
  const [isLoadingLines, setIsLoadingLines] = useState(false)

  const form = useForm<AssignLineFormValues>({
    resolver: zodResolver(assignLineSchema),
    defaultValues: {
      brandId: currentRow.id,
      brandName: currentRow.nombre,
      lineId: '',
    },
  })

  // Cargar líneas cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadLines()
      form.reset({
        brandId: currentRow.id,
        brandName: currentRow.nombre,
        lineId: '',
      })
    }
  }, [open, currentRow, form])

  const loadLines = async () => {
    try {
      setIsLoadingLines(true)
      const data = await linesService.getAll()
      setLines(data)
    } catch (error) {
      console.error('Error al cargar líneas:', error)
      toast.error('Error al cargar las líneas de producto')
    } finally {
      setIsLoadingLines(false)
    }
  }

  const onSubmit = async (values: AssignLineFormValues) => {
    try {
      setIsSubmitting(true)
      await brandsService.assignLine(values.brandId, values.lineId)
      toast.success('Línea asociada correctamente')
      onOpenChange()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al asociar línea:', error)
      const errorMessage = error.response?.data?.message || 'Error al asociar la línea'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Asociar línea de producto</DialogTitle>
          <DialogDescription>
            Asocia una línea de producto a la marca seleccionada
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='brandName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lineId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Línea de producto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingLines || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecciona una línea' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingLines ? (
                        <SelectItem value='loading' disabled>
                          Cargando líneas...
                        </SelectItem>
                      ) : lines.length === 0 ? (
                        <SelectItem value='empty' disabled>
                          No hay líneas disponibles
                        </SelectItem>
                      ) : (
                        lines.map((line) => (
                          <SelectItem key={line.id} value={String(line.id)}>
                            {line.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={onOpenChange}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isSubmitting || isLoadingLines}>
                {isSubmitting ? 'Asociando...' : 'Asociar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
