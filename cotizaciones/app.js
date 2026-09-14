'use strict';
const M = window.QuoteModel;
let data = M.create();
let dirty = false;
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(value);
const categoryNames = {implementation:'Implementación · pago único',monthly:'Servicios mensuales',thirdParty:'Costos de terceros · presupuesto separado'};
const labels = {number:'Número de cotización',date:'Fecha de emisión',validUntil:'Válida hasta',issuer:'Nombre comercial / emisor',email:'Correo de contacto',phone:'Teléfono',taxId:'Datos tributarios del emisor',bank:'Datos para pago',client:'Empresa o nombre del cliente',clientContact:'Contacto del cliente',clientTaxId:'Datos tributarios del cliente',project:'Nombre del proyecto',objective:'Objetivo',scope:'Alcance incluido',deliverables:'Entregables',exclusions:'Exclusiones',timeline:'Plazo y condiciones de inicio',payment:'Forma e hitos de pago',support:'Soporte incluido',notes:'Observaciones'};
const longFields = ['bank','objective','scope','deliverables','exclusions','timeline','payment','support','notes'];
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function message(text, error = false) { $('status').textContent = text; $('status').classList.toggle('error',error); }
function changed() { dirty = true; render(); }
function select(options, value, change) {
  const node = el('select');
  for (const [key,label] of options) { const option = el('option',label); option.value = key; node.append(option); }
  node.value = value;
  node.addEventListener('change',()=>change(node.value));
  return node;
}
function wrap(label, input) { const node = el('label',label); node.append(input); return node; }
function inputFor(key) {
  const node = el(longFields.includes(key) ? 'textarea' : 'input');
  if (node.tagName === 'INPUT') node.type = ['date','validUntil'].includes(key) ? 'date' : 'text';
  else node.rows = 3;
  node.value = data[key]; node.name = key; node.maxLength = 20000;
  node.addEventListener('input',()=>{data[key]=node.value; changed();});
  return wrap(labels[key],node);
}
function buildEditor() {
  const form = $('form'); form.replaceChildren();
  const groups = [ ['Documento',['number','date','validUntil']], ['Tu negocio',['issuer','email','phone','taxId']], ['Cliente y proyecto',['client','clientContact','clientTaxId','project','objective']], ['Alcance y entrega',['scope','deliverables','exclusions']], ['Condiciones',['timeline','payment','support','bank','notes']] ];
  for (const [title,keys] of groups) {
    const details = el('details'); details.open = ['Documento','Cliente y proyecto'].includes(title);
    details.append(el('summary',title));
    for (const key of keys) details.append(inputFor(key));
    form.append(details);
  }
  const pricing = el('section',undefined,'pricing-editor'); pricing.append(el('h3','Servicios e inversión'));
  pricing.append(wrap('Tratamiento de impuestos',select([['pending','Selecciona una opción'],['none','Sin impuesto agregado'],['added','Impuesto adicional al precio'],['included','Impuesto incluido en el precio']],data.taxMode,value=>{data.taxMode=value; changed(); buildEditor();})));
  if (['added','included'].includes(data.taxMode)) {
    const rate = el('input'); rate.type='number'; rate.min='0'; rate.max='100'; rate.step='0.01'; rate.value=data.taxRate;
    rate.addEventListener('input',()=>{data.taxRate=rate.value === '' ? NaN : Number(rate.value);changed();});
    pricing.append(wrap('Tasa de impuesto (%)',rate));
  }
  pricing.append(el('p','Los pagos únicos, mensuales y de terceros se calculan por separado. En terceros, indica la periodicidad en la descripción.','hint'));
  data.items.forEach((item,index)=>{
    const card = el('fieldset',undefined,'item-editor'); card.append(el('legend',`Servicio ${index+1}`));
    const description = el('textarea'); description.rows=2; description.maxLength=4000; description.value=item.description;
    description.addEventListener('input',()=>{item.description=description.value;changed();});
    card.append(wrap('Descripción',description));
    card.append(wrap('Tipo de cobro',select(Object.entries(categoryNames),item.category,value=>{item.category=value;changed();})));
    const row=el('div',undefined,'two-fields');
    for (const [key,label] of [['quantity','Cantidad'],['price','Precio unitario CLP']]) {
      const input=el('input'); input.type='number';input.min=key==='quantity'?'0.001':'0';input.max=key==='quantity'?'1000000':'1000000000';input.step=key==='quantity'?'any':'1';input.value=item[key]??'';input.placeholder=key==='price'?'Por definir':'';
      input.addEventListener('input',()=>{item[key]=input.value===''?(key==='price'?null:NaN):Number(input.value);changed();});
      row.append(wrap(label,input));
    }
    card.append(row);
    const check=el('input');check.type='checkbox';check.checked=item.estimated;
    check.addEventListener('change',()=>{item.estimated=check.checked;changed();});
    const label=wrap('Estimación / variable (no sumar al total)',check);label.className='checkbox';card.append(label);
    const remove=el('button','Quitar servicio','remove');remove.type='button';remove.addEventListener('click',()=>{data.items.splice(index,1);changed();buildEditor();});card.append(remove);pricing.append(card);
  });
  const add=el('button','+ Agregar servicio');add.type='button';add.addEventListener('click',()=>{if(data.items.length>=200)return message('Máximo 200 servicios.',true);data.items.push({description:'',category:'implementation',quantity:1,price:null,estimated:false});changed();buildEditor();});pricing.append(add);form.append(pricing);
}
function paragraphSection(parent,title,text) {
  if (!text.trim()) return;
  const section=el('section',undefined,'text-section');section.append(el('h3',title),el('p',text));parent.append(section);
}
function render() {
  const doc=$('document');doc.replaceChildren();
  const header=el('header',undefined,'document-header');
  const brand=el('div',undefined,'brand');const logo=el('img');logo.src='assets/logo.png';logo.alt='Logo de La Cueva del Oso';
  const name=el('div');name.append(el('strong',data.issuer || 'La Cueva del Oso'),el('span','WEB / AUTOMATIZACIÓN'));brand.append(logo,name);
  const ref=el('div',undefined,'reference');ref.append(el('span','PROPUESTA DE SERVICIOS'),el('strong',data.number || 'SIN NÚMERO'));header.append(brand,ref);doc.append(header);
  let invalid='';try{M.validate(data);}catch(error){invalid=error.message;}
  let warning='';try{M.ready(data);}catch(error){warning=error.message;}
  if(warning)doc.append(el('p','BORRADOR · '+warning,'draft'));
  const title=el('section',undefined,'document-title');title.append(el('span','SOLUCIONES DIGITALES A MEDIDA','eyebrow'),el('h2',data.project || 'Nombre del proyecto'));doc.append(title);
  const meta=el('div',undefined,'meta');
  const client=el('div');client.append(el('span','PREPARADO PARA','eyebrow'),el('strong',data.client||'Nombre del cliente'));
  for (const key of ['clientContact','clientTaxId'])if(data[key])client.append(el('p',data[key]));
  const dates=el('div');const dateLabel=value=>value?value.split('-').reverse().join('/'):'Por definir';dates.append(el('p','Emisión: '+dateLabel(data.date)));if(data.validUntil)dates.append(el('p','Vigencia: '+dateLabel(data.validUntil)));meta.append(client,dates);doc.append(meta);
  paragraphSection(doc,'01 / Objetivo',data.objective);
  paragraphSection(doc,'Alcance incluido',data.scope);
  paragraphSection(doc,'Entregables',data.deliverables);
  paragraphSection(doc,'No incluido',data.exclusions);
  const investment=el('section',undefined,'investment');investment.append(el('h3','02 / Inversión'));
  if(invalid) investment.append(el('p',invalid,'draft'));
  else for(const category of M.categories){
    const items=data.items.filter(i=>i.category===category);if(!items.length)continue;
    const block=el('section',undefined,'price-group');block.append(el('h4',categoryNames[category]));
    const table=el('table');const thead=el('thead');const head=el('tr');for(const text of ['Servicio','Cant.','Unitario','Importe']){const th=el('th',text);th.scope='col';head.append(th);}thead.append(head);table.append(thead);
    const tbody=el('tbody');for(const item of items){const row=el('tr');const description=el('td',item.description||'Servicio por definir');if(item.estimated)description.append(el('small','Estimado / variable · fuera del total'));row.append(description,el('td',String(item.quantity)),el('td',item.price===null?'Por definir':money(item.price)),el('td',item.price===null?'Por definir':money(Math.round(item.quantity*item.price))));tbody.append(row);}table.append(tbody);block.append(table);
    if(items.some(i=>!i.estimated)){
      const total=M.totals(data,category);const box=el('div',undefined,'totals');
      if(total.incomplete)box.append(el('p','Subtotal incompleto: hay precios por definir.'));
      if(data.taxMode==='pending')box.append(el('p','Impuestos pendientes de definir.'));
      if(['added','included'].includes(data.taxMode)) {box.append(el('p',`Neto: ${money(total.net)}`),el('p',`Impuesto (${data.taxRate}%): ${money(total.tax)}`));}
      const label=total.incomplete||data.taxMode==='pending'?'Parcial':category==='monthly'?'Total mensual':'Total';
      box.append(el('strong',`${label} CLP ${money(total.total)}`));block.append(box);
    }
    investment.append(block);
  }
  if(data.taxMode==='none')investment.append(el('p','Importes en pesos chilenos (CLP), sin impuesto agregado.','fine-print'));
  if(data.items.some(i=>i.estimated))investment.append(el('p','Los importes estimados o variables son referenciales y no están incluidos en los totales.','fine-print'));
  doc.append(investment);
  const conditions=el('section',undefined,'conditions');
  const hasConditions=['timeline','payment','support','bank','notes'].some(key=>data[key].trim());
  if(hasConditions)conditions.append(el('h3','03 / Condiciones del proyecto'));
  for(const [key,label] of [['timeline','Plazo y comienzo'],['payment','Forma de pago'],['support','Soporte'],['bank','Datos para pago'],['notes','Observaciones']])paragraphSection(conditions,label,data[key]);doc.append(conditions);
  const footer=el('footer',undefined,'document-footer');footer.append(el('strong',data.issuer));footer.append(el('span',[data.email,data.phone].filter(Boolean).join(' · ')));if(data.taxId)footer.append(el('span',data.taxId));doc.append(footer);
  document.title = (data.number ? data.number+' · ' : '')+'Cotización · '+(data.client||'La Cueva del Oso');
}
function canReplace(){return !dirty||window.confirm('Hay cambios sin guardar. ¿Quieres reemplazar esta cotización?');}
$('new').addEventListener('click',()=>{if(!canReplace())return;data=M.create($('base').value);dirty=false;buildEditor();render();message('Nueva cotización. Completa precios y condiciones antes de enviarla.');});
$('save').addEventListener('click',()=>{
  try {const clean=M.validate(data);const blob=new Blob([JSON.stringify(clean,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=el('a');link.href=url;link.download=(data.number||'cotizacion').replace(/[^a-zA-Z0-9_-]/g,'_')+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);dirty=false;message('Descarga solicitada. Conserva el archivo JSON para editar esta cotización después.');}catch(error){message(error.message,true);}
});
$('load').addEventListener('click',()=>{$('file').click();});
$('file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>2000000)throw new Error('El archivo supera el límite de 2 MB.');const imported=M.validate(JSON.parse(await file.text()));if(!canReplace())return;data=imported;dirty=false;buildEditor();render();message('Cotización cargada. Revisa su contenido antes de enviarla.');}catch(error){message('No se cargó el archivo: '+error.message,true);}finally{event.target.value='';}
});
$('print').addEventListener('click',async()=>{try{M.ready(data);await document.fonts.ready;await Promise.all([...$('document').querySelectorAll('img')].map(img=>img.decode()));message('En el diálogo: A4, escala 100 %, sin encabezados del navegador y con gráficos de fondo.');window.print();}catch(error){message(error.message,true);$('status').scrollIntoView({behavior:'smooth',block:'center'});}});
$('form').addEventListener('submit',event=>event.preventDefault());
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
buildEditor();render();
