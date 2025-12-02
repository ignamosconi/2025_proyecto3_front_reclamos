import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileForm } from './components/profile-form'
import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth/auth.service'

const route = getRouteApi('/_authenticated/profile/')

export function Profile() {
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
  })

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Mi Perfil</h2>
            <p className='text-muted-foreground'>
              Actualiza tu información personal y cambia tu contraseña.
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <p className='text-muted-foreground'>Cargando información del perfil...</p>
          </div>
        ) : currentUser ? (
          <ProfileForm user={currentUser} />
        ) : (
          <div className='flex items-center justify-center py-8'>
            <p className='text-muted-foreground'>No se pudo cargar la información del perfil.</p>
          </div>
        )}
      </Main>
    </>
  )
}

