import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

interface TopEmployeesByEfficiencyChartProps {
  filters?: DashboardFilters
}

export function TopEmployeesByEfficiencyChart({ filters }: TopEmployeesByEfficiencyChartProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

  if (isLoading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Top Empleados por Eficiencia</CardTitle>
              <CardDescription className="text-xs">
                Empleados con menor tiempo promedio de resolución
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

  const chartData = data?.topEmployeesByEfficiency || []

  if (chartData.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Top Empleados por Eficiencia</CardTitle>
              <CardDescription className="text-xs">
                Empleados con menor tiempo promedio de resolución
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[350px] text-center px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Zap className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              No hay datos disponibles
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              No se encontraron empleados con reclamos resueltos
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedData = chartData.map((item) => ({
    nombre: item.empleadoNombre.split(' ').slice(0, 2).join(' '),
    promedioDias: Math.round(item.promedioDias * 100) / 100,
    email: item.empleadoEmail,
    diasFormateado: item.promedioDias < 1 
      ? `${Math.round(item.promedioDias * 24)} horas`
      : `${item.promedioDias.toFixed(1)} días`,
  }))

  const maxDays = Math.max(...formattedData.map(item => item.promedioDias), 1)

  // Colores degradados para eficiencia (verde = más eficiente)
  const getBarColor = (index: number) => {
    if (index === 0) return 'hsl(142, 76%, 36%)' // Green for #1
    if (index === 1) return 'hsl(142, 76%, 42%)' // Light green for #2
    if (index === 2) return 'hsl(142, 76%, 48%)' // Lighter green for #3
    return 'hsl(var(--primary))'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{data.nombre}</p>
          <p className="text-xs text-muted-foreground mb-1">{data.email}</p>
          <p className="text-base font-bold text-green-600">{data.diasFormateado}</p>
          <p className="text-xs text-muted-foreground mt-1">Tiempo promedio</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Zap className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Top Empleados por Eficiencia</CardTitle>
            <CardDescription className="text-xs">
              Empleados con menor tiempo promedio de resolución
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={Math.max(350, formattedData.length * 70 + 80)}>
          <BarChart data={formattedData} layout="vertical" margin={{ top: 10, right: 10, left: 90, bottom: 20 }}>
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => {
                if (value < 1) {
                  const hours = Math.round(value * 24)
                  return `${hours}h`
                }
                return `${value.toFixed(1)}d`
              }}
              domain={[0, Math.max(maxDays * 1.1, 1)]}
              label={{ value: 'Tiempo', position: 'insideBottom', offset: -5, style: { fill: 'hsl(var(--muted-foreground))', fontSize: 12 } }}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fill: 'hsl(var(--foreground))', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} />
            <Bar
              dataKey="promedioDias"
              radius={[0, 8, 8, 0]}
              maxBarSize={100}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

