import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldClasses } from '@/lib/styles/field'

export type InputProps = ComponentProps<'input'> & {
  id: string
}

/** Campo de texto. El estado de error se expresa con aria-invalid (lo cablea FormField). */
export function Input({ id, type = 'text', className, ...props }: InputProps) {
  return <input id={id} type={type} className={cn(fieldClasses, className)} {...props} />
}
