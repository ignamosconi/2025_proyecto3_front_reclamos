import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRecentSales, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'

interface RecentSalesProps {
  filters?: DashboardFilters
}

export function RecentSales({ filters }: RecentSalesProps) {
  const { data: recentSales, isLoading } = useRecentSales(5, filters)

  if (isLoading) {
    return (
      <div className='space-y-8'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-[150px]' />
              <Skeleton className='h-3 w-[200px]' />
            </div>
            <Skeleton className='h-4 w-[80px]' />
          </div>
        ))}
      </div>
    )
  }

  if (!recentSales || recentSales.length === 0) {
    return (
      <div className='flex items-center justify-center py-8'>
        <p className='text-muted-foreground text-sm'>No hay ventas recientes</p>
      </div>
    )
  }

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName?.charAt(0) || '?'
    const lastInitial = lastName?.charAt(0) || '?'
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  return (
    <div className='space-y-8'>
      {recentSales.map((sale) => {
        console.log(sale);
        const nombre = sale.usuario?.nombre || 'Usuario'
        const apellido = sale.usuario?.apellido || 'desconocido'
        const email = sale.usuario?.email || 'No disponible'
        
        return (
          <div key={sale.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src='' alt='Avatar' />
              <AvatarFallback>{getInitials(nombre, apellido)}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {nombre} {apellido}
                </p>
                <p className='text-muted-foreground text-sm'>
                  {email}
                </p>
              </div>
              <div className='font-medium'>+${sale.total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
