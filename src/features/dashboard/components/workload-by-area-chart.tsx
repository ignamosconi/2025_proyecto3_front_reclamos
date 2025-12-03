import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'

interface WorkloadByAreaChartProps {
  filters?: DashboardFilters
}

export function WorkloadByAreaChart({ filters }: WorkloadByAreaChartProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

  if (isLoading) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Briefcase className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Carga de Trabajo por Área</CardTitle>
              <CardDescription className="text-xs">
                Distribución de reclamos según el área responsable
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

  const chartData = data?.workloadByArea || []

  if (chartData.length === 0) {
    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Briefcase className="text-primary h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Carga de Trabajo por Área</CardTitle>
              <CardDescription className="text-xs">
                Distribución de reclamos según el área responsable
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-[350px] text-center px-4">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Briefcase className="text-muted-foreground h-8 w-8" />
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

  // Paleta de colores variada para las áreas
  const COLORS = [
    'hsl(221, 83%, 53%)', // Blue
    'hsl(142, 76%, 36%)', // Green
    'hsl(45, 100%, 55%)', // Yellow/Amber
    'hsl(15, 100%, 55%)', // Orange
    'hsl(280, 100%, 70%)', // Purple
    'hsl(180, 100%, 45%)', // Cyan
    'hsl(0, 84%, 65%)', // Red
    'hsl(270, 91%, 65%)', // Pink
    'hsl(200, 100%, 50%)', // Light Blue
    'hsl(120, 100%, 40%)', // Lime
    'hsl(30, 100%, 60%)', // Light Orange
    'hsl(240, 100%, 70%)', // Indigo
    'hsl(330, 81%, 60%)', // Magenta
    'hsl(160, 100%, 40%)', // Teal
    'hsl(350, 89%, 60%)', // Rose
  ]

  const formattedData = chartData.map((item, index) => ({
    area: item.areaNombre,
    cantidad: item.cantidad,
    color: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-1">{data.area}</p>
          <p className="text-base font-bold text-primary">{data.cantidad} reclamos</p>
          <p className="text-xs text-muted-foreground mt-1">Carga de trabajo del área</p>
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
            <Briefcase className="text-primary h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Carga de Trabajo por Área</CardTitle>
            <CardDescription className="text-xs">
              Distribución de reclamos según el área responsable
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={Math.max(350, formattedData.length * 60 + 80)}>
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
              dataKey="area"
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
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

