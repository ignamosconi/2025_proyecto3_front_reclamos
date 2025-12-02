'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { type Product } from '../data/schema'
import { CreateProductDto, productsService, UpdateProductDto } from '@/services/products/products.service'
import { Textarea } from '@/components/ui/textarea'
import { brandsService } from '@/services/brands/brands.service'

const formSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido.'),
    descripcion: z.string().optional().nullable(),
    precio: z.number().min(0, 'El precio debe ser mayor o igual a 0.'),
    stock: z.number().min(0, 'El stock debe ser mayor o igual a 0.'),
    alertaStock: z.number().min(0, 'La alerta de stock debe ser mayor o igual a 0.'),
    foto: z.string().optional().nullable(),
    fotoFile: z.any().optional(),
    idLinea: z.number().optional(),
    idMarca: z.number().min(1, 'Debes seleccionar una marca.').optional(),
  })
  .extend({
    isEdit: z.boolean(),
  })

type ProductForm = z.infer<typeof formSchema>

type ProductActionDialogProps = {
  currentRow?: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

interface Marca {
  id: number
  nombre: string
}

interface Linea {
  id: number
  nombre: string
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
  onSuccess,
}: ProductActionDialogProps) {
  const isEdit = !!currentRow
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [lineas, setLineas] = useState<Linea[]>([])
  const [isLoadingMarcas, setIsLoadingMarcas] = useState(false)
  const [isLoadingLineas, setIsLoadingLineas] = useState(false)
  const [openMarcaCombobox, setOpenMarcaCombobox] = useState(false)
  const [openLineaCombobox, setOpenLineaCombobox] = useState(false)
  const [selectedMarcaId, setSelectedMarcaId] = useState<number | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasNewImage, setHasNewImage] = useState(false)

  const form = useForm<ProductForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          nombre: currentRow.nombre,
          descripcion: currentRow.descripcion ?? '',
          precio: currentRow.precio,
          stock: currentRow.stock,
          alertaStock: currentRow.alertaStock,
          foto: currentRow.foto ?? '',
          fotoFile: undefined,
          idLinea: currentRow.idLinea,
          idMarca: currentRow.idMarca,
          isEdit,
        }
      : {
          nombre: '',
          descripcion: '',
          precio: 0,
          stock: 0,
          alertaStock: 0,
          foto: '',
          fotoFile: undefined,
          idLinea: undefined,
          idMarca: undefined,
          isEdit,
        },
  })

  // Cargar marcas cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadMarcas()
      setHasNewImage(false)
      // Si estamos editando, cargar las líneas de la marca actual
      if (isEdit && currentRow?.idMarca) {
        setSelectedMarcaId(currentRow.idMarca)
        loadLineasByMarca(currentRow.idMarca)
        // Establecer la vista previa de la imagen si existe
        if (currentRow?.foto) {
          // Agregar timestamp para evitar cache del navegador
          const imageUrl = `${currentRow.foto}?t=${new Date(currentRow.updatedAt || Date.now()).getTime()}`
          setImagePreview(imageUrl)
        }
      }
    } else {
      // Limpiar al cerrar
      setLineas([])
      setSelectedMarcaId(undefined)
      setImagePreview(null)
      setHasNewImage(false)
    }
  }, [open, isEdit, currentRow?.idMarca, currentRow?.foto, currentRow?.updatedAt])

  const loadMarcas = async () => {
    try {
      setIsLoadingMarcas(true)
      const marcasData = await brandsService.getAll()
      setMarcas(marcasData)
    } catch (error) {
      console.error('Error al cargar marcas:', error)
      toast.error('Error al cargar las marcas')
    } finally {
      setIsLoadingMarcas(false)
    }
  }

  const loadLineasByMarca = async (marcaId: number) => {
    try {
      setIsLoadingLineas(true)
      let lineasData = await brandsService.getAssociatedLines(marcaId)
      lineasData = lineasData.map((linea:any) => {
        return linea.linea
      });
      setLineas(lineasData)
    } catch (error) {
      console.error('Error al cargar líneas:', error)
      toast.error('Error al cargar las líneas de la marca')
      setLineas([])
    } finally {
      setIsLoadingLineas(false)
    }
  }

  const handleMarcaChange = (marcaId: number) => {
    setSelectedMarcaId(marcaId)
    form.setValue('idMarca', marcaId)
    
    // Limpiar la línea seleccionada cuando cambia la marca
    form.setValue('idLinea', undefined)
    setLineas([])
    
    // Cargar las líneas de la nueva marca
    loadLineasByMarca(marcaId)
  }

  const onSubmit = async (values: ProductForm) => {
    try {
      setIsSubmitting(true)
      
      // Validar que se haya seleccionado una marca
      if (!values.idMarca) {
        toast.error('Debes seleccionar una marca')
        return
      }
      
      if (isEdit && currentRow) {
        // Actualizar producto
        const updateData: UpdateProductDto = {
          nombre: values.nombre,
          descripcion: values.descripcion ?? "",  
          precio: values.precio,
          stock: values.stock,
          alertaStock: values.alertaStock,
          idLinea: values.idLinea,
          idMarca: values.idMarca,
        }

        // Solo incluir foto si NO hay un archivo nuevo
        if (!values.fotoFile) {
          updateData.foto = values.foto ?? "";
        }

        await productsService.update(currentRow.idProducto, updateData, values.fotoFile)
        toast.success('Producto actualizado correctamente')
      } else {
        // Crear nuevo producto
        const createData: CreateProductDto = {
          nombre: values.nombre,
          descripcion: values.descripcion ?? "",  
          precio: values.precio,
          stock: values.stock,
          alertaStock: values.alertaStock,
          idLinea: values.idLinea,
          idMarca: values.idMarca,
        }

        // Solo incluir foto si NO hay un archivo nuevo
        if (!values.fotoFile) {
          createData.foto = values.foto ?? "";
        }

        await productsService.create(createData, values.fotoFile)
        toast.success('Producto creado correctamente')
      }
      
      form.reset()
      setImagePreview(null)
      setHasNewImage(false)
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      console.error('Error al guardar proveedor:', error)
      
      // Manejar errores específicos
      if (error.response?.status === 409) {
        toast.error('Ya existe un producto con ese nombre')
      } else {
        const errorMessage = error.response?.data?.message || 'Error al guardar el producto'
        toast.error(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        setImagePreview(null)
        setHasNewImage(false)
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Editar producto' : 'Agregar nuevo producto'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Actualiza la información del producto. Haz clic en guardar cuando termines.'
              : 'Crea un nuevo producto. Haz clic en guardar cuando termines.'}
          </DialogDescription>
        </DialogHeader>
        <div className='h-[26.25rem] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='line-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='nombre'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Proveedor S.A.'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='descripcion'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Descripción
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Descripción del producto'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name='precio'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Precio
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'0.01'}
                        autoComplete='off'
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stock'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'1'}
                        autoComplete='off'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='alertaStock'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Alerta de stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='0.00'
                        className='col-span-4'
                        type='number'
                        step={'1'}
                        autoComplete='off'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
                            <FormField
                control={form.control}
                name='fotoFile'
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Foto
                    </FormLabel>
                    <div className='col-span-4 space-y-2'>
                      <FormControl>
                        <Input
                          type='file'
                          accept='image/*'
                          className='cursor-pointer'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              onChange(file)
                              setHasNewImage(true)
                              // Crear vista previa
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string)
                              }
                              reader.readAsDataURL(file)
                            } else {
                              // Si se cancela la selección, restaurar la imagen original si existe
                              if (isEdit && currentRow?.foto) {
                                const imageUrl = `${currentRow.foto}?t=${new Date(currentRow.updatedAt || Date.now()).getTime()}`
                                setImagePreview(imageUrl)
                                setHasNewImage(false)
                              } else {
                                setImagePreview(null)
                                setHasNewImage(false)
                              }
                              onChange(undefined)
                            }
                          }}
                          {...field}
                          value={undefined}
                        />
                      </FormControl>
                      {isEdit && currentRow?.foto && !imagePreview && (
                        <p className='text-sm text-muted-foreground'>
                          Imagen actual mantenida. Sube una nueva para reemplazarla.
                        </p>
                      )}
                      {imagePreview && (
                        <div className='relative w-full h-32 border rounded-md overflow-hidden bg-gray-50'>
                          <img
                            src={imagePreview}
                            alt='Vista previa'
                            className='w-full h-full object-contain'
                          />
                          <button
                            type='button'
                            onClick={() => {
                              // Si hay una nueva imagen, eliminarla
                              if (hasNewImage) {
                                // Si estamos editando y había una imagen original, restaurarla
                                if (isEdit && currentRow?.foto) {
                                  const imageUrl = `${currentRow.foto}?t=${new Date(currentRow.updatedAt || Date.now()).getTime()}`
                                  setImagePreview(imageUrl)
                                } else {
                                  setImagePreview(null)
                                }
                                setHasNewImage(false)
                              } else {
                                // Si es la imagen original, simplemente eliminarla de la vista
                                setImagePreview(null)
                              }
                              form.setValue('fotoFile', undefined)
                              // Resetear el input file
                              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                              if (fileInput) fileInput.value = ''
                            }}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md'
                            title={hasNewImage ? 'Cancelar nueva imagen' : 'Ocultar vista previa'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='idMarca'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Marca
                    </FormLabel>
                    <FormControl>
                      <Popover open={openMarcaCombobox} onOpenChange={setOpenMarcaCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openMarcaCombobox}
                            className='col-span-4 w-full justify-between'
                            disabled={isLoadingMarcas}
                          >
                            {field.value
                              ? marcas.find((marca) => marca.id === field.value)?.nombre
                              : 'Seleccione una marca'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[300px] p-0'>
                          <Command className='w-full'>
                            <CommandInput placeholder='Buscar marca...' />
                            <CommandList>
                              <CommandEmpty>No se encontró ninguna marca.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="sin-marca"
                                  onSelect={() => {
                                    form.setValue('idMarca', undefined)
                                    form.setValue('idLinea', undefined)
                                    setSelectedMarcaId(undefined)
                                    setLineas([])
                                    setOpenMarcaCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      !field.value ? 'opacity-100' : 'opacity-0'
                                    }`}
                                  />
                                  Seleccione una marca
                                </CommandItem>
                                {marcas.map((marca) => (
                                  <CommandItem
                                    key={marca.id}
                                    value={marca.nombre}
                                    onSelect={() => {
                                      handleMarcaChange(marca.id)
                                      setOpenMarcaCombobox(false)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === marca.id ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                    {marca.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='idLinea'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Línea
                    </FormLabel>
                    <FormControl>
                      <Popover open={openLineaCombobox} onOpenChange={setOpenLineaCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={openLineaCombobox}
                            className='col-span-4 w-full justify-between'
                            disabled={!selectedMarcaId || isLoadingLineas}
                          >
                            {field.value
                              ? lineas.find((linea) => linea.id === field.value)?.nombre
                              : selectedMarcaId 
                                ? 'Selecciona una línea' 
                                : 'Primero selecciona una marca'}
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[300px] p-0'>
                          <Command className='w-full'>
                            <CommandInput placeholder='Buscar línea...' />
                            <CommandList>
                              <CommandEmpty>
                                {isLoadingLineas 
                                  ? 'Cargando líneas...' 
                                  : 'No se encontraron líneas para esta marca.'}
                              </CommandEmpty>
                              <CommandGroup>
                                {lineas.map((linea) => (
                                  <CommandItem
                                    key={linea.id}
                                    value={linea.nombre}
                                    onSelect={() => {
                                      field.onChange(linea.id)
                                      setOpenLineaCombobox(false)
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === linea.id ? 'opacity-100' : 'opacity-0'
                                      }`}
                                    />
                                    {linea.nombre}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='line-form' disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
