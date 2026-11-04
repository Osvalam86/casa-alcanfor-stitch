import { useId, type ReactNode } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { Label } from '@/components/atoms/Label'
import { cn } from '@/lib/cn'

/** Props que el control recibe ya cableadas (id, descripción, error). */
export type FieldControlProps = {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  required?: boolean
}

export type FormFieldProps = {
  label: string
  /** Texto visible de obligatorio (desde content/) */
  requiredText?: string
  /** Texto visible de opcional (desde content/); se muestra si el campo no es obligatorio */
  optionalText?: string
  required?: boolean
  hint?: string
  /** Mensaje de error; si existe, el control queda aria-invalid */
  error?: string
  /** id fijo opcional (p. ej. destino del resumen de errores); si no, se genera */
  id?: string
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

export function FormField({
  label,
  requiredText,
  optionalText,
  required = false,
  hint,
  error,
  id,
  className,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const hintId = `${controlId}-hint`
  const errorId = `${controlId}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined
  const invalid = Boolean(error)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={controlId} indicator={required ? requiredText : optionalText} invalid={invalid}>
        {label}
      </Label>
      {children({
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': invalid ? true : undefined,
        required,
      })}
      {hint ? (
        <p id={hintId} className="font-sans text-caption text-text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 font-sans text-caption font-medium text-error">
          <Icon name="error" size="sm" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}
