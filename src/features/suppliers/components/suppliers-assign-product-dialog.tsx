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
import { type Supplier } from '../data/schema'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import { productsService } from '@/services/products/products.service'

const assignProductSchema = z.object({
  supplierId: z.number(),
  supplierName: z.string(),
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  codigoProveedor: z.string().min(1, 'El código del proveedor es obligatorio'),
})

type AssignProductFormValues = z.infer<typeof assignProductSchema>

interface SuppliersAssignProductDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: Supplier
  onSuccess?: () => void
}

interface Product {
  idProducto: number
  nombre: string
  descripcion?: string
}

export function SuppliersAssignProductDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: SuppliersAssignProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const form = useForm<AssignProductFormValues>({
    resolver: zodResolver(assignProductSchema),
    defaultValues: {
      supplierId: currentRow.idProveedor,
      supplierName: currentRow.nombre,
      productId: '',
      codigoProveedor: '',
    },
  })

  // Cargar productos cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadProducts()
      form.reset({
        supplierId: currentRow.idProveedor,
        supplierName: currentRow.nombre,
        productId: '',
        codigoProveedor: '',
      })
    }
  }, [open, currentRow, form])

  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      toast.error('Error al cargar los productos')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const onSubmit = async (values: AssignProductFormValues) => {
    try {
      setIsSubmitting(true)
      await suppliersService.assignProduct(
        values.supplierId,
        values.productId,
        values.codigoProveedor
      )
      toast.success('Producto asociado correctamente')
      onOpenChange()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al asociar producto:', error)
      const errorMessage = error.response?.data?.message || 'Error al asociar el producto'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Asociar producto</DialogTitle>
          <DialogDescription>
            Asocia un producto al proveedor seleccionado
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='supplierName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proveedor</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='productId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingProducts || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Selecciona un producto' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingProducts ? (
                        <SelectItem value='loading' disabled>
                          Cargando productos...
                        </SelectItem>
                      ) : products.length === 0 ? (
                        <SelectItem value='empty' disabled>
                          No hay productos disponibles
                        </SelectItem>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product.idProducto} value={String(product.idProducto)}>
                            {product.nombre}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='codigoProveedor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código del proveedor</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder='Ingrese el código del proveedor'
                      disabled={isSubmitting}
                    />
                  </FormControl>
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
              <Button type='submit' disabled={isSubmitting || isLoadingProducts}>
                {isSubmitting ? 'Asociando...' : 'Asociar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
