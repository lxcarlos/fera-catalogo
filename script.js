// ============================================
// FERA — Render de catálogo + integración WhatsApp
// ============================================

const INSTAGRAM_URL = "https://www.instagram.com/carlos_fera_/"; // <- pega aquí tu link de Instagram, ej: "https://instagram.com/fera.joyeria"

function money(n) {
  return "$" + n.toLocaleString("es-MX");
}

function whatsappLink(product) {
  const msg = `Hola, me interesa el ${product.collection} ${product.name} (${money(product.price)}). ¿Está disponible?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const WHATSAPP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.7.8-.8.9-.2.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.3-.4.2-.4.7-1.3.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3z"/></svg>`;

// Helper: todos los productos que pertenecen a una sección dada
function productsInSection(section) {
  return PRODUCTS.filter(p => p.sections && p.sections.includes(section) && passesFilters(p));
}

// ── Filtro por material y precio ──
// currentFilters guarda lo que el usuario tiene seleccionado ahora mismo.
// Usamos Set() en vez de un solo valor porque ahora se puede elegir MÁS
// DE UNO a la vez (ej. "Oro Laminado" + "Plata 925" juntos). Un Set vacío
// significa "sin restricción" — se muestran todos.
const currentFilters = {
  materials: new Set(),
  priceRanges: new Set()
};

// Rangos de precio predefinidos. Cada uno tiene su "key" (para guardarlo
// en el Set) y su "label" (lo que se ve en el botón). Ajusta estos
// números o agrega más rangos si tu catálogo crece mucho.
const PRICE_RANGES = [
  { key: "hasta-400", label: "Hasta $400",     min: 0,    max: 400 },
  { key: "400-800",   label: "$400 – $800",    min: 400,  max: 800 },
  { key: "800-1500",  label: "$800 – $1,500",  min: 800,  max: 1500 },
  { key: "mas-1500",  label: "Más de $1,500",  min: 1500, max: Infinity }
];

function passesFilters(p) {
  const materialOk = currentFilters.materials.size === 0 || currentFilters.materials.has(p.material);
  const priceOk = currentFilters.priceRanges.size === 0 || [...currentFilters.priceRanges].some(key => {
    const range = PRICE_RANGES.find(r => r.key === key);
    return range && p.price >= range.min && p.price <= range.max;
  });
  return materialOk && priceOk;
}

// ── Selección aleatoria de videos que se reproducen al cargar ──
// En vez de que los N productos con video (p.video) se reproduzcan TODOS
// de golpe al abrir la página (pesado, sobre todo en celular), elegimos al
// azar solo 2 en cada visita. Los que no caen en la selección muestran
// nada más su foto — ni siquiera se crea la etiqueta <video> para ellos,
// así que el navegador no descarga ni un byte de esos archivos.
// Bonus: cada visita puede mostrar una combinación distinta, dándole
// variedad al catálogo sin que tú tengas que hacer nada manual.
const AUTOPLAY_VIDEO_COUNT = 5;
const videoProducts = PRODUCTS.filter(p => p.video);
const shuffledVideoProducts = [...videoProducts].sort(() => Math.random() - 0.5);
const autoplayVideoIds = new Set(
  shuffledVideoProducts.slice(0, AUTOPLAY_VIDEO_COUNT).map(p => p.id)
);

// ── Helpers compartidos (antes duplicados entre cardHTML y renderMarca) ──

function buildTag(p) {
  if (p.status === "nuevo") return `<span class="tag nuevo">Nuevo</span>`;
  if (p.status === "agotado") return `<span class="tag agotado">Agotado</span>`;
  return "";
}

function buildButton(p, extraAttrs = "") {
  if (p.status === "agotado") {
    return `<div class="soon-note">Próximamente disponible</div><span class="btn disabled">${WHATSAPP_ICON} No disponible</span>`;
  }
  return `<a class="btn" href="${whatsappLink(p)}" target="_blank" rel="noopener" ${extraAttrs}>${WHATSAPP_ICON} Ordenar por WhatsApp</a>`;
}

function buildMedia(p, wrapperClass = "card-img") {
  const tag = buildTag(p);

  // Solo se crea la etiqueta <video> (y por lo tanto solo se descarga
  // el archivo) si este producto cayó en la selección aleatoria de hoy.
  if (p.video && autoplayVideoIds.has(p.id)) {
    return `<div class="${wrapperClass} has-video" style="position:relative;" onclick="event.preventDefault(); const v=this.querySelector('video'); v.muted=false; v.play(); this.querySelector('.card-play-btn').style.display='none';">
        ${tag}
        <video src="${p.video}" poster="${p.img}" muted loop playsinline></video>
        <span class="card-play-btn" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,0.55);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;pointer-events:none;">&#9658;</span>
      </div>`;
  }

  // Si el producto tiene video pero no le tocó esta vez, lo mostramos
  // EXACTAMENTE igual que un producto sin video: mismo contenedor
  // cuadrado, mismo object-fit: contain (foto completa, sin recortar).
  // Antes esto usaba el wrapper .has-video (fondo negro, proporción 3:4,
  // recorte), y por eso Vintage Alhambra y Barbada se veían con más
  // zoom que Figaro Torzal — eran dos estilos distintos sin querer.
  return `<div class="${wrapperClass}">
      ${tag}
      <img src="${p.img}" alt="${p.collection} ${p.name}" loading="lazy">
    </div>`;
}

function cardHTML(p) {
  return `
    <article class="card">
      <a class="card-link" href="#detalle/${p.id}">
        ${buildMedia(p)}
        <div class="card-collection">${p.collection}</div>
        <h3>${p.name}</h3>
        <div class="card-specs"><b>${p.specs}</b><br>${p.material}</div>
        <div class="price">${money(p.price)}</div>
      </a>
      ${buildButton(p)}
    </article>
  `;
}

function renderGrid(id, section) {
  const el = document.getElementById(id);
  if (!el) return;
  const items = productsInSection(section);
  el.innerHTML = items.map(cardHTML).join("");

  // Si el filtro deja esta sección sin productos, ocultamos la sección
  // completa (encabezado incluido) en vez de mostrar un título con una
  // cuadrícula vacía debajo, que se ve descuidado.
  const sectionEl = document.getElementById(section);
  if (sectionEl) {
    sectionEl.style.display = items.length ? "" : "none";
  }
  return items.length;
}

// Piezas de marca: layout más grande, dos columnas por producto
function renderMarca() {
  const el = document.getElementById("grid-marca");
  if (!el) return 0;
  const items = productsInSection("marca");
  el.innerHTML = items.map(p => `
      <div class="brand-card">
        <a href="#detalle/${p.id}" style="display:block;">
          ${buildMedia(p)}
        </a>
        <div class="brand-copy">
          <a href="#detalle/${p.id}" style="display:block;">
            <span class="eyebrow">${p.collection}</span>
            <h3>${p.name}</h3>
            <div class="card-specs"><b>${p.specs}</b><br>${p.material}</div>
            <div class="price">${money(p.price)}</div>
          </a>
          ${buildButton(p, 'style="max-width:280px;"')}
        </div>
      </div>
    `).join("");

  const sectionEl = document.getElementById("marca");
  if (sectionEl) {
    sectionEl.style.display = items.length ? "" : "none";
  }
  return items.length;
}

// Vuelve a dibujar las 4 secciones del catálogo con los filtros actuales.
// Se llama una vez al cargar la página, y de nuevo cada vez que el
// usuario cambia el material o el rango de precio.
function renderCatalog() {
  const counts = [
    renderGrid("grid-destacados", "destacados"),
    renderGrid("grid-pulsos", "pulsos"),
    renderGrid("grid-cadenas", "cadenas"),
    renderMarca()
  ];

  // Si absolutamente ningún producto coincide con el filtro elegido,
  // mostramos un mensaje en vez de dejar la página en blanco y silenciosa.
  const totalMatches = counts.reduce((sum, n) => sum + n, 0);
  const emptyStateEl = document.getElementById("filterEmptyState");
  if (emptyStateEl) {
    emptyStateEl.style.display = totalMatches === 0 ? "block" : "none";
  }
}

renderCatalog();

// ── Chips de filtro (material y precio) ──
// Ambos grupos funcionan igual, así que usamos una sola función genérica:
// - clic en un chip normal: si ya estaba activo, se DESELECCIONA (esto es
//   lo que resuelve "quiero poder quitar un filtro haciendo clic de nuevo").
//   Si no estaba activo, se agrega al Set — así puedes tener varios
//   chips activos a la vez (multi-selección).
// - clic en "Todos": limpia el Set completo, es el "reset" de ese grupo.
// Usamos un solo listener en el contenedor (delegación de eventos) en vez
// de uno por botón — más simple y sigue funcionando aunque los botones
// se regeneren dinámicamente.
function setupChipGroup(containerEl, filterSet, onChange) {
  if (!containerEl) return;
  containerEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-value]");
    if (!btn) return;
    const value = btn.dataset.value;

    if (value === "todos") {
      filterSet.clear();
    } else if (filterSet.has(value)) {
      filterSet.delete(value);
    } else {
      filterSet.add(value);
    }

    containerEl.querySelectorAll("button[data-value]").forEach(b => {
      const isActive = b.dataset.value === "todos"
        ? filterSet.size === 0
        : filterSet.has(b.dataset.value);
      b.classList.toggle("active", isActive);
    });

    onChange();
  });
}

function chipsHTML(options) {
  return `
    <button type="button" class="chip active" data-value="todos">Todos</button>
    ${options.map(o => `<button type="button" class="chip" data-value="${o.value}">${o.label}</button>`).join("")}
  `;
}

// Los chips de material se generan solos a partir de los materiales que
// ya existen en tus productos (Set quita duplicados). Así, si agregas un
// material nuevo a products.js en el futuro, el filtro se actualiza solo.
const materialFilterEl = document.getElementById("filterMaterial");
if (materialFilterEl) {
  const materials = [...new Set(PRODUCTS.map(p => p.material))].sort();
  materialFilterEl.innerHTML = chipsHTML(materials.map(m => ({ value: m, label: m })));
  setupChipGroup(materialFilterEl, currentFilters.materials, renderCatalog);
}

const priceFilterEl = document.getElementById("filterPriceChips");
if (priceFilterEl) {
  priceFilterEl.innerHTML = chipsHTML(PRICE_RANGES.map(r => ({ value: r.key, label: r.label })));
  setupChipGroup(priceFilterEl, currentFilters.priceRanges, renderCatalog);
}

const clearFiltersBtn = document.getElementById("filterClear");
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", () => {
    currentFilters.materials.clear();
    currentFilters.priceRanges.clear();
    document.querySelectorAll(".chip-group .chip").forEach(b => {
      b.classList.toggle("active", b.dataset.value === "todos");
    });
    renderCatalog();
  });
}

// ── Botón de lupa (en el header): muestra/oculta todo el panel de filtros ──
// Como el botón vive arriba en el header y el panel está más abajo, junto
// al catálogo, hacemos scroll suave hasta el panel cada vez que se abre —
// así el usuario no tiene que buscarlo con la vista.
const filterToggleBtn = document.getElementById("filterToggleBtn");
const filterPanel = document.getElementById("filterPanel");
if (filterToggleBtn && filterPanel) {
  filterToggleBtn.addEventListener("click", () => {
    const isOpen = filterPanel.classList.toggle("open");
    filterToggleBtn.classList.toggle("active", isOpen);
    filterToggleBtn.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      filterPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// Header / footer WhatsApp links (mensaje genérico)
const genericMsg = encodeURIComponent("Hola, vi su catálogo Fera y quiero hacer una pregunta.");
const genericLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${genericMsg}`;
document.getElementById("whatsapp-header").href = genericLink;
document.getElementById("whatsapp-footer").href = genericLink;

// Instagram link — si no hay URL configurada, ocultamos el ícono
// en vez de dejarlo ahí sin hacer nada al usuario dar click.
const igEl = document.getElementById("instagram-footer");
if (igEl) {
  if (INSTAGRAM_URL) {
    igEl.href = INSTAGRAM_URL;
  } else {
    igEl.style.display = "none";
  }
}

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.style.display === "flex";
    mainNav.style.display = isOpen ? "none" : "flex";
    mainNav.style.flexDirection = "column";
    mainNav.style.position = "absolute";
    mainNav.style.top = "100%";
    mainNav.style.left = "0";
    mainNav.style.right = "0";
    mainNav.style.background = "var(--cream)";
    mainNav.style.padding = "20px 28px";
    mainNav.style.gap = "18px";
    mainNav.style.borderBottom = "1px solid var(--line)";
  });
}

// ============================================
// Vista de detalle de producto
// ============================================

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/************************************ */
let currentDetailMedia = [];
let currentDetailIndex = 0;

// El navegador solo dispara una animación CSS (@keyframes) la primera vez
// que el elemento aparece. Para que se repita cada vez que cambiamos de
// slide, hay que quitarla, forzar un "reflow" (leer offsetWidth engaña al
// navegador para que aplique el cambio ya) y volver a ponerla. Es un truco
// común y muy barato en rendimiento — nada de librerías de animación.
function restartAnimation(el) {
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
}

// Cambia el slide activo del carrusel (funciona igual para fotos y para el video)
function goToSlide(i) {
  const items = currentDetailMedia;
  currentDetailIndex = (i + items.length) % items.length;
  const item = items[currentDetailIndex];

  const imgEl = document.getElementById("detailImgEl");
  const videoEl = document.getElementById("detailVideoEl");
  const mainBox = document.getElementById("detailMainImg");

  // Si el slide anterior era el video, lo pausamos para que no siga sonando de fondo
  if (!videoEl.paused) videoEl.pause();

  if (item.type === "video") {
    mainBox.classList.add("video-active");
    imgEl.style.display = "none";
    videoEl.style.display = "block";
    if (videoEl.src !== item.src) videoEl.src = item.src;
    restartAnimation(videoEl);
    videoEl.currentTime = 0;
    videoEl.muted = false; // queremos que se escuche
    const playPromise = videoEl.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Si el navegador bloquea el audio automático, lo intentamos silenciado
        // (el usuario puede darle al ícono de sonido del propio reproductor)
        videoEl.muted = true;
        videoEl.play();
      });
    }
  } else {
    mainBox.classList.remove("video-active");
    videoEl.style.display = "none";
    imgEl.style.display = "block";
    imgEl.src = item.src;
    restartAnimation(imgEl);
  }

  document.querySelectorAll(".detail-thumb").forEach((t, idx) => {
    t.classList.toggle("active", idx === currentDetailIndex);
  });
  const counter = document.getElementById("detailCounter");
  if (counter) counter.textContent = `${currentDetailIndex + 1} / ${items.length}`;
}

function renderDetail(product) {
  // Armamos la lista de fotos
  const photos = product.images && product.images.length ? product.images : [product.img];

  // Convertimos todo a un solo arreglo de "slides": { type: "image" | "video", src }
  let mediaItems = photos.map(src => ({ type: "image", src }));

  // ── AQUÍ SE INSERTA EL VIDEO, SI EL PRODUCTO TIENE UNO ──
  // Lo ponemos en la posición 2 (justo después de la foto principal),
  // sin importar cuántas fotos tenga el producto.
  if (product.video) {
    mediaItems.splice(1, 0, { type: "video", src: product.video });
  }

  currentDetailMedia = mediaItems;
  currentDetailIndex = 0;

  // Miniaturas: las de foto muestran la foto; la del video muestra la foto principal
  // con un icono de "play" encima, para que se note que ahí hay un video.
  const thumbsHTML = mediaItems.length > 1
    ? `<div class="detail-thumbs">${mediaItems.map((item, i) => `
        <div class="detail-thumb ${i === 0 ? "active" : ""}" data-index="${i}">
          <img src="${item.type === "video" ? product.img : item.src}" alt="${product.name} ${i + 1}">
          ${item.type === "video" ? `<span class="thumb-play">&#9654;</span>` : ""}
        </div>`).join("")}</div>`
    : "";

  const arrowsHTML = mediaItems.length > 1
    ? `<button class="detail-arrow detail-arrow-prev" aria-label="Anterior">&#10094;</button>
       <button class="detail-arrow detail-arrow-next" aria-label="Siguiente">&#10095;</button>
       <span class="detail-counter" id="detailCounter">1 / ${mediaItems.length}</span>`
    : "";

  const tag = buildTag(product);
  const button = buildButton(product);

  // La imagen principal Y el video viven en el mismo cuadro (#detailMainImg),
  // uno se oculta y el otro se muestra según el slide activo (ver goToSlide).
  document.getElementById("detailGallery").innerHTML = `
    <div class="detail-main-img" id="detailMainImg">
      ${tag}
      <img id="detailImgEl" src="${mediaItems[0].src}" alt="${product.collection} ${product.name}">
      <video id="detailVideoEl" style="display:none;" playsinline controls loop></video>
      ${arrowsHTML}
    </div>
    ${thumbsHTML}
  `;

  document.getElementById("detailInfo").innerHTML = `
    <div class="card-collection">${product.collection}</div>
    <h1>${product.name}</h1>
    <div class="card-specs"><b>${product.specs}</b><br>${product.material}</div>
    <div class="price">${money(product.price)}</div>
    ${product.description ? `<p class="detail-desc">${product.description}</p>` : ""}
    ${button}
  `;

  // Barra fija inferior (solo se ve en móvil, por CSS)
  const stickyBar = document.getElementById("detailStickyBar");
  if (stickyBar) {
    stickyBar.innerHTML = `
      <div class="detail-sticky-price">${money(product.price)}</div>
      ${button}
    `;
  }

  // Si el primer slide ya es el video (no debería pasar con la posición 2,
  // pero por si acaso cambias el orden más adelante), lo arrancamos también.
  if (mediaItems[0].type === "video") {
    goToSlide(0);
  }

  // Miniaturas: click para saltar a esa foto o video
  document.querySelectorAll(".detail-thumb").forEach((thumb, i) => {
    thumb.addEventListener("click", () => goToSlide(i));
  });

  // Flechas prev/next
  const prevBtn = document.querySelector(".detail-arrow-prev");
  const nextBtn = document.querySelector(".detail-arrow-next");
  if (prevBtn) prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goToSlide(currentDetailIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goToSlide(currentDetailIndex + 1);
  });

  // Swipe con el dedo en celular (deslizar para cambiar de foto/video)
  if (mediaItems.length > 1) {
    const mainImgEl = document.getElementById("detailMainImg");
    let touchStartX = 0;
    mainImgEl.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    mainImgEl.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) < 40) return; // muy corto, no cuenta como swipe
      if (diff < 0) goToSlide(currentDetailIndex + 1);
      else goToSlide(currentDetailIndex - 1);
    }, { passive: true });
  }

  // Flechas del teclado (izq/der), por si lo ven en computadora.
  // IMPORTANTE: quitamos el listener anterior antes de agregar uno nuevo,
  // porque renderDetail() puede llamarse varias veces seguidas (ej. navegando
  // de un producto a otro con el botón atrás/adelante del navegador) sin pasar
  // siempre por showCatalogView(). Sin este removeEventListener, cada visita
  // a un detalle agrega un listener extra y las flechas terminan moviendo
  // varios slides de golpe por cada tecla presionada.
  document.removeEventListener("keydown", detailKeyHandler);
  if (mediaItems.length > 1) {
    document.addEventListener("keydown", detailKeyHandler);
  }
}

function detailKeyHandler(e) {
  if (e.key === "ArrowLeft") goToSlide(currentDetailIndex - 1);
  if (e.key === "ArrowRight") goToSlide(currentDetailIndex + 1);
}

function showDetail(product) {
  document.getElementById("catalogView").style.display = "none";
  document.getElementById("product-detail").style.display = "block";
  renderDetail(product);
  window.scrollTo(0, 0);
}

function showCatalogView() {
  document.getElementById("catalogView").style.display = "block";
  document.getElementById("product-detail").style.display = "none";
  document.removeEventListener("keydown", detailKeyHandler);
  // Si había un video reproduciéndose, lo detenemos al salir de la vista
  const videoEl = document.getElementById("detailVideoEl");
  if (videoEl) videoEl.pause();
}
/*********************** */

function handleRoute() {
  const hash = window.location.hash;
  if (hash.startsWith("#detalle/")) {
    const id = hash.replace("#detalle/", "");
    const product = getProductById(id);
    if (product) {
      showDetail(product);
      return;
    }
  }
  showCatalogView();
}

window.addEventListener("hashchange", handleRoute);
handleRoute(); // revisa el hash al cargar la página