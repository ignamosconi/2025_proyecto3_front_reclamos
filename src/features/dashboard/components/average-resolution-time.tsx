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
            <Card className="border-orange-500/20 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Tiempo Promedio de Resolución
                    </CardTitle>
                    <div className="rounded-full bg-orange-500/10 p-2">
                        <Clock className="text-orange-500 h-5 w-5" />
                    </div>
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
        <Card className="border-orange-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Tiempo Promedio de Resolución
                </CardTitle>
                <div className="rounded-full bg-orange-500/10 p-2">
                    <Clock className="text-orange-500 h-5 w-5" />
                </div>
            </CardHeader>
            <CardContent>
                {hasResolvedClaims ? (
                    <>
                        <div className="text-3xl font-bold text-foreground">
                            {averageTime.toFixed(1)} días
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                            Desde creación hasta estado final
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

