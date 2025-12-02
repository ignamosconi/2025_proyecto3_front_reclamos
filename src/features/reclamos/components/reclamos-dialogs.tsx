import { ReclamoCreateDialog } from './reclamo-create-dialog'
import { ReclamoEditDialog } from './reclamo-edit-dialog'
import { ReclamoDeleteDialog } from './reclamo-delete-dialog'
import { ReclamoViewDialog } from './reclamo-view-dialog'
import { ReclamoChangeStateDialog } from './reclamo-change-state-dialog'
import { ReclamoReassignAreaDialog } from './reclamo-reassign-area-dialog'
import { useReclamos } from './reclamos-provider'

type ReclamosDialogsProps = {
  onSuccess?: () => void
}

export function ReclamosDialogs({ onSuccess }: ReclamosDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useReclamos()
  return (
    <>
      <ReclamoCreateDialog
        key='reclamo-add'
        open={open === 'add'}
        onOpenChange={(state) => {
          if (!state) setOpen(null)
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <ReclamoViewDialog
            key={`reclamo-view-${currentRow._id}`}
            open={open === 'view'}
            onOpenChange={(state) => {
              if (!state) {
                setOpen(null)
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }
            }}
            currentRow={currentRow}
          />

          <ReclamoEditDialog
            key={`reclamo-edit-${currentRow._id}`}
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

          <ReclamoDeleteDialog
            key={`reclamo-delete-${currentRow._id}`}
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

          <ReclamoChangeStateDialog
            key={`reclamo-change-state-${currentRow._id}`}
            open={open === 'change-state'}
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

          <ReclamoReassignAreaDialog
            key={`reclamo-reassign-area-${currentRow._id}`}
            open={open === 'reassign-area'}
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

