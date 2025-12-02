import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'
import { AuditTable } from './components/audit-table'
import { useQuery } from '@tanstack/react-query'
import { auditService } from '@/services/audit/audit.service'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, X } from 'lucide-react'

const route = getRouteApi('/_authenticated/audit/')

export function Audit() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  // Estados para los filtros
  const [showFilters, setShowFilters] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [tipoEvento, setTipoEvento] = useState<string>('')
  const [fechaDesde, setFechaDesde] = useState<string>('')
  const [fechaHasta, setFechaHasta] = useState<string>('')

  // Obtener tipos de eventos
  const { data: eventTypes = [] } = useQuery({
    queryKey: ['audit-event-types'],
    queryFn: () => auditService.getEventTypes(),
  })

  // Construir filtros para la consulta
  // Convertir las fechas a formato ISO completo con zona horaria
  const filters = {
    userId: userId ? Number(userId) : undefined,
    tipo_evento: tipoEvento || undefined,
    fechaDesde: fechaDesde ? new Date(fechaDesde + 'T00:00:00').toISOString() : undefined,
    fechaHasta: fechaHasta ? new Date(fechaHasta + 'T23:59:59.999').toISOString() : undefined,
  }

  // Obtener auditorías con filtros
  const { data: audits = [], isLoading, refetch } = useQuery({
    queryKey: ['audits', filters],
    queryFn: () => auditService.getAll(filters),
  })

  // Limpiar filtros
  const clearFilters = () => {
    setUserId('')
    setTipoEvento('')
    setFechaDesde('')
    setFechaHasta('')
  }

  // Aplicar filtros
  const applyFilters = () => {
    refetch()
  }

  return (
    <div>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Auditoría</h2>
            <p className='text-muted-foreground'>
              Listado de logs de auditoría
            </p>
          </div>
          <Button
            variant='outline'
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </Button>
        </div>

        {/* Panel de filtros */}
        {showFilters && (
          <div className='rounded-lg border bg-card p-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-2'>
                <Label htmlFor='userId'>ID de usuario</Label>
                <Input
                  id='userId'
                  type='number'
                  placeholder='Ej: 1'
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tipoEvento'>Tipo de evento</Label>
                <Select value={tipoEvento} onValueChange={setTipoEvento}>
                  <SelectTrigger id='tipoEvento' className='w-full'>
                    <SelectValue placeholder='Seleccionar evento' />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((event: string) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fechaDesde'>Fecha desde</Label>
                <Input
                  id='fechaDesde'
                  type='date'
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fechaHasta'>Fecha hasta</Label>
                <Input
                  id='fechaHasta'
                  type='date'
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
            </div>

            <div className='mt-4 flex gap-2'>
              <Button onClick={applyFilters}>
                Aplicar filtros
              </Button>
              <Button variant='outline' onClick={clearFilters}>
                <X className='mr-2 h-4 w-4' />
                Limpiar
              </Button>
            </div>
          </div>
        )}

        <AuditTable 
          data={audits} 
          search={search} 
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>
    </div>
  )
}
