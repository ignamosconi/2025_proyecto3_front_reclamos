import { BrandsActionDialog } from './brands-action-dialog'
import { BrandsDeleteDialog } from './brands-delete-dialog'
import { useBrands } from './brands-provider'


type BrandsDialogsProps = {
  onSuccess?: () => void
}

export function BrandsDialogs({ onSuccess }: BrandsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useBrands()
  return (
    <>
      <BrandsActionDialog
        key='brand-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <BrandsActionDialog
            key={`brand-edit-${currentRow.id}`}
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

          <BrandsDeleteDialog
            key={`brand-delete-${currentRow.id}`}
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
