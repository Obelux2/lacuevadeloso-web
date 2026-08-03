# Diseño

## Decisiones de diseño

El sitio pasó por dos diseños: uno editorial claro/oscuro con serif y cero recursos remotos (2026-07), y el **rediseño Mercury** vigente (commit `e5f882a`, 2026-08-02): canvas oscuro único, un solo acento, Inter. Las decisiones vigentes:

| Decisión | Razón | Alternativa descartada |
|---|---|---|
| Un solo `index.html` autocontenido | Una landing de servicios no justifica un pipeline. Sin build no hay nada que se rompa entre el código y lo publicado. | Proyecto con framework y bundler |
| Estilo Mercury: canvas ónix único, **sin modo claro** | El look oscuro formal es la preferencia declarada de Francisco (demo elegida sobre la variante editorial crema) y calza con la metáfora de la cueva. Un solo tema = la mitad de superficie que mantener. | Doble tema claro/oscuro del diseño anterior |
| **Un solo acento** (cobalto `#5266eb`), reservado al CTA primario | Jerarquía inequívoca: lo único azul de la página es el botón que importa. | Acento aplicado a links, tags y bordes |
| **Inter variable desde Google Fonts** | Consistencia con el estilo Mercury de referencia. Revierte la prohibición de webfonts del brief original: se aceptó **una** dependencia externa, con `preconnect` y fallback al stack del sistema. | Font stacks del sistema (diseño anterior) |
| Botones píldora, cards de radio 12 px, hairlines en vez de bordes fuertes | Lenguaje visual Mercury; sin sombras difusas, la profundidad la dan los tres niveles de gris (ónix/grafito/obsidiana). | Estética de imprenta del diseño anterior (radios 0–2 px) |
| Sello del oso como fondo fantasma del hero (opacidad 8 %) | Marca presente sin competir con el titular; el mismo sello sirve de identidad en `brand/`. | Hero con foto o ilustración protagonista |
| GitHub Pages en vez de Vercel | Coherente con los otros sitios de Francisco y con el repo versionado. Se aceptó perder los redirects 301 configurables. | Vercel — habría conservado el `vercel.json`, pero exigía mover el dominio entre cuentas |
| Movimiento mínimo, solo un reveal al entrar en pantalla | Un sitio de servicios se lee, no se recorre. | Parallax, contadores animados, carruseles |

## Reglas de contenido (tan vinculantes como las de código)

Estas reglas nacieron del encargo y explican bastante del contenido actual:

- **Cero métricas inventadas.** Nada de "+40 % de conversión" ni "50 proyectos". Lo que no se puede verificar, no se publica. La única cifra del sitio ("actualizar precios pasó de una vez al mes a 20 minutos al día", trabajo 03) es **observación real de la operación de la amasandería** (2026-08: llegan 10–15 facturas a la semana), no estimación.
- **Sin testimonios ni logos de clientes.** No existen todavía; fabricarlos sería mentir.
- **Los casos se describen por lo que hacen**, no por resultados no medidos.
- **Lo que falta se marca como `PLACEHOLDER`** en un comentario HTML, para que sea evidente al editar.
- **Los tres principios son verdad documentada**: salen de propuestas comerciales reales de Francisco, no son copy inventada.
- Un caso se retiró por esta regla: había un "agente de voz para clínica" que **no existe** — estaba planificado, no entregado.

## Patrones y convenciones

- **Tokens en `:root`**: paleta Mercury con nombres semánticos (`--canvas`, `--card`, `--accent`…), espaciado (`--sp-1`…`--sp-3`, `--sp-section`) y escala tipográfica (`--fs-*`) con `clamp()`. Nada de valores sueltos en las reglas.
- **Móvil primero**, con puntos de quiebre por sección: `560px` (barra superior), `720px` (sello del hero), `780px` (principios, pasos, contacto) y `860px` (servicios y trabajos a dos columnas).
- **Mejora progresiva en el reveal**: las secciones `.reveal` son visibles por CSS; el JavaScript *añade* el estado oculto solo si el visitante no pidió reducir movimiento. Sin JS, o con `prefers-reduced-motion`, se ve todo.
- **Accesibilidad**: un solo `<h1>`, `:focus-visible` en todo lo interactivo, áreas táctiles ≥44 px, `aria-label` donde el texto del enlace no basta, y enlace para saltar al contenido.
- **Imágenes**: `width`/`height` explícitos para reservar espacio, `loading="lazy"`, `decoding="async"` y `alt` descriptivo.

## Contraste verificado

Medido con la fórmula WCAG de luminancia relativa sobre la paleta Mercury vigente (2026-08-03), no estimado a ojo:

| Par | Ratio |
|---|---|
| Texto principal `#ededf3` / canvas `#171721` | 15,25:1 |
| Texto secundario `#c3c3cc` / canvas `#171721` | 10,16:1 |
| Texto secundario `#c3c3cc` / card `#1e1e2a` | 9,42:1 |
| Blanco / acento cobalto `#5266eb` (CTA primario) | 4,71:1 |

Todos superan el 4,5:1 exigido por AA. El par más justo es el texto del CTA sobre cobalto — si se oscurece el acento, hay que volver a medir.

## Modelo de datos

No aplica: el sitio no tiene estado ni persistencia. El contenido está escrito en el marcado.

## Trade-offs conocidos y deuda técnica

- **Sin redirects 301.** GitHub Pages no los soporta. Las URLs antiguas de producto de `lacuevadeloso.cl` (9 en el sitemap de la tienda) quedarán sin redirigir. Se asumió a cambio de la simplicidad; el `vercel.json` que los implementaba se eliminó.
- **Contenido incrustado en el marcado.** Cambiar un texto es editar HTML. Correcto mientras lo mantenga quien lo escribió; deja de serlo si el sitio crece o lo edita otra persona.
- **Google Fonts es un tercero.** Aporta consistencia tipográfica a cambio de una petición externa (privacidad + posible FOUT). Mitigado con `preconnect` y fallback al sistema; no sumar más recursos remotos.
- **Un trabajo sin captura** (04, rediseño en curso). Muestra un patrón geométrico. Es honesto pero rinde menos que una imagen real.
- **La captura del trabajo 03 lleva el nombre del negocio difuminado**, a pedido del cliente, y desde 2026-08-03 la bajada explica por qué la lista mezcla panadería e impresión 3D (revisión externa detectó que sin contexto parecía error de IA). Sigue previsto reemplazarla por una captura de un cliente demo con datos ficticios.
- **La imagen OG es una captura del propio hero** (regenerada con el rediseño). Cumple, pero no es una pieza diseñada para compartir.
