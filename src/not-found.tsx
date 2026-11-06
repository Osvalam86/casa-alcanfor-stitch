import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Entrada de 404.html: se sirve en rutas inexistentes, así que no depende del pathname
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFoundPage />
  </StrictMode>,
)
