import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { notFound } from '@/content/notFound'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Ruteo mínimo por pathname (D16): sin router, dos páginas y la 404 de respaldo
const path = window.location.pathname.replace(/\/+$/, '')

function pageFor(path: string) {
  if (path === '' || path === '/index.html') return <LandingPage />
  if (path === '/design-system') return <DesignSystemPage />  // Respaldo si el hosting manda una ruta inexistente a index.html (Netlify sirve 404.html):
  // React 19 sube el título y el noindex al <head>, por delante de los de la landing
  return (
    <>
      <title>{notFound.meta.title}</title>
      <meta name="robots" content="noindex" />
      <NotFoundPage />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{pageFor(path)}</StrictMode>,
)
