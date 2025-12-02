import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { LinesDialogs } from './components/lines-dialogs'
import { LinesPrimaryButtons } from './components/lines-primary-buttons'
import { LinesProvider } from './components/lines-provider'
import { LinesTable } from './components/lines-table'
import { linesService } from '@/services/lines/lines.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/lines/')

export function Lines() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: lines = [] } = useQuery({
    queryKey: ['lines'],
    queryFn: () => linesService.getAll()
  })

  const handleRefreshLines = () => {
    queryClient.invalidateQueries({ queryKey: ['lines'] })
  }

  return (
    <LinesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de líneas de productos</h2>
            <p className='text-muted-foreground'>
              Administra tus líneas de productos aquí.
            </p>
          </div>
          <LinesPrimaryButtons />
        </div>
        <LinesTable data={lines} search={search} navigate={navigate} />
      </Main>

      <LinesDialogs onSuccess={handleRefreshLines} />
    </LinesProvider>
  )
}
