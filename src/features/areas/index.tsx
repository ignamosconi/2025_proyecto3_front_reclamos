import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { AreasDialogs } from './components/areas-dialogs'
import { AreasPrimaryButtons } from './components/areas-primary-buttons'
import { AreasProvider } from './components/areas-provider'
import { AreasTable } from './components/areas-table'
import { areasService } from '@/services/areas/areas.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { areaListSchema } from './data/schema'

const route = getRouteApi('/_authenticated/areas')

export function Areas() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: areasResponse } = useQuery({
    queryKey: ['areas', search],
    queryFn: async () => {
      const response = await areasService.getAll({
        page: search.page as number,
        limit: search.pageSize as number,
        sort: search.sort as 'asc' | 'desc',
        search: search.search as string,
      })
      // Transform data using Zod schema
      const parsed = areaListSchema.parse(response.data)
      return { ...response, data: parsed }
    }
  })

  const areas = areasResponse?.data || []
  const total = areasResponse?.total || 0

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['areas'] })
  }

  return (
    <AreasProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Áreas Responsables</h2>
            <p className='text-muted-foreground'>
              Gestiona las áreas responsables para asignar reclamos y personal interno.
            </p>
          </div>
          <AreasPrimaryButtons />
        </div>
        <AreasTable 
          data={areas} 
          search={search} 
          navigate={navigate}
          total={total}
          pageSize={search.pageSize as number}
        />
      </Main>

      <AreasDialogs onSuccess={handleRefresh} />
    </AreasProvider>
  )
}


