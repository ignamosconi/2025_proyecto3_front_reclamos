import { getRouteApi, Outlet, useLocation } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReclamosDialogs } from './components/reclamos-dialogs'
import { ReclamosPrimaryButtons } from './components/reclamos-primary-buttons'
import { ReclamosProvider } from './components/reclamos-provider'
import { ReclamosTable } from './components/reclamos-table'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { useAuthStore } from '@/stores/auth-store'
import { reclamoListSchema } from './data/schema'

const route = getRouteApi('/_authenticated/reclamos')

export function Reclamos() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')
  const location = useLocation()
  
  // Check if we're on a child route (like encuesta)
  const hasChildRoute = location.pathname.includes('/encuesta')

  const { data: reclamosResponse, error } = useQuery({
    queryKey: ['reclamos', search],
    queryFn: async () => {
      try {
        const response = await reclamosService.getAll({
          page: search.page as number,
          limit: search.pageSize as number,
          estado: (search.estado && typeof search.estado === 'string' && Object.values(EstadoReclamo).includes(search.estado as EstadoReclamo)) ? (search.estado as EstadoReclamo) : undefined,
          fkTipoReclamo: search.fkTipoReclamo && search.fkTipoReclamo !== 'all' ? (search.fkTipoReclamo as string) : undefined,
          fechaInicio: search.fechaInicio as string | undefined,
          fechaFin: search.fechaFin as string | undefined,
          // El backend maneja el filtrado por área para managers automáticamente
        })
        const parsed = reclamoListSchema.parse(response.data)
        return { ...response, data: parsed }
      } catch (err: any) {
        console.error('Error al cargar reclamos:', err)
        throw err
      }
    },
    retry: 1,
  })

  if (error) {
    console.error('Error al cargar reclamos:', error)
  }

  const reclamos = reclamosResponse?.data || []
  const total = reclamosResponse?.total || 0

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['reclamos'] })
  }

  // If there's a child route, render only the Outlet
  if (hasChildRoute) {
    return (
      <ReclamosProvider>
        <Outlet />
      </ReclamosProvider>
    )
  }

  return (
    <ReclamosProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {isClient ? 'Mis Reclamos' : 'Gestión de Reclamos'}
            </h2>
            <p className='text-muted-foreground'>
              {isClient
                ? 'Gestiona tus reclamos y reporta problemas sobre tus proyectos.'
                : 'Gestiona los reclamos asignados a tus áreas.'}
            </p>
          </div>
          {isClient && <ReclamosPrimaryButtons />}
        </div>
        <ReclamosTable 
          data={reclamos} 
          search={search} 
          navigate={navigate}
          total={total}
          pageSize={search.pageSize as number}
        />
      </Main>

      <ReclamosDialogs onSuccess={handleRefresh} />
    </ReclamosProvider>
  )
}

