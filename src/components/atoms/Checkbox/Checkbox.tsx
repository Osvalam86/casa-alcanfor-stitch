import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  id: string
}

/** Casilla nativa; la etiqueta se asocia por id en el componente que la usa. */
export function Checkbox({ id, className, ...props }: CheckboxProps) {
  return (
    <input
      id={id}
      type="checkbox"
      className={cn(
        'mt-0.5 size-5 shrink-0 cursor-pointer rounded-xs accent-action disabled:cursor-not-allowed aria-invalid:outline-2 aria-invalid:outline-error',
        className,
      )}
      {...props}
    />
  )
}
