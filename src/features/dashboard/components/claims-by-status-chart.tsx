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
      <Card>
        <CardHeader>
          <CardTitle>Reclamos por Estado</CardTitle>
          <CardDescription>
            Cantidad de reclamos agrupados por estado
            {filters?.proyectoId && ' (filtrado por proyecto)'}
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
    <Card>
      <CardHeader>
        <CardTitle>Reclamos por Estado</CardTitle>
        <CardDescription>
          Cantidad de reclamos agrupados por estado
          {filters?.proyectoId && ' (filtrado por proyecto)'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={formattedData}>
            <XAxis
              dataKey="estado"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
            <Bar dataKey="cantidad" name="Cantidad" radius={[4, 4, 0, 0]}>
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

