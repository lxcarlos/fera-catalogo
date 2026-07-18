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

function cardHTML(p) {
  const tag = p.status === "nuevo"
    ? `<span class="tag nuevo">Nuevo</span>`
    : p.status === "agotado"
      ? `<span class="tag agotado">Agotado</span>`
      : "";

  const isAgotado = p.status === "agotado";

  const button = isAgotado
    ? `<div class="soon-note">Próximamente disponible</div><span class="btn disabled">${WHATSAPP_ICON} No disponible</span>`
    : `<a class="btn" href="${whatsappLink(p)}" target="_blank" rel="noopener">${WHATSAPP_ICON} Comprar por WhatsApp</a>`;

  // Si el producto tiene "video" (un archivo .mp4), se muestra como video
  // vertical 3:4 que se reproduce solo, en bucle y sin sonido, apenas
  // carga la página. Si no tiene "video", se muestra la foto normal.
  const media = p.video
    ? `<div class="card-img has-video">
         ${tag}
         <video src="${p.video}" poster="${p.img}" autoplay muted loop playsinline></video>
       </div>`
    : `<div class="card-img">
         ${tag}
         <img src="${p.img}" alt="${p.collection} ${p.name}" loading="lazy">
       </div>`;

  return `
    <article class="card">
      <a class="card-link" href="#detalle/${p.id}">
        ${media}
        <div class="card-collection">${p.collection}</div>
        <h3>${p.name}</h3>
        <div class="card-specs"><b>${p.specs}</b><br>${p.material}</div>
        <div class="price">${money(p.price)}</div>
      </a>
      ${button}
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
  el.innerHTML = productsInSection("marca").map(p => {
    const tag = p.status === "agotado" ? `<span class="tag agotado">Agotado</span>` : (p.status === "nuevo" ? `<span class="tag nuevo">Nuevo</span>` : "");
    const isAgotado = p.status === "agotado";
    const button = isAgotado
      ? `<div class="soon-note">Próximamente disponible</div><span class="btn disabled">${WHATSAPP_ICON} No disponible</span>`
      : `<a class="btn" href="${whatsappLink(p)}" target="_blank" rel="noopener" style="max-width:280px;">${WHATSAPP_ICON} Comprar por WhatsApp</a>`;
    const media = p.video
      ? `<div class="card-img has-video">${tag}<video src="${p.video}" poster="${p.img}" autoplay muted loop playsinline></video></div>`
      : `<div class="card-img">${tag}<img src="${p.img}" alt="${p.collection} ${p.name}" loading="lazy"></div>`;
    return `
      <div class="brand-card">
        <a href="#detalle/${p.id}" style="display:block;">
          ${media}
        </a>
        <div class="brand-copy">
          <a href="#detalle/${p.id}" style="display:block;">
            <span class="eyebrow">${p.collection}</span>
            <h3>${p.name}</h3>
            <div class="card-specs"><b>${p.specs}</b><br>${p.material}</div>
            <div class="price">${money(p.price)}</div>
          </a>
          ${button}
        </div>
      </div>
    `;
  }).join("");
})();

// Header / footer WhatsApp links (mensaje genérico)
const genericMsg = encodeURIComponent("Hola, vi su catálogo Fera y quiero hacer una pregunta.");
const genericLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${genericMsg}`;
document.getElementById("whatsapp-header").href = genericLink;
document.getElementById("whatsapp-footer").href = genericLink;

// Instagram link
const igEl = document.getElementById("instagram-footer");
if (igEl) {
  if (INSTAGRAM_URL) {
    igEl.href = INSTAGRAM_URL;
  } else {
    igEl.addEventListener("click", (e) => e.preventDefault());
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

let currentDetailImages = [];
let currentDetailIndex = 0;

function setDetailImage(i) {
  const images = currentDetailImages;
  currentDetailIndex = (i + images.length) % images.length;
  document.querySelector("#detailMainImg img").src = images[currentDetailIndex];
  document.querySelectorAll(".detail-thumb").forEach((t, idx) => {
    t.classList.toggle("active", idx === currentDetailIndex);
  });
  const counter = document.getElementById("detailCounter");
  if (counter) counter.textContent = `${currentDetailIndex + 1} / ${images.length}`;
}

function renderDetail(product) {
  const images = product.images && product.images.length ? product.images : [product.img];
  currentDetailImages = images;
  currentDetailIndex = 0;

  const thumbsHTML = images.length > 1
    ? `<div class="detail-thumbs">${images.map((src, i) =>
        `<div class="detail-thumb ${i === 0 ? "active" : ""}" data-src="${src}">
           <img src="${src}" alt="${product.name} foto ${i + 1}">
         </div>`).join("")}</div>`
    : "";

  const arrowsHTML = images.length > 1
    ? `<button class="detail-arrow detail-arrow-prev" aria-label="Foto anterior">&#10094;</button>
       <button class="detail-arrow detail-arrow-next" aria-label="Foto siguiente">&#10095;</button>
       <span class="detail-counter" id="detailCounter">1 / ${images.length}</span>`
    : "";

  const videoHTML = product.video
    ? `<div class="detail-video">
         ${product.video.endsWith(".mp4")
            ? `<video src="${product.video}" controls></video>`
            : `<iframe src="${product.video}" allowfullscreen></iframe>`}
       </div>`
    : "";

  const tag = product.status === "nuevo"
    ? `<span class="tag nuevo">Nuevo</span>`
    : product.status === "agotado"
      ? `<span class="tag agotado">Agotado</span>`
      : "";

  const isAgotado = product.status === "agotado";
  const button = isAgotado
    ? `<div class="soon-note">Próximamente disponible</div><span class="btn disabled">${WHATSAPP_ICON} No disponible</span>`
    : `<a class="btn" href="${whatsappLink(product)}" target="_blank" rel="noopener">${WHATSAPP_ICON} Comprar por WhatsApp</a>`;

  document.getElementById("detailGallery").innerHTML = `
    <div class="detail-main-img" id="detailMainImg">
      ${tag}
      <img src="${images[0]}" alt="${product.collection} ${product.name}">
      ${arrowsHTML}
    </div>
    ${thumbsHTML}
    ${videoHTML}
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

  // Miniaturas: click para saltar a esa foto
  document.querySelectorAll(".detail-thumb").forEach((thumb, i) => {
    thumb.addEventListener("click", () => setDetailImage(i));
  });

  // Flechas prev/next: funcionan para cualquier producto que tenga 2+ fotos
  const prevBtn = document.querySelector(".detail-arrow-prev");
  const nextBtn = document.querySelector(".detail-arrow-next");
  if (prevBtn) prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setDetailImage(currentDetailIndex - 1);
  });
  if (nextBtn) nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setDetailImage(currentDetailIndex + 1);
  });

  // Swipe con el dedo en celular (deslizar la foto para cambiarla)
  if (images.length > 1) {
    const mainImgEl = document.getElementById("detailMainImg");
    let touchStartX = 0;
    mainImgEl.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    mainImgEl.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) < 40) return; // muy corto, no cuenta como swipe
      if (diff < 0) setDetailImage(currentDetailIndex + 1); // deslizó a la izquierda -> siguiente
      else setDetailImage(currentDetailIndex - 1); // deslizó a la derecha -> anterior
    }, { passive: true });

    // Flechas del teclado (izq/der) también funcionan, por si lo ven en compu
    document.addEventListener("keydown", detailKeyHandler);
  }
}

function detailKeyHandler(e) {
  if (e.key === "ArrowLeft") setDetailImage(currentDetailIndex - 1);
  if (e.key === "ArrowRight") setDetailImage(currentDetailIndex + 1);
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
}

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