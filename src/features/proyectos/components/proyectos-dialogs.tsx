import { ProyectoActionDialog } from './proyecto-action-dialog'
import { ProyectoDeleteDialog } from './proyecto-delete-dialog'
import { ProyectoViewDialog } from './proyecto-view-dialog'
import { useProyecto } from './proyectos-provider'

type ProyectosDialogsProps = {
  onSuccess?: () => void
}

export function ProyectosDialogs({ onSuccess }: ProyectosDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useProyecto()
  return (
    <>
      <ProyectoActionDialog
        key='proyecto-add'
        open={open === 'add'}
        onOpenChange={(state) => {
          if (!state) setOpen(null)
        }}
        onSuccess={onSuccess}
      />

      {currentRow && (
        <>
          <ProyectoActionDialog
            key={`proyecto-edit-${currentRow._id}`}
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

          <ProyectoDeleteDialog
            key={`proyecto-delete-${currentRow._id}`}
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

          <ProyectoViewDialog
            key={`proyecto-view-${currentRow._id}`}
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
        </>
      )}
    </>
  )
}

