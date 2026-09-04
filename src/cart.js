// Lógica de negocio del carrito de compras.
// Este módulo no depende de React ni del DOM a propósito: son funciones puras,
// fáciles de importar y probar de forma aislada desde tests/cart.test.js.

const UMBRAL_ENVIO_GRATIS = 50;
const COSTO_ENVIO_ESTANDAR = 5.99;

const CUPONES = {
  DESCUENTO10: 10,
  VERANO20: 20,
  BIENVENIDA15: 15,
};

/**
 * Suma el precio por cantidad de cada producto del carrito.
 * @param {{precio: number, cantidad: number}[]} items
 * @returns {number} subtotal antes de descuentos y envío.
 */
export function calcularSubtotal(items) {
  return items.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
}

/**
 * Aplica un descuento porcentual sobre el subtotal.
 * @param {number} subtotal
 * @param {number} porcentajeDescuento - Valor entre 0 y 100.
 * @returns {number} subtotal luego de restar el descuento.
 */
export function aplicarDescuento(subtotal, porcentajeDescuento) {
  const descuento = (subtotal * porcentajeDescuento) / 100;
  return subtotal - descuento;
}

/**
 * Calcula el costo de envío. El envío es gratis en compras de $50 o más;
 * por debajo de ese umbral se cobra un costo de envío estándar.
 * @param {number} subtotal
 * @returns {number} costo de envío.
 */
export function calcularEnvio(subtotal) {
  if (subtotal >= UMBRAL_ENVIO_GRATIS) {
    return 0;
  }
  return COSTO_ENVIO_ESTANDAR;
}

/**
 * Verifica si un código de cupón es válido, sin distinguir mayúsculas,
 * minúsculas ni espacios en blanco alrededor del código.
 * @param {string} codigo
 * @returns {boolean}
 */
export function validarCupon(codigo) {
  return Object.prototype.hasOwnProperty.call(CUPONES, codigo.trim().toUpperCase());
}

/**
 * Obtiene el porcentaje de descuento asociado a un cupón válido.
 * @param {string} codigo
 * @returns {number} porcentaje de descuento, o 0 si el cupón no existe.
 */
export function obtenerDescuentoCupon(codigo) {
  return CUPONES[codigo.trim().toUpperCase()] ?? 0;
}

/**
 * Calcula el total a pagar combinando subtotal, descuento y envío.
 * El envío se calcula sobre el subtotal antes de aplicar el descuento.
 * @param {{items: {precio: number, cantidad: number}[], porcentajeDescuento?: number}} datos
 * @returns {number} total final, redondeado a 2 decimales.
 */
export function calcularTotal({ items, porcentajeDescuento = 0 }) {
  const subtotal = calcularSubtotal(items);
  const totalConDescuento = aplicarDescuento(subtotal, porcentajeDescuento);
  const envio = calcularEnvio(subtotal);
  return Number((totalConDescuento + envio).toFixed(2));
}

/**
 * Formatea un valor numérico como precio en dólares con dos decimales.
 * @param {number} valor
 * @returns {string} por ejemplo "$19.99".
 */
export function formatearPrecio(valor) {
  return `$${valor.toFixed(2)}`;
}
