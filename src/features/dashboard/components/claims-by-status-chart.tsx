import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts'
import { useClientDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'

interface ClaimsByStatusChartProps {
    filters?: DashboardFilters
}

// Color mapping for each status
const statusColors: Record<string, string> = {
    [EstadoReclamo.PENDIENTE]: 'hsl(210, 100%, 50%)', // Blue
    [EstadoReclamo.EN_REVISION]: 'hsl(45, 100%, 50%)', // Yellow/Orange
    [EstadoReclamo.RESUELTO]: 'hsl(142, 76%, 36%)', // Green
    [EstadoReclamo.RECHAZADO]: 'hsl(0, 84%, 60%)', // Red
}

// Status display names
const statusLabels: Record<string, string> = {
    [EstadoReclamo.PENDIENTE]: 'Pendiente',
    [EstadoReclamo.EN_REVISION]: 'En Revisión',
    [EstadoReclamo.RESUELTO]: 'Resuelto',
    [EstadoReclamo.RECHAZADO]: 'Rechazado',
}

export function ClaimsByStatusChart({ filters }: ClaimsByStatusChartProps) {
    // Create a new filters object with proyectoId for status chart
    const statusFilters: DashboardFilters = {
        ...filters,
        // proyectoId is already in filters if set
    }

    const { data, isLoading } = useClientDashboardMetrics(statusFilters)

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Reclamos por Estado</CardTitle>
                    <CardDescription>
                        Cantidad de reclamos agrupados por estado
                        {filters?.proyectoId && ' (filtrado por proyecto)'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
        )
    }

    const chartData = data?.claimsByStatus || []

    if (chartData.length === 0) {
        return (
            <Card className="shadow-sm">
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
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos por Estado</CardTitle>
                            <CardDescription className="text-xs">
                                Distribución de reclamos según su estado actual
                                {filters?.proyectoId && ' • Filtrado por proyecto'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
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
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
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

    // Sort by status order for consistent display
    const statusOrder = [
        EstadoReclamo.PENDIENTE,
        EstadoReclamo.EN_REVISION,
        EstadoReclamo.RESUELTO,
        EstadoReclamo.RECHAZADO,
    ]

    const formattedData = statusOrder
        .map((status) => {
            const item = chartData.find((d) => d.estado === status)
            return {
                estado: statusLabels[status] || status,
                cantidad: item?.cantidad || 0,
                originalEstado: status,
            }
        })
        .filter((item) => item.cantidad > 0 || chartData.some((d) => d.estado === item.originalEstado))

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
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </div>
                    <div>
                        <CardTitle className="text-lg">Reclamos por Estado</CardTitle>
                        <CardDescription className="text-xs">
                            Distribución de reclamos según su estado actual
                            {filters?.proyectoId && ' • Filtrado por proyecto'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <XAxis
                            dataKey="estado"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            width={60}
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--popover))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }}
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="square"
                        />
                        <Bar
                            dataKey="cantidad"
                            name="Cantidad de Reclamos"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={80}
                        >
                            {formattedData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={statusColors[entry.originalEstado] || 'hsl(var(--primary))'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

