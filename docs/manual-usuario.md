# Manual de usuario

Este sitio tiene dos clases de usuario: **quien lo visita** (un dueño de negocio buscando quién le haga la página) y **quien lo mantiene** (Francisco). Esta guía cubre a ambos.

## Para el visitante

### Qué va a encontrar

Una sola página, que se recorre de arriba abajo. El menú superior lleva a tres puntos: **Servicios**, **Trabajos** y **Contacto**. No hay más páginas ni registros: nada que instalar, nada que crear.

### Recorrido

1. **Portada.** Qué se ofrece en una frase: páginas web para negocios chicos y automatización del trabajo repetitivo.
2. **Cómo pienso esto.** Tres compromisos: no se vende lo que no se necesita, el precio se cierra antes de partir, y el sitio queda editable por su dueño.
3. **Qué hago.** Dos columnas. La izquierda, páginas y tiendas (sitio nuevo, rediseño, tiendas, catálogos de precios). La derecha, automatizaciones (agente de voz que contesta el teléfono, presupuestos automáticos, listas de precios que se recalculan, pedidos de WhatsApp a planilla o CRM).
4. **Trabajos.** Cuatro proyectos, presentados con la idea de "banco de pruebas": lo que se ofrece, primero lo usa Francisco en sus propios negocios. Dos son visitables — la calculadora de Costeador 3D y la tienda de impresiones 3D, en pestaña nueva. El tercero (lista de precios de panadería) se muestra solo como imagen porque es de un cliente y está protegido con clave. El cuarto está en curso y aún no tiene captura.
5. **Cómo trabajo.** Cuatro pasos, de la conversación inicial a la entrega.
6. **Cómo cobro.** Presupuesto cerrado por proyecto, sin mensualidad obligatoria y con mantención opcional.
7. **Contacto.** Correo y WhatsApp. El botón de WhatsApp abre la conversación con un mensaje ya escrito.

### Cómo contactar

Cualquiera de los dos botones de la portada lleva al final de la página. Ahí:

- **Correo:** abre el programa de correo con la dirección puesta.
- **WhatsApp:** abre el chat con el mensaje "Hola Francisco, te escribo desde lacuevadeloso.cl" listo para enviar.

No hay formulario que llenar ni datos que dejar.

### Accesibilidad y preferencias

- El sitio tiene **un solo tema, oscuro** (desde el rediseño Mercury): se ve igual en cualquier configuración del dispositivo.
- Si el sistema pide **reducir movimiento**, no hay ninguna animación.
- Funciona **con JavaScript desactivado**: se ve todo el contenido igual.
- Se navega entero con el teclado, con el foco siempre visible.

## Para quien mantiene el sitio

### Cambiar un texto

Todos los textos están en `index.html`. Se busca la frase y se edita. No hay compilación: guardar el archivo y publicar el cambio es todo.

### Cambiar un dato de contacto

- **WhatsApp:** aparece dos veces en la sección de contacto — en el `href` (`https://wa.me/<número>`) y en el texto visible. Hay que cambiar ambos.
- **Correo:** igual, en el `mailto:` y en el texto.

### Agregar o cambiar un trabajo

Cada caso es un `<li class="work-item">` dentro de `<ol class="work-list">`. Copiar uno existente y ajustar. Al agregar o quitar, **renumerar los `work-num`** (01, 02, 03…), que están escritos a mano.

Para poner una captura donde hoy hay un patrón geométrico, se reemplaza el `<div class="work-pattern …">` por una etiqueta `<img class="work-shot" …>` copiando el formato de las que ya la tienen: ruta, `width`, `height`, `loading` y un `alt` que describa la imagen.

### Qué falta por completar

Los pendientes de contenido viven en [Plan](plan.md), fase 4: la captura del trabajo 04, el demo enlazable del trabajo 03, los rangos de precio y la imagen OG diseñada. (Ya no hay comentarios `PLACEHOLDER` en el HTML.)

### Reglas que conviene no romper

- **No inventar cifras, testimonios ni logos de clientes.** El sitio se construyó con esa regla y es lo que lo hace creíble.
- **No enlazar el trabajo 03**: esa pantalla es de un cliente y está protegida con PIN.
- **No agregar más recursos externos.** La única excepción vigente es la tipografía Inter desde Google Fonts (decisión del rediseño Mercury); cualquier otro tercero (CDN, imágenes remotas, scripts) rompería la carga rápida.
