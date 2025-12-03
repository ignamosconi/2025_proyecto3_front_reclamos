import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RecentSynthesis } from './components/recent-synthesis'
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters'
import { ClaimsPerProjectChart } from './components/claims-per-project-chart'
import { ClaimsByStatusChart } from './components/claims-by-status-chart'
import { AverageResolutionTime } from './components/average-resolution-time'
import { useClientDashboardMetrics } from '@/hooks/use-dashboard-stats'
import { useState, useMemo } from 'react'

export function ClienteDashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({})
  
  // Estabilizar la referencia del objeto filters para evitar re-renderizados infinitos
  const stableFilters = useMemo(() => filters, [
    filters.dateFrom,
    filters.dateTo,
    filters.specificDay,
    filters.proyectoId,
  ])
  
  const { data: clientMetrics } = useClientDashboardMetrics(stableFilters)

  return (
    <div className='space-y-6'>
      {/* Filtros */}
      <DashboardFiltersComponent 
        filters={filters} 
        onFiltersChange={setFilters}
        showClientFilters={true}
      />
      
      {/* Client Dashboard Metrics - Improved Layout */}
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
              {clientMetrics?.totalClaims || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              En el período seleccionado
            </p>
          </CardContent>
        </Card>
        
        <AverageResolutionTime filters={stableFilters} />
        
        <Card className='border-blue-500/20 shadow-sm hover:shadow-md transition-shadow duration-200'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Reclamos Pendientes
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
                <circle cx='12' cy='12' r='10' />
                <path d='M12 6v6l4 2' />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-foreground'>
              {clientMetrics?.claimsByStatus?.find((s: any) => s.estado === 'Pendiente')?.cantidad || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              Esperando atención
            </p>
          </CardContent>
        </Card>
        
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
              {clientMetrics?.claimsByStatus?.find((s: any) => s.estado === 'Resuelto')?.cantidad || 0}
            </div>
            <p className='text-muted-foreground text-xs mt-1'>
              Completados exitosamente
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <ClaimsPerProjectChart filters={stableFilters} />
        <ClaimsByStatusChart filters={stableFilters} />
      </div>
      
      {/* Recent Synthesis Section */}
      <Card className='shadow-sm'>
        <CardHeader className='border-b'>
          <div className='flex items-center gap-2'>
            <div className='rounded-lg bg-primary/10 p-2'>
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
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14 2 14 8 20 8' />
                <line x1='16' y1='13' x2='8' y2='13' />
                <line x1='16' y1='17' x2='8' y2='17' />
                <polyline points='10 9 9 9 8 9' />
              </svg>
            </div>
            <div>
              <CardTitle className='text-lg'>Síntesis de Reclamos Cerrados</CardTitle>
              <CardDescription>
                Resoluciones y cierres de tus reclamos más recientes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <RecentSynthesis limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}

