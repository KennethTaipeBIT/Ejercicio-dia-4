import { useMemo, useState } from 'react';
import {
  calcularSubtotal,
  aplicarDescuento,
  calcularEnvio,
  validarCupon,
  obtenerDescuentoCupon,
  formatearPrecio,
} from './cart.js';

const PRODUCTOS = [
  { id: 'auriculares', nombre: 'Auriculares inalámbricos', precio: 25.99 },
  { id: 'mouse', nombre: 'Mouse ergonómico', precio: 15.5 },
  { id: 'teclado', nombre: 'Teclado mecánico', precio: 45.0 },
  { id: 'monitor', nombre: 'Monitor 24" Full HD', precio: 129.99 },
];

function ProductCard({ producto, cantidad, onChange }) {
  return (
    <article className="product-card">
      <div className="product-info">
        <h3>{producto.nombre}</h3>
        <p className="price">{formatearPrecio(producto.precio)}</p>
      </div>
      <div className="quantity-control">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, cantidad - 1))}
          aria-label={`Quitar una unidad de ${producto.nombre}`}
        >
          −
        </button>
        <span className="quantity-value">{cantidad}</span>
        <button
          type="button"
          onClick={() => onChange(cantidad + 1)}
          aria-label={`Agregar una unidad de ${producto.nombre}`}
        >
          +
        </button>
      </div>
    </article>
  );
}

export default function App() {
  const [cantidades, setCantidades] = useState({});
  const [cuponInput, setCuponInput] = useState('');

  const items = useMemo(
    () =>
      PRODUCTOS.filter((producto) => cantidades[producto.id] > 0).map((producto) => ({
        precio: producto.precio,
        cantidad: cantidades[producto.id],
      })),
    [cantidades]
  );

  const subtotal = calcularSubtotal(items);
  const cuponEscrito = cuponInput.trim().length > 0;
  const cuponValido = cuponEscrito && validarCupon(cuponInput);
  const porcentajeDescuento = cuponValido ? obtenerDescuentoCupon(cuponInput) : 0;
  const totalConDescuento = aplicarDescuento(subtotal, porcentajeDescuento);
  const descuentoAplicado = subtotal - totalConDescuento;
  const envio = calcularEnvio(subtotal);
  const total = Number((totalConDescuento + envio).toFixed(2));

  const actualizarCantidad = (id, cantidad) => {
    setCantidades((previas) => ({ ...previas, [id]: cantidad }));
  };

  return (
    <>
      <header className="site-header">
        <div className="container">
          <p className="eyebrow">Proyecto educativo</p>
          <h1>TechStore</h1>
          <p className="subtitle">
            Un carrito de compras simple, construido con React, para practicar pruebas
            automatizadas y entender por qué un pipeline de CI/CD puede fallar.
          </p>
        </div>
      </header>

      <main className="container layout">
        <section className="products" aria-label="Catálogo de productos">
          <h2>Catálogo</h2>
          <div className="product-list">
            {PRODUCTOS.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                cantidad={cantidades[producto.id] ?? 0}
                onChange={(cantidad) => actualizarCantidad(producto.id, cantidad)}
              />
            ))}
          </div>
        </section>

        <aside className="summary" aria-label="Resumen de compra">
          <h2>Resumen de compra</h2>

          <div className="field">
            <label htmlFor="coupon-input">Cupón de descuento</label>
            <input
              id="coupon-input"
              type="text"
              placeholder="Ej: VERANO20"
              autoComplete="off"
              value={cuponInput}
              onChange={(evento) => setCuponInput(evento.target.value)}
            />
            <p className="hint">Cupones válidos: DESCUENTO10, VERANO20, BIENVENIDA15</p>
            {cuponEscrito && (
              <p className={`coupon-status ${cuponValido ? 'is-valid' : 'is-invalid'}`}>
                {cuponValido
                  ? `Cupón aplicado: ${porcentajeDescuento}% de descuento`
                  : 'Cupón no válido.'}
              </p>
            )}
          </div>

          <dl className="summary-rows">
            <div className="row">
              <dt>Subtotal</dt>
              <dd>{formatearPrecio(subtotal)}</dd>
            </div>
            <div className="row">
              <dt>Descuento</dt>
              <dd>
                {descuentoAplicado > 0
                  ? `-${formatearPrecio(descuentoAplicado)}`
                  : formatearPrecio(0)}
              </dd>
            </div>
            <div className="row">
              <dt>Envío</dt>
              <dd>{formatearPrecio(envio)}</dd>
            </div>
            <div className="row total">
              <dt>Total</dt>
              <dd>{formatearPrecio(total)}</dd>
            </div>
          </dl>

          <p className="shipping-hint">Envío gratis en compras de $50 o más.</p>
        </aside>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            Proyecto educativo sin backend ni base de datos. Ver <code>README.md</code> para
            instrucciones de instalación y pruebas.
          </p>
        </div>
      </footer>
    </>
  );
}
