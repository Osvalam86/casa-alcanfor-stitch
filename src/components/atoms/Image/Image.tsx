import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const imageVariants = cva('block size-full object-cover', {
  variants: {
    shape: {
      none: '',
      /** Arco de hacienda: esquinas superiores en píldora (DESIGN.md) */
      arch: 'rounded-t-full rounded-b-2xl',
      rounded: 'rounded-2xl',
    },
  },
  defaultVariants: { shape: 'none' },
})

export type ImageProps = Omit<ComponentProps<'img'>, 'alt'> &
  VariantProps<typeof imageVariants> & {
    src: string
    /** Obligatorio: descriptivo en imágenes de contenido, "" en las decorativas */
    alt: string
  }

export function Image({ src, alt, shape, loading = 'lazy', decoding = 'async', className, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(imageVariants({ shape }), className)}
      {...props}
    />
  )
}
