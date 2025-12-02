import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { BrandsDialogs } from './components/brands-dialogs'
import { BrandsPrimaryButtons } from './components/brands-primary-buttons'
import { BrandsProvider, useBrands } from './components/brands-provider'
import { BrandsTable } from './components/brands-table'
import { brandsService } from '@/services/brands/brands.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Brand } from './data/schema'

const route = getRouteApi('/_authenticated/brands/')

function BrandsContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { setOpen, setCurrentRow } = useBrands()

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsService.getAll()
  })

  const handleRefreshBrands = () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] })
    setRefreshTrigger(prev => prev + 1)
  }

  const handleAssignLine = (brand: Brand) => {
    setCurrentRow(brand)
    setOpen('assignLine')
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
            <h2 className='text-2xl font-bold tracking-tight'>Listado de marcas</h2>
            <p className='text-muted-foreground'>
              Administra tus marcas de productos aquí.
            </p>
          </div>
          <BrandsPrimaryButtons />
        </div>
        <BrandsTable 
          data={brands} 
          search={search} 
          navigate={navigate} 
          onUpdate={handleRefreshBrands} 
          refreshTrigger={refreshTrigger}
          onAssignLine={handleAssignLine}
        />
      </Main>

      <BrandsDialogs onSuccess={handleRefreshBrands} />
    </>
  )
}

export function Brands() {
  return (
    <BrandsProvider>
      <BrandsContent />
    </BrandsProvider>
  )
}
