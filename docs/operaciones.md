# Operaciones

## Requisitos y entornos

No hay variables de entorno, secretos ni configuración: el sitio es estático y todo lo que necesita está versionado.

| Necesidad | Para qué |
|---|---|
| Un navegador | Ver el sitio (basta abrir `index.html`) |
| Python 3 o cualquier servidor estático | Previsualizar rutas absolutas y el `favicon` como en producción |
| Git + `gh` | Publicar |
| Playwright *(opcional)* | Capturas con viewport fijo |

## Correr en local

Abrir `index.html` con doble clic funciona para revisar contenido. Para que las rutas se comporten como en producción:

```bash
cd E:/Proyectos/Web/LaCuevaDelOso
python -m http.server 8777
```

Y entrar a <http://localhost:8777>. El servidor cachea: si un cambio no aparece, agregar un parámetro a la URL (`?v=2`) o recargar forzado.

*(El sitio tiene un solo tema oscuro desde el rediseño Mercury; ya no hay modo claro que revisar por separado.)*

## Tests y CI

No hay suite de tests ni pipeline: no hay lógica que probar. La verificación es manual, en el navegador, y debe cubrir:

- Anchos de móvil, tablet y escritorio, sin desplazamiento horizontal
- Que todas las imágenes carguen
- Que los enlaces internos apunten a un `id` existente

Para capturas o pruebas responsive, usar **Playwright**, no el redimensionado del navegador:

```bash
npx playwright screenshot --viewport-size="390,844" --wait-for-timeout=5000 URL salida.png
```

## Despliegue

Automático: **cada `push` a `main` publica**. GitHub Pages sirve la raíz del repositorio.

```bash
git add -A
git commit -m "…"
git push origin main
```

El build tarda ~1 minuto. Para verificar sin abrir el navegador, **la fuente confiable es el workflow de Actions**, no la API antigua de builds:

```bash
gh run list --repo Obelux2/lacuevadeloso-web --limit 3   # workflow "pages build and deployment"
```

Después, confirmar el contenido con un fetch al dominio buscando un texto que solo exista en la versión nueva.

> ⚠️ `gh api …/pages/builds/latest` **queda rezagado**: el 2026-08-03 siguió reportando el commit anterior como "built" después de que Actions ya había desplegado el nuevo. No usarlo como señal de deploy.

> Mientras el `CNAME` esté puesto, `obelux2.github.io/lacuevadeloso-web` **redirige al dominio propio**. Es lo esperado, no un error.

## DNS y dominio

`lacuevadeloso.cl` está registrado a nombre de Francisco en **NIC Chile** desde el 2026-04-24. NIC solo delega; **la zona la administra Cloudflare**.

Configuración vigente:

```
NS (en NIC)   clint.ns.cloudflare.com · jamie.ns.cloudflare.com
A     @       185.199.108.153 · 185.199.109.153 · 185.199.110.153 · 185.199.111.153
CNAME www     obelux2.github.io
TXT   @       google-site-verification=dlzCajsENPGYk8eZtSRjuqMqm6KaL0FFDUQO5GLFtSk
```

**El proxy de Cloudflare debe quedar en "DNS only" (nube gris).** Con el proxy activo, GitHub no puede emitir el certificado y el sitio queda con error de SSL. Es el fallo más común de esta configuración.

El registro `_domainconnect` que Cloudflare crea solo no afecta al sitio: no sirve tráfico y su estado de proxy es indiferente.

## Runbook

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El dominio muestra el sitio anterior | Los nameservers no han propagado | `nslookup -type=NS lacuevadeloso.cl 8.8.8.8`. Si aún salen los antiguos, esperar: la delegación previa tenía TTL de 86400 |
| Error de certificado en el dominio | Proxy de Cloudflare activo (nube naranja) | Ponerlo en "DNS only" y esperar a que GitHub reemita |
| No aparece "Enforce HTTPS" en Settings → Pages | El certificado aún no se emite | Esperar; puede tardar hasta 24 h desde que el DNS resuelve |
| El certificado no sale tras >24 h con DNS correcto | La emisión quedó atascada en GitHub (pasó el 2026-08: 2.5 días sirviendo `*.github.io`) | Re-agregar el dominio custom para retriggerar: `echo '{"cname":null}' \| gh api -X PUT repos/Obelux2/lacuevadeloso-web/pages --input -`, luego lo mismo con `"cname":"lacuevadeloso.cl"`. El cert salió en <1 h. Después activar Enforce: `echo '{"https_enforced":true}' \| gh api -X PUT …/pages --input -` |
| Un cambio no se ve en producción | Build sin terminar, o caché | `gh run list` (workflow de Pages); recargar forzado. No fiarse de `pages/builds/latest` |
| Un cambio no se ve en local | Caché del servidor de pruebas | Agregar `?v=N` a la URL |
| Una imagen no carga | Ruta o archivo no versionado | `git ls-files img/` — si no aparece, revisar `.gitignore` |

## Verificar la zona antes de que propague

Se puede leer la zona de Cloudflare sin esperar la propagación, preguntándole directo al nameserver:

```bash
nslookup -type=A lacuevadeloso.cl clint.ns.cloudflare.com
nslookup -type=CNAME www.lacuevadeloso.cl clint.ns.cloudflare.com
```

Si ahí ya salen las IPs de GitHub, la configuración está bien y solo falta esperar.

## Material privado

`capturas/` está en `.gitignore` y guarda imágenes con datos reales de clientes (el panel de administración de la amasandería y la evidencia de un defecto). **No debe publicarse.** Antes de mover algo de `capturas/` a `img/`, revisar que no exponga costos, proveedores ni datos identificables.
