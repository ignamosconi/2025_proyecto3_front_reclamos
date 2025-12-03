import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useEncargadoDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ClaimsByTypeChartProps {
    filters?: DashboardFilters
}

export function ClaimsByTypeChart({ filters }: ClaimsByTypeChartProps) {
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
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos por Tipo</CardTitle>
                            <CardDescription className="text-xs">
                                Distribución de reclamos según su tipo
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

    const chartData = data?.claimsByType || []

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
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos por Tipo</CardTitle>
                            <CardDescription className="text-xs">
                                Distribución de reclamos según su tipo
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
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

    // Sort by quantity descending for better visualization
    const formattedData = [...chartData]
        .sort((a, b) => b.cantidad - a.cantidad)
        .map((item) => ({
            tipo: item.tipoReclamoNombre,
            cantidad: item.cantidad,
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
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-lg">Reclamos por Tipo</CardTitle>
                        <CardDescription className="text-xs">
                            Distribución de reclamos según su tipo
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={formattedData} layout="vertical" margin={{ top: 10, right: 10, left: 120, bottom: 10 }}>
                        <XAxis
                            type="number"
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'hsl(var(--foreground))' }}
                        />
                        <YAxis
                            type="category"
                            dataKey="tipo"
                            stroke="hsl(var(--foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            width={110}
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
                            dataKey="cantidad"
                            name="Cantidad de Reclamos"
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

