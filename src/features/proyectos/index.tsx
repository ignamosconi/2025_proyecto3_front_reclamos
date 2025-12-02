import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProyectosDialogs } from './components/proyectos-dialogs'
import { ProyectosPrimaryButtons } from './components/proyectos-primary-buttons'
import { ProyectosProvider } from './components/proyectos-provider'
import { ProyectosTable } from './components/proyectos-table'
import { ProyectosFilters } from './components/proyectos-filters'
import { proyectosService } from '@/services/proyectos/proyectos.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/proyectos')

export function Proyectos() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: proyectosResponse, error } = useQuery({
    queryKey: ['proyectos', search],
    queryFn: () => proyectosService.getAll({
      page: search.page as number,
      limit: search.pageSize as number,
      sort: search.sort as string,
      search: search.search as string,
      cliente: search.cliente && search.cliente !== 'all' ? (search.cliente as string) : undefined,
      areaResponsable: search.areaResponsable && search.areaResponsable !== 'all' ? (search.areaResponsable as string) : undefined,
      estado: search.estado && search.estado !== 'all' ? (search.estado as 'activo' | 'inactivo') : undefined,
    }),
    retry: 1,
  })

  if (error) {
    console.error('Error al cargar proyectos:', error)
  }

  const proyectos = proyectosResponse?.data || []
  const total = proyectosResponse?.total || 0

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['proyectos'] })
  }

  return (
    <ProyectosProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Proyectos</h2>
            <p className='text-muted-foreground'>
              Gestiona los proyectos de la organización.
            </p>
          </div>
          <ProyectosPrimaryButtons />
        </div>
        <div className='flex flex-col gap-4'>
          <ProyectosFilters search={search} navigate={navigate} />
          <ProyectosTable 
            data={proyectos} 
            search={search} 
            navigate={navigate}
            total={total}
            pageSize={search.pageSize as number}
          />
        </div>
      </Main>

      <ProyectosDialogs onSuccess={handleRefresh} />
    </ProyectosProvider>
  )
}


