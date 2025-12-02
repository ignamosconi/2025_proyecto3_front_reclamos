import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTipoReclamo } from './tipo-reclamo-provider'

export function TipoReclamoPrimaryButtons() {
  const { setOpen } = useTipoReclamo()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar tipo de reclamo</span> <Plus size={18} />
      </Button>
    </div>
  )
}

