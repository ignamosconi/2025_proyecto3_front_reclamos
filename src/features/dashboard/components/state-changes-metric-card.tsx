import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { History } from 'lucide-react'

interface StateChangesMetricCardProps {
  filters?: DashboardFilters
}

export function StateChangesMetricCard({ filters }: StateChangesMetricCardProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

  if (isLoading) {
    return (
      <Card className="border-blue-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Modificaciones de Estados
          </CardTitle>
          <div className="rounded-full bg-blue-500/10 p-2">
            <History className="text-blue-500 h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  const stateChangesCount = data?.stateChangesCount ?? 0

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num)
  }

  return (
    <Card className="border-blue-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Modificaciones de Estados
        </CardTitle>
        <div className="rounded-full bg-blue-500/10 p-2">
          <History className="text-blue-500 h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {formatNumber(stateChangesCount)}
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Cambios de estado en el período
        </p>
      </CardContent>
    </Card>
  )
}

