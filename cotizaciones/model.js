(function (root) {
  'use strict';
  const fields = ['number','date','validUntil','issuer','email','phone','taxId','bank','client','clientContact','clientTaxId','project','objective','scope','deliverables','exclusions','timeline','payment','support','notes'];
  const categories = ['implementation','monthly','thirdParty'];
  const textDefaults = {
    web: ['Sitio web a medida', 'Diseño y desarrollo web', 'Diseño de la interfaz\nDesarrollo adaptable a dispositivos móviles\nPreparación para publicación'],
    automation: ['Automatización de procesos', 'Implementación de automatización', 'Definición del flujo\nConfiguración de integraciones acordadas\nPruebas y entrega'],
    mixed: ['Sitio web y automatización', 'Diseño y desarrollo web', 'Diseño y desarrollo del sitio\nImplementación del flujo de automatización\nPruebas y entrega conjunta']
  };
  function create(base = 'web') {
    const now = new Date();
    const date = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-');
    const data = Object.fromEntries(fields.map(k => [k, '']));
    Object.assign(data, {version:1, currency:'CLP', date, issuer:'La Cueva del Oso', email:'francisco.velasquez@lacuevadeloso.cl', phone:'+56 9 5714 1786', project:textDefaults[base][0], deliverables:textDefaults[base][2], taxMode:'pending', taxRate:0, items:[{description:textDefaults[base][1],category:'implementation',quantity:1,price:null,estimated:false}]});
    if (base === 'mixed') data.items.push({description:'Implementación de automatización',category:'implementation',quantity:1,price:null,estimated:false});
    return data;
  }
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
  }
  function validate(input) {
    if (!input || typeof input !== 'object' || input.version !== 1 || input.currency !== 'CLP') throw new Error('Archivo incompatible. Se requiere versión 1 y moneda CLP.');
    const data = {version:1,currency:'CLP'};
    for (const key of fields) {
      if (typeof input[key] !== 'string' || input[key].length > 20000) throw new Error('Campo inválido: '+key);
      data[key] = input[key];
    }
    for (const key of ['date','validUntil']) if (data[key] && !validDate(data[key])) throw new Error('Fecha inválida: '+key);
    if (!['pending','none','added','included'].includes(input.taxMode)) throw new Error('Modo de impuesto inválido.');
    if (typeof input.taxRate !== 'number' || !Number.isFinite(input.taxRate) || input.taxRate < 0 || input.taxRate > 100) throw new Error('La tasa debe estar entre 0 y 100.');
    Object.assign(data,{taxMode:input.taxMode,taxRate:input.taxRate});
    if (!Array.isArray(input.items) || input.items.length > 200) throw new Error('Se admiten hasta 200 servicios.');
    data.items = input.items.map(item => {
      if (!item || typeof item.description !== 'string' || item.description.length > 4000 || !categories.includes(item.category) || typeof item.estimated !== 'boolean') throw new Error('Servicio inválido.');
      if (typeof item.quantity !== 'number' || !Number.isFinite(item.quantity) || item.quantity <= 0 || item.quantity > 1000000) throw new Error('La cantidad debe ser positiva y hasta 1.000.000.');
      if (item.price !== null && (typeof item.price !== 'number' || !Number.isSafeInteger(item.price) || item.price < 0 || item.price > 1000000000)) throw new Error('El precio debe ser un número entero de pesos, entre 0 y 1.000.000.000.');
      return {description:item.description,category:item.category,quantity:item.quantity,price:item.price,estimated:item.estimated};
    });
    return data;
  }
  function totals(data, category) {
    const rows = data.items.filter(i => i.category === category && !i.estimated);
    const amount = rows.reduce((sum,i) => sum + (i.price === null ? 0 : Math.round(i.quantity * i.price)), 0);
    let net = amount, tax = 0;
    if (data.taxMode === 'added') tax = Math.round(net * data.taxRate / 100);
    if (data.taxMode === 'included') { net = Math.round(amount / (1 + data.taxRate / 100)); tax = amount - net; }
    return {net,tax,total:net+tax,incomplete:rows.some(i=>i.price===null)};
  }
  function ready(data) {
    validate(data);
    for (const key of ['number','date','client','project']) if (!data[key].trim()) throw new Error('Completa número, fecha, cliente y proyecto antes de imprimir.');
    if (data.validUntil && data.validUntil < data.date) throw new Error('La vigencia no puede ser anterior a la fecha de emisión.');
    if (data.taxMode === 'pending') throw new Error('Selecciona el tratamiento de impuestos antes de imprimir.');
    if (!data.items.length || data.items.some(i => !i.description.trim() || (!i.estimated && i.price === null))) throw new Error('Completa las descripciones y los precios confirmados.');
    return true;
  }
  const api = {fields,categories,create,validate,totals,ready};
  if (typeof module !== 'undefined') module.exports = api;
  else root.QuoteModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
