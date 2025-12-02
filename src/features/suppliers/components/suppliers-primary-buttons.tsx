import { Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSuppliers } from './suppliers-provider'


export function SuppliersPrimaryButtons() {
  const { setOpen } = useSuppliers()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Agregar proveedor</span> <Building size={18} />
      </Button>
    </div>
  )
}
