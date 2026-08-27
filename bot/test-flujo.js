/**
 * Validador del guion del bot. Corre con: node bot/test-flujo.js
 * Sin frameworks: solo assert y require. Ver docs/superpowers/specs/
 * 2026-08-18-bot-sitio-design.md §8 para las reglas que verifica.
 */
"use strict";

const assert = require("assert");
const FLUJO = require("./flujo.js");

function indexarPorId(nodos) {
  const porId = new Map();
  for (const nodo of nodos) {
    assert.ok(!porId.has(nodo.id), `id duplicado: "${nodo.id}"`);
    porId.set(nodo.id, nodo);
  }
  return porId;
}

function validarEstructura(nodo) {
  assert.ok(
    !(nodo.opciones && nodo.captura),
    `nodo "${nodo.id}" mezcla opciones y captura`
  );
  const tieneSalida = Boolean((nodo.opciones && nodo.opciones.length) || nodo.captura);
  assert.ok(
    tieneSalida || nodo.final,
    `nodo "${nodo.id}" no tiene salida y no está marcado final`
  );
}

function validarReferencias(nodo, porId) {
  if (nodo.opciones) {
    for (const opcion of nodo.opciones) {
      if (opcion.siguiente) {
        assert.ok(
          porId.has(opcion.siguiente),
          `nodo "${nodo.id}": opción "${opcion.texto}" apunta a "${opcion.siguiente}", que no existe`
        );
      }
    }
  }
  if (nodo.captura) {
    assert.ok(
      porId.has(nodo.captura.siguiente),
      `nodo "${nodo.id}": captura apunta a "${nodo.captura.siguiente}", que no existe`
    );
  }
}

function validarAlcanzabilidad(nodos, porId, inicioId) {
  const visitados = new Set();
  const pendientes = [inicioId];
  while (pendientes.length) {
    const id = pendientes.pop();
    if (visitados.has(id)) continue;
    visitados.add(id);
    const nodo = porId.get(id);
    assert.ok(nodo, `id de inicio "${id}" no existe entre los nodos`);
    if (nodo.opciones) {
      for (const opcion of nodo.opciones) {
        if (opcion.siguiente && !visitados.has(opcion.siguiente)) {
          pendientes.push(opcion.siguiente);
        }
      }
    }
    if (nodo.captura && !visitados.has(nodo.captura.siguiente)) {
      pendientes.push(nodo.captura.siguiente);
    }
  }
  for (const nodo of nodos) {
    assert.ok(
      visitados.has(nodo.id),
      `nodo "${nodo.id}" es inalcanzable desde "${inicioId}"`
    );
  }
}

function main() {
  const nodos = FLUJO.nodos;
  const porId = indexarPorId(nodos);

  for (const nodo of nodos) {
    validarEstructura(nodo);
    validarReferencias(nodo, porId);
  }
  validarAlcanzabilidad(nodos, porId, FLUJO.inicioId);

  console.log(`OK, ${nodos.length} nodos, guion del bot valida correctamente.`);
}

main();
