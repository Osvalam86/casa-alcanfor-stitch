import type { ReactNode } from 'react'

export type LandingTemplateProps = {
  skipLink: ReactNode
  header: ReactNode
  /** Secciones de la página, en orden */
  children: ReactNode
  footer: ReactNode
  /** Elementos fijos (botón de WhatsApp, barra móvil) */
  floating?: ReactNode
}

/**
 * Composición de la landing: landmarks y espacio reservado para lo fijo.
 * El <main> empieza debajo del header (altura medida) y deja libre la franja inferior.
 */
export function LandingTemplate({ skipLink, header, children, footer, floating }: LandingTemplateProps) {
  return (
    <>
      {skipLink}
      {header}
      <main id="main" tabIndex={-1} className="pt-header">
        {children}
      </main>
      {/* En móvil la barra fija ocuparía el final del footer: se reserva su altura */}
      <div className="bg-surface-inverse pb-floating md:pb-0">{footer}</div>
      {floating}
    </>
  )
}
