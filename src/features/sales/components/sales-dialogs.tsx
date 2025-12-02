import { SalesMutateDrawer } from './sales-mutate-drawer'
import { useSales } from './sales-provider'

type SalesDialogsProps = {
  onSuccess?: () => void
}

export function SalesDialogs({ onSuccess }: SalesDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useSales()
  
  return (
    <>
      <SalesMutateDrawer
        key='sale-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
          }
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <SalesMutateDrawer
          key={`sale-edit-${currentRow.id}`}
          open={open === 'edit'}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }
          }}
          currentRow={currentRow}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
