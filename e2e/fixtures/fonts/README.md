# Fuentes de prueba (solo e2e)

Simulan las fuentes del sistema de Android en `e2e/fonts.spec.ts`, para comprobar que las caras de
respaldo `… Fallback Android` (Roboto y Noto Serif, en `src/styles/fonts.css`) ocupan lo mismo que
EB Garamond y Manrope. No se sirven en el sitio.

| Archivo | Origen | Licencia |
|---|---|---|
| `roboto-latin-{400,500,700}-normal.woff2` | `@fontsource/roboto` 5.3.0 | OFL 1.1 |
| `noto-serif-latin-400-{normal,italic}.woff2` | `@fontsource/noto-serif` 5.3.0 | OFL 1.1 |
