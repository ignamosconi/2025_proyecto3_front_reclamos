import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useMonthlySales, DashboardFilters } from '@/hooks/use-dashboard-stats'
import { Skeleton } from '@/components/ui/skeleton'

// Función para formatear valores grandes de manera compacta
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

interface OverviewProps {
  filters?: DashboardFilters
}

export function Overview({ filters }: OverviewProps) {
  const { data: monthlySales, isLoading } = useMonthlySales(filters)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  const chartData = monthlySales?.map((sale) => ({
    name: sale.month,
    total: sale.total,
  })) || []

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
          width={60}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
