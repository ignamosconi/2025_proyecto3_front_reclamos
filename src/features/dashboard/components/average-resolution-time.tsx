import { useClientDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock } from 'lucide-react'

interface AverageResolutionTimeProps {
  filters?: DashboardFilters
}

export function AverageResolutionTime({ filters }: AverageResolutionTimeProps) {
  const { data, isLoading } = useClientDashboardMetrics(filters)

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tiempo promedio de resolución
          </CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  const averageTime = data?.averageResolutionTime ?? 0
  const hasResolvedClaims = averageTime > 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Tiempo promedio de resolución
        </CardTitle>
        <Clock className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        {hasResolvedClaims ? (
          <>
            <div className="text-2xl font-bold">
              {averageTime.toFixed(2)} días
            </div>
            <p className="text-muted-foreground text-xs">
              Desde creación hasta estado final (resuelto o rechazado)
            </p>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-muted-foreground">
              N/A
            </div>
            <p className="text-muted-foreground text-xs">
              No hay reclamos resueltos o rechazados en el período seleccionado
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

