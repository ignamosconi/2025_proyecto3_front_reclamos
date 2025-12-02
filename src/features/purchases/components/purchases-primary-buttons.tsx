import { ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePurchases } from './purchases-provider'

export function PurchasesPrimaryButtons() {
  const { setOpen } = usePurchases()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar compra</span> <ListTodo size={18} />
      </Button>
    </div>
  )
}
