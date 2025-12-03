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
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-lg">Reclamos por Proyecto</CardTitle>
              <CardDescription className="text-xs">
                Cantidad de reclamos realizados para cada uno de tus proyectos
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
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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
    name: item.proyectoNombre,
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
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg">Reclamos por Proyecto</CardTitle>
            <CardDescription className="text-xs">
              Cantidad de reclamos realizados para cada uno de tus proyectos
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={100}
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
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="Cantidad de Reclamos"
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

