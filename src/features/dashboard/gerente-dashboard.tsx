import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters'
import { WorkloadByAreaChart } from './components/workload-by-area-chart'
import { TopEmployeesByResolvedChart } from './components/top-employees-by-resolved-chart'
import { TopEmployeesByEfficiencyChart } from './components/top-employees-by-efficiency-chart'
import { StateChangesMetricCard } from './components/state-changes-metric-card'
import { DistributionByTypeChart } from './components/distribution-by-type-chart'
import { CriticalClaimsPercentageCard } from './components/critical-claims-percentage-card'
import { useGerenteDashboardMetrics } from '@/hooks/use-dashboard-stats'
import { useState, useMemo } from 'react'

export function GerenteDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    topLimit: 10, // Default top limit
  })
  
  // Estabilizar la referencia del objeto filters para evitar re-renderizados infinitos
  const stableFilters = useMemo(() => filters, [
    filters.dateFrom,
    filters.dateTo,
    filters.proyectoId,
    filters.estado,
    filters.tipoReclamoId,
    filters.criticidad,
    filters.topLimit,
  ])
  
  const { data: gerenteMetrics } = useGerenteDashboardMetrics(stableFilters, true)

  return (
    <div className='space-y-6'>
      {/* Filtros */}
      <DashboardFiltersComponent 
        filters={filters} 
        onFiltersChange={setFilters}
        showGerenteFilters={true}
      />
      
      {/* Gerente Dashboard Metrics */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
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
              {gerenteMetrics?.totalClaims || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              En el período seleccionado
            </p>
          </CardContent>
        </Card>
        
        <StateChangesMetricCard filters={stableFilters} />
        
        <CriticalClaimsPercentageCard filters={stableFilters} />
      </div>
      
      {/* Charts Section */}
      <WorkloadByAreaChart filters={stableFilters} />
      
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <TopEmployeesByResolvedChart filters={stableFilters} />
        <TopEmployeesByEfficiencyChart filters={stableFilters} />
      </div>
      
      <DistributionByTypeChart filters={stableFilters} />
    </div>
  )
}

