import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useEncargadoDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AverageResolutionTimeByTypeChartProps {
    filters?: DashboardFilters
}

export function AverageResolutionTimeByTypeChart({ filters }: AverageResolutionTimeByTypeChartProps) {
    const { data, isLoading } = useEncargadoDashboardMetrics(filters)

    if (isLoading) {
        return (
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="text-primary h-5 w-5"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Tiempo Promedio de Resolución por Tipo</CardTitle>
                            <CardDescription className="text-xs">
                                Tiempo promedio en días para resolver reclamos según su tipo
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
        )
    }

    const chartData = data?.averageResolutionTimeByType || []

    if (chartData.length === 0) {
        return (
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="text-primary h-5 w-5"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Tiempo Promedio de Resolución por Tipo</CardTitle>
                            <CardDescription className="text-xs">
                                Tiempo promedio en días para resolver reclamos según su tipo
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center h-[350px] text-center px-4">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="text-muted-foreground h-8 w-8"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">
                            No hay datos disponibles
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                            No hay reclamos resueltos para mostrar tiempos de resolución
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Sort by average days ascending (fastest to slowest)
    const formattedData = [...chartData]
        .sort((a, b) => a.promedioDias - b.promedioDias)
        .map((item) => ({
            tipo: item.tipoReclamoNombre,
            promedioDias: Number(item.promedioDias.toFixed(1)),
        }))

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="text-primary h-5 w-5"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-lg">Tiempo Promedio de Resolución por Tipo</CardTitle>
                        <CardDescription className="text-xs">
                            Tiempo promedio en días para resolver reclamos según su tipo
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={formattedData} layout="vertical" margin={{ top: 10, right: 10, left: 120, bottom: 10 }}>
                        <XAxis
                            type="number"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            label={{ value: 'Días', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="tipo"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={110}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            formatter={(value: number) => [`${value} días`, 'Tiempo Promedio']}
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="square"
                        />
                        <Bar
                            dataKey="promedioDias"
                            name="Tiempo Promedio (días)"
                            fill="hsl(var(--primary))"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

