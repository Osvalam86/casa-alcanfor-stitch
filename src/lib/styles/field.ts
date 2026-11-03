/**
 * Estilo compartido de los controles de formulario (Input, Select, Textarea).
 * Borde ≥ 3:1 (D13), borde dorado al enfocar (DESIGN.md) y el anillo de foco global.
 */
export const fieldClasses = [
  'w-full min-h-control-md rounded-sm border border-border-control bg-surface-sunken',
  'px-4 py-3 font-sans text-body-md text-text placeholder:text-text-placeholder',
  'transition-surface duration-200',
  'hover:bg-surface-muted focus:border-accent focus:bg-surface-muted',
  'aria-invalid:border-2 aria-invalid:border-error aria-invalid:bg-error-soft',
  'disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-surface-disabled disabled:text-text-muted',
].join(' ')
