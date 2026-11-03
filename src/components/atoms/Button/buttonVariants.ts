import { cva, type VariantProps } from 'class-variance-authority'

/** Variantes compartidas por Button (<button>) y ButtonLink (<a>). */
export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-sm text-center font-sans font-semibold tracking-wide',
    'transition-colors duration-200 select-none',
    'disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-muted disabled:shadow-none',
    'aria-disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-action text-on-action shadow-sm hover:bg-action-hover hover:text-accent-soft active:bg-surface-inverse',
        secondary: 'bg-action-secondary text-on-action-secondary hover:bg-action-secondary-hover active:bg-surface-stronger',
        outline:
          'border border-border-subtle bg-surface text-text-strong shadow-sm hover:bg-surface-strong active:bg-surface-stronger',
        accent: 'bg-accent text-on-accent shadow-sm hover:bg-accent-soft hover:text-on-accent-soft active:bg-accent-strong',
        inverse:
          'bg-surface text-text-strong shadow-lg hover:bg-accent-soft hover:text-on-accent-soft active:bg-surface-strong',
        inverseSubtle:
          'bg-surface-inverse-strong text-text-on-inverse hover:bg-text-on-inverse/20 active:bg-text-on-inverse/30',
      },
      size: {
        sm: 'min-h-control-sm px-4 text-label-caps',
        md: 'min-h-control-md px-6 text-label-md',
        lg: 'min-h-control-lg px-8 text-label-md',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
