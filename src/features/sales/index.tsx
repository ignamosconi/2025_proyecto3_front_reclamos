import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { SalesDialogs } from './components/sales-dialogs'
import { SalesPrimaryButtons } from './components/sales-primary-buttons'
import { SalesProvider } from './components/sales-provider'
import { SalesTable } from './components/sales-table'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { salesService } from '@/services/sales/sales.service'

const route = getRouteApi('/_authenticated/sales/')

export function Sales() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => salesService.getAll()
  })

  const handleRefreshSales = () => {
    queryClient.invalidateQueries({ queryKey: ['sales'] })
  }

  return (
    <SalesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de ventas</h2>
            <p className='text-muted-foreground'>
              Administra tus ventas aquí.
            </p>
          </div>
          <SalesPrimaryButtons />
        </div>
        <SalesTable data={sales} search={search} navigate={navigate} />
      </Main>

      <SalesDialogs onSuccess={handleRefreshSales} />
    </SalesProvider>
  )
}
