# Arquitectura

## Visión general

Sitio de marca personal de Francisco Velásquez, para vender servicios de páginas web y automatizaciones a pymes chilenas. Es una **landing de una sola página, estática, sin build y sin dependencias externas**: se sirve tal cual está en el repositorio. No hay backend, base de datos ni proceso de compilación — el navegador recibe exactamente los archivos versionados en git.

## Stack

| Capa | Tecnología |
|---|---|
| Marcado y estilos | HTML5 + CSS en un `<style>` embebido en `index.html` |
| Interactividad | JavaScript vanilla (~15 líneas), en un `<script>` al final del `<body>` |
| Tipografía | Font stacks del sistema — **sin webfonts, sin `@font-face`, sin `@import`** |
| Imágenes | JPG estáticos en `img/` + un SVG inline para la marca |
| Hosting | GitHub Pages (rama `main`, raíz del repo) |
| DNS | Cloudflare (zona), NIC Chile (delegación) |

No hay `package.json`, gestor de dependencias ni CI. La ausencia es deliberada, no una omisión: ver [Diseño](diseno.md).

## Estructura de carpetas

```
.
├── index.html      # el sitio completo: marcado, estilos y script
├── favicon.svg     # marca (cabeza de oso) como icono de pestaña
├── CNAME           # dominio para GitHub Pages: lacuevadeloso.cl
├── .gitignore      # excluye capturas/
├── img/            # imágenes publicadas (capturas de trabajos + preview OG)
└── capturas/       # material privado, NO versionado (datos de clientes)
```

`capturas/` existe en disco pero está fuera de git a propósito: guarda capturas con datos reales de clientes que no deben publicarse.

## Componentes y responsabilidades

Todo vive en `index.html`, organizado en secciones autónomas:

| Sección | `id` | Responsabilidad |
|---|---|---|
| Cabecera | — | Marca (SVG inline) y navegación por anclas |
| Hero | — | Titular de resultado y los dos llamados a la acción |
| Principios | — | Tres compromisos comerciales |
| Servicios | `servicios` | Dos bloques: páginas/tiendas y automatizaciones |
| Trabajos | `trabajos` | Cuatro casos; los que tienen captura usan `<img class="work-shot">`, los que no, un patrón CSS |
| Cómo trabajo | — | Proceso en cuatro pasos |
| Cómo cobro | — | Modelo de cobro |
| Contacto | `contacto` | Correo (`mailto:`) y WhatsApp (`wa.me`) |

Los estilos se apoyan en **custom properties** definidas en `:root`, redefinidas dentro de `@media (prefers-color-scheme: dark)`. Cambiar la paleta completa es cambiar ese bloque.

## Flujo de una petición

No hay enrutamiento ni servidor de aplicación:

1. El navegador pide `lacuevadeloso.cl` → Cloudflare resuelve a las IPs de GitHub Pages.
2. GitHub Pages sirve `index.html` desde `main`, con el certificado emitido para el dominio del `CNAME`.
3. El HTML se pinta completo sin JavaScript. Las imágenes de `img/` cargan diferidas (`loading="lazy"`).
4. Si el visitante no pidió reducir movimiento, el script marca las secciones y las revela al entrar en pantalla vía `IntersectionObserver`.

La navegación interna es por anclas (`#servicios`, `#trabajos`, `#contacto`): no hay cambios de página.

## Límites e integraciones externas

El sitio **no consume ninguna API ni carga recursos de terceros**. Sus únicos vínculos son enlaces salientes que abre el visitante:

| Destino | Dónde | Notas |
|---|---|---|
| `costeador3d-production.up.railway.app/calculadora` | Trabajo 01 | Calculadora pública, sin login |
| `lacuevadeloso3d.cl` | Trabajo 02 | Tienda propia de impresiones 3D |
| `wa.me/56995087901` | Contacto | Con mensaje precargado |
| `mailto:` | Contacto | Correo directo |

El trabajo 03 (lista de precios) **no lleva enlace a propósito**: esa pantalla está protegida por PIN y es de un cliente.

## Decisiones arquitectónicas clave

- **Un solo archivo autocontenido** en vez de un proyecto con build.
- **Cero dependencias y cero recursos remotos**, incluidas las tipografías.
- **GitHub Pages en vez de Vercel**, aun teniendo el dominio en Vercel.
- **Mejora progresiva**: el sitio funciona íntegro con JavaScript desactivado.

El razonamiento y las alternativas descartadas están en [Diseño](diseno.md).
