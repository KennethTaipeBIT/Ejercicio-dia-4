# TechStore — Proyecto demo de Testing y CI/CD

Carrito de compras simple construido con **React + Vite**. Es un proyecto
**100% frontend**: no tiene backend, no se conecta a ninguna base de datos y
no depende de servicios externos. Su único propósito es servir como material
de práctica para entender **por qué las pruebas automatizadas importan** y
qué aspecto tiene un pipeline de CI/CD cuando esas pruebas fallan.

> Este repositorio contiene deliberadamente algunos tests que fallan. No es
> un error de configuración: es el punto de partida de la clase.

## Estructura del proyecto

```
├── index.html          # Punto de entrada de Vite
├── src/
│   ├── main.jsx         # Monta la app de React en el DOM
│   ├── App.jsx           # Componente principal: catálogo + resumen de compra
│   ├── cart.js            # Lógica de negocio pura (sin React, sin DOM)
│   └── style.css          # Estilos de la interfaz
├── tests/
│   └── cart.test.js       # Pruebas unitarias sobre src/cart.js (Vitest)
├── eslint.config.js       # Reglas de lint (calidad de código)
├── GUIA_DOCENTE.md        # Guía de respuestas para quien dicte la clase
└── package.json
```

La idea clave de la estructura: **la lógica de negocio (`src/cart.js`) está
separada de la interfaz (`App.jsx`)**. Eso es lo que permite probar el
cálculo del carrito con pruebas rápidas y simples, sin necesidad de renderizar
componentes ni simular un navegador.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`).

## Instalación

```bash
npm install
```

## Ver la aplicación

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).
Vas a ver una tienda con 4 productos, control de cantidades y un campo para
aplicar un cupón de descuento. Los cupones válidos son:

- `DESCUENTO10`
- `VERANO20`
- `BIENVENIDA15`

## Ejecutar las pruebas

```bash
npm test
```

Esto corre **Vitest** una sola vez y muestra en la terminal qué pruebas
pasaron (en verde) y cuáles fallaron (en rojo), junto con el valor esperado
contra el valor recibido. **Es normal y esperado que algunas fallen.**

Si prefieres que las pruebas se vuelvan a ejecutar automáticamente cada vez
que guardas un archivo:

```bash
npm run test:watch
```

## Revisar el estilo de código (lint)

```bash
npm run lint
```

Corre **ESLint** sobre todo el proyecto. A diferencia de los tests, el código
del proyecto está limpio a propósito: el lint debería terminar sin errores
(código de salida `0`). Sirve para mostrar la diferencia entre dos tipos de
gate que un pipeline de CI/CD puede tener: uno que valida el *comportamiento*
del código (`npm test`) y otro que valida su *estilo y buenas prácticas*
(`npm run lint`).

## ¿Por qué hay pruebas que fallan a propósito?

`src/cart.js` tiene algunos errores sutiles en su implementación (nada de
excepciones ni código roto: son fórmulas o condiciones ligeramente
incorrectas, del tipo que cualquier desarrollador puede escribir sin darse
cuenta). Las pruebas en `tests/cart.test.js` describen el comportamiento
**correcto** según la documentación de cada función, así que exponen esos
errores en cuanto se ejecutan.

Esto es exactamente lo que hace valiosa a una suite de pruebas dentro de un
pipeline de CI/CD: un pipeline normalmente ejecuta `npm test` como parte del
proceso de integración, y si el comando termina con errores, el pipeline se
marca en rojo y bloquea el merge o el despliegue — sin que nadie tenga que
revisar el código manualmente para notar el problema.

Este repositorio **no incluye el pipeline en sí** (no hay workflow de GitHub
Actions ni configuración similar). La idea es que ese sea el siguiente paso:
tomar este proyecto, subirlo a un repositorio y construir el pipeline que
ejecute `npm test` en cada cambio, para ver en vivo cómo se pone en rojo por
estas fallas y cómo se puede corregir.

## Sugerencia de flujo de clase

1. Mostrar la aplicación funcionando (`npm run dev`) y señalar algún valor
   que "se ve raro" en pantalla (precios, descuentos, envío).
2. Correr `npm test` y leer juntos la salida: ¿cuántas pruebas pasaron?
   ¿cuántas fallaron? ¿qué mensaje da cada falla?
3. Elegir una prueba en rojo, abrir `tests/cart.test.js` para entender qué
   se esperaba, y luego revisar la función correspondiente en `src/cart.js`
   para encontrar el error.
4. Corregir el error y volver a correr `npm test` para confirmar que la
   prueba pasa a verde.
5. Repetir con las demás fallas y cerrar con la relación entre este ejercicio
   y un pipeline real de CI/CD (ver `GUIA_DOCENTE.md`).
