import type { ReactNode } from 'react'

export type SkipLinkProps = {
  /** id del destino, sin # (normalmente el <main>) */
  targetId: string
  children: ReactNode
}

/** Primer elemento enfocable: salta el header. Visible solo con foco. */
export function SkipLink({ targetId, children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      // not-sr-only anula el padding: se repone con foco para mantener el área táctil (2.5.8)
      className="sr-only rounded-sm bg-action font-sans text-label-md font-semibold text-on-action shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:px-6 focus:py-3"
    >
      {children}
    </a>
  )
}
