import { AreaActionDialog } from './areas-action-dialog'
import { AreaDeleteDialog } from './areas-delete-dialog'
import { useAreas } from './areas-provider'

type AreasDialogsProps = {
  onSuccess?: () => void
}

export function AreasDialogs({ onSuccess }: AreasDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useAreas()
  return (
    <>
      <AreaActionDialog
        key='area-add'
        open={open === 'add'}
        onOpenChange={(state) => {
          if (!state) setOpen(null)
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <AreaActionDialog
            key={`area-edit-${currentRow._id}`}
            open={open === 'edit'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />

          <AreaDeleteDialog
            key={`area-delete-${currentRow._id}`}
            open={open === 'delete'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
            onSuccess={onSuccess}
          />
        </>
      )}
    </>
  )
}


