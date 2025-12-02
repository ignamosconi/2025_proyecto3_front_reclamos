import { LinesActionDialog } from './lines-action-dialog'
import { LinesDeleteDialog } from './lines-delete-dialog'
import { useLines } from './lines-provider'


type LinesDialogsProps = {
  onSuccess?: () => void
}

export function LinesDialogs({ onSuccess }: LinesDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useLines()
  return (
    <>
      <LinesActionDialog
        key='line-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <LinesActionDialog
            key={`line-edit-${currentRow.id}`}
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

          <LinesDeleteDialog
            key={`line-delete-${currentRow.id}`}
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
