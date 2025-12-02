'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import { brandsService, type CreateBrandDto, type UpdateBrandDto } from '@/services/brands/brands.service'
import { toast } from 'sonner'
import { type Brand } from '../data/schema'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    descripcion: z.string().optional(),
    isEdit: z.boolean(),
  })

type BrandForm = z.infer<typeof formSchema>

type BrandActionDialogProps = {
  currentRow?: Brand
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BrandsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: BrandActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<BrandForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          descripcion: currentRow.descripcion || '',
          isEdit,
        }
      : {
          nombre: '',
          descripcion: '',
          isEdit,
        },
  })

  const onSubmit = async (values: BrandForm) => {
    try {
      setIsSubmitting(true)
      
      if (isEdit && currentRow) {
        // Actualizar marca
        const updateData: UpdateBrandDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }

        await brandsService.update(currentRow.id, updateData)
        toast.success('Marca actualizada correctamente')
      } else {
        // Crear nueva marca
        const createData: CreateBrandDto = {
          nombre: values.nombre,
          descripcion: values.descripcion || undefined,
        }
        
        await brandsService.create(createData)
        toast.success('Marca creada correctamente')
      }
      
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar marca:', error)
      const errorMessage = error.response?.data?.message || 'Error al guardar la marca'
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
          <DialogTitle>{isEdit ? 'Editar marca' : 'Agregar nueva marca'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información de la marca. Haz clic en guardar cuando termines.'
              : 'Crea una nueva marca. Haz clic en guardar cuando termines.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='brand-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Ej: Nike'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descripcion'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Ej: Marca deportiva internacional'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='brand-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
