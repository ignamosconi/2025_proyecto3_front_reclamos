import { useEncargadoDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle } from 'lucide-react'

interface AverageResolvedMetricCardProps {
  filters?: DashboardFilters
}

export function AverageResolvedMetricCard({ filters }: AverageResolvedMetricCardProps) {
  const { data, isLoading } = useEncargadoDashboardMetrics(filters)

  if (isLoading) {
    return (
      <Card className="border-green-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Promedio Resuelto por Período
          </CardTitle>
          <div className="rounded-full bg-green-500/10 p-2">
            <CheckCircle className="text-green-500 h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  const averageResolved = data?.averageResolvedPerPeriod ?? 0
  const hasResolvedClaims = averageResolved > 0

  return (
    <Card className="border-green-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Promedio Resuelto por Período
        </CardTitle>
        <div className="rounded-full bg-green-500/10 p-2">
          <CheckCircle className="text-green-500 h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        {hasResolvedClaims ? (
          <>
            <div className="text-3xl font-bold text-foreground">
              {averageResolved.toFixed(1)}
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              Reclamos resueltos en promedio por período
            </p>
          </>
        ) : (
          <>
            <div className="text-3xl font-bold text-muted-foreground">
              N/A
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              No hay reclamos resueltos en el período
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

