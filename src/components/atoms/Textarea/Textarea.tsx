import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { fieldClasses } from '@/lib/styles/field'

export type TextareaProps = ComponentProps<'textarea'> & {
  id: string
}

export function Textarea({ id, rows = 3, className, ...props }: TextareaProps) {
  return <textarea id={id} rows={rows} className={cn(fieldClasses, 'resize-y', className)} {...props} />
}
