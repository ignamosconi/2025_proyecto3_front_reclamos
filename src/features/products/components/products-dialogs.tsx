import { ProductsActionDialog } from './products-action-dialog'
import { ProductsDeleteDialog } from './products-delete-dialog'
import { useProducts } from './products-provider'

type ProductsDialogsProps = {
  onSuccess?: () => void
}

export function ProductsDialogs({ onSuccess }: ProductsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useProducts()
  return (
    <>
      <ProductsActionDialog
        key='product-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <ProductsActionDialog
            key={`product-edit-${currentRow.idProducto}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <ProductsDeleteDialog
            key={`product-delete-${currentRow.idProducto}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />
        </>
      )}
    </>
  )
}
