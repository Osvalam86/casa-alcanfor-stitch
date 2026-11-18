import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { iconHref } from '@/lib/icons'
import { fieldClasses } from '@/lib/styles/field'

export type InputProps = ComponentProps<'input'> & {
  id: string
}

/** Campo de texto. El estado de error se expresa con aria-invalid (lo cablea FormField). */
export function Input({ id, type = 'text', className, ...props }: InputProps) {
  if (type !== 'date') return <input id={id} type={type} className={cn(fieldClasses, className)} {...props} />

  // Fecha: ícono propio en el lugar y del tamaño de la flecha del Select. Es decorativo: el indicador nativo,
  // transparente, queda encima y abre el calendario (date-field en index.css). En Firefox se oculta (date-icon)
  // y queda su calendario nativo.
  return (
    <div className="relative">
      <input id={id} type={type} className={cn(fieldClasses, 'date-field relative', className)} {...props} />
      <svg
        aria-hidden="true"
        focusable="false"
        data-field-icon="calendar-today"
        className="date-icon pointer-events-none absolute top-1/2 right-3 size-icon-field -translate-y-1/2 fill-current text-text-muted"
      >
        <use href={iconHref('calendar-today')} />
      </svg>
    </div>
  )
}
