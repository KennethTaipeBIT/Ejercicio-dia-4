import { describe, it, expect } from 'vitest';
import {
  calcularSubtotal,
  aplicarDescuento,
  calcularEnvio,
  validarCupon,
  calcularTotal,
  formatearPrecio,
} from '../src/cart.js';

describe('calcularSubtotal', () => {
  it('suma el precio por cantidad de un solo producto', () => {
    const items = [{ precio: 10, cantidad: 3 }];
    expect(calcularSubtotal(items)).toBe(30);
  });

  it('suma correctamente varios productos distintos', () => {
    const items = [
      { precio: 25.99, cantidad: 2 },
      { precio: 15.5, cantidad: 1 },
    ];
    expect(calcularSubtotal(items)).toBeCloseTo(67.48, 2);
  });

  it('devuelve 0 cuando el carrito está vacío', () => {
    expect(calcularSubtotal([])).toBe(0);
  });
});

describe('aplicarDescuento', () => {
  it('no cambia el subtotal cuando el descuento es 0%', () => {
    expect(aplicarDescuento(100, 0)).toBe(100);
  });

  it('aplica correctamente un descuento del 20%', () => {
    expect(aplicarDescuento(100, 20)).toBe(80);
  });

  it('aplica correctamente un descuento del 50%', () => {
    expect(aplicarDescuento(200, 50)).toBe(100);
  });
});

describe('calcularEnvio', () => {
  it('el envío es gratis por encima del umbral de $50', () => {
    expect(calcularEnvio(80)).toBe(0);
  });

  it('cobra el envío estándar por debajo del umbral', () => {
    expect(calcularEnvio(20)).toBe(5.99);
  });

  it('el envío es gratis justo en el umbral de $50', () => {
    expect(calcularEnvio(50)).toBe(0);
  });
});

describe('validarCupon', () => {
  it('acepta un cupón válido escrito en mayúsculas', () => {
    expect(validarCupon('DESCUENTO10')).toBe(true);
  });

  it('rechaza un cupón inexistente', () => {
    expect(validarCupon('CUPON_FALSO')).toBe(false);
  });

  it('acepta un cupón válido con espacios y en minúsculas', () => {
    expect(validarCupon('  verano20  ')).toBe(true);
  });
});

describe('calcularTotal', () => {
  it('calcula el total sin descuento y con envío gratis', () => {
    const items = [{ precio: 100, cantidad: 1 }];
    expect(calcularTotal({ items, porcentajeDescuento: 0 })).toBe(100);
  });

  it('calcula el total con descuento y envío pago', () => {
    const items = [{ precio: 40, cantidad: 1 }];
    expect(calcularTotal({ items, porcentajeDescuento: 10 })).toBe(41.99);
  });
});

describe('formatearPrecio', () => {
  it('formatea un precio con dos decimales', () => {
    expect(formatearPrecio(19.99)).toBe('$19.99');
  });

  it('completa con ceros cuando el precio es un número entero', () => {
    expect(formatearPrecio(5)).toBe('$5.00');
  });

  it('formatea el cero correctamente', () => {
    expect(formatearPrecio(0)).toBe('$0.00');
  });
});
