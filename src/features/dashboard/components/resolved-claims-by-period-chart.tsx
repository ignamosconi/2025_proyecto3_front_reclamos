import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { useEncargadoDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState, useMemo } from 'react'

interface ResolvedClaimsByPeriodChartProps {
    filters?: DashboardFilters
}

type PeriodType = 'all' | 'mes' | 'semana' | 'dia'

export function ResolvedClaimsByPeriodChart({ filters }: ResolvedClaimsByPeriodChartProps) {
    const { data, isLoading } = useEncargadoDashboardMetrics(filters)
    const [periodType, setPeriodType] = useState<PeriodType>('mes')

    const allPeriodData = data?.resolvedClaimsByPeriod || []

    // Filter data by period type - MUST be called before any early returns
    const chartData = useMemo(() => {
        if (periodType === 'all') {
            return allPeriodData
        }

        return allPeriodData.filter((item) => {
            const prefix = item.periodo.split(':')[0].toLowerCase()
            if (periodType === 'mes') return prefix === 'mes'
            if (periodType === 'semana') return prefix === 'semana'
            if (periodType === 'dia') return prefix === 'día'
            return false
        })
    }, [allPeriodData, periodType])

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
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos Resueltos por Período</CardTitle>
                            <CardDescription className="text-xs">
                                Cantidad de reclamos resueltos por día, semana o mes
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
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos Resueltos por Período</CardTitle>
                            <CardDescription className="text-xs">
                                Cantidad de reclamos resueltos por día, semana o mes
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
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">
                            No hay datos disponibles
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                            No se encontraron reclamos resueltos para el período seleccionado
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Format data for chart
    const formattedData = chartData
        .map((item) => ({
            periodo: item.periodo.replace(/^(Mes|Semana|Día):\s*/, ''),
            cantidad: item.cantidad,
        }))
        .sort((a, b) => {
            // Simple string comparison for sorting
            return a.periodo.localeCompare(b.periodo)
        })

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
                <div className="flex items-center justify-between">
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
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <div>
                            <CardTitle className="text-lg">Reclamos Resueltos por Período</CardTitle>
                            <CardDescription className="text-xs">
                                Cantidad de reclamos resueltos por día, semana o mes
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="period-type" className="text-xs">Período:</Label>
                        <Select value={periodType} onValueChange={(value) => setPeriodType(value as PeriodType)}>
                            <SelectTrigger id="period-type" className="w-32 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mes">Por Mes</SelectItem>
                                <SelectItem value="semana">Por Semana</SelectItem>
                                <SelectItem value="dia">Por Día</SelectItem>
                                <SelectItem value="all">Todos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis
                            dataKey="periodo"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            angle={-45}
                            textAnchor="end"
                            height={80}
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
                            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, opacity: 0.3 }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="cantidad"
                            name="Reclamos Resueltos"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

