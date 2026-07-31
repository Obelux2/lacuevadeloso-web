# Plan

## Estado actual (2026-07-30)

El sitio está **construido y publicado en GitHub Pages**, pero **todavía no es visitable**: el `CNAME` apunta a `lacuevadeloso.cl` y ese dominio aún resuelve al sitio anterior mientras propagan los nameservers.

- Repositorio: `Obelux2/lacuevadeloso-web` (público, 3 commits)
- Pages: rama `main`, raíz, build en estado `built` sin errores
- DNS: nameservers ya cambiados en NIC Chile a Cloudflare; zona verificada contra el nameserver autoritativo

## Roadmap

### Fase 1 — Construcción ✅
- ✅ Nombre y posicionamiento definidos (webs primero, automatización como segundo acto)
- ✅ Landing completa: hero, principios, servicios, trabajos, proceso, cobro, contacto
- ✅ Identidad visual alineada con `lacuevadeloso3d.cl`
- ✅ Contraste AA verificado en ambos modos
- ✅ Marca (cabeza de oso) y favicon
- ✅ Datos de contacto reales (WhatsApp y correo)
- ✅ Metadatos Open Graph y canonical

### Fase 2 — Publicación 🔄
- ✅ Repositorio público y GitHub Pages activado
- ✅ Nameservers cambiados en NIC Chile a Cloudflare
- ✅ Zona DNS configurada: 4 registros A de Pages, `CNAME` de `www`, TXT de Search Console
- 🔄 **Propagación de los nameservers** — la delegación anterior tenía TTL de 86400, así que puede tardar hasta 24 h
- ⬜ Verificar que el sitio cargue en el dominio real, con imágenes y favicon
- ⬜ Activar **Enforce HTTPS** (el botón aparece recién cuando GitHub emite el certificado)
- ⬜ Quitar `lacuevadeloso.cl` del proyecto de Vercel de la tienda, para no dejarlo colgando

### Fase 3 — Contenido pendiente ⬜
- ⬜ Captura del trabajo 04 (rediseño de tienda de esencias florales)
- ⬜ Reemplazar la captura del trabajo 03 por una del **cliente demo** de `Lista de Precios (Template)`, con datos ficticios y **con enlace**
- ⬜ Decidir si se publican rangos de precio en "Cómo cobro"
- ⬜ Imagen Open Graph diseñada, en vez de la captura del hero

## Pendientes priorizados

1. **Validar el dominio** cuando propague, y activar HTTPS. Bloquea todo lo demás: hasta que resuelva, el sitio no existe para nadie.
2. **Arreglar el responsive móvil de `Lista de Precios (Template)`** antes de armar el demo. El template es copia del de la amasandería y arrastra el mismo defecto: a 390 px los nombres de producto se truncan a una o dos letras. El demo se compartirá por WhatsApp, o sea que se abrirá en teléfono.
3. **Armar el cliente demo** y enlazarlo desde el trabajo 03.
4. Completar la captura del trabajo 04.
5. Decidir sobre los precios públicos.

> TODO: definir cuál repositorio es el origen del arreglo responsive (`Lista de Precios (Template)` o el de la amasandería), para no parchar en paralelo.

## Riesgos y decisiones abiertas

- **Sin redirects.** Al pasar el dominio a este sitio, las URLs antiguas de producto quedan sin 301. Se aceptó: son 9 URLs y la tienda ya tiene su dominio propio y descriptivo.
- **La zona DNS salió de la cuenta compartida.** Estaba en una cuenta de Vercel con acceso de más gente; quien controla la zona controla a dónde apunta el dominio. Se resolvió cambiando los nameservers, pero **el TXT de Search Console hay que conservarlo**: ya está copiado en Cloudflare.
- **Dos trabajos sin captura real** debilitan la sección más persuasiva del sitio.
- **La marca paraguas está definida, el nombre de un producto no.** "La Cueva del Oso" es marca paraguas de la tienda 3D y de Costeador3D / PrintCave Manager, con este sitio como casa madre; la tienda de Etsy y la cuenta de Pinterest comparten el nombre pero son otro negocio y quedan fuera. Lo que sigue abierto es interno de Costeador3D, que muestra tres títulos públicos distintos en tres pantallas.
