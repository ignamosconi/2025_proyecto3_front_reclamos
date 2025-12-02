import { SuppliersActionDialog } from './suppliers-action-dialog'
import { SuppliersDeleteDialog } from './suppliers-delete-dialog'
import { SuppliersAssignProductDialog } from './suppliers-assign-product-dialog'
import { useSuppliers } from './suppliers-provider'

type SuppliersDialogsProps = {
  onSuccess?: () => void
}

export function SuppliersDialogs({ onSuccess }: SuppliersDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useSuppliers()
  return (
    <>
      <SuppliersActionDialog
        key='supplier-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <SuppliersActionDialog
            key={`supplier-edit-${currentRow.idProveedor}`}
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

          <SuppliersDeleteDialog
            key={`supplier-delete-${currentRow.idProveedor}`}
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

          <SuppliersAssignProductDialog
            key={`supplier-assign-product-${currentRow.idProveedor}`}
            open={open === 'assignProduct'}
            onOpenChange={() => {
              setOpen('assignProduct')
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
