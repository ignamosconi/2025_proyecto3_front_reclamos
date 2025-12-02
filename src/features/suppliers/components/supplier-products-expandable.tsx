import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Trash2, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import type { SupplierProduct } from '../data/schema'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SupplierProductsExpandButtonProps {
  isExpanded: boolean
  onToggle: () => void
  isLoading: boolean
}

export function SupplierProductsExpandButton({
  isExpanded,
  onToggle,
  isLoading,
}: SupplierProductsExpandButtonProps) {
  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-8 w-8 p-0'
      onClick={onToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : isExpanded ? (
        <ChevronDown className='h-4 w-4' />
      ) : (
        <ChevronRight className='h-4 w-4' />
      )}
      <span className='sr-only'>
        {isExpanded ? 'Contraer' : 'Expandir'}
      </span>
    </Button>
  )
}

interface SupplierProductsExpandedRowProps {
  supplierId: number
  supplierName: string
  onUpdate?: () => void
  refreshTrigger?: number
  onAssignProduct?: () => void
}

export function SupplierProductsExpandedRow({
  supplierId,
  supplierName,
  onUpdate,
  refreshTrigger,
  onAssignProduct,
}: SupplierProductsExpandedRowProps) {
  const [products, setProducts] = useState<SupplierProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<SupplierProduct | null>(null)

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await suppliersService.getAssociatedProducts(supplierId)
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos asociados:', error)
      toast.error('Error al cargar los productos asociados')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadProducts()
    }
  }, [refreshTrigger])

  const handleDeleteProduct = async (product: SupplierProduct) => {
    try {
      setDeletingProductId(product.productoId)
      await suppliersService.unassignProduct(product.idProductoProveedor)
      toast.success('Producto desasociado correctamente')
      await loadProducts()
      onUpdate?.()
    } catch (error: any) {
      console.error('Error al desasociar producto:', error)
      const errorMessage = error.response?.data?.message || 'Error al desasociar el producto'
      toast.error(errorMessage)
    } finally {
      setDeletingProductId(null)
      setShowDeleteDialog(false)
      setProductToDelete(null)
    }
  }

  const openDeleteDialog = (product: SupplierProduct) => {
    setProductToDelete(product)
    setShowDeleteDialog(true)
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className='py-4'>
        <div className='mb-3 px-4 flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-muted-foreground'>
            Productos asociados
          </h4>
          <Button
            size='sm'
            onClick={onAssignProduct}
            className='h-8 gap-1'
          >
            <Plus className='h-4 w-4' />
            Asociar producto
          </Button>
        </div>
        <div className='py-8 text-center text-sm text-muted-foreground'>
          No hay productos asociados a este proveedor
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='py-4'>
        <div className='mb-3 px-4 flex items-center justify-between'>
          <h4 className='text-sm font-semibold text-muted-foreground'>
            Productos asociados
          </h4>
          <Button
            size='sm'
            onClick={onAssignProduct}
            className='h-8 gap-1'
          >
            <Plus className='h-4 w-4' />
            Asociar producto
          </Button>
        </div>
        <div className='divide-y'>
          {products.map((supplierProduct) => (
            <div
              key={supplierProduct.productoId}
              className='flex items-center justify-between py-3 px-4 hover:bg-muted/50 transition-colors'
            >
              <div className='flex flex-col gap-1'>
                <span className='font-medium'>{supplierProduct.producto.nombre}</span>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-xs text-muted-foreground'>
                    Código de proveedor: <span className='font-mono font-medium'>{supplierProduct.codigoProveedor}</span>
                  </span>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50'
                onClick={() => openDeleteDialog(supplierProduct)}
                disabled={deletingProductId === supplierProduct.productoId}
              >
                {deletingProductId === supplierProduct.productoId ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Trash2 className='h-4 w-4' />
                )}
                <span className='sr-only'>Eliminar</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desasociar el producto "{productToDelete?.producto.nombre}" del proveedor "{supplierName}".
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
              className='bg-red-500 hover:bg-red-600'
            >
              Desasociar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
