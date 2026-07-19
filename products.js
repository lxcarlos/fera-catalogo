const WHATSAPP_NUMBER = "522211911972"; // <- tu número con código de país, sin + ni espacios

const PRODUCTS = [
  /*"pulso-figaro-torzal"*/
  { id: "pulso-figaro-torzal", sections: ["destacados", "pulsos"],
    collection: "Pulso Clasics", name: "Figaro Torzal", specs: "20cm / 6mm", material: "Oro Laminado", price: 665,
    img: "assets/PULSOS/pulso-figaro-torzal/pulso-figaro-torzal-1.jpg",
    images: [
      "assets/PULSOS/pulso-figaro-torzal/pulso-figaro-torzal-1.jpg",
      "assets/PULSOS/pulso-figaro-torzal/pulso-figaro-torzal-2.jpg",
      "assets/PULSOS/pulso-figaro-torzal/pulso-figaro-torzal-3.jpg"
    ],
    status: "nuevo" },

      /*"pulso-barbado-plata925"*/
  { id: "pulso-barbado-plata925", sections: ["destacados", "pulsos"],
    collection: "Pulso Clasics", name: "Barbada Diamantada", specs: "20cm / 5mm", material: "Plata 925", price: 1160,
    img: "assets/PULSOS/pulso-barbado-plata925/pulso-barbado-plata925-1.jpg",
    images: [
      "assets/PULSOS/pulso-barbado-plata925/pulso-barbado-plata925-1.jpg",
      "assets/PULSOS/pulso-barbado-plata925/pulso-barbado-plata925-2.jpg",
      "assets/PULSOS/pulso-barbado-plata925/pulso-barbado-plata925-3.jpg"
    ],
    video: "assets/PULSOS/pulso-barbado-plata925/VIDEO-pulso-barbado-plata925-1.mp4",
    status: "nuevo" },

    /*"vancleef-diamantada"*/
  { id: "vancleef-diamantada", sections: ["destacados", "pulsos"],
    collection: "Van Cleef", name: "Vintage Alhambra", specs: "20cm", material: "Plata 925", price: 1260,
    img: "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-1.png",
    images: [
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-1.png",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-2.avif",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-3.avif",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-4.jpg",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-5.jpg",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-6.jpg",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-7.jpg",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-8.jpg",
      /*"assets/PULSOS/vancleef-diamantada/vancleef-diamantada-9.jpg",
      "assets/PULSOS/vancleef-diamantada/vancleef-diamantada-10.jpg"*/
    ],
    status: "nuevo" },

    /*"pulso-figaro*/
  { id: "pulso-figaro", sections: ["pulsos"],
    collection: "Pulso Clasics", name: "Figaro", specs: "21.5cm / 4mm", material: "Oro Laminado", price: 375,
    img: "assets/PULSOS/pulso-figaro/pulso-figaro-1.jpg",
    images: [
      "assets/PULSOS/pulso-figaro/pulso-figaro-1.jpg",
      "assets/PULSOS/pulso-figaro/pulso-figaro-2.jpg",
      "assets/PULSOS/pulso-figaro/pulso-figaro-3.jpg"
    ],
    status: "nuevo" },

    /*"pulso-panza-vivora-ol"*/
  { id: "pulso-panza-vivora-ol", sections: ["pulsos"],
    collection: "Pulso Clasics", name: "Vibora", specs: "17cm / 4mm", material: "Oro Laminado", price: 350,
    img: "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-1.jpg",
    images: [
      "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-1.jpg",
      "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-2.jpg",
      "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-3.jpg",
      "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-4.jpg",
      "assets/PULSOS/pulso-panza-vivora-ol/pulso-panza-vivora-ol-5.jpg"
    ],
    status: "nuevo" },

    /*"pulso-barbado"*/
  { id: "pulso-barbado", sections: ["pulsos"],
    collection: "Pulso Clasics", name: "Barbada", specs: "18cm / 4mm", material: "Oro Laminado", price: 350,
    img: "assets/PULSOS/pulso-barbado/pulso-barbado-1.jpg",
    images: [
      "assets/PULSOS/pulso-barbado/pulso-barbado-1.jpg",
      "assets/PULSOS/pulso-barbado/pulso-barbado-2.jpg",
      "assets/PULSOS/pulso-barbado/pulso-barbado-3.jpg"
    ],
    status: "nuevo" },

    /*"pulsera-torzal"*/
  { id: "pulsera-torzal", sections: ["pulsos"],
    collection: "Pulsera Clasics", name: "Torzal", specs: "21.5cm / 4mm", material: "Oro Laminado", price: 229,
    img: "assets/pulso-torzal-broche.jpg", 
    status: "nuevo" },

    /*"pulsera-pandora"*/
  { id: "pulsera-pandora", sections: ["pulsos"],
    collection: "Pulsera Clasics", name: "Pandora", specs: "21.5cm / 4mm", material: "Acero Inoxidable", price: 395,
    img: "assets/pulsera-pandora.jpg", status: "nuevo" },

    /*"pulso-tenis-diamantado"*/
  { id: "pulso-tenis-diamantado", sections: ["pulsos"],
    collection: "Pulso Tenis", name: "Diamantado", specs: "20cm / 5mm", material: "Plata 925", price: 1490,
    img: "assets/PULSOS/pulso-tenis-diamantado/pulso-tenis-diamantado-1.jpg",
    images: [
      "assets/PULSOS/pulso-tenis-diamantado/pulso-tenis-diamantado-1.jpg",
      "assets/PULSOS/pulso-tenis-diamantado/pulso-tenis-diamantado-2.jpg",
      "assets/PULSOS/pulso-tenis-diamantado/pulso-tenis-diamantado-3.jpg",
      "assets/PULSOS/pulso-tenis-diamantado/pulso-tenis-diamantado-4.jpg"
    ],
    status: "nuevo" },

    /*"vancleef-negra"*/
  { id: "vancleef-negra", sections: ["pulsos", "destacados"],
    collection: "Van Cleef", name: "Vintage Alhambra Onix", specs: "20cm", material: "Plata 925", price: 1260,
    img: "assets/PULSOS/vancleef-negra/vancleef-negra-1.jpg",
    images: [
      "assets/PULSOS/vancleef-negra/vancleef-negra-1.jpg",
      "assets/PULSOS/vancleef-negra/vancleef-negra-2.jpg",
      "assets/PULSOS/vancleef-negra/vancleef-negra-3.jpg"
    ],
    status: "nuevo" },

    /*"cadena-torzal-50"*/ /*HAY QUE MODIFICAR PORQUE LA IMAGEN NO ENCAJA */
  { id: "cadena-torzal-50", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Torzal", specs: "50cm / 5mm", material: "Oro Laminado", price: 475,
    img: "assets/CADENAS/cadena-torzal-grande/cadena-torzal-grande-1.jpg", status: "nuevo" },


    /*"cadena-vibora"*/
  { id: "cadena-vibora", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Vibora", specs: "50cm / 5mm", material: "Oro Laminado", price: 400,
    img: "assets/CADENAS/cadena-panza-vibora/cadena-panza-vibora-1.jpg", status: "disponible" },

    /*"cadena-tubular"*/
  { id: "cadena-tubular", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Tubular", specs: "55cm / 5mm", material: "Oro Laminado", price: 505,
    img: "assets/CADENAS/cadena-tubular/cadena-tubular-1.jpg", status: "nuevo" },

    /*"cadena-torzal-CHICA"*/
  { id: "cadena-torzal-45", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Torzal Pequeña", specs: "45cm / 3mm", material: "Oro Laminado", price: 465,
    img: "assets/CADENAS/cadena-torzal-pequeña/cadena-torzal-pequeña-1.jpg", status: "nuevo" },

    /*"cadena-hoja"*/ 
  { id: "cadena-hoja", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Hoja", specs: "55cm / 5mm", material: "Oro Laminado", price: 435,
    img: "assets/CADENAS/cadena-hoja/cadena-hoja-1.jpg", status: "nuevo" },

    /*"cadena-espiga"*/ 
  { id: "cadena-espiga", sections: ["cadenas"],
    collection: "Cadena Clasics", name: "Espiga", specs: "45cm / 2mm", material: "Oro Laminado", price: 450,
    img: "assets/CADENAS/cadena-espiga/cadena-espiga-1.jpg", status: "nuevo" },

    /*collar-corazon-oro*/
  { id: "collar-corazon-oro", sections: ["cadenas"],
    collection: "Collar Clasics", name: "Collar Corazon", specs: "45+5cm / 5mm", material: "Oro Laminado", price: 460,
    img: "assets/CADENAS/collar-corazon-oro/collar-corazon-oro-1.jpg", status: "nuevo" },

    /*collar-corazon-acero*/
  { id: "collar-corazon-acero", sections: ["cadenas"],
    collection: "Collar Clasics", name: "Collar Corazon", specs: "45+5cm / 5mm", material: "Acero Inoxidable", price: 460,
    img: "assets/CADENAS/collar-corazon-acero/collar-corazon-acero-1.jpg", status: "nuevo" },

    /*brazalete-hh-hermes*/
  { id: "brazalete-hh-hermes", sections: ["marca"],
    collection: "Brazalete HH", name: "Hermes", specs: "19cm / 1.2cm", material: "Acero Inoxidable", price: 1610,
    img: "assets/PULSOS/brazalete-hh-hermes/brazalete-hh-hermes-1.jpg", status: "agotado" },

    /*pulsera-trinity-cartier*/
  { id: "pulsera-trinity-cartier", sections: ["marca"],
    collection: "Pulsera Trinity", name: "Cartier", specs: "19cm / 1.2cm", material: "Acero Inoxidable", price: 2610,
    img: "assets/PULSOS/pulsera-cartier/pulsera-cartier-1.jpg", status: "agotado" },

];