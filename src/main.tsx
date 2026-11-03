import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { LandingPage } from '@/pages/LandingPage'

// Ruteo mínimo por pathname (D16): sin router, solo dos páginas
const path = window.location.pathname.replace(/\/+$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{path === '/design-system' ? <DesignSystemPage /> : <LandingPage />}</StrictMode>,
)
