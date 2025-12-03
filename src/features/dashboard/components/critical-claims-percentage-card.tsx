import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle } from 'lucide-react'

interface CriticalClaimsPercentageCardProps {
  filters?: DashboardFilters
}

export function CriticalClaimsPercentageCard({ filters }: CriticalClaimsPercentageCardProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

  if (isLoading) {
    return (
      <Card className="border-red-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Porcentaje de Reclamos Críticos
          </CardTitle>
          <div className="rounded-full bg-red-500/10 p-2">
            <AlertTriangle className="text-red-500 h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32" />
        </CardContent>
      </Card>
    )
  }

  const percentageCriticalClaims = data?.percentageCriticalClaims ?? 0

  return (
    <Card className="border-red-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Porcentaje de Reclamos Críticos
        </CardTitle>
        <div className="rounded-full bg-red-500/10 p-2">
          <AlertTriangle className="text-red-500 h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {percentageCriticalClaims.toFixed(2)}%
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Reclamos con criticidad = "SÍ"
        </p>
      </CardContent>
    </Card>
  )
}

