// ============================================
// FERA — Render de catálogo + integración WhatsApp
// ============================================

const INSTAGRAM_URL = ""; // <- pega aquí tu link de Instagram, ej: "https://instagram.com/fera.joyeria"

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
  return PRODUCTS.filter(p => p.sections && p.sections.includes(section));
}

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
  return `<a class="btn" href="${whatsappLink(p)}" target="_blank" rel="noopener" ${extraAttrs}>${WHATSAPP_ICON} Comprar por WhatsApp</a>`;
}

function buildMedia(p, wrapperClass = "card-img") {
  const tag = buildTag(p);
  if (p.video) {
    return `<div class="${wrapperClass} has-video">
        ${tag}
        <video src="${p.video}" poster="${p.img}" autoplay muted loop playsinline></video>
      </div>`;
  }
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
  el.innerHTML = productsInSection(section).map(cardHTML).join("");
}

renderGrid("grid-destacados", "destacados");
renderGrid("grid-pulsos", "pulsos");
renderGrid("grid-cadenas", "cadenas");

// Piezas de marca: layout más grande, dos columnas por producto
(function renderMarca() {
  const el = document.getElementById("grid-marca");
  if (!el) return;
  el.innerHTML = productsInSection("marca").map(p => `
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
})();

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