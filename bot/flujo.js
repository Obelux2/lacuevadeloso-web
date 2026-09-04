/**
 * Guion del bot de La Cueva del Oso, Fase 1 (guiado, sin backend).
 *
 * Contenido puro: nodos, copy y opciones. Editable sin tocar bot.js.
 * Se carga tanto en el navegador (window.FLUJO_BOT) como en Node
 * (module.exports), para que bot/test-flujo.js pueda importarlo.
 *
 * Esquema de nodo:
 *   {
 *     id: 'identificador-unico',
 *     mensaje: ['burbuja 1', 'burbuja 2'],
 *     opciones: [{ texto, siguiente|url, guarda? }],  // excluyente con captura
 *     captura: { campo, placeholder, siguiente },     // excluyente con opciones
 *     final: true                                     // dispara resumen + WhatsApp
 *   }
 */
(function (global) {
  "use strict";

  var NODOS = [
    {
      id: "inicio",
      mensaje: [
        "Hola 👋 Soy el asistente de La Cueva del Oso.",
        "Y sí, soy un bot, de los que Francisco construye. Cuéntame qué te trae por acá.",
      ],
      opciones: [
        { texto: "Quiero cotizar algo", siguiente: "necesidad" },
        { texto: "Tengo una duda", siguiente: "faq" },
        { texto: "Solo estoy mirando", siguiente: "mirando" },
      ],
    },
    {
      id: "necesidad",
      mensaje: ["Bien. ¿Qué necesitas?"],
      opciones: [
        { texto: "Un sitio nuevo", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Sitio nuevo" } },
        { texto: "Rediseñar el que tengo", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Rediseño" } },
        { texto: "Una tienda online", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Tienda online" } },
        { texto: "Que mi negocio se atienda solo", siguiente: "necesidad_auto" },
        { texto: "Otra cosa", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Otra cosa (por conversar)" } },
      ],
    },
    {
      id: "necesidad_auto",
      mensaje: ["Esa es mi parte favorita. ¿Cuál de estas se parece más a lo tuyo?"],
      opciones: [
        { texto: "Que alguien conteste las consultas por mí", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Automatización: atención de consultas" } },
        { texto: "Que los presupuestos se armen solos", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Automatización: presupuestos" } },
        { texto: "Que la lista de precios se recalcule sola", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Automatización: lista de precios" } },
        { texto: "Que los pedidos de WhatsApp lleguen ordenados", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Automatización: pedidos a planilla/CRM" } },
        { texto: "Algo parecido, pero no exactamente", siguiente: "plazo", guarda: { campo: "necesidad", valor: "Automatización: por definir" } },
      ],
    },
    {
      id: "plazo",
      mensaje: ["¿Para cuándo lo necesitas?"],
      opciones: [
        { texto: "Ya, es urgente", siguiente: "tramo", guarda: { campo: "plazo", valor: "Urgente" } },
        { texto: "Este mes", siguiente: "tramo", guarda: { campo: "plazo", valor: "Este mes" } },
        { texto: "En los próximos meses", siguiente: "tramo", guarda: { campo: "plazo", valor: "Próximos meses" } },
        { texto: "Todavía estoy explorando", siguiente: "tramo", guarda: { campo: "plazo", valor: "Explorando" } },
      ],
    },
    {
      id: "tramo",
      mensaje: [
        "Francisco cobra presupuesto cerrado por proyecto, sin mensualidad obligatoria.",
        "Para no hacerte perder el tiempo: ¿en qué tramo estabas pensando invertir?",
      ],
      opciones: [
        { texto: "Menos de $300.000", siguiente: "contacto", guarda: { campo: "tramo", valor: "Menos de $300k" } },
        { texto: "Entre $300.000 y $1.000.000", siguiente: "contacto", guarda: { campo: "tramo", valor: "$300k–$1M" } },
        { texto: "Más de $1.000.000", siguiente: "contacto", guarda: { campo: "tramo", valor: "Más de $1M" } },
        { texto: "No tengo idea todavía", siguiente: "contacto", guarda: { campo: "tramo", valor: "Por definir" } },
      ],
    },
    {
      id: "contacto",
      mensaje: ["Última cosa y te dejo tranquilo: ¿cómo te llamas y cuál es tu negocio?"],
      captura: { campo: "contacto", placeholder: "Juan, Panadería San Juan", siguiente: "cierre" },
    },
    {
      id: "cierre",
      mensaje: [
        "Listo. Con esto Francisco ya sabe de qué se trata antes de saludarte.",
        "Aprieta abajo y le llega todo escrito, no tienes que repetir nada.",
      ],
      opciones: [{ texto: "Empezar de nuevo", siguiente: "inicio" }],
      final: true,
    },
    {
      id: "faq",
      mensaje: ["Dispara. ¿Qué quieres saber?"],
      opciones: [
        { texto: "¿Cómo cobras?", siguiente: "faq_cobro" },
        { texto: "¿Cuánto se demora?", siguiente: "faq_plazos" },
        { texto: "¿El trabajo queda mío?", siguiente: "faq_propiedad" },
        { texto: "¿Y después quién lo mantiene?", siguiente: "faq_mantencion" },
        { texto: "¿Quién es Francisco?", siguiente: "faq_quien" },
        { texto: "¿Esto es un bot de verdad?", siguiente: "faq_bot" },
        { texto: "Mejor coticemos", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_cobro",
      mensaje: [
        "Presupuesto cerrado por proyecto, no por hora. Sabes el número antes de que empiece.",
        "Sin mensualidad obligatoria y sin letra chica.",
      ],
      opciones: [
        { texto: "Otra duda", siguiente: "faq" },
        { texto: "Quiero cotizar", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_plazos",
      mensaje: [
        "Días, no meses. Francisco trabaja de a un proyecto y no le gusta tener a nadie esperando.",
        "El plazo exacto va en el presupuesto, cerrado igual que el precio.",
      ],
      opciones: [
        { texto: "Otra duda", siguiente: "faq" },
        { texto: "Quiero cotizar", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_propiedad",
      mensaje: [
        "Queda funcionando y queda tuyo. El código, el dominio, las cuentas: todo a tu nombre.",
        "Nada de quedar amarrado a quien te lo hizo.",
      ],
      opciones: [
        { texto: "Otra duda", siguiente: "faq" },
        { texto: "Quiero cotizar", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_mantencion",
      mensaje: [
        "Puedes mantenerlo tú, porque queda tuyo.",
        "Si prefieres que Francisco se haga cargo, es un acuerdo aparte que decides después, nunca una condición para empezar.",
      ],
      opciones: [
        { texto: "Otra duda", siguiente: "faq" },
        { texto: "Quiero cotizar", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_quien",
      mensaje: [
        "Le dicen Oso. Viene de una familia de panaderos y la amasandería de sus padres fue la primera pyme que digitalizó.",
        "Antes de eso, casi 20 años construyendo sistemas para bancos y grandes retails, la mayor parte como líder técnico.",
        "Hoy esa experiencia trabaja para pymes que ya funcionan y merecen que se note.",
      ],
      opciones: [
        { texto: "Ver trabajos", url: "/portafolio.html" },
        { texto: "Quiero cotizar", siguiente: "necesidad" },
      ],
    },
    {
      id: "faq_bot",
      mensaje: [
        "Sí, y de los baratos: no tengo servidor ni cobro por mensaje. Soy un guion bien escrito.",
        "Justamente eso es lo que Francisco te vende: que tu negocio conteste solo, sin que pagues una fortuna por ello.",
        "Si esto te sirvió, imagina uno hecho a la medida de tu negocio.",
      ],
      opciones: [
        { texto: "Quiero uno así", siguiente: "necesidad" },
        { texto: "Otra duda", siguiente: "faq" },
      ],
    },
    {
      id: "mirando",
      mensaje: [
        "Dale, mira tranquilo. Si algo te hace sentido, acá estoy.",
        "Los trabajos están en el portafolio: cada uno con capturas de cómo quedó.",
      ],
      opciones: [
        { texto: "Ver el portafolio", url: "/portafolio.html" },
        { texto: "Mejor pregunto algo", siguiente: "faq" },
      ],
    },
  ];

  var FLUJO = {
    inicioId: "inicio",
    nodos: NODOS,
    // Orden y etiqueta de cada campo capturado, tal como va en el mensaje de WhatsApp.
    campos: {
      necesidad: "Necesito",
      plazo: "Plazo",
      tramo: "Inversión",
      contacto: "Quién",
    },
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = FLUJO;
  }
  if (typeof global !== "undefined") {
    global.FLUJO_BOT = FLUJO;
  }
})(typeof window !== "undefined" ? window : this);
