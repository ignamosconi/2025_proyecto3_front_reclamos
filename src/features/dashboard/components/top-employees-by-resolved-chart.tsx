import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Medal } from 'lucide-react'

interface TopEmployeesByResolvedChartProps {
  filters?: DashboardFilters
}

export function TopEmployeesByResolvedChart({ filters }: TopEmployeesByResolvedChartProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

  if (isLoading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Medal className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Top Empleados por Reclamos Resueltos</CardTitle>
              <CardDescription className="text-xs">
                Empleados que más reclamos han resuelto
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

  const chartData = data?.topEmployeesByResolved || []

  if (chartData.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Medal className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Top Empleados por Reclamos Resueltos</CardTitle>
              <CardDescription className="text-xs">
                Empleados que más reclamos han resuelto
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[350px] text-center px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Medal className="text-muted-foreground h-8 w-8" />
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


  const formattedData = chartData.map((item, index) => ({
    nombre: item.empleadoNombre.split(' ').slice(0, 2).join(' '),
    cantidad: item.cantidadResueltos,
    email: item.empleadoEmail,
    rank: index + 1,
  }))

  // Colores para los top 3
  const getBarColor = (index: number) => {
    if (index === 0) return '#FFD700' // Gold
    if (index === 1) return '#C0C0C0' // Silver
    if (index === 2) return '#CD7F32' // Bronze
    return 'hsl(var(--primary))'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm">{data.nombre}</p>
          <p className="text-xs text-muted-foreground mb-1">{data.email}</p>
          <p className="text-base font-bold text-primary">{data.cantidad} reclamos resueltos</p>
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
            <Medal className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Top Empleados por Reclamos Resueltos</CardTitle>
            <CardDescription className="text-xs">
              Empleados que más reclamos han resuelto
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
              tickFormatter={(value) => Math.round(value).toString()}
              domain={[0, 'dataMax + 0.5']}
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
              dataKey="cantidad"
              radius={[0, 8, 8, 0]}
              maxBarSize={100}
            >
              {formattedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

