import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { TipoReclamoDialogs } from './components/tipo-reclamo-dialogs'
import { TipoReclamoPrimaryButtons } from './components/tipo-reclamo-primary-buttons'
import { TipoReclamoProvider } from './components/tipo-reclamo-provider'
import { TipoReclamoTable } from './components/tipo-reclamo-table'
import { tipoReclamoService } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/tipo-reclamo')

export function TipoReclamo() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: tipoReclamoResponse } = useQuery({
    queryKey: ['tipo-reclamo', search],
    queryFn: () => tipoReclamoService.getAll({
      page: search.page as number,
      limit: search.pageSize as number,
      sort: search.sort as 'asc' | 'desc',
      search: search.search as string,
    })
  })

  const tiposReclamo = tipoReclamoResponse?.data || []
  const total = tipoReclamoResponse?.total || 0

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['tipo-reclamo'] })
  }

  return (
    <TipoReclamoProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tipos de Reclamos</h2>
            <p className='text-muted-foreground'>
              Gestiona los tipos de reclamos para clasificar los problemas reportados.
            </p>
          </div>
          <TipoReclamoPrimaryButtons />
        </div>
        <TipoReclamoTable 
          data={tiposReclamo} 
          search={search} 
          navigate={navigate}
          total={total}
          pageSize={search.pageSize as number}
        />
      </Main>

      <TipoReclamoDialogs onSuccess={handleRefresh} />
    </TipoReclamoProvider>
  )
}

