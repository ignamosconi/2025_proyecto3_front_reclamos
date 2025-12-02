import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { SuppliersDialogs } from './components/suppliers-dialogs'
import { SuppliersPrimaryButtons } from './components/suppliers-primary-buttons'
import { SuppliersProvider, useSuppliers } from './components/suppliers-provider'
import { SuppliersTable } from './components/suppliers-table'
import { suppliersService } from '@/services/suppliers/suppliers.service'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Supplier } from './data/schema'

const route = getRouteApi('/_authenticated/suppliers/')

function SuppliersContent() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const queryClient = useQueryClient()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { setOpen, setCurrentRow } = useSuppliers()

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersService.getAll()
  })

  const handleRefreshSuppliers = () => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] })
    setRefreshTrigger(prev => prev + 1)
  }

  const handleAssignProduct = (supplier: Supplier) => {
    setCurrentRow(supplier)
    setOpen('assignProduct')
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
            <h2 className='text-2xl font-bold tracking-tight'>Listado de proveedores</h2>
            <p className='text-muted-foreground'>
              Administra tus proveedores de productos aquí.
            </p>
          </div>
          <SuppliersPrimaryButtons />
        </div>
        <SuppliersTable 
          data={suppliers} 
          search={search} 
          navigate={navigate} 
          onUpdate={handleRefreshSuppliers} 
          refreshTrigger={refreshTrigger}
          onAssignProduct={handleAssignProduct}
        />
      </Main>

      <SuppliersDialogs onSuccess={handleRefreshSuppliers} />
    </>
  )
}

export function Suppliers() {
  return (
    <SuppliersProvider>
      <SuppliersContent />
    </SuppliersProvider>
  )
}