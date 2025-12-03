import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useGerenteDashboardMetrics, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DistributionByTypeChartProps {
  filters?: DashboardFilters
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(210, 100%, 60%)',
  'hsl(142, 76%, 45%)',
  'hsl(45, 100%, 55%)',
  'hsl(0, 84%, 65%)',
  'hsl(280, 100%, 70%)',
  'hsl(180, 100%, 45%)',
  'hsl(15, 100%, 55%)',
]

export function DistributionByTypeChart({ filters }: DistributionByTypeChartProps) {
  const { data, isLoading } = useGerenteDashboardMetrics(filters, true)

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
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Distribución por Tipo de Reclamo</CardTitle>
              <CardDescription className="text-xs">
                Porcentaje de reclamos según su tipo
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

  const chartData = data?.distributionByType || []

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
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Distribución por Tipo de Reclamo</CardTitle>
              <CardDescription className="text-xs">
                Porcentaje de reclamos según su tipo
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
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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

  const formattedData = chartData.map((item) => ({
    name: item.tipoReclamoNombre,
    value: item.cantidad,
    porcentaje: item.porcentaje,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Cantidad: {data.value}
          </p>
          <p className="text-sm text-muted-foreground">
            Porcentaje: {data.payload.porcentaje.toFixed(2)}%
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.value} ({formattedData[index].porcentaje.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    )
  }

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
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg">Distribución por Tipo de Reclamo</CardTitle>
            <CardDescription className="text-xs">
              Porcentaje de reclamos según su tipo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ porcentaje }) => `${porcentaje.toFixed(1)}%`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

