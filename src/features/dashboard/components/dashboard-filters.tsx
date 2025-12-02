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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useMarcas } from '@/hooks/use-marcas'
import { useLineas } from '@/hooks/use-lineas'
import { useCallback } from 'react'

export interface DashboardFilters {
  dateFrom?: Date
  dateTo?: Date
  proveedorId?: number
  marcaId?: number
  lineaId?: number
}

interface DashboardFiltersProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
}

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
  const { data: marcas } = useMarcas()
  const { data: lineas } = useLineas()

  const handleDateFromChange = useCallback((date: Date | undefined) => {
    onFiltersChange({ ...filters, dateFrom: date })
  }, [filters, onFiltersChange])

  const handleDateToChange = useCallback((date: Date | undefined) => {
    onFiltersChange({ ...filters, dateTo: date })
  }, [filters, onFiltersChange])

  const handleMarcaChange = useCallback((value: string) => {
    onFiltersChange({ 
      ...filters, 
      marcaId: value === 'all' ? undefined : Number(value) 
    })
  }, [filters, onFiltersChange])

  const handleLineaChange = useCallback((value: string) => {
    onFiltersChange({ 
      ...filters, 
      lineaId: value === 'all' ? undefined : Number(value) 
    })
  }, [filters, onFiltersChange])

  const handleClearFilters = useCallback(() => {
    onFiltersChange({})
  }, [onFiltersChange])

  const hasActiveFilters = filters.dateFrom || filters.dateTo || 
    filters.proveedorId || filters.marcaId || filters.lineaId

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Marca */}
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Select
            value={filters.marcaId?.toString() || 'all'}
            onValueChange={handleMarcaChange}
          >
            <SelectTrigger id="marca" className='w-full'>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {marcas?.map((marca: any) => (
                <SelectItem key={marca.id} value={marca.id.toString()}>
                  {marca.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Línea */}
        <div className="space-y-2">
          <Label htmlFor="linea">Línea</Label>
          <Select
            value={filters.lineaId?.toString() || 'all'}
            onValueChange={handleLineaChange}
          >
            <SelectTrigger id="linea" className='w-full'>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {lineas?.map((linea: any) => (
                <SelectItem key={linea.id} value={linea.id.toString()}>
                  {linea.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
