// ============================================
// FERA — Datos de productos
// Edita aquí para agregar, quitar o modificar productos.
// status: "disponible" | "nuevo" | "agotado"
//
// ── CÓMO AGREGAR MÁS FOTOS O UN VIDEO A UN PRODUCTO ──
// Cada producto puede tener, además de los campos normales,
// estos DOS campos opcionales:
//
//   images: ["assets/foto1.jpg", "assets/foto2.jpg", "assets/foto3.jpg"]
//     -> Todas las fotos que quieras que salgan en la vista de detalle
//        (la primera de la lista es la que se ve primero).
//        Si no pones "images", usa solo la foto normal (el campo "img").
//
//   video: "assets/mi-video.mp4"
//     -> Ruta de un video subido a la carpeta assets/ (formato .mp4),
//        O un link de YouTube tipo: "https://www.youtube.com/embed/XXXXXXXXXXX"
//        (tiene que ser el link que dice "embed", no el link normal del video).
//        Si no pones "video", simplemente no aparece ningún video.
//
// EJEMPLO (no lo copies, es solo referencia):
//
//   { collection: "Pulso Clasics", name: "Figaro", specs: "21.5cm / 4mm",
//     material: "Oro Laminado", price: 375,
//     img: "assets/pulso-figaro.jpg",
//     images: ["assets/pulso-figaro.jpg", "assets/pulso-figaro-2.jpg", "assets/pulso-figaro-puesto.jpg"],
//     video: "assets/pulso-figaro.mp4",
//     status: "disponible" },
//
// ============================================

const WHATSAPP_NUMBER = "522211911972"; // <- tu número con código de país, sin + ni espacios

const PRODUCTS = {

  destacados: [
    { collection: "Pulso Clasics", name: "Figaro Torzal", specs: "20cm / 6mm", material: "Oro Laminado", price: 665, img: "assets/pulso-figaro-torzal.jpg", status: "nuevo" },
    { collection: "Pulso Clasics", name: "Barbada Diamantada", specs: "20cm / 5mm", material: "Plata 925", price: 1160, img: "assets/pulso-barbada-diamantada.jpg", status: "nuevo" },
    { collection: "Cadena Clasics", name: "Torzal", specs: "50cm / 5mm", material: "Oro Laminado", price: 475, img: "assets/cadena-torzal-50.jpg", status: "disponible" },
    { collection: "Van Cleef", name: "Vintage Alhambra", specs: "20cm", material: "Plata 925", price: 1260, img: "assets/vancleef-alhambra-diamante.jpg", status: "agotado" }
  ],

  pulsos: [
    { collection: "Pulso Clasics", name: "Figaro", specs: "21.5cm / 4mm", material: "Oro Laminado", price: 375, img: "assets/pulso-figaro.jpg", status: "disponible" },
    { collection: "Pulso Clasics", name: "Vibora", specs: "17cm / 4mm", material: "Oro Laminado", price: 350, img: "assets/pulso-vibora.jpg", status: "disponible" },
    { collection: "Pulso Clasics", name: "Barbada", specs: "18cm / 4mm", material: "Oro Laminado", price: 350, img: "assets/pulso-barbada.jpg", status: "disponible" },
    { collection: "Pulsera Clasics", name: "Torzal", specs: "21.5cm / 4mm", material: "Oro Laminado", price: 229, img: "assets/pulso-torzal-agotado.jpg", status: "agotado" },
    { collection: "Pulsera Clasics", name: "Pandora", specs: "21.5cm / 4mm", material: "Acero Inoxidable", price: 395, img: "assets/pulsera-pandora.jpg", status: "disponible" },
    { collection: "Pulso Clasics", name: "Figaro Torzal", specs: "20cm / 6mm", material: "Oro Laminado", price: 665, img: "assets/pulso-figaro-torzal.jpg", status: "nuevo" },
    { collection: "Pulso Clasics", name: "Barbada Diamantada", specs: "20cm / 5mm", material: "Plata 925", price: 1160, img: "assets/pulso-barbada-diamantada.jpg", status: "nuevo" },
    { collection: "Pulso Tenis", name: "Diamantado", specs: "20cm / 5mm", material: "Plata 925", price: 1490, img: "assets/pulso-tenis-diamantado.jpg", status: "agotado" },
    
    { collection: "Van Cleef", name: "Vintage Alhambra", specs: "20cm", material: "Plata 925", price: 1260,
    img: "assets/vancleef-blanca-1.png",
    images: [
      "assets/vancleef-blanca-1.png",
      "assets/vancleef-blanca-2.avif",
      "assets/vancleef-blanca-3.avif"
    ],
    status: "nuevo" },





    { collection: "Van Cleef", name: "Vintage Alhambra Onix", specs: "20cm", material: "Plata 925", price: 1260, img: "assets/vancleef-alhambra-negro.jpg", status: "agotado" }
  ],

  cadenas: [
    { collection: "Cadena Clasics", name: "Torzal", specs: "50cm / 5mm", material: "Oro Laminado", price: 475, img: "assets/cadena-torzal-50.jpg", status: "disponible" },
    { collection: "Cadena Clasics", name: "Vibora", specs: "50cm / 5mm", material: "Oro Laminado", price: 400, img: "assets/cadena-vibora.jpg", status: "disponible" },
    { collection: "Cadena Clasics", name: "Tubular", specs: "55cm / 5mm", material: "Oro Laminado", price: 505, img: "assets/cadena-tubular.jpg", status: "disponible" },
    { collection: "Cadena Clasics", name: "Torzal", specs: "45cm / 3mm", material: "Oro Laminado", price: 465, img: "assets/cadena-torzal-45.jpg", status: "disponible" },
    { collection: "Cadena Clasics", name: "Hoja", specs: "55cm / 5mm", material: "Oro Laminado", price: 435, img: "assets/cadena-hoja.jpg", status: "disponible" },
    { collection: "Cadena Clasics", name: "Espiga", specs: "45cm / 2mm", material: "Oro Laminado", price: 450, img: "assets/cadena-espiga.jpg", status: "disponible" },
    { collection: "Collar Clasics", name: "Collar Corazon", specs: "45+5cm / 5mm", material: "Oro Laminado", price: 460, img: "assets/collar-corazon-oro.jpg", status: "disponible" },
    { collection: "Collar Clasics", name: "Collar Corazon", specs: "45+5cm / 5mm", material: "Acero Inoxidable", price: 460, img: "assets/collar-corazon-acero.jpg", status: "disponible" }
  ],

  marca: [
    { collection: "Brazalete HH", name: "Hermes", specs: "19cm / 1.2cm", material: "Acero Inoxidable", price: 1610, img: "assets/brazalete-hh-hero.jpg", status: "agotado" },
    { collection: "Pulsera Trinity", name: "Cartier", specs: "19cm / 1.2cm", material: "Acero Inoxidable", price: 2610, img: "assets/trinity-detalle.jpg", status: "agotado" }
  ]

};