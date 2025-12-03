import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters'
import { ClaimsPerMonthChart } from './components/claims-per-month-chart'
import { ClaimsByTypeChart } from './components/claims-by-type-chart'
import { AverageResolutionTimeByTypeChart } from './components/average-resolution-time-by-type-chart'
import { ResolvedClaimsByPeriodChart } from './components/resolved-claims-by-period-chart'
import { AverageResolvedMetricCard } from './components/average-resolved-metric-card'
import { useEncargadoDashboardMetrics } from '@/hooks/use-dashboard-stats'
import { useState, useMemo } from 'react'

export function EncargadoDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({})
  
  // Estabilizar la referencia del objeto filters para evitar re-renderizados infinitos
  const stableFilters = useMemo(() => filters, [
    filters.dateFrom,
    filters.dateTo,
    filters.specificDay,
    filters.proyectoId,
    filters.clienteId,
    filters.tipoReclamoId,
    filters.estado,
    filters.areaId,
  ])
  
  const { data: encargadoMetrics } = useEncargadoDashboardMetrics(stableFilters, true)

  return (
    <div className='space-y-6'>
      {/* Filtros */}
      <DashboardFiltersComponent 
        filters={filters} 
        onFiltersChange={setFilters}
        showEncargadoFilters={true}
      />
      
      {/* Encargado Dashboard Metrics */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-primary/20 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total de Reclamos
            </CardTitle>
            <div className='rounded-full bg-primary/10 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-primary h-5 w-5'
              >
                <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                <circle cx='9' cy='7' r='4' />
                <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {encargadoMetrics?.totalClaims || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              En el período seleccionado
            </p>
          </CardContent>
        </Card>
        
        <AverageResolvedMetricCard filters={stableFilters} />
        
        <Card className='border-green-500/20 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Reclamos Resueltos
            </CardTitle>
            <div className='rounded-full bg-green-500/10 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-green-500 h-5 w-5'
              >
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
                <polyline points='22 4 12 14.01 9 11.01' />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {encargadoMetrics?.resolvedClaimsByPeriod?.reduce((sum, item) => sum + item.cantidad, 0) || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              Total resueltos
            </p>
          </CardContent>
        </Card>
        
        <Card className='border-blue-500/20 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tipos de Reclamo
            </CardTitle>
            <div className='rounded-full bg-blue-500/10 p-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                className='text-blue-500 h-5 w-5'
              >
                <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {encargadoMetrics?.claimsByType?.length || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              Diferentes tipos atendidos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <ClaimsPerMonthChart filters={stableFilters} />
      
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <ClaimsByTypeChart filters={stableFilters} />
        <AverageResolutionTimeByTypeChart filters={stableFilters} />
      </div>
      
      <ResolvedClaimsByPeriodChart filters={stableFilters} />
    </div>
  )
}

