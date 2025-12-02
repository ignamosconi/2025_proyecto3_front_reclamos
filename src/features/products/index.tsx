import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsDialogs} from './components/products-dialogs'
import { ProductsPrimaryButtons } from './components/products-primary-buttons'
import { ProductsProvider } from './components/products-provider'
import { ProductsTable } from './components/products-table'
import { productsService } from '@/services/products/products.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'

const route = getRouteApi('/_authenticated/products/')

function ProductsContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getAll()
  })

  const handleRefreshProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Listado de productos</h2>
            <p className='text-muted-foreground'>
              Administra tus productos aquí.
            </p>
          </div>
          <ProductsPrimaryButtons />
        </div>
        <ProductsTable 
          data={products}
          search={search}
          navigate={navigate}
          onUpdate={handleRefreshProducts}
          refreshTrigger={refreshTrigger}
        />
      </Main>

      <ProductsDialogs onSuccess={handleRefreshProducts} />
    </>
  )
}

export function Products() {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  )
}