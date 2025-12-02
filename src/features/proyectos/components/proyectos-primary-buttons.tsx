import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProyecto } from './proyectos-provider'
import { useAuthStore } from '@/stores/auth-store'

export function ProyectosPrimaryButtons() {
  const { setOpen } = useProyecto()
  const { hasRole } = useAuthStore((state) => state.auth)
  const isGerente = hasRole('Gerente')

  if (!isGerente) return null

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar proyecto</span> <Plus size={18} />
      </Button>
    </div>
  )
}

