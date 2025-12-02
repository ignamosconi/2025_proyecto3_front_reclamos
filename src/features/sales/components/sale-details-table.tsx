'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Check, ChevronsUpDown } from 'lucide-react'
import { productsService } from '@/services/products/products.service'
import { type SaleDetail } from './sales-mutate-drawer'
import { cn } from '@/lib/utils'

interface Product {
  idProducto: number
  nombre: string
  precio: number
  stock: number
}

interface SaleDetailsTableProps {
  details: SaleDetail[]
  setDetails: (details: SaleDetail[]) => void
}

export function SaleDetailsTable({ details, setDetails }: SaleDetailsTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newDetail, setNewDetail] = useState<{
    idProducto: string
    cantidad: string
  }>({
    idProducto: '',
    cantidad: '1',
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productsService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDetail = () => {
    if (!newDetail.idProducto || !newDetail.cantidad) {
      return
    }

    const product = products.find((p) => p.idProducto === Number(newDetail.idProducto))
    
    if (!product) {
      return
    }

    const cantidad = Number(newDetail.cantidad)
    
    if (cantidad <= 0) {
      return
    }

    // Verificar si el producto ya está en la lista
    const existingIndex = details.findIndex((d) => d.idProducto === product.idProducto)
    
    if (existingIndex >= 0) {
      // Si ya existe, actualizar la cantidad
      const updatedDetails = [...details]
      updatedDetails[existingIndex] = {
        ...updatedDetails[existingIndex],
        cantidad: updatedDetails[existingIndex].cantidad + cantidad,
      }
      setDetails(updatedDetails)
    } else {
      // Si no existe, agregar nuevo
      const newSaleDetail: SaleDetail = {
        idProducto: product.idProducto,
        cantidad,
        precio: product.precio,
        nombreProducto: product.nombre,
      }
      setDetails([...details, newSaleDetail])
    }

    // Resetear el formulario
    setSelectedProduct(null)
    setNewDetail({
      idProducto: '',
      cantidad: '1',
    })
  }

  const handleRemoveDetail = (index: number) => {
    const updatedDetails = details.filter((_, i) => i !== index)
    setDetails(updatedDetails)
  }

  const handleQuantityChange = (index: number, cantidad: number) => {
    if (cantidad <= 0) return
    const updatedDetails = [...details]
    updatedDetails[index] = {
      ...updatedDetails[index],
      cantidad,
    }
    setDetails(updatedDetails)
  }

  const calculateSubtotal = (detail: SaleDetail) => {
    return (detail.precio || 0) * detail.cantidad
  }

  const calculateTotal = () => {
    return details.reduce((sum, detail) => sum + calculateSubtotal(detail), 0)
  }

  return (
    <div className='space-y-4'>
      {/* Formulario para agregar productos */}
      <div className='flex gap-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='flex-1 justify-between'
              disabled={loading}
            >
              {selectedProduct ? selectedProduct.nombre : 'Seleccionar producto...'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[400px] p-0' align='start'>
            <Command>
              <CommandInput placeholder='Buscar producto...' />
              <CommandList>
                <CommandEmpty>No se encontró el producto.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.idProducto}
                      value={`${product.idProducto}-${product.nombre}`}
                      onSelect={() => {
                        setSelectedProduct(product)
                        setNewDetail({ 
                          ...newDetail, 
                          idProducto: String(product.idProducto) 
                        })
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedProduct?.idProducto === product.idProducto
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{product.nombre}</span>
                        <span className='text-xs text-muted-foreground'>
                          ${product.precio.toFixed(2)} · Stock: {product.stock}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type='number'
          min='1'
          value={newDetail.cantidad}
          onChange={(e) =>
            setNewDetail({ ...newDetail, cantidad: e.target.value })
          }
          placeholder='Cant.'
          className='w-24'
        />

        <Button
          type='button'
          onClick={handleAddDetail}
          size='icon'
          disabled={!newDetail.idProducto || !newDetail.cantidad}
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Tabla de detalles */}
      {details.length > 0 ? (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className='text-right'>Precio</TableHead>
                <TableHead className='text-center'>Cantidad</TableHead>
                <TableHead className='text-right'>Subtotal</TableHead>
                <TableHead className='w-[50px]'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.nombreProducto}</TableCell>
                  <TableCell className='text-right'>
                    ${(detail.precio || 0)}
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex flex-col items-center gap-1'>
                      <Input
                        type='number'
                        min='1'
                        value={detail.cantidad}
                        onChange={(e) =>
                          handleQuantityChange(index, Number(e.target.value))
                        }
                        className='w-20 text-center'
                      />
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    ${calculateSubtotal(detail).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => handleRemoveDetail(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className='text-right font-bold'>
                  Total:
                </TableCell>
                <TableCell className='text-right font-bold'>
                  ${calculateTotal().toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className='rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground'>
          No hay productos agregados. Usa el formulario arriba para agregar productos.
        </div>
      )}
    </div>
  )
}
