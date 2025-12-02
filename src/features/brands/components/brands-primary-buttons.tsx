import { Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBrands } from './brands-provider'

export function BrandsPrimaryButtons() {
  const { setOpen } = useBrands()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar marca</span> <Tag size={18} />
      </Button>
    </div>
  )
}
