import type { ReactNode, Ref } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

const alertVariants = cva('flex items-start gap-3 rounded-2xl p-4 font-sans text-body-sm md:p-6', {
  variants: {
    tone: {
      success: 'bg-surface-inverse-strong text-text-on-inverse',
      info: 'bg-accent-soft text-on-accent-soft',
      error: 'border-2 border-error bg-error-soft text-text',
    },
  },
  defaultVariants: { tone: 'info' },
})

const toneIcon: Record<'success' | 'info' | 'error', IconName> = {
  success: 'check-circle',
  info: 'info',
  error: 'error',
}

export type AlertProps = VariantProps<typeof alertVariants> & {
  title?: string
  /** Nivel del título: p por defecto; h3 cuando el aviso reemplaza contenido y recibe el foco */
  titleAs?: 'p' | 'h3'
  /** Si se indica, el título (h3) es enfocable por script (tabIndex -1): destino del foco */
  titleRef?: Ref<HTMLHeadingElement>
  children?: ReactNode
  className?: string
}

/**
 * Aviso visual. No es región viva por sí mismo: el organismo lo coloca dentro de
 * un contenedor con role="status" / role="alert" que existe desde el render inicial.
 */
export function Alert({ tone = 'info', title, titleAs = 'p', titleRef, children, className }: AlertProps) {
  const resolvedTone = tone ?? 'info'

  return (
    <div
      data-surface={resolvedTone === 'success' ? 'inverse' : undefined}
      className={cn(alertVariants({ tone: resolvedTone }), className)}
    >
      <Icon
        name={toneIcon[resolvedTone]}
        size="lg"
        className={cn(
          'mt-0.5',
          resolvedTone === 'success' && 'text-accent-soft',
          resolvedTone === 'error' && 'text-error',
        )}
      />
      <div className="flex flex-col gap-1">
        {title && titleAs === 'h3' ? (
          <h3 ref={titleRef} tabIndex={titleRef ? -1 : undefined} className="rounded-xs font-serif text-headline-sm">
            {title}
          </h3>
        ) : title ? (
          <p className="font-serif text-headline-sm">{title}</p>
        ) : null}
        {children}
      </div>
    </div>
  )
}
