'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ImageIcon, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
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
  console.log('[getImageUrl] Procesando URL:', {
    urlLength: url?.length || 0,
    urlPreview: url?.substring(0, 50) + '...',
    startsWithData: url?.startsWith('data:'),
    startsWithHttp: url?.startsWith('http://') || url?.startsWith('https://'),
  })

  if (!url) {
    console.warn('[getImageUrl] URL vacía')
    return ''
  }

  // Si es un data URI (base64), retornarlo tal cual sin modificar
  if (url.startsWith('data:')) {
    console.log('[getImageUrl] ✅ Es un data URI, retornando sin modificar')
    return url
  }

  // Si la URL ya es absoluta (empieza con http:// o https://), retornarla tal cual
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('[getImageUrl] ✅ Es una URL absoluta, retornando sin modificar')
    return url
  }

  // Si la URL es relativa, construir la URL completa con la base del API
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  console.log('[getImageUrl] URL relativa detectada, construyendo URL completa con base:', API_BASE_URL)

  // Si la URL empieza con /, es relativa al dominio
  if (url.startsWith('/')) {
    // Extraer el dominio de la base URL
    const baseUrl = API_BASE_URL.replace('/api', '')
    const finalUrl = `${baseUrl}${url}`
    console.log('[getImageUrl] URL relativa al dominio construida:', finalUrl)
    return finalUrl
  }

  // Si no empieza con /, asumir que es relativa a la base del API
  const finalUrl = `${API_BASE_URL}/${url}`
  console.log('[getImageUrl] URL relativa al API construida:', finalUrl)
  return finalUrl
}

export function ReclamoImagesList({ reclamoId }: ReclamoImagesListProps) {
  console.log('[ReclamoImagesList] Componente renderizado con reclamoId:', reclamoId)

  // Get the claim - images should be included in the response
  const { data: claim, isLoading, error: queryError } = useQuery({
    queryKey: ['reclamo', reclamoId],
    queryFn: async () => {
      console.log('[ReclamoImagesList] Obteniendo reclamo con ID:', reclamoId)
      const response = await reclamosService.getById(reclamoId)
      console.log('[ReclamoImagesList] Respuesta del servicio:', response)
      try {
        const parsed = reclamoSchema.parse(response)
        console.log('[ReclamoImagesList] ✅ Datos parseados exitosamente:', parsed)
        return parsed
      } catch (error) {
        console.error('[ReclamoImagesList] ❌ Error al parsear con Zod:', error)
        if (error instanceof z.ZodError) {
          console.error('[ReclamoImagesList] Errores de validación (issues):', error.issues)
          error.issues.forEach((issue, index) => {
            console.error(`[ReclamoImagesList] Issue ${index + 1}:`, {
              path: issue.path,
              message: issue.message,
              code: issue.code,
            })
          })
        }
        throw error
      }
    },
    enabled: !!reclamoId,
  })

  // Images are now included in the claim response from the backend
  const images = claim?.imagenes
  console.log('[ReclamoImagesList] Estado del query:', { isLoading, hasClaim: !!claim, imagesCount: images?.length || 0, queryError })
  console.log('[ReclamoImagesList] Imágenes recibidas:', images)

  // Estado para manejar la carga y errores de cada imagen individualmente
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({})

  // Inicializar estados de carga cuando las imágenes cambian
  useEffect(() => {
    console.log('[ReclamoImagesList] useEffect - imágenes cambiaron:', images)
    if (images && images.length > 0) {
      console.log('[ReclamoImagesList] Inicializando estados para', images.length, 'imágenes')
      const initialStates: Record<string, ImageState> = {}
      images.forEach((imagen) => {
        console.log('[ReclamoImagesList] Procesando imagen:', {
          _id: imagen._id,
          nombre: imagen.nombre,
          urlLength: imagen.url?.length || 0,
          urlPreview: imagen.url?.substring(0, 50) + '...',
          isDataUri: imagen.url?.startsWith('data:'),
        })
        if (imagen._id && imagen.url) {
          // Para data URIs, no necesitamos estado de carga ya que se cargan instantáneamente
          const isDataUri = imagen.url.startsWith('data:')
          initialStates[imagen._id] = {
            loading: !isDataUri, // Solo mostrar loading para URLs remotas
            error: false
          }
          console.log('[ReclamoImagesList] Estado inicial para imagen', imagen._id, ':', initialStates[imagen._id])
        } else {
          console.warn('[ReclamoImagesList] Imagen sin _id o url:', imagen)
        }
      })
      console.log('[ReclamoImagesList] Estados iniciales configurados:', initialStates)
      setImageStates(initialStates)
    } else {
      console.log('[ReclamoImagesList] No hay imágenes para inicializar estados')
    }
  }, [images])

  const handleImageLoad = (imageId: string) => {
    console.log('[ReclamoImagesList] ✅ Imagen cargada exitosamente:', imageId)
    setImageStates((prev) => {
      const newState = {
        ...prev,
        [imageId]: { loading: false, error: false },
      }
      console.log('[ReclamoImagesList] Nuevo estado después de carga:', newState)
      return newState
    })
  }

  const handleImageError = (imageId: string, imageUrl: string) => {
    console.error('[ReclamoImagesList] ❌ Error al cargar imagen:', {
      imageId,
      imageUrlLength: imageUrl?.length || 0,
      imageUrlPreview: imageUrl?.substring(0, 100) + '...',
      isDataUri: imageUrl?.startsWith('data:'),
    })
    setImageStates((prev) => {
      const newState = {
        ...prev,
        [imageId]: { loading: false, error: true },
      }
      console.log('[ReclamoImagesList] Nuevo estado después de error:', newState)
      return newState
    })
  }

  if (isLoading) {
    console.log('[ReclamoImagesList] Mostrando skeleton de carga')
    return (
      <div className='space-y-4'>
        <Skeleton className='h-48 w-full' />
        <Skeleton className='h-48 w-full' />
      </div>
    )
  }

  if (!images || images.length === 0) {
    console.log('[ReclamoImagesList] No hay imágenes para mostrar')
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <ImageIcon className='h-12 w-12 text-muted-foreground mb-4' />
        <p className='text-sm text-muted-foreground'>
          No hay imágenes adjuntas para este reclamo.
        </p>
      </div>
    )
  }

  console.log('[ReclamoImagesList] Renderizando', images.length, 'imágenes')
  console.log('[ReclamoImagesList] Estados actuales de imágenes:', imageStates)

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      {images?.map((imagen: { _id: string; nombre: string; tipo: string; url: string; fkReclamo: string; createdAt?: Date; updatedAt?: Date }) => {
        const imageState = imageStates[imagen._id] || { loading: false, error: false }
        const finalUrl = getImageUrl(imagen.url)

        console.log('[ReclamoImagesList] Renderizando imagen:', {
          _id: imagen._id,
          nombre: imagen.nombre,
          urlOriginal: imagen.url?.substring(0, 50) + '...',
          urlFinal: finalUrl?.substring(0, 50) + '...',
          urlLength: imagen.url?.length || 0,
          finalUrlLength: finalUrl?.length || 0,
          isDataUri: imagen.url?.startsWith('data:'),
          imageState,
        })

        // Debug: verificar que la imagen tenga URL
        if (!imagen.url) {
          console.warn('[ReclamoImagesList] ⚠️ Imagen sin URL:', imagen)
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
                      src={finalUrl}
                      alt={imagen.nombre || 'Imagen del reclamo'}
                      className={`h-full w-full object-cover ${imageState.loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                      onLoad={() => {
                        console.log('[ReclamoImagesList] 🖼️ onLoad disparado para imagen:', imagen._id)
                        handleImageLoad(imagen._id)
                      }}
                      onError={(e) => {
                        console.error('[ReclamoImagesList] 🚨 onError disparado para imagen:', imagen._id, e)
                        handleImageError(imagen._id, imagen.url)
                      }}
                      loading={imagen.url.startsWith('data:') ? 'eager' : 'lazy'}
                      onLoadStart={() => console.log('[ReclamoImagesList] 📥 onLoadStart para imagen:', imagen._id)}
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

