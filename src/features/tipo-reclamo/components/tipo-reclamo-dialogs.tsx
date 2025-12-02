import { TipoReclamoActionDialog } from './tipo-reclamo-action-dialog'
import { TipoReclamoDeleteDialog } from './tipo-reclamo-delete-dialog'
import { useTipoReclamo } from './tipo-reclamo-provider'

type TipoReclamoDialogsProps = {
  onSuccess?: () => void
}

export function TipoReclamoDialogs({ onSuccess }: TipoReclamoDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useTipoReclamo()
  return (
    <>
      <TipoReclamoActionDialog
        key='tipo-reclamo-add'
        open={open === 'add'}
        onOpenChange={(state) => {
          if (!state) setOpen(null)
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <TipoReclamoActionDialog
            key={`tipo-reclamo-edit-${currentRow._id}`}
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

          <TipoReclamoDeleteDialog
            key={`tipo-reclamo-delete-${currentRow._id}`}
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

