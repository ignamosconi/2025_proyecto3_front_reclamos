import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useClientDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ClaimsPerProjectChartProps {
  filters?: DashboardFilters
}

export function ClaimsPerProjectChart({ filters }: ClaimsPerProjectChartProps) {
  const { data, isLoading } = useClientDashboardMetrics(filters)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reclamos por Proyecto</CardTitle>
          <CardDescription>
            Cantidad de reclamos realizados para cada proyecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data?.claimsPerProject || []

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reclamos por Proyecto</CardTitle>
          <CardDescription>
            Cantidad de reclamos realizados para cada proyecto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedData = chartData.map((item) => ({
    name: item.proyectoNombre,
    cantidad: item.cantidad,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reclamos por Proyecto</CardTitle>
        <CardDescription>
          Cantidad de reclamos realizados para cada proyecto
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={formattedData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Bar
              dataKey="cantidad"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Cantidad"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

