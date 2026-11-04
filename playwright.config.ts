import { defineConfig } from '@playwright/test'

const PORT = 4173

/**
 * QA (CLAUDE.md §10): pruebas contra el build de producción servido con `vite preview`,
 * en dos proyectos de ancho fijo: 390 px (móvil) y 1440 px (escritorio).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: 'chromium',
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile-390', use: { viewport: { width: 390, height: 844 } } },
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    // Siempre el build: `pnpm test:e2e` compila antes de lanzar las pruebas
    command: `pnpm preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Nunca reutiliza otro servidor: así se prueba siempre el build recién compilado
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
