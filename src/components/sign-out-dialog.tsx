import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const { auth } = useAuthStore()

  const handleSignOut = () => {
    // Use the new logout method which handles cleanup and redirect
    auth.logout()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Cerrar sesión'
      desc='¿Estás seguro de que deseas cerrar sesión? Necesitarás iniciar sesión nuevamente para acceder a tu cuenta.'
      confirmText='Cerrar sesión'
      cancelBtnText='Cancelar'
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
