(function () {
  "use strict";

  window.__BRAND__ = {
    name: "VG Designs",
    person: "Vicente Gómez",
    location: "Puerto Montt, Chile",
    founded: "2024",
    tagline: "Diseño que vende.",

    contact: {
      whatsapp: "56963074376",
      whatsappDisplay: "+56 9 6307 4376",
      email: "vg.desings@gmail.com",
      instagramHandle: "@vg_desings",
      instagramUrl: "https://instagram.com/vg_desings"
    },

    services: [
      { n: "01", tag: "BASE", color: "red", title: "Diseño Web", desc: "Landing de una sección, rápida y lista para vender desde el día uno." },
      { n: "02", tag: null, color: "green", title: "Branding", desc: "Sistema de marca completo: del logo al lenguaje visual." },
      { n: "03", tag: null, color: "blue", title: "Logos", desc: "Marcas memorables construidas desde una idea sólida." },
      { n: "04", tag: "48H", color: "yellow", title: "Flyers", desc: "Piezas con jerarquía clara y tipografía con carácter." },
      { n: "05", tag: null, color: "red", title: "Video / Reels", desc: "Edición con dirección de arte para Instagram y TikTok." },
      { n: "06", tag: null, color: "green", title: "Redes Sociales", desc: "Contenido mensual con estética consistente." }
    ],

    pricing2026: {
      categories: [
        {
          label: "Diseño Web", color: "red",
          items: [
            { tag: "01", name: "Plan Inicial", price: 180000, priceLabel: "Desde $180.000 CLP", pitch: "Todo lo necesario para comenzar con una presencia web profesional.", features: ["One page profesional", "Diseño responsive", "Servicios principales", "Información del negocio", "WhatsApp / contacto", "SEO básico"] },
            { tag: "02", name: "Profesional", price: 380000, priceLabel: "Desde $380.000 CLP", recommended: true, pitch: "La mejor relación precio/servicio para una marca que quiere verse seria.", features: ["Sitio multipágina", "Formularios de contacto", "SEO optimizado + Analytics", "Integraciones a medida", "Secciones personalizadas"] },
            { tag: "03", name: "Premium", price: 620000, priceLabel: "Desde $620.000 CLP", pitch: "Sitio avanzado con máxima personalización y funcionalidades a medida.", features: ["Personalización avanzada", "Integraciones avanzadas", "SEO avanzado", "Funcionalidades a medida"] }
          ]
        },
        {
          label: "Identidad & Marca", color: "green",
          items: [
            { tag: "02", name: "Branding", price: 160000, oldPrice: 220000, discount: "-25%", features: ["Logo principal + variantes", "Paleta y tipografía", "Manual básico PDF"] },
            { tag: "03", name: "Logos", price: 55000, oldPrice: 80000, discount: "-30%", features: ["2 propuestas", "3 rondas de cambios", "Archivos vectoriales"] }
          ]
        },
        {
          label: "Contenido", color: "yellow",
          items: [
            { tag: "04", name: "Flyers", price: 19000, oldPrice: 30000, discount: "-35%", features: ["Diseño en 48h", "Formato print + redes", "2 correcciones"] },
            { tag: "05", name: "Video / Reels", price: 39000, oldPrice: 60000, discount: "-35%", features: ["Reel hasta 60s", "Música + subtítulos", "Color grading"] }
          ]
        }
      ],
      combos: [
        { name: "Pack Marca", desc: "Logo + Branding + 3 Flyers", price: 220000, oldPrice: 297000 },
        { name: "Pack Digital", desc: "Diseño Web + Logo + 4 Reels", price: 420000, oldPrice: 611000 },
        { name: "Pack Total", desc: "Web + Branding + Redes Sociales (1 mes)", price: 480000, oldPrice: 730000 }
      ]
    },
    pricingNote: "Precios referenciales de campaña 2026 — cada proyecto se confirma según alcance real.",

    work: [
      { name: "Empanadas PiedrAzul", type: "Logo + identidad", quote: "Vicente entendió al toque la esencia de PiedrAzul. El logo y el sitio web nos posicionaron.", color: "red" },
      { name: "Funko Nation Chile", type: "Logo", quote: "El logo levantó el alcance de forma real. Diseño con propósito, no relleno.", color: "blue" },
      { name: "Nogal Remodelaciones", type: "Logo + identidad", quote: "Pasamos de una imagen improvisada a un sistema visual sólido que transmite confianza.", color: "yellow" }
    ],

    featuredCase: {
      client: "Centro Médico Veterinario Austral",
      location: "Puerto Montt",
      url: "veterinariaaustral.cl",
      title: "Diseño web + identidad digital",
      bullets: [
        "Sitio completo con urgencias 24h y galería",
        "Sistema de reserva de horas online",
        "Diseño responsive y optimizado para móvil",
        "Integración de WhatsApp y contacto directo"
      ],
      heroLine: "Cuidado veterinario 24 horas en Puerto Montt."
    }
  };
})();
