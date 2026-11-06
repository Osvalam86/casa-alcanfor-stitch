import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fontPreloadPlugin } from './config/vite-plugin-font-preload.ts'
import { seoPlugin } from './config/vite-plugin-seo.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [react(), tailwindcss(), seoPlugin(env.VITE_SITE_URL), fontPreloadPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        // 404.html: Netlify la sirve en cualquier ruta inexistente (sin regla /* en netlify.toml)
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          notFound: fileURLToPath(new URL('./404.html', import.meta.url)),
        },
        // Con dos entradas, Rollup nombra el código compartido por su primer módulo
        // (p. ej. VisuallyHidden-*.css): se le da un nombre estable
        output: {
          chunkFileNames: 'assets/app-[hash].js',
          assetFileNames: (asset) =>
            asset.names.some((name) => name.endsWith('.css')) ? 'assets/styles-[hash][extname]' : 'assets/[name]-[hash][extname]',
        },
      },
    },
  }
})
