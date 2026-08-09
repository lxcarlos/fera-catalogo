// products.js
// El número de WhatsApp y los productos ya no se escriben aquí a mano —
// los productos se cargan desde Supabase. El número de WhatsApp sí se
// queda fijo aquí porque no cambia seguido.

const WHATSAPP_NUMBER = "522211911972";

let PRODUCTS = [];

async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error);
    return;
  }

  PRODUCTS = data.map(p => ({
    id: p.id,
    sections: p.sections || [],
    collection: p.collection,
    name: p.name,
    specs: p.specs,
    material: p.material,
    price: Number(p.price),
    img: p.img,
    images: p.images || [],
    video: p.video,
    description: p.description,
    status: p.status
  }));

  document.dispatchEvent(new CustomEvent("productsReady"));
}

loadProducts();