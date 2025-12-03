'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ImageIcon, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { reclamoSchema } from '../data/schema'

type ReclamoImagesListProps = {
  reclamoId: string
}

type ImageState = {
  loading: boolean
  error: boolean
}

// Función auxiliar para construir la URL completa si es relativa
const getImageUrl = (url: string): string => {
  if (!url) return ''
  
  // Si es un data URI (base64), retornarlo tal cual sin modificar
  if (url.startsWith('data:')) {
    return url
  }
  
  // Si la URL ya es absoluta (empieza con http:// o https://), retornarla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Si la URL es relativa, construir la URL completa con la base del API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  
  // Si la URL empieza con /, es relativa al dominio
  if (url.startsWith('/')) {
    // Extraer el dominio de la base URL
    const baseUrl = API_BASE_URL.replace('/api', '')
    return `${baseUrl}${url}`
  }
  
  // Si no empieza con /, asumir que es relativa a la base del API
  return `${API_BASE_URL}/${url}`
}

export function ReclamoImagesList({ reclamoId }: ReclamoImagesListProps) {
  // Get the claim - images should be included in the response
  const { data: claim, isLoading } = useQuery({
    queryKey: ['reclamo', reclamoId],
    queryFn: async () => {
      const response = await reclamosService.getById(reclamoId)
      return reclamoSchema.parse(response)
    },
    enabled: !!reclamoId,
  })

  // Images are now included in the claim response from the backend
  const images = claim?.imagenes

  // Estado para manejar la carga y errores de cada imagen individualmente
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({})

  // Inicializar estados de carga cuando las imágenes cambian
  useEffect(() => {
    if (images && images.length > 0) {
      const initialStates: Record<string, ImageState> = {}
      images.forEach((imagen) => {
        if (imagen._id && imagen.url) {
          // Para data URIs, no necesitamos estado de carga ya que se cargan instantáneamente
          const isDataUri = imagen.url.startsWith('data:')
          initialStates[imagen._id] = { 
            loading: !isDataUri, // Solo mostrar loading para URLs remotas
            error: false 
          }
        }
      })
      setImageStates(initialStates)
    }
  }, [images])

  const handleImageLoad = (imageId: string) => {
    setImageStates((prev) => ({
      ...prev,
      [imageId]: { loading: false, error: false },
    }))
  }

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('Error al cargar imagen:', imageId, imageUrl)
    setImageStates((prev) => ({
      ...prev,
      [imageId]: { loading: false, error: true },
    }))
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-48 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <ImageIcon className='h-12 w-12 text-muted-foreground mb-4' />
        <p className='text-sm text-muted-foreground'>
          No hay imágenes adjuntas para este reclamo.
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {images?.map((imagen: { _id: string; nombre: string; tipo: string; url: string; fkReclamo: string; createdAt?: Date; updatedAt?: Date }) => {
        const imageState = imageStates[imagen._id] || { loading: false, error: false }

        // Debug: verificar que la imagen tenga URL
        if (!imagen.url) {
          console.warn('Imagen sin URL:', imagen)
        }
        
        return (
          <div key={imagen._id} className='space-y-2'>
            <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
              {imagen.url ? (
                <>
                  {imageState.loading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-muted z-10'>
                      <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                    </div>
                  )}
                  {imageState.error && (
                    <div className='absolute inset-0 flex flex-col items-center justify-center bg-muted z-10'>
                      <ImageIcon className='h-12 w-12 text-muted-foreground mb-2' />
                      <p className='text-xs text-muted-foreground text-center px-4'>
                        Error al cargar la imagen
                      </p>
                    </div>
                  )}
                  {!imageState.error && (
                    <img
                      src={getImageUrl(imagen.url)}
                      alt={imagen.nombre || 'Imagen del reclamo'}
                      className={`h-full w-full object-cover ${imageState.loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                      onLoad={() => handleImageLoad(imagen._id)}
                      onError={() => handleImageError(imagen._id, imagen.url)}
                      loading={imagen.url.startsWith('data:') ? 'eager' : 'lazy'}
                    />
                  )}
                </>
              ) : (
                <div className='flex items-center justify-center h-full text-muted-foreground'>
                  <ImageIcon className='h-12 w-12' />
                  <p className='ml-2 text-sm'>Imagen sin URL</p>
                </div>
              )}
            </div>
            {imagen.nombre && (
              <p className='text-xs font-medium'>{imagen.nombre}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

