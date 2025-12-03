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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { proyectosService } from '@/services/proyectos/proyectos.service'
import { useAuthStore } from '@/stores/auth-store'
import type { DashboardFilters } from '@/hooks/use-dashboard-stats'

// Re-export for convenience
export type { DashboardFilters }

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  showClientFilters?: boolean
}

export function DashboardFiltersComponent({ 
  filters, 
  onFiltersChange,
  showClientFilters = false 
}: DashboardFiltersProps) {
  const { auth } = useAuthStore()
  const [dateFilterMode, setDateFilterMode] = useState<'range' | 'single'>('range')
  
  // Fetch projects for client
  const { data: proyectosData } = useQuery({
    queryKey: ['proyectos', 'cliente', auth.user?.id],
    queryFn: () => proyectosService.getAll({ 
      cliente: auth.user?.id,
      limit: 100 
    }),
    enabled: showClientFilters && !!auth.user?.id,
  })

  const proyectos = proyectosData?.data || []

  useEffect(() => {
    // If specificDay is set, switch to single mode
    if (filters.specificDay) {
      setDateFilterMode('single')
    } else if (filters.dateFrom || filters.dateTo) {
      setDateFilterMode('range')
    }
  }, [filters.specificDay, filters.dateFrom, filters.dateTo])

  const handleDateFromChange = useCallback((date: Date | undefined) => {
    if (dateFilterMode === 'range') {
      onFiltersChange({ ...filters, dateFrom: date, specificDay: undefined })
    }
  }, [filters, onFiltersChange, dateFilterMode])

  const handleDateToChange = useCallback((date: Date | undefined) => {
    if (dateFilterMode === 'range') {
      onFiltersChange({ ...filters, dateTo: date, specificDay: undefined })
    }
  }, [filters, onFiltersChange, dateFilterMode])

  const handleSpecificDayChange = useCallback((date: Date | undefined) => {
    if (dateFilterMode === 'single') {
      onFiltersChange({ 
        ...filters, 
        specificDay: date,
        dateFrom: undefined,
        dateTo: undefined 
      })
    }
  }, [filters, onFiltersChange, dateFilterMode])

  const handleDateModeChange = useCallback((mode: 'range' | 'single') => {
    setDateFilterMode(mode)
    if (mode === 'single') {
      onFiltersChange({ 
        ...filters, 
        dateFrom: undefined, 
        dateTo: undefined 
      })
    } else {
      onFiltersChange({ 
        ...filters, 
        specificDay: undefined 
      })
    }
  }, [filters, onFiltersChange])

  const handleProjectChange = useCallback((proyectoId: string) => {
    onFiltersChange({ 
      ...filters, 
      proyectoId: proyectoId === 'all' ? undefined : proyectoId 
    })
  }, [filters, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    onFiltersChange({})
    setDateFilterMode('range')
  }, [onFiltersChange])

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.specificDay || filters.proyectoId

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-primary h-4 w-4"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </div>
            <h3 className="text-base font-semibold">Filtros de Búsqueda</h3>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-8 px-3 text-xs font-medium"
            >
              Limpiar todo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">

      {showClientFilters && (
        <div className="space-y-2">
          <Label>Modo de filtrado de fechas</Label>
          <RadioGroup
            value={dateFilterMode}
            onValueChange={(value) => handleDateModeChange(value as 'range' | 'single')}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="range" id="range" />
              <Label htmlFor="range" className="cursor-pointer font-normal">
                Rango de fechas
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single" className="cursor-pointer font-normal">
                Día específico
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {dateFilterMode === 'range' ? (
          <>
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
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="specific-day">Día específico</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="specific-day"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !filters.specificDay && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.specificDay ? (
                    format(filters.specificDay, 'PPP', { locale: es })
                  ) : (
                    <span>Seleccionar</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.specificDay}
                  onSelect={handleSpecificDayChange}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {showClientFilters && (
        <div className="space-y-2">
          <Label htmlFor="proyecto-filter">Filtrar por proyecto (gráfico de estados)</Label>
          <Select
            value={filters.proyectoId || 'all'}
            onValueChange={handleProjectChange}
          >
            <SelectTrigger id="proyecto-filter" className="w-full">
              <SelectValue placeholder="Todos los proyectos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              {proyectos.map((proyecto) => (
                <SelectItem key={proyecto._id} value={proyecto._id}>
                  {proyecto.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      </CardContent>
    </Card>
  )
}
