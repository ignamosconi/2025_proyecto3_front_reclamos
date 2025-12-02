import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { useCallback } from 'react'

export interface DashboardFilters {
  dateFrom?: Date
  dateTo?: Date
}

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
  const handleDateFromChange = useCallback((date: Date | undefined) => {
    onFiltersChange({ ...filters, dateFrom: date })
  }, [filters, onFiltersChange])

  const handleDateToChange = useCallback((date: Date | undefined) => {
    onFiltersChange({ ...filters, dateTo: date })
  }, [filters, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    onFiltersChange({})
  }, [onFiltersChange])

  const hasActiveFilters = filters.dateFrom || filters.dateTo

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 px-2 text-xs"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Fecha Desde */}
        <div className="space-y-2">
          <Label htmlFor="date-from">Fecha desde</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-from"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.dateFrom && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? (
                  format(filters.dateFrom, 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha Hasta */}
        <div className="space-y-2">
          <Label htmlFor="date-to">Fecha hasta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-to"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !filters.dateTo && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? (
                  format(filters.dateTo, 'PPP', { locale: es })
                ) : (
                  <span>Seleccionar</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateTo}
                onSelect={handleDateToChange}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
