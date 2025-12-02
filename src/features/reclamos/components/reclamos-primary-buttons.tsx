import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useReclamos } from './reclamos-provider'

export function ReclamosPrimaryButtons() {
  const { setOpen } = useReclamos()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Crear reclamo</span> <Plus size={18} />
      </Button>
    </div>
  )
}


