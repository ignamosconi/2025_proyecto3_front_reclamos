import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { RecentSynthesis } from './components/recent-synthesis'
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters'
import { ClaimsPerProjectChart } from './components/claims-per-project-chart'
import { ClaimsByStatusChart } from './components/claims-by-status-chart'
import { AverageResolutionTime } from './components/average-resolution-time'
import { useClientDashboardMetrics } from '@/hooks/use-dashboard-stats'
import { useState, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({})
  const { auth } = useAuthStore()
  const isClient = auth.hasRole('Cliente')
  
  // Estabilizar la referencia del objeto filters para evitar re-renderizados infinitos
  const stableFilters = useMemo(() => filters, [
    filters.dateFrom,
    filters.dateTo,
    filters.specificDay,
    filters.proyectoId,
  ])
  
  const { data: clientMetrics } = useClientDashboardMetrics(isClient ? stableFilters : undefined)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            {isClient ? 'Dashboard de Reclamos' : 'Dashboard'}
          </h1>
        </div>
        
        {isClient ? (
          <div className='space-y-4'>
            {/* Filtros */}
            <DashboardFiltersComponent 
              filters={filters} 
              onFiltersChange={setFilters}
              showClientFilters={isClient}
            />
            
            {/* Client Dashboard Metrics */}
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
              <AverageResolutionTime filters={stableFilters} />
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total de reclamos
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='text-muted-foreground h-4 w-4'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {clientMetrics?.totalClaims || 0}
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    En el período seleccionado
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <ClaimsPerProjectChart filters={stableFilters} />
              <ClaimsByStatusChart filters={stableFilters} />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Síntesis de reclamos cerrados</CardTitle>
                <CardDescription>
                  Resoluciones y cierres de tus reclamos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSynthesis limit={5} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Bienvenido</CardTitle>
              <CardDescription>
                No tienes acceso al dashboard. Por favor, contacta al administrador.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </Main>
    </>
  )
}
