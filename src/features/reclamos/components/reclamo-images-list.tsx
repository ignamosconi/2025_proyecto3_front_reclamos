'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { ImageIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { reclamosService } from '@/services/reclamos/reclamos.service'
import { type Reclamo } from '../data/schema'

type ReclamoImagesListProps = {
  reclamoId: string
}

export function ReclamoImagesList({ reclamoId }: ReclamoImagesListProps) {
  // Get the claim - images should be included in the response
  const { data: claim, isLoading } = useQuery({
    queryKey: ['reclamo', reclamoId],
    queryFn: () => reclamosService.getById(reclamoId),
    enabled: !!reclamoId,
  })

  // Images are now included in the claim response from the backend
  const images = (claim as Reclamo)?.imagenes

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
      {images?.map((imagen) => {
        // Debug: verificar que la imagen tenga URL
        if (!imagen.url) {
          console.warn('Imagen sin URL:', imagen)
        }
        
        return (
          <div key={imagen._id} className='space-y-2'>
            <div className='relative aspect-video w-full overflow-hidden rounded-lg border bg-muted'>
              {imagen.url ? (
                <img
                  src={imagen.url}
                  alt={imagen.nombre || 'Imagen del reclamo'}
                  className='h-full w-full object-cover'
                  onError={(e) => {
                    console.error('Error al cargar imagen:', imagen.url?.substring(0, 50))
                    // Si la imagen falla al cargar, mostrar placeholder
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="flex items-center justify-center h-full text-muted-foreground">
                          <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      `
                    }
                  }}
                />
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

