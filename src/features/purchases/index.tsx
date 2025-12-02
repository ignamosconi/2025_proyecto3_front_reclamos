import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { PurchasesDialogs } from './components/purchases-dialogs'
import { PurchasesPrimaryButtons } from './components/purchases-primary-buttons'
import { PurchasesProvider } from './components/purchases-provider'
import { PurchasesTable } from './components/purchases-table'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { purchasesService } from '@/services/purchases/purchases.service'

const route = getRouteApi('/_authenticated/purchases/')

export function Purchases() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()

  const { data: purchases = [] } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => purchasesService.getAll()
  })

  const handleRefreshPurchases = () => {
    queryClient.invalidateQueries({ queryKey: ['purchases'] })
  }

  return (
    <PurchasesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de compras</h2>
            <p className='text-muted-foreground'>
              Administra tus compras aquí.
            </p>
          </div>
          <PurchasesPrimaryButtons />
        </div>
        <PurchasesTable data={purchases} search={search} navigate={navigate} />
      </Main>

      <PurchasesDialogs onSuccess={handleRefreshPurchases} />
    </PurchasesProvider>
  )
}
