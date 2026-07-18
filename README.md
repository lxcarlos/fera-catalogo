# Fera — Catálogo de Joyería

Página estática lista para subir a GitHub Pages.

## Estructura del proyecto

```
index.html      → estructura de la página
styles.css      → todo el diseño (colores, tipografía, layout)
script.js       → arma los links de WhatsApp y dibuja las tarjetas
products.js     → AQUÍ agregas/editas/quitas productos
assets/         → fotos de los productos
```

## Cómo subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub (ej. `fera-catalogo`).
2. Sube estos archivos a la raíz del repo (`git add .`, `git commit -m "catalogo inicial"`, `git push`).
3. En el repo, ve a **Settings → Pages**.
4. En "Branch" selecciona `main` y carpeta `/ (root)`. Guarda.
5. En un par de minutos tu página estará en:
   `https://TU-USUARIO.github.io/fera-catalogo/`

## Cómo agregar un producto nuevo

Abre `products.js` y copia un bloque como este dentro de la categoría que quieras (`pulsos`, `cadenas` o `marca`):

```js
{ collection: "Pulso Clasics", name: "Nombre", specs: "20cm / 4mm", material: "Oro Laminado", price: 350, img: "assets/mi-foto.jpg", status: "disponible" },
```

- `status` puede ser `"disponible"`, `"nuevo"` (le pone etiqueta "Nuevo") o `"agotado"` (bloquea el botón y pone "Próximamente disponible").
- Sube la foto del producto a la carpeta `assets/` con el mismo nombre que pusiste en `img`.

## Cómo cambiar los productos destacados (banner principal)

Edita el arreglo `destacados` en `products.js` — puedes usar cualquier producto que ya exista en otra categoría, solo copia su bloque.

## Pendiente de tu parte

- **Instagram:** abre `script.js` y en la línea `const INSTAGRAM_URL = ""` pega tu link (ej. `"https://instagram.com/fera.joyeria"`). Mientras esté vacío, el ícono no hace nada al darle clic.
- **WhatsApp:** ya está configurado con tu número `+52 221 191 1972`. Si cambia, edítalo en `products.js` en la variable `WHATSAPP_NUMBER`.
