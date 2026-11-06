# CLAUDE.md · [NOMBRE DEL PROYECTO]

## 1. Proyecto

- Qué es: landing para un salón de eventos (Casa Alcanfor).
- Origen del diseño: Stitch (MCP).
- Referencia del diseño en el repo: `design/` (solo consulta; nunca se importa).
- Commits: automático (repositorio local).
- Arquitectura: Atomic Design completo.

## 2. Stack (no cambiar sin preguntar)

<!-- AJUSTAR POR PROYECTO. Este es el stack por defecto (React + Vite + Tailwind v4).
Si el proyecto usa otro (Next.js, Angular, Nunjucks + SCSS/BEMIT, PrimeReact...), reemplaza
esta sección y ajusta las secciones 4, 5, 6, 11 y 12, que dependen del stack. -->

- React 19 + TypeScript (strict) + Vite.
- Tailwind CSS v4 con `@tailwindcss/vite`; tokens en CSS con `@theme`, sin `tailwind.config.js`.
- Gestor de paquetes: **pnpm**. Nunca `npm` ni `yarn`; nunca `package-lock.json` ni `yarn.lock`.
- Dependencias permitidas sin preguntar: `clsx`, `tailwind-merge`, `class-variance-authority`, `motion`, `@fontsource/*` de las fuentes del diseño, `eslint-plugin-jsx-a11y`, `@playwright/test`, `@axe-core/playwright`.

## 3. Origen del diseño

- No reconstruyas desde cero: usa el código o las specs del diseño como referencia y refactorízalo a esta arquitectura.
- Copy, colores, tipografía y espaciado del diseño son la fuente de verdad. No inventes contenido ni cambies textos.
- Lo ambiguo, lo que rompa accesibilidad y lo que parezca demo va a la lista de dudas del plan, nunca se decide en silencio.

## 4. Arquitectura (Atomic Design flexible + presentacional/contenedor)

```
src/
  styles/        index.css · theme.css · fonts.css
  components/
    atoms/       elementos mínimos (Button, Input, Icon, Heading...)
    molecules/   combinaciones con una sola responsabilidad (FormField, Card...)
    organisms/   secciones completas (Header, Hero, Form, Footer...)
    templates/   composición de la página
  pages/         LandingPage.tsx · DesignSystemPage.tsx
  content/       todo el copy en un objeto tipado
  lib/           utilidades y hooks (cn.ts, validaciones, hooks/)
```

- Una carpeta por componente: `Button/Button.tsx` + `Button/index.ts`. Alias `@/` hacia `src/`.
- Reglas de composición:
  - Un átomo no importa otros componentes.
  - Una molécula usa átomos y, si hace falta, otras moléculas pequeñas.
  - Un organismo usa moléculas y átomos. Si un organismo necesita otro, recíbelo por slots (`ReactNode`) y compónlo en el template.
- El nivel se decide por la función del componente, no por cumplir la regla. Si el diseño y la regla chocan, pregunta.
- Copy siempre en `content/`, nunca hardcodeado en componentes.

### Presentacional / contenedor

- Átomos, moléculas y organismos son **presentacionales**: reciben props y pintan UI. Solo manejan estado de interfaz (abierto/cerrado, pestaña activa). No piden datos ni contienen lógica de negocio.
- Los **contenedores** son las páginas: piden los datos, guardan el estado compartido y pasan props hacia abajo.
- La lógica reutilizable vive en hooks (`lib/hooks/`), no en componentes contenedores extra.

### Variante híbrida (solo si la sección 1 la indica)

```
src/
  components/    design system atómico (átomos y moléculas), presentacional
  features/
    <feature>/   organismos, hooks, tipos y lógica de esa funcionalidad
  pages/         contenedores que conectan features y rutas
```

- `components/` no importa nada de `features/`.
- Una feature no importa otra feature; lo compartido sube a `components/` o a `lib/`.

## 5. Tokens (Tailwind v4)

- Todo en `src/styles/theme.css`, en 3 niveles: primitivos en `:root` → semánticos en `@theme inline` → de componente cuando aplique.
- Nombres semánticos en inglés (`--color-surface`, `--color-text-muted`, `--color-accent`...).
- El color del foco se define por superficie (`--focus-ring` redefinido en `[data-surface="inverse"]`).
- Prohibido: valores arbitrarios (`p-[13px]`, `text-[#hex]`), hex en componentes y `style=` en JSX. Si falta un valor, créalo como token.

## 6. Componentes

- Props tipadas con `type`, sin `any`. Extiende las props nativas (`ComponentProps<'button'>`) y pasa el resto con `...props`.
- Variantes con `cva`; clases con `cn()` (clsx + tailwind-merge configurado con los tokens del proyecto).
- `ref` como prop (React 19), sin `forwardRef`.
- Estados: default, hover, focus-visible, active, disabled, loading, error y success, según aplique.
- `alt` y `children` siempre explícitos, nunca dentro de un spread (el lint no los ve).
- Sin lógica de negocio en átomos ni moléculas.

## 7. Responsive y layout

- Mobile first. Valida en 320, 390, 768, 1024, 1280 y 1440 px.
- El grid sigue al diseño (auto-fit con mínimos tokenizados); columnas fijas solo donde el diseño las tenga.
- `scroll-padding-top: var(--header-height, [ALTURA]px)`, con la altura real del header medida (ResizeObserver) y su estado compactado sin mover el contenido.

## 8. Metadatos (checklist obligatorio)

- `lang="[es-MX]"`, title, meta description, viewport, theme-color.
- Favicon generado desde el logo: `icon.svg`, `favicon.ico`, `apple-touch-icon.png` (180), íconos de 192 y 512 y `site.webmanifest`.
- Open Graph completo con imagen de 1200×630 (width, height y alt) + Twitter Card `summary_large_image`.
- JSON-LD del tipo de negocio, generado en el build a partir de `content/`. Sin reseñas ni datos inventados.
- `robots.txt`. Las páginas internas llevan `noindex`, no se bloquean en robots.
- Lo que depende del dominio (canonical, og:url, URLs absolutas, sitemap) usa `VITE_SITE_URL`; si está vacía, se omite.

## 9. Fases y checkpoints

Detente solo en estos checkpoints; dentro de cada fase avanza sin pedir confirmación por componente.

0. **Setup:** git init, Vite + React + TS + Tailwind v4 con pnpm, este CLAUDE.md. Commit (según la regla de git).
1. **Plan (modo plan, sin código):** inventario atómico, mapeo de tokens, árbol de archivos y dudas (D1, D2…) con tu recomendación. → Espera aprobación.
2. **Fundamentos:** configuración, tokens, fuentes, átomos, moléculas y `DesignSystemPage` (incluye una sección de superficie oscura para validar el foco). → Espera aprobación. Commit (según la regla de git).
3. **Página:** organismos, template, página completa, metadatos (sección 8) y favicon. Revisión a 390 y 1440 px. → Espera aprobación. Commit (según la regla de git).
4. **QA, en un chat nuevo:** ver sección 10. Commit (según la regla de git).

## 10. QA (fase 4)

- `pnpm typecheck`, `pnpm lint` y `pnpm build` sin errores.
- Playwright contra el build (`vite preview`), proyectos de 390 y 1440 px:
  - axe en todas las páginas: cero violaciones serious o critical.
  - Teclado real (`keyboard.press`, nunca la API del dialog): skip link, menú, modales, tabs, acordeones y formularios.
  - Anclas: cada enlace de navegación deja su sección justo bajo el header (±1 px), con la página arriba y ya desplazada.
  - 320 px, zoom al 200% y `prefers-reduced-motion: reduce`.
  - Elementos fijos sin tapar el foco (2.4.11).
- Cada corrección se valida quitándola y comprobando que su prueba vuelve a fallar.

## 11. Lint

- `eslint-plugin-jsx-a11y` en modo strict, con los átomos mapeados en `settings['jsx-a11y']`: `polymorphicPropName: 'as'` y `components` { Button: 'button', IconButton: 'button', [Imagen]: 'img', TextLink: 'a', NavLink: 'a', Input: 'input', Select: 'select', Textarea: 'textarea', Label: 'label' }.
- Al configurarlo, valida con una prueba de sabotaje (`src/_canary.tsx` con errores conocidos; el lint debe fallar; luego se borra).

## 12. Comandos

```
pnpm dev          # servidor local
pnpm build        # build de producción
pnpm lint         # ESLint + jsx-a11y
pnpm typecheck    # tsc --noEmit (incluye e2e)
pnpm test:e2e     # Playwright + axe
pnpm icons        # regenera favicon e íconos
pnpm images       # regenera las variantes AVIF de las fotos y su manifiesto (sharp)
```

## 13. Excepciones aprobadas

Registro de toda excepción a estas reglas: qué, dónde y por qué.

- [Ejemplo: `style` inline del parallax del hero, porque `motion` requiere un valor dinámico.]
- Sin `sitemap.xml` ni línea `Sitemap` en `robots.txt` (sección 8), en `config/vite-plugin-seo.ts`: el sitio es un proyecto conceptual con `X-Robots-Tag: noindex` en todas las rutas, y un sitemap invita a indexar.

## 14. No hacer

- No usar `div` ni `span` como botones o enlaces.
- No hardcodear copy, colores ni medidas.
- No instalar librerías de UI (MUI, shadcn, Chakra…) sin preguntar.
- No borrar ni reescribir archivos fuera del alcance de la fase en curso.
