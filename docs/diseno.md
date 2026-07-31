# Diseño

## Decisiones de diseño

| Decisión | Razón | Alternativa descartada |
|---|---|---|
| Un solo `index.html` autocontenido | Una landing de servicios no justifica un pipeline. Sin build no hay nada que se rompa entre el código y lo publicado. | Proyecto con framework y bundler |
| Cero dependencias y cero recursos remotos | Carga rápida, sin terceros rastreando visitantes, nada que caducar. | CDN de fuentes o de CSS |
| Tipografías del sistema (Georgia y afines) | Evita el aspecto genérico de las fuentes web más usadas y no cuesta ni un byte de descarga. | Inter u otra webfont — **explícitamente prohibida** en el brief |
| Paleta tomada del CSS real de `lacuevadeloso3d.cl` | Los tres sitios de la marca se leen como familia. Los valores se extrajeron del sitio en producción, no se eligieron a ojo. | Paleta nueva e independiente (era el acento óxido inicial) |
| Serif en los titulares | Diferencia el sitio de servicios de la tienda, que usa sans, sin romper la familia cromática. | Misma tipografía que la tienda |
| Grano de papel con `feTurbulence` inline | Quita el aspecto plano de una página generada; cuesta un data-URI y ningún archivo. | Textura como imagen de fondo |
| Bordes sólidos de 1px, radios de 0–2px | Estética de imprenta. **Sin sombras difusas**, que son la marca de agua del diseño por defecto. | Tarjetas flotantes con `box-shadow` |
| GitHub Pages en vez de Vercel | Coherente con los otros sitios de Francisco y con el repo versionado. Se aceptó perder los redirects 301 configurables. | Vercel — habría conservado el `vercel.json`, pero exigía mover el dominio entre cuentas |
| Modo oscuro como "cueva", no como negativo | Ambos modos se diseñaron aparte; el oscuro usa la familia de oscuros de la tienda. | Invertir los colores del modo claro |
| Movimiento mínimo, solo un reveal al entrar en pantalla | Un sitio de servicios se lee, no se recorre. | Parallax, contadores animados, carruseles |

## Reglas de contenido (tan vinculantes como las de código)

Estas reglas nacieron del encargo y explican bastante del contenido actual:

- **Cero métricas inventadas.** Nada de "+40 % de conversión" ni "50 proyectos". Lo que no se puede verificar, no se publica.
- **Sin testimonios ni logos de clientes.** No existen todavía; fabricarlos sería mentir.
- **Los casos se describen por lo que hacen**, no por resultados no medidos.
- **Lo que falta se marca como `PLACEHOLDER`** en un comentario HTML, para que sea evidente al editar.
- **Los tres principios son verdad documentada**: salen de propuestas comerciales reales de Francisco, no son copy inventada.
- Un caso se retiró por esta regla: había un "agente de voz para clínica" que **no existe** — estaba planificado, no entregado.

## Patrones y convenciones

- **Tokens en `:root`**: colores, escala de espaciado (`--sp-1`…`--sp-6`) y tipográfica (`--fs-*`) con `clamp()`. Nada de valores sueltos en las reglas.
- **Móvil primero**, con un único punto de quiebre relevante en `700px` (los trabajos pasan a dos columnas alternadas) y ajustes bajo `480px` para la barra superior.
- **Mejora progresiva en el reveal**: las secciones `.reveal` son visibles por CSS; el JavaScript *añade* el estado oculto solo si el visitante no pidió reducir movimiento. Sin JS, o con `prefers-reduced-motion`, se ve todo.
- **Accesibilidad**: un solo `<h1>`, `:focus-visible` en todo lo interactivo, áreas táctiles ≥44 px, `aria-label` donde el texto del enlace no basta, y enlace para saltar al contenido.
- **Imágenes**: `width`/`height` explícitos para reservar espacio, `loading="lazy"`, `decoding="async"` y `alt` descriptivo.

## Contraste verificado

Medido con la fórmula WCAG de luminancia relativa, no estimado a ojo:

| Par | Claro | Oscuro |
|---|---|---|
| Texto principal / fondo | 15,83:1 | 15,83:1 |
| Texto secundario / fondo | 6,17:1 | 8,30:1 |
| Acento / fondo | 6,12:1 | 7,23:1 |

Todos superan el 4,5:1 exigido por AA. El acento del modo oscuro se aclaró a `#84b471` justamente para sostener esa cifra.

## Modelo de datos

No aplica: el sitio no tiene estado ni persistencia. El contenido está escrito en el marcado.

## Trade-offs conocidos y deuda técnica

- **Sin redirects 301.** GitHub Pages no los soporta. Las URLs antiguas de producto de `lacuevadeloso.cl` (9 en el sitemap de la tienda) quedarán sin redirigir. Se asumió a cambio de la simplicidad; el `vercel.json` que los implementaba se eliminó.
- **Contenido incrustado en el marcado.** Cambiar un texto es editar HTML. Correcto mientras lo mantenga quien lo escribió; deja de serlo si el sitio crece o lo edita otra persona.
- **Dos trabajos sin captura.** Muestran un patrón geométrico. Es honesto pero rinde menos que una imagen real.
- **La captura del trabajo 03 lleva el nombre del negocio difuminado**, a pedido del cliente. Es una solución de parche: lo previsto es reemplazarla por una captura de un cliente demo con datos ficticios.
- **La imagen OG es una captura del propio hero.** Cumple, pero no es una pieza diseñada para compartir.
