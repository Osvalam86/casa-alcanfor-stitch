import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type LabelProps = ComponentProps<'label'> & {
  htmlFor: string
  children: ReactNode
  /** Indicador visible a la derecha ("Requerido" / "Opcional", desde content/) */
  indicator?: string
  invalid?: boolean
}

/**
 * Etiqueta de campo. La fila tiene interlineado fijo (leading-label-row) para que
 * mida lo mismo con o sin indicador y los campos de una fila queden alineados.
 */
export function Label({ htmlFor, indicator, invalid = false, className, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-baseline justify-between gap-2 font-sans text-label-caps leading-label-row uppercase',
        invalid ? 'text-error' : 'text-text',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {indicator ? (
        <span
          className={cn(
            'text-caption leading-label-row font-medium tracking-normal normal-case',
            invalid ? 'text-error' : 'text-text-muted',
          )}
        >
          {indicator}
        </span>
      ) : null}
    </label>
  )
}
