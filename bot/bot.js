/**
 * Motor del bot de La Cueva del Oso, Fase 1 (guiado, sin backend).
 *
 * Carga flujo.js, inyecta su propio CSS (consumiendo las variables del
 * sitio con fallback) y arma el botón flotante + panel de chat.
 * Vanilla JS puro: cero dependencias, cero CDN, cero build.
 *
 * Se enchufa con una sola línea por página:
 *   <script src="/bot/bot.js" defer></script>
 */
(function () {
  "use strict";

  var WHATSAPP_NUMERO = "56957141786";
  var RUTA_FLUJO = "/bot/flujo.js";

  function el(tag, attrs, hijos) {
    var nodo = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (clave) {
        if (clave === "texto") nodo.textContent = attrs[clave];
        else nodo.setAttribute(clave, attrs[clave]);
      });
    }
    (hijos || []).forEach(function (hijo) {
      if (hijo) nodo.appendChild(hijo);
    });
    return nodo;
  }

  function cargarFlujo(listo) {
    if (window.FLUJO_BOT) {
      listo();
      return;
    }
    var script = document.createElement("script");
    script.src = RUTA_FLUJO;
    script.onload = listo;
    // Si el guion no carga, el bot simplemente no aparece, sin errores visibles.
    document.head.appendChild(script);
  }

  function inyectarEstilos() {
    if (document.getElementById("cueva-bot-estilos")) return;
    var css =
      ".cueva-bot-flotante{position:fixed;right:20px;bottom:20px;z-index:1500;" +
      "background:var(--accent,#5266eb);color:var(--white,#fff);border:none;" +
      "border-radius:var(--r-pill,32px);padding:.75em 1.4em;cursor:pointer;" +
      "font-family:var(--font,inherit);font-size:var(--fs-body,1rem);font-weight:600;" +
      "box-shadow:0 4px 16px rgba(0,0,0,.35);" +
      "transition:transform 160ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "opacity 140ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "display 140ms allow-discrete;}" +
      ".cueva-bot-flotante:hover{opacity:.9;}" +
      // Feedback de presion: scale(.97) arrastra el texto del boton, que es
      // lo que hace que se lea como algo que se hunde.
      // Asimetrico a proposito: hundir es la respuesta a lo que el usuario
      // acaba de hacer y tiene que verse ya (100ms); volver es el sistema
      // soltando y puede ser mas suave (160ms, en la base de arriba).
      ".cueva-bot-flotante:active{transform:scale(.97);transition-duration:100ms;}" +
      ".cueva-bot-panel{position:fixed;right:20px;bottom:20px;z-index:1500;" +
      "width:min(360px,calc(100vw - 40px));max-height:min(560px,calc(100vh - 40px));" +
      "display:flex;flex-direction:column;overflow:hidden;" +
      "background:var(--card,#1e1e2a);color:var(--text,#ededf3);" +
      "border:1px solid var(--border-hair,rgba(226,227,237,.16));" +
      "border-radius:var(--r-card,12px);box-shadow:0 12px 40px rgba(0,0,0,.45);" +
      "font-family:var(--font,inherit);" +
      // El panel nace del boton flotante, que vive en la esquina inferior
      // derecha: por eso el origen ahi y no en el centro. Sin esto el panel
      // aparece de la nada en vez de salir de lo que el usuario apreto.
      "transform-origin:bottom right;opacity:1;scale:1;translate:0 0;" +
      "transition:opacity 260ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "scale 260ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "translate 260ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "display 260ms allow-discrete;}" +
      // El display de autor le gana al [hidden] del navegador: sin esta regla
      // el panel nunca se oculta y queda tapando el boton flotante.
      // `allow-discrete` arriba hace que ese display:none espere a que
      // termine la salida, asi el panel se va por donde entro.
      ".cueva-bot-panel[hidden],.cueva-bot-flotante[hidden]{display:none;}" +
      ".cueva-bot-panel[hidden]{opacity:0;scale:.96;translate:0 8px;}" +
      ".cueva-bot-flotante[hidden]{opacity:0;transition-delay:0ms;}" +
      // Sin esto el panel NO anima al entrar: viene de display:none, o sea
      // de no estar renderizado, y una transicion necesita un estado previo
      // del cual interpolar. `allow-discrete` arriba solo cubre la salida.
      "@starting-style{.cueva-bot-panel:not([hidden]){" +
      "opacity:0;scale:.96;translate:0 8px;}}" +
      "@starting-style{.cueva-bot-flotante:not([hidden]){opacity:0;}}" +
      // El boton y el panel viven en el mismo punto de la pantalla. Al cerrar,
      // el boton espera a que el panel se haya ido casi del todo en vez de
      // aparecer encima de su salida.
      // El orden sigue al de `transition` de arriba: transform, opacity,
      // display. El transform va en 0 porque es el feedback de presion y no
      // puede esperar a nada.
      ".cueva-bot-flotante{transition-delay:0ms,180ms,180ms;}" +
      ".cueva-bot-header{display:flex;align-items:center;justify-content:space-between;" +
      "padding:.9em 1em;border-bottom:1px solid var(--border-hair,rgba(226,227,237,.16));" +
      "font-weight:600;}" +
      ".cueva-bot-cerrar{background:transparent;border:none;color:var(--text-muted,#c3c3cc);" +
      "font-size:1.2rem;line-height:1;cursor:pointer;padding:.2em .5em;border-radius:6px;}" +
      ".cueva-bot-cerrar:hover{background:var(--button-2,#272735);color:var(--text,#ededf3);}" +
      ".cueva-bot-mensajes{flex:1;overflow-y:auto;padding:1em;display:flex;" +
      "flex-direction:column;gap:.6em;font-size:var(--fs-body,1rem);}" +
      ".cueva-bot-burbuja{max-width:85%;padding:.6em .9em;border-radius:var(--r-card,12px);" +
      "line-height:1.4;white-space:pre-line;" +
      // Corto a proposito: en una conversacion esto se ve muchas veces por
      // sesion, y a esa frecuencia el movimiento tiene que ser casi invisible.
      "transition:opacity 180ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "translate 180ms var(--ease,cubic-bezier(.16,1,.3,1));}" +
      "@starting-style{.cueva-bot-burbuja{opacity:0;translate:0 6px;}}" +
      ".cueva-bot-burbuja--bot{align-self:flex-start;background:var(--button-2,#272735);" +
      "color:var(--text,#ededf3);border-bottom-left-radius:4px;}" +
      ".cueva-bot-burbuja--usuario{align-self:flex-end;background:var(--accent,#5266eb);" +
      "color:var(--white,#fff);border-bottom-right-radius:4px;}" +
      ".cueva-bot-controles{padding:.75em 1em 1em;display:flex;flex-direction:column;gap:.5em;" +
      "border-top:1px solid var(--border-hair,rgba(226,227,237,.16));}" +
      ".cueva-bot-opcion{text-align:left;background:var(--button-2,#272735);" +
      "color:var(--text,#ededf3);border:1px solid var(--border-hair,rgba(226,227,237,.16));" +
      "border-radius:var(--r-pill,32px);padding:.55em 1em;cursor:pointer;" +
      "font-family:inherit;font-size:var(--fs-small,.875rem);" +
      // Las cuatro propiedades que cambia el :hover van juntas: si solo funde
      // el fondo, el texto y el borde saltan en el primer frame y el cambio
      // se lee peor que si no animara nada.
      "transition:transform 160ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "background-color 140ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "color 140ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "border-color 140ms var(--ease,cubic-bezier(.16,1,.3,1));}" +
      ".cueva-bot-opcion:hover{background:var(--accent,#5266eb);color:var(--white,#fff);" +
      "border-color:var(--accent,#5266eb);}" +
      ".cueva-bot-opcion:active{transform:scale(.97);transition-duration:100ms;}" +
      ".cueva-bot-captura{display:flex;gap:.5em;}" +
      ".cueva-bot-captura input{flex:1;min-width:0;background:var(--canvas,#171721);" +
      "color:var(--text,#ededf3);border:1px solid var(--border-strong,#70707d);" +
      "border-radius:var(--r-pill,32px);padding:.55em 1em;font-family:inherit;" +
      "font-size:var(--fs-small,.875rem);}" +
      ".cueva-bot-captura button{background:var(--accent,#5266eb);color:var(--white,#fff);" +
      "border:none;border-radius:var(--r-pill,32px);padding:.55em 1.1em;cursor:pointer;" +
      "font-family:inherit;font-size:var(--fs-small,.875rem);font-weight:600;}" +
      ".cueva-bot-resumen{list-style:none;margin:0 0 .75em;padding:.75em;" +
      "background:var(--canvas,#171721);border-radius:var(--r-card,12px);" +
      "font-size:var(--fs-small,.875rem);color:var(--text-muted,#c3c3cc);" +
      "display:flex;flex-direction:column;gap:.3em;}" +
      ".cueva-bot-primario{display:block;text-align:center;text-decoration:none;" +
      "background:var(--accent,#5266eb);color:var(--white,#fff);font-weight:600;" +
      "border-radius:var(--r-pill,32px);padding:.7em 1em;margin-bottom:.5em;" +
      "font-family:inherit;font-size:var(--fs-body,1rem);}" +
      ".cueva-bot-primario:hover{opacity:.9;}" +
      ".cueva-bot-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;" +
      "overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}" +
      ".cueva-bot-panel button:focus-visible,.cueva-bot-panel a:focus-visible," +
      ".cueva-bot-panel input:focus-visible,.cueva-bot-flotante:focus-visible{" +
      "outline:2px solid var(--text,#ededf3);outline-offset:2px;}" +
      // Movimiento reducido no es cero movimiento: se queda el cruce de
      // opacidad, que ayuda a entender que algo cambio, y se va todo lo que
      // se desplaza o escala.
      "@media (prefers-reduced-motion: reduce){" +
      ".cueva-bot-panel{scale:1;translate:0 0;" +
      "transition:opacity 200ms var(--ease,cubic-bezier(.16,1,.3,1))," +
      "display 200ms allow-discrete;}" +
      ".cueva-bot-panel[hidden]{scale:1;translate:0 0;}" +
      ".cueva-bot-burbuja{translate:0 0;transition:opacity 180ms " +
      "var(--ease,cubic-bezier(.16,1,.3,1));}" +
      "@starting-style{.cueva-bot-burbuja{translate:0 0;}}" +
      ".cueva-bot-flotante:active,.cueva-bot-opcion:active{transform:none;}}";
    var estilo = el("style", { id: "cueva-bot-estilos" });
    estilo.textContent = css;
    document.head.appendChild(estilo);
  }

  function construirDom() {
    var botonFlotante = el("button", {
      type: "button",
      class: "cueva-bot-flotante",
      "aria-haspopup": "dialog",
      "aria-label": "Abrir chat con el asistente de La Cueva del Oso",
      texto: "¿Hablamos?",
    });
    var botonCerrar = el("button", {
      type: "button",
      class: "cueva-bot-cerrar",
      "aria-label": "Cerrar chat",
      texto: "✕",
    });
    var header = el("div", { class: "cueva-bot-header" }, [
      el("strong", { texto: "Asistente · La Cueva del Oso" }),
      botonCerrar,
    ]);
    var mensajes = el("div", { class: "cueva-bot-mensajes", "aria-live": "polite" });
    var controles = el("div", { class: "cueva-bot-controles" });
    var panel = el(
      "div",
      {
        class: "cueva-bot-panel",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Chat con el asistente de La Cueva del Oso",
        hidden: "hidden",
      },
      [header, mensajes, controles]
    );
    document.body.appendChild(botonFlotante);
    document.body.appendChild(panel);
    return {
      botonFlotante: botonFlotante,
      botonCerrar: botonCerrar,
      panel: panel,
      mensajes: mensajes,
      controles: controles,
    };
  }

  function armarMensajeWhatsapp(campos, datos) {
    var lineas = ["Hola Francisco, vengo del bot de lacuevadeloso.cl.", ""];
    Object.keys(campos).forEach(function (campo) {
      if (datos[campo]) {
        lineas.push("· " + campos[campo] + ": " + datos[campo]);
      }
    });
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(lineas.join("\n"));
  }

  function iniciarBot(flujo) {
    var mapaNodos = {};
    flujo.nodos.forEach(function (nodo) {
      mapaNodos[nodo.id] = nodo;
    });

    var dom = construirDom();
    var estado = null;
    var elementoPrevio = null;

    // === PUNTO DE SWAP PARA FASE 2 (LLM) ===
    // Hoy: lee flujo.js y avanza el estado por guion fijo.
    // Fase 2: reemplazar el cuerpo por un fetch() al endpoint del VPS de
    // Preciario. La firma (nodoActual, estado, entrada) => {nodo} | {url}
    // no cambia; la UI, el estado y el handoff a WhatsApp tampoco.
    function responder(nodoActual, entrada) {
      if (entrada.tipo === "opcion") {
        var opcion = entrada.opcion;
        if (opcion.guarda) {
          estado.datos[opcion.guarda.campo] = opcion.guarda.valor;
        }
        if (opcion.url) {
          return { url: opcion.url };
        }
        estado.nodoId = opcion.siguiente;
        return { nodo: mapaNodos[estado.nodoId] };
      }
      estado.datos[nodoActual.captura.campo] = entrada.valor;
      estado.nodoId = nodoActual.captura.siguiente;
      return { nodo: mapaNodos[estado.nodoId] };
    }

    function agregarBurbuja(rol, texto) {
      dom.mensajes.appendChild(
        el("div", { class: "cueva-bot-burbuja cueva-bot-burbuja--" + rol, texto: texto })
      );
      dom.mensajes.scrollTop = dom.mensajes.scrollHeight;
    }

    function obtenerFocosables() {
      return Array.prototype.slice
        .call(dom.panel.querySelectorAll("button, a[href], input"))
        .filter(function (nodo) {
          return nodo.offsetParent !== null;
        });
    }

    function enfocarPrimerControl() {
      var focos = obtenerFocosables();
      (focos[0] || dom.botonCerrar).focus();
    }

    function manejarOpcion(opcion, nodoActual) {
      agregarBurbuja("usuario", opcion.texto);
      var resultado = responder(nodoActual, { tipo: "opcion", opcion: opcion });
      if (resultado.url) {
        var esExterna = /^https?:\/\//.test(resultado.url);
        if (esExterna) window.open(resultado.url, "_blank", "noopener");
        else window.location.assign(resultado.url);
        return;
      }
      mostrarNodo(resultado.nodo);
    }

    function renderOpciones(nodo) {
      nodo.opciones.forEach(function (opcion) {
        var boton = el("button", { type: "button", class: "cueva-bot-opcion", texto: opcion.texto });
        boton.addEventListener("click", function () {
          manejarOpcion(opcion, nodo);
        });
        dom.controles.appendChild(boton);
      });
    }

    function renderCaptura(nodo) {
      var idInput = "cueva-bot-input-" + nodo.id;
      var etiqueta = el("label", { class: "cueva-bot-sr", for: idInput, texto: nodo.mensaje[nodo.mensaje.length - 1] });
      var input = el("input", { type: "text", id: idInput, placeholder: nodo.captura.placeholder });
      var enviar = el("button", { type: "submit", texto: "Enviar" });
      var form = el("form", { class: "cueva-bot-captura" }, [etiqueta, input, enviar]);
      form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var valor = input.value.trim();
        if (!valor) {
          input.focus();
          return;
        }
        agregarBurbuja("usuario", valor);
        var resultado = responder(nodo, { tipo: "captura", valor: valor });
        mostrarNodo(resultado.nodo);
      });
      dom.controles.appendChild(form);
    }

    function renderFinal(nodo) {
      var resumen = el("ul", { class: "cueva-bot-resumen" });
      Object.keys(flujo.campos).forEach(function (campo) {
        if (estado.datos[campo]) {
          resumen.appendChild(el("li", { texto: flujo.campos[campo] + ": " + estado.datos[campo] }));
        }
      });
      dom.controles.appendChild(resumen);
      dom.controles.appendChild(
        el("a", {
          class: "cueva-bot-primario",
          href: armarMensajeWhatsapp(flujo.campos, estado.datos),
          target: "_blank",
          rel: "noopener",
          texto: "Enviársela a Francisco por WhatsApp",
        })
      );
    }

    function mostrarNodo(nodo) {
      nodo.mensaje.forEach(function (texto) {
        agregarBurbuja("bot", texto);
      });
      dom.controles.innerHTML = "";
      if (nodo.final) renderFinal(nodo);
      if (nodo.opciones) renderOpciones(nodo);
      if (nodo.captura) renderCaptura(nodo);
      enfocarPrimerControl();
    }

    function manejarTeclado(evento) {
      if (evento.key === "Escape") {
        cerrarPanel();
        return;
      }
      if (evento.key !== "Tab") return;
      var focos = obtenerFocosables();
      if (!focos.length) return;
      var primero = focos[0];
      var ultimo = focos[focos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    }

    function alternarInertFondo(activo) {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el === dom.panel || el === dom.botonFlotante) return;
        el.inert = activo;
      });
    }

    function abrirPanel() {
      elementoPrevio = document.activeElement;
      dom.botonFlotante.hidden = true;
      dom.panel.hidden = false;
      alternarInertFondo(true);
      document.addEventListener("keydown", manejarTeclado);
      if (!estado) {
        estado = { nodoId: flujo.inicioId, datos: {} };
        mostrarNodo(mapaNodos[estado.nodoId]);
      } else {
        enfocarPrimerControl();
      }
    }

    function cerrarPanel() {
      dom.panel.hidden = true;
      dom.botonFlotante.hidden = false;
      alternarInertFondo(false);
      document.removeEventListener("keydown", manejarTeclado);
      (elementoPrevio || dom.botonFlotante).focus();
    }

    dom.botonFlotante.addEventListener("click", abrirPanel);
    dom.botonCerrar.addEventListener("click", cerrarPanel);
  }

  function iniciar() {
    inyectarEstilos();
    cargarFlujo(function () {
      iniciarBot(window.FLUJO_BOT);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
