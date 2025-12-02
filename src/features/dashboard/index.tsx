import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { DashboardFiltersComponent, DashboardFilters } from './components/dashboard-filters'
import { useDashboardStats, useRecentSales } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useMemo } from 'react'

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({})
  
  // Estabilizar la referencia del objeto filters para evitar re-renderizados infinitos
  const stableFilters = useMemo(() => filters, [
    filters.dateFrom,
    filters.dateTo,
    filters.proveedorId,
    filters.marcaId,
    filters.lineaId,
  ])
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats(stableFilters)
  const { data: recentSales } = useRecentSales(5, stableFilters)

  const recentSalesCount = recentSales?.length || 0

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
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            {/* Filtros */}
            <DashboardFiltersComponent 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
            
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Ingresos totales
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
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        ${stats?.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {stats?.revenueGrowth && stats.revenueGrowth > 0 ? '+' : ''}
                        {stats?.revenueGrowth.toFixed(1).replace('.', ',') || '0'}% desde el mes pasado
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Ventas mes actual
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
                  {statsLoading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>+{recentSalesCount}</div>
                      <p className='text-muted-foreground text-xs'>
                        Ventas recientes mostradas
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total de ventas</CardTitle>
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
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>+{stats?.totalSales || 0}</div>
                      <p className='text-muted-foreground text-xs'>
                        {stats?.salesGrowth && stats.salesGrowth > 0 ? '+' : ''}
                        {stats?.salesGrowth.toFixed(1) || '0'}% desde el mes pasado
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Crecimiento
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
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    <>
                      <div className='text-2xl font-bold'>
                        {stats?.revenueGrowth && stats.revenueGrowth > 0 ? '+' : ''}
                        {stats?.revenueGrowth.toFixed(1) || '0'}%
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Comparado con el mes anterior
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Ventas mensuales</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview filters={stableFilters} />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Ventas recientes</CardTitle>
                  <CardDescription>
                    {recentSalesCount > 0 
                      ? `Mostrando ${recentSalesCount} ventas recientes.`
                      : 'No hay ventas recientes.'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales filters={stableFilters} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
