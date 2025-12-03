import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useEncargadoDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ClaimsPerMonthChartProps {
    filters?: DashboardFilters
}

export function ClaimsPerMonthChart({ filters }: ClaimsPerMonthChartProps) {
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
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos por Mes</CardTitle>
                            <CardDescription className="text-xs">
                                Cantidad de reclamos resueltos y no resueltos por mes
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

    const chartData = data?.claimsPerMonth || []

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
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos por Mes</CardTitle>
                            <CardDescription className="text-xs">
                                Cantidad de reclamos resueltos y no resueltos por mes
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
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">
                            No hay datos disponibles
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                            No se encontraron reclamos para el período seleccionado
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Format data for chart: create month labels and prepare for grouped bars
    const formattedData = chartData.map((item) => {
        const date = new Date(item.year, item.month - 1, 1)
        const monthLabel = format(date, 'MMM yyyy', { locale: es })

        return {
            mes: monthLabel,
            resueltos: item.resueltos,
            noResueltos: item.noResueltos,
            total: item.total,
        }
    })

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
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-lg">Reclamos por Mes</CardTitle>
                        <CardDescription className="text-xs">
                            Cantidad de reclamos resueltos y no resueltos por mes
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <XAxis
                            dataKey="mes"
                            stroke="hsl(var(--foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: 'hsl(var(--foreground))' }}
                        />
                        <YAxis
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tick={{ fill: 'hsl(var(--foreground))' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            cursor={{ fill: 'hsl(var(--primary))', opacity: 0.15 }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px', color: 'hsl(var(--foreground))' }}
                            iconType="square"
                        />
                        <Bar
                            dataKey="resueltos"
                            name="Resueltos"
                            fill="hsl(142, 76%, 36%)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="noResueltos"
                            name="No Resueltos"
                            fill="hsl(45, 100%, 50%)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

