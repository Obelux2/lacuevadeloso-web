# Arquitectura

## Visión general

Sitio de marca personal de Francisco Velásquez, para vender servicios de páginas web y automatizaciones a pymes chilenas. Es una **landing de una sola página, estática, sin build y sin dependencias externas**: se sirve tal cual está en el repositorio. No hay backend, base de datos ni proceso de compilación — el navegador recibe exactamente los archivos versionados en git.

## Stack

| Capa | Tecnología |
|---|---|
| Marcado y estilos | HTML5 + CSS en un `<style>` embebido en `index.html` |
| Interactividad | JavaScript vanilla (~20 líneas), en un `<script>` al final del `<body>` |
| Tipografía | **Inter (variable) desde Google Fonts** — la única dependencia externa del sitio, adoptada en el rediseño Mercury |
| Imágenes | JPG estáticos en `img/`, el logo del oso como SVG (`img/logo-oso.svg`) y el sello de marca en PNG (`brand/`) |
| Hosting | GitHub Pages (rama `main`, raíz del repo) |
| DNS | Cloudflare (zona), NIC Chile (delegación) |

No hay `package.json`, gestor de dependencias ni CI. La ausencia es deliberada, no una omisión: ver [Diseño](diseno.md).

## Estructura de carpetas

```
.
├── index.html      # el sitio completo: marcado, estilos y script
├── favicon.svg     # marca (cabeza de oso) como icono de pestaña
├── CNAME           # dominio para GitHub Pages: lacuevadeloso.cl
├── .gitignore      # excluye capturas/, .claude/, CLAUDE.md y config local
├── img/            # imágenes publicadas (capturas de trabajos, logo del oso, preview OG)
├── brand/          # sello corporativo (oso en la cueva) en tres tamaños PNG
├── docs/           # esta documentación
└── capturas/       # material privado, NO versionado (datos de clientes)
```

`capturas/` existe en disco pero está fuera de git a propósito: guarda capturas con datos reales de clientes que no deben publicarse. `.claude/`, `CLAUDE.md` y `example.mcp.json` (infraestructura del agente local) también están fuera de git.

## Componentes y responsabilidades

Todo vive en `index.html`, organizado en secciones autónomas:

| Sección | `id` | Responsabilidad |
|---|---|---|
| Cabecera | — | Marca (logo del oso, `img/logo-oso.svg`) y navegación por anclas; sticky con blur |
| Hero | — | Titular de resultado, dos llamados a la acción y el sello del oso como fondo fantasma (`brand/logo-avatar-512.png`, opacidad 8 %) |
| Principios | — | Tres compromisos comerciales |
| Servicios | `servicios` | Dos bloques: páginas/tiendas y automatizaciones |
| Trabajos | `trabajos` | Cuatro casos con bajada de "banco de pruebas"; tres llevan captura (`<img class="work-shot">`), el cuarto un patrón CSS |
| Cómo trabajo | — | Proceso en cuatro pasos |
| Cómo cobro | — | Modelo de cobro |
| Contacto | `contacto` | Correo (`mailto:`) y WhatsApp (`wa.me`) |

Los estilos se apoyan en **custom properties** definidas en `:root` (tokens Mercury: ónix, grafito, cobalto). Hay **un solo tema, oscuro** — el rediseño eliminó el modo claro y el bloque `prefers-color-scheme`. Cambiar la paleta completa es cambiar ese bloque de tokens.

## Flujo de una petición

No hay enrutamiento ni servidor de aplicación:

1. El navegador pide `lacuevadeloso.cl` → Cloudflare resuelve a las IPs de GitHub Pages.
2. GitHub Pages sirve `index.html` desde `main`, con el certificado emitido para el dominio del `CNAME`.
3. El navegador pide la hoja de estilos de **Inter a Google Fonts** (con `preconnect` previo); si falla, cae al font stack del sistema declarado en `--font`.
4. El HTML se pinta completo sin JavaScript. Las imágenes de `img/` cargan diferidas (`loading="lazy"`).
5. Si el visitante no pidió reducir movimiento, el script marca las secciones y las revela al entrar en pantalla vía `IntersectionObserver`.

La navegación interna es por anclas (`#servicios`, `#trabajos`, `#contacto`): no hay cambios de página.

## Límites e integraciones externas

El sitio **no consume ninguna API**. Carga un solo recurso de terceros: la tipografía Inter desde Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). El resto de sus vínculos son enlaces salientes que abre el visitante:

| Destino | Dónde | Notas |
|---|---|---|
| `costeador3d-production.up.railway.app/calculadora` | Trabajo 01 | Calculadora pública, sin login |
| `lacuevadeloso3d.cl` | Trabajo 02 | Tienda propia de impresiones 3D |
| `wa.me/56995087901` | Contacto | Con mensaje precargado |
| `mailto:` | Contacto | Correo directo |

El trabajo 03 (lista de precios) **no lleva enlace a propósito**: esa pantalla está protegida por PIN y es de un cliente.

## Decisiones arquitectónicas clave

- **Un solo archivo autocontenido** en vez de un proyecto con build.
- **Una sola dependencia externa** (Inter vía Google Fonts, con fallback al sistema); todo lo demás vive en el repo. La regla original era "cero recursos remotos"; el rediseño Mercury la relajó a propósito.
- **GitHub Pages en vez de Vercel**, aun teniendo el dominio en Vercel.
- **Mejora progresiva**: el sitio funciona íntegro con JavaScript desactivado.

El razonamiento y las alternativas descartadas están en [Diseño](diseno.md).
