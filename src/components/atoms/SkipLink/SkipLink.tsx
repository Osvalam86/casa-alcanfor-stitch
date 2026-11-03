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
      className="sr-only rounded-sm bg-action px-6 py-3 font-sans text-label-md font-semibold text-on-action shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60"
    >
      {children}
    </a>
  )
}
