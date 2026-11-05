import type { ReactNode } from 'react'

export type LandingTemplateProps = {
  skipLink: ReactNode
  /** Franja estática arriba del header (aviso de proyecto conceptual) */
  notice?: ReactNode
  header: ReactNode
  /** Secciones de la página, en orden */
  children: ReactNode
  footer: ReactNode
  /** Elementos fijos (botón de WhatsApp, barra móvil) */
  floating?: ReactNode
}

/**
 * Composición de la landing: landmarks y espacio reservado para lo fijo.
 * El header es sticky (en el flujo), así que la franja de aviso queda arriba y se va con el scroll;
 * el <main> empieza justo debajo del header sin relleno extra.
 */
export function LandingTemplate({ skipLink, notice, header, children, footer, floating }: LandingTemplateProps) {
  return (
    <>
      {skipLink}
      {notice}
      {header}
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      {/* Lo fijo inferior (barra móvil / botón de WhatsApp) taparía el final del footer: se reserva su altura */}
      <div className="bg-surface-inverse pb-floating">{footer}</div>
      {floating}
    </>
  )
}
