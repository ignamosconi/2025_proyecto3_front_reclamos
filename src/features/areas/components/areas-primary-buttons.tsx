import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAreas } from './areas-provider'

export function AreasPrimaryButtons() {
  const { setOpen } = useAreas()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar área</span> <Plus size={18} />
      </Button>
    </div>
  )
}

