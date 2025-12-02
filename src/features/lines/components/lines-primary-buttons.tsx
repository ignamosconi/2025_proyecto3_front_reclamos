import { ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLines } from './lines-provider'

export function LinesPrimaryButtons() {
  const { setOpen } = useLines()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar línea de producto</span> <ListTodo size={18} />
      </Button>
    </div>
  )
}
