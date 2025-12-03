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
import { usersService } from '@/services/users/users.service'
import { tipoReclamoService } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { areasService } from '@/services/areas/areas.service'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { useAuthStore } from '@/stores/auth-store'
import type { DashboardFilters } from '@/hooks/use-dashboard-stats'

// Re-export for convenience
export type { DashboardFilters }

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  showClientFilters?: boolean
  showEncargadoFilters?: boolean
}

export function DashboardFiltersComponent({ 
  filters, 
  onFiltersChange,
  showClientFilters = false,
  showEncargadoFilters = false,
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

  // Fetch all projects for encargado
  const { data: allProyectosData } = useQuery({
    queryKey: ['proyectos', 'all'],
    queryFn: () => proyectosService.getAll({ 
      limit: 100 
    }),
    enabled: showEncargadoFilters,
  })

  // Fetch clients for encargado
  const { data: clientesData } = useQuery({
    queryKey: ['users', 'clientes'],
    queryFn: () => usersService.getAll({ 
      role: 'Cliente',
      limit: 100 
    }),
    enabled: showEncargadoFilters,
  })

  // Fetch tipo reclamos
  const { data: tipoReclamosData } = useQuery({
    queryKey: ['tipo-reclamos', 'all'],
    queryFn: () => tipoReclamoService.getAll({ 
      limit: 100 
    }),
    enabled: showEncargadoFilters,
  })

  // Fetch areas
  const { data: areasData } = useQuery({
    queryKey: ['areas', 'all'],
    queryFn: () => areasService.getAll({ 
      limit: 100 
    }),
    enabled: showEncargadoFilters,
  })

  const proyectos = showClientFilters ? (proyectosData?.data || []) : (allProyectosData?.data || [])
  const clientes = clientesData?.data || []
  const tipoReclamos = tipoReclamosData?.data || []
  const areas = areasData?.data || []

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

  const handleClienteChange = useCallback((clienteId: string) => {
    onFiltersChange({ 
      ...filters, 
      clienteId: clienteId === 'all' ? undefined : clienteId 
    })
  }, [filters, onFiltersChange])

  const handleTipoReclamoChange = useCallback((tipoReclamoId: string) => {
    onFiltersChange({ 
      ...filters, 
      tipoReclamoId: tipoReclamoId === 'all' ? undefined : tipoReclamoId 
    })
  }, [filters, onFiltersChange])

  const handleEstadoChange = useCallback((estado: string) => {
    onFiltersChange({ 
      ...filters, 
      estado: estado === 'all' ? undefined : estado as EstadoReclamo
    })
  }, [filters, onFiltersChange])

  const handleAreaChange = useCallback((areaId: string) => {
    onFiltersChange({ 
      ...filters, 
      areaId: areaId === 'all' ? undefined : areaId 
    })
  }, [filters, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    onFiltersChange({})
    setDateFilterMode('range')
  }, [onFiltersChange])

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.specificDay || 
    filters.proyectoId || filters.clienteId || filters.tipoReclamoId || 
    filters.estado || filters.areaId

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

      {(showClientFilters || showEncargadoFilters) && (
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

      {(showClientFilters || showEncargadoFilters) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          {showEncargadoFilters && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cliente-filter">Cliente</Label>
                <Select
                  value={filters.clienteId || 'all'}
                  onValueChange={handleClienteChange}
                >
                  <SelectTrigger id="cliente-filter" className="w-full">
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente._id} value={cliente._id}>
                        {cliente.firstName} {cliente.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proyecto-filter-encargado">Proyecto</Label>
                <Select
                  value={filters.proyectoId || 'all'}
                  onValueChange={handleProjectChange}
                >
                  <SelectTrigger id="proyecto-filter-encargado" className="w-full">
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

              <div className="space-y-2">
                <Label htmlFor="tipo-reclamo-filter">Tipo de Reclamo</Label>
                <Select
                  value={filters.tipoReclamoId || 'all'}
                  onValueChange={handleTipoReclamoChange}
                >
                  <SelectTrigger id="tipo-reclamo-filter" className="w-full">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    {tipoReclamos.map((tipo) => (
                      <SelectItem key={tipo._id} value={tipo._id}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado-filter">Estado</Label>
                <Select
                  value={filters.estado || 'all'}
                  onValueChange={handleEstadoChange}
                >
                  <SelectTrigger id="estado-filter" className="w-full">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.values(EstadoReclamo).map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area-filter">Área</Label>
                <Select
                  value={filters.areaId || 'all'}
                  onValueChange={handleAreaChange}
                >
                  <SelectTrigger id="area-filter" className="w-full">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las áreas</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area._id} value={area._id}>
                        {area.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}
      </CardContent>
    </Card>
  )
}
