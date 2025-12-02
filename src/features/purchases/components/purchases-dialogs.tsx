import { PurchasesMutateDrawer } from './purchases-mutate-drawer'
import { usePurchases } from './purchases-provider'

type PurchasesDialogsProps = {
  onSuccess?: () => void
}

export function PurchasesDialogs({ onSuccess }: PurchasesDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = usePurchases()
  
  return (
    <>
      <PurchasesMutateDrawer
        key='purchase-add'
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null)
          }
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <PurchasesMutateDrawer
          key={`purchase-edit-${currentRow.id}`}
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
