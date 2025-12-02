import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { usersService } from '@/services/users/users.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll()
  })

  const handleRefreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  return (
    <UsersProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de usuarios</h2>
            <p className='text-muted-foreground'>
              Administra tus usuarios y sus roles aquí.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={users} search={search} navigate={navigate} />
      </Main>

      <UsersDialogs onSuccess={handleRefreshUsers} />
    </UsersProvider>
  )
}
