'use client'

import { useState } from 'react'
import { isRenderableProductImage } from '@/lib/product-image'

interface ProductPhotoProps {
  src: string
  alt: string
  name: string
  faded?: boolean
  className?: string
  priority?: boolean
}

export default function ProductPhoto({
  src,
  alt,
  name,
  faded = false,
  className = '',
  priority = false,
}: ProductPhotoProps) {
  const [failed, setFailed] = useState(false)
  const showImage = isRenderableProductImage(src) && !failed

  if (!showImage) {
    return (
      <div
        className={`flex h-full w-full items-end bg-paper p-4 ${faded ? 'opacity-50' : ''} ${className}`}
      >
        <p className="text-left text-sm font-normal leading-snug text-stone-900">{name}</p>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover transition-transform duration-700 ease-out ${faded ? 'opacity-50' : ''} ${className}`}
    />
  )
}
