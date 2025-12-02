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
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { usersService } from '@/services/users/users.service'
import { areasService } from '@/services/areas/areas.service'
import { useAuthStore } from '@/stores/auth-store'

type ProyectosFiltersProps = {
    search: Record<string, unknown>
    navigate: NavigateFn
}

export function ProyectosFilters({ search, navigate }: ProyectosFiltersProps) {
    const { hasRole } = useAuthStore((state) => state.auth)
    const isGerente = hasRole('Gerente')
    const isEncargado = hasRole('Encargado')

    const [cliente, setCliente] = useState<string>((search.cliente as string) || 'all')
    const [areaResponsable, setAreaResponsable] = useState<string>((search.areaResponsable as string) || 'all')
    const [estado, setEstado] = useState<string>((search.estado as string) || 'all')

    const { data: clientesResponse } = useQuery({
        queryKey: ['clientes-list'],
        queryFn: () => usersService.getAll({ page: 1, limit: 100, role: 'Cliente' }),
        enabled: isGerente, // Solo cargar si es Gerente
    })

    const { data: areasResponse } = useQuery({
        queryKey: ['areas-list'],
        queryFn: () => areasService.getAll({ page: 1, limit: 100 }),
        enabled: isGerente || isEncargado, // Cargar si es Gerente o Encargado
    })

    const clientes = clientesResponse?.data || []
    const areas = areasResponse?.data || []

    useEffect(() => {
        // Sincronizar los filtros con la URL cuando cambia
        setCliente((search.cliente as string) || 'all')
        setAreaResponsable((search.areaResponsable as string) || 'all')
        setEstado((search.estado as string) || 'all')
    }, [search])

    const applyFilters = () => {
        navigate({
            search: (prev) => ({
                ...prev,
                cliente: cliente && cliente !== 'all' ? cliente : undefined,
                areaResponsable: areaResponsable && areaResponsable !== 'all' ? areaResponsable : undefined,
                estado: estado && estado !== 'all' ? estado : undefined,
                page: 1, // Reset to first page when filtering
            }),
        })
    }

    const clearFilters = () => {
        setCliente('all')
        setAreaResponsable('all')
        setEstado('all')
        navigate({
            search: (prev) => ({
                ...prev,
                cliente: undefined,
                areaResponsable: undefined,
                estado: undefined,
                page: 1,
            }),
        })
    }

    const hasActiveFilters = (cliente && cliente !== 'all') || (areaResponsable && areaResponsable !== 'all') || (estado && estado !== 'all')

    return (
        <div className='flex flex-wrap items-end gap-4 rounded-lg border p-4'>
            {isGerente && (
                <div className='flex-1 min-w-[200px]'>
                    <Label htmlFor='cliente'>Cliente</Label>
                    <Select value={cliente} onValueChange={setCliente}>
                        <SelectTrigger id='cliente' className='mt-2'>
                            <SelectValue placeholder='Todos los clientes' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Todos los clientes</SelectItem>
                            {clientes.map((cliente) => (
                                <SelectItem key={cliente._id} value={cliente._id}>
                                    {cliente.firstName && cliente.lastName
                                        ? `${cliente.firstName} ${cliente.lastName}`
                                        : cliente.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {(isGerente || isEncargado) && (
                <div className='flex-1 min-w-[200px]'>
                    <Label htmlFor='areaResponsable'>Área Responsable</Label>
                    <Select value={areaResponsable} onValueChange={setAreaResponsable}>
                        <SelectTrigger id='areaResponsable' className='mt-2'>
                            <SelectValue placeholder='Todas las áreas' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>Todas las áreas</SelectItem>
                            {areas.map((area) => (
                                <SelectItem key={area._id} value={area._id}>
                                    {area.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className='flex-1 min-w-[200px]'>
                <Label htmlFor='estado'>Estado</Label>
                <Select value={estado} onValueChange={setEstado}>
                    <SelectTrigger id='estado' className='mt-2'>
                        <SelectValue placeholder='Todos los estados' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Todos los estados</SelectItem>
                        <SelectItem value='activo'>Activo</SelectItem>
                        <SelectItem value='inactivo'>Inactivo</SelectItem>
                    </SelectContent>
                </Select>
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

