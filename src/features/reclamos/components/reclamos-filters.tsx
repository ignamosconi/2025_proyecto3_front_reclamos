'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { EstadoReclamo } from '@/services/reclamos/reclamos.service'
import { tipoReclamoService } from '@/services/tipo-reclamo/tipo-reclamo.service'
import { useQuery } from '@tanstack/react-query'
import type { NavigateFn } from '@/hooks/use-table-url-state'

type ReclamosFiltersProps = {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function ReclamosFilters({ search, navigate }: ReclamosFiltersProps) {
  const [estado, setEstado] = useState<string>((search.estado as string) || 'all')
  const [tipoReclamo, setTipoReclamo] = useState<string>((search.fkTipoReclamo as string) || 'all')
  const [fechaInicio, setFechaInicio] = useState<string>((search.fechaInicio as string) || '')
  const [fechaFin, setFechaFin] = useState<string>((search.fechaFin as string) || '')

  const { data: tiposReclamoResponse } = useQuery({
    queryKey: ['tipo-reclamo-list'],
    queryFn: () => tipoReclamoService.getAll({ page: 1, limit: 100 }),
  })

  const tiposReclamo = tiposReclamoResponse?.data || []

  useEffect(() => {
    // Sincronizar los filtros con la URL cuando cambia
    setEstado((search.estado as string) || 'all')
    setTipoReclamo((search.fkTipoReclamo as string) || 'all')
    setFechaInicio((search.fechaInicio as string) || '')
    setFechaFin((search.fechaFin as string) || '')
  }, [search])

  const applyFilters = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        estado: estado && estado !== 'all' ? estado : undefined,
        fkTipoReclamo: tipoReclamo && tipoReclamo !== 'all' ? tipoReclamo : undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
        page: 1, // Reset to first page when filtering
      }),
    })
  }

  const clearFilters = () => {
    setEstado('all')
    setTipoReclamo('all')
    setFechaInicio('')
    setFechaFin('')
    navigate({
      search: (prev) => ({
        ...prev,
        estado: undefined,
        fkTipoReclamo: undefined,
        fechaInicio: undefined,
        fechaFin: undefined,
        page: 1,
      }),
    })
  }

  const hasActiveFilters = (estado && estado !== 'all') || (tipoReclamo && tipoReclamo !== 'all') || fechaInicio || fechaFin

  return (
    <div className='flex flex-wrap items-end gap-4 rounded-lg border p-4'>
      <div className='flex-1 min-w-[200px]'>
        <Label htmlFor='estado'>Estado</Label>
        <Select value={estado} onValueChange={setEstado}>
          <SelectTrigger id='estado' className='mt-2'>
            <SelectValue placeholder='Todos los estados' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos los estados</SelectItem>
            {Object.values(EstadoReclamo).map((est) => (
              <SelectItem key={est} value={est}>
                {est}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex-1 min-w-[200px]'>
        <Label htmlFor='tipoReclamo'>Tipo de Reclamo</Label>
        <Select value={tipoReclamo} onValueChange={setTipoReclamo}>
          <SelectTrigger id='tipoReclamo' className='mt-2'>
            <SelectValue placeholder='Todos los tipos' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos los tipos</SelectItem>
            {tiposReclamo.map((tipo) => (
              <SelectItem key={tipo._id} value={tipo._id}>
                {tipo.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex-1 min-w-[150px]'>
        <Label htmlFor='fechaInicio' >Fecha Inicio</Label>
        <Input
          id='fechaInicio'
          type='date'
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className='mt-2'
        />
      </div>

      <div className='flex-1 min-w-[150px]'>
        <Label htmlFor='fechaFin'>Fecha Fin</Label>
        <Input
          id='fechaFin'
          type='date'
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className='mt-2'
        />
      </div>

      <div className='flex gap-2'>
        <Button onClick={applyFilters} size='sm'>
          Aplicar filtros
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant='outline' size='sm'>
            <X className='h-4 w-4 mr-1' />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}

