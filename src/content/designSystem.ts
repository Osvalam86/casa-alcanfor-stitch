/**
 * Copy de la página interna del sistema de diseño (/design-system, noindex).
 * Textos tomados de la pantalla "Sistema de Diseño · Warm Hacienda Editorial" de Stitch
 * y, para los ejemplos de componentes, de la pantalla desktop.
 */
import eventWeddings from '@/assets/images/event-weddings.jpg'
import galleryGardenNight from '@/assets/images/gallery-garden-night.jpg'
import heroWedding from '@/assets/images/hero-wedding.jpg'

export const designSystem = {
  meta: {
    title: 'Sistema de Diseño · Casa Alcanfor',
  },
  intro: {
    eyebrow: 'Documentación Viva',
    title: 'Sistema de Diseño · Casa Alcanfor',
    description:
      'Fundamentos visuales, escala modular y biblioteca de componentes basada en Atomic Design para la experiencia digital de Casa Alcanfor (Zapopan, Jalisco).',
    navLabel: 'Secciones del sistema de diseño',
    nav: [
      { id: 'tokens', label: '01. Tokens & Fundamentos' },
      { id: 'atomos', label: '02. Átomos' },
      { id: 'moleculas', label: '03. Moléculas' },
      { id: 'superficie-oscura', label: '04. Superficie oscura' },
    ],
    homeLink: 'Ver la landing',
  },
  tokens: {
    eyebrow: 'Fundamentos 01',
    title: 'Design Tokens & Variables',
    description: 'Gama cromática botánica, gradientes de luz de Zapopan, ritmo tipográfico y métricas dimensionales.',
    colorsTitle: 'Paleta Cromática del Sistema',
    colorGroups: {
      surfaces: 'Superficies & Cantera / Lienzo',
      text: 'Texto',
      accent: 'Oro Envejecido / Acentos Cálidos',
      actions: 'Acciones & Verde Alcanfor',
      states: 'Semánticos & Estados de Validación',
    },
    typographyTitle: 'Escala Tipográfica Modular',
    typographySample: 'Celebraciones Inolvidables',
    bodySample: 'Texto editorial para introducciones destacadas, sinopsis de espacios y citas con carácter.',
    captionSample: 'Respuesta en menos de 2 horas en horario de oficina. Presupuestos formales sin compromiso.',
    eyebrowSample: 'Jardín & Salón de Eventos en Zapopan · Jalisco 2027',
    spacingTitle: 'Escala de Espaciado (Padding & Margin)',
    radiiTitle: 'Elevaciones Naturales & Arcos de Cantera',
  },
  atoms: {
    eyebrow: 'Atomic Design 02',
    title: 'Átomos del Sistema',
    description:
      'Componentes indivisibles: botones botánicos, inputs de formulario, píldoras informativas y simbología editorial.',
    buttonsTitle: 'Botones & Acciones Táctiles',
    buttonGroups: {
      primary: '01. Botón Primario',
      secondary: '02. Botón Secundario (Contorno Sutil)',
      accent: '03. Botón Acento (Antique Gold & Ghost)',
      sizes: '04. Escala de Tamaños (Small / Medium / Large)',
    },
    buttons: {
      primary: 'Reservar Recorrido',
      disabled: 'No Disponible',
      loadingDemo: 'Simular carga',
      secondary: 'Descargar Brochure (PDF)',
      outline: 'Cotiza este paquete',
      secondaryDisabled: 'Descarga Inactiva',
      accent: 'Atención Concierge',
      textAction: 'Ver plano del salón',
      small: 'Small (36px)',
      medium: 'Medium Default (44px)',
      large: 'Large Hero (52px)',
    },
    linksTitle: 'Enlaces',
    links: {
      arrow: 'Ver detalles y fotos',
      arrowContext: 'de Bodas de Ensueño',
      inline: 'Aviso de Privacidad',
      caps: 'Abrir GPS',
      phone: '33 0000 0000',
    },
    iconButtonsTitle: 'Botones de ícono',
    iconButtons: {
      menu: 'Abrir menú',
      close: 'Cerrar menú',
      whatsapp: 'Contacto por WhatsApp',
    },
    inputsTitle: 'Campos de Entrada (Form Inputs)',
    inputs: {
      name: { label: 'Nombre completo', placeholder: 'Ej. Mariana González', hint: 'Estado vacío por defecto' },
      date: { label: 'Fecha tentativa', value: '2027-10-16', hint: 'Estado con dato / Seleccionado' },
      phone: {
        label: 'WhatsApp',
        value: '331290',
        error: 'Escribe un número de WhatsApp de 10 dígitos.',
      },
      folio: { label: 'Folio de Cotización', value: 'CA-2027-0941', hint: 'Bloqueado por sistema' },
      eventType: {
        label: 'Tipo de evento',
        placeholder: 'Selecciona una opción',
        options: ['Boda', 'XV Años', 'Bautizo o Primera Comunión', 'Cumpleaños o Aniversario', 'Evento Corporativo o Gala', 'Otro festejo especial'],
      },
      comments: {
        label: 'Cuéntanos tu idea',
        placeholder: 'Cuéntanos si requieres ceremonia civil en jardín, banquete en salón, fecha flexible, etc.',
      },
      privacy: 'Acepto el aviso de privacidad y autorizo el envío de cotización y recordatorio por WhatsApp.',
    },
    badgesTitle: 'Insignias & Píldoras de Estado',
    badges: {
      featured: 'Más Elegido',
      recommended: 'Recomendado 2027',
      season: 'Temporada Alta',
      climate: 'Climatizado',
      rain: 'Plan Lluvia Garantizado',
      area: '620 m² de Salón',
      available: 'Disponible',
      blocked: 'Fecha Bloqueada',
      limited: 'Cupo Limitado (3 fechas)',
      onImage: 'Salón Techado Principal',
      sage: 'Banquete & Civil',
    },
    iconsTitle: 'Iconografía Editorial (Material Symbols)',
    typographyAtomsTitle: 'Títulos, texto y antetítulos',
    imagesTitle: 'Imagen y arco de hacienda',
    image: {
      src: heroWedding,
      alt: 'Banquete nocturno de boda en un patio de hacienda con arcos de cantera, mesas imperiales de madera y luces cálidas.',
    },
    dividersTitle: 'Separadores y carga',
    spinnerLabel: 'Cargando',
  },
  molecules: {
    eyebrow: 'Atomic Design 03',
    title: 'Moléculas Compuestas',
    description:
      'Uniones de átomos con propósitos funcionales específicos: verificador de fechas, tarjetas de espacio, fichas testimoniales y acordeones.',
    sectionHeader: {
      eyebrow: 'Momentos Memorables',
      title: 'Un escenario hecho a la medida de tu celebración',
      description:
        'Cada evento tiene una vibra única. En Casa Alcanfor adaptamos arquitectura, mantelería, tiempos gastronómicos y producción técnica a tus sueños.',
    },
    labels: {
      sectionHeader: 'SectionHeader',
      iconFeature: 'IconFeature (bento y fila móvil)',
      stats: 'StatItem (barra de confianza)',
      specs: 'SpecItem (ficha de espacio)',
      eventCard: 'EventCard',
      pricing: 'PricingCard',
      process: 'ProcessStep',
      gallery: 'GalleryItem',
      testimonial: 'TestimonialCard',
      accordion: 'AccordionItem',
      contact: 'ContactInfoItem',
      filters: 'FilterChip',
      formField: 'FormField',
      brand: 'BrandLockup',
      alerts: 'Alert',
    },
    iconFeature: {
      title: 'Coordinación Dedicada',
      description:
        'Una wedding planner y concierge exclusiva asignada a tu evento desde la firma de tu contrato hasta la partida del último invitado. Ella vela por tu minuto a minuto.',
      inlineTitle: 'Precio Cerrado y Transparente',
      inlineDescription:
        'Cotizaciones desglosadas por persona y por concepto. Sin cargos sorpresa el día de la fiesta ni letras chiquitas. Tu presupuesto se respeta al 100%.',
    },
    stats: [
      { value: '+1,200', label: 'Eventos realizados con éxito en Zapopan' },
      { value: 'Hasta 450', label: 'Invitados cómodamente distribuidos' },
      { value: '4.9 ★', valueLabel: '4.9 de 5 estrellas', label: 'Más de 380 reseñas verificadas en Google' },
    ],
    specs: [
      { label: 'Capacidad', value: 'Hasta 450 pax' },
      { label: 'Superficie', value: '620 m²' },
      { label: 'Ambiente', value: 'Climatizado' },
    ],
    eventCard: {
      title: 'Bodas de Ensueño',
      description:
        'Ceremonias al aire libre, banquete imperial bajo columnatas de cantera y pista estelar iluminada con luces cálidas de bistro.',
      badge: 'Banquete & Civil',
      image: {
        src: eventWeddings,
        alt: 'Ceremonia de boda en el jardín con arco floral blanco, sillas de madera y faroles entre la vegetación.',
      },
      link: { label: 'Ver detalles y fotos', href: '/?galeria=bodas#galeria' },
    },
    pricing: [
      {
        eyebrow: 'Opción Base',
        title: 'Esencial',
        description: 'Para celebraciones íntimas que buscan calidez, libertad y encanto natural.',
        price: { prefix: 'Desde', amount: '$690', unit: 'por invitado' },
        features: [
          'Mobiliario básico en madera y mantelería neutra',
          'Servicio de refresco y hielo ilimitado',
          'Descorche libre nacional sin costo adicional',
        ],
        cta: { label: 'Cotiza este paquete', href: '#moleculas' },
      },
      {
        eyebrow: 'Experiencia Recomendada',
        title: 'Celebración',
        description: 'La fórmula favorita con gastronomía, ambientación y producción impecable.',
        price: { prefix: 'Desde', amount: '$950', unit: 'por invitado' },
        features: [
          'Banquete gourmet de 3 tiempos a elección',
          'Barra libre de coctelería y refrescos por 6 horas',
          'Coordinación dedicada el día del evento',
        ],
        cta: { label: 'Cotiza este paquete', href: '#moleculas' },
        featuredLabel: 'Más elegido',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Cuéntanos tu idea',
        description:
          'Compártenos tu fecha tentativa, número de invitados y el tipo de evento que imaginas para enviarte una propuesta preliminar a tu medida.',
        tag: 'Primer contacto',
      },
      {
        number: '04',
        title: 'Celebra',
        description:
          'Relájate. Nuestro equipo de coordinación, logística y banquete se encarga de cada detalle para que tú sólo disfrutes con tus invitados.',
        tag: 'Tu gran día',
      },
    ],
    gallery: {
      image: {
        src: galleryGardenNight,
        alt: 'Jardín de noche con luces cálidas entre grandes árboles de alcanfor e invitados cenando.',
      },
      caption: 'Jardín Bajo las Estrellas',
    },
    testimonial: {
      quote:
        '“Nuestra boda en Casa Alcanfor superó todo lo que soñamos. Mariana, nuestra coordinadora, no nos dejó un solo minuto con dudas. La comida fue elogiada por todos los invitados de Guadalajara y CDMX.”',
      author: 'Sofía & Alejandro',
      meta: 'Boda Octubre 2024 · 220 Invitados',
      ratingLabel: 'Calificación: 5 de 5',
    },
    accordion: [
      {
        question: '¿Con cuánto tiempo de anticipación debo reservar mi fecha?',
        answer:
          'Recomendamos apartar entre 8 y 14 meses antes para bodas y sábados de temporada alta. Para eventos de viernes o domingo, 4 a 6 meses suele ser suficiente.',
      },
      {
        question: '¿Cómo funciona el plan de lluvia en las áreas de jardín?',
        answer:
          'Contamos con toldos arquitectónicos de alta gama y la garantía inmediata de migración o montaje híbrido en el Gran Salón climatizado sin costo extra imprevisto.',
      },
    ],
    contactLabels: { address: 'Dirección', hours: 'Horarios para Visitas Guiadas', phone: 'Atención Telefónica y WhatsApp' },
    filters: ['Todos', 'Bodas', 'Jardín Nocturno', 'Banquete & Detalles', 'XV Años'],
    alerts: {
      successTitle: '¡Solicitud recibida con éxito!',
      success:
        'Nuestro coordinador de eventos se comunicará contigo vía WhatsApp o llamada en breve para compartir el presupuesto formal y disponibilidad de fechas.',
      info: 'Precios de referencia para 2027. Pueden variar según fecha y número de invitados.',
      errorTitle: 'Revisa los campos marcados',
      error: 'Escribe un número de WhatsApp de 10 dígitos.',
    },
  },
  inverse: {
    eyebrow: 'Fechas Limitadas por Temporada',
    title: '¿Tienes una fecha especial en mente?',
    description: 'Superficie oscura para validar el color del foco (oro claro sobre verde alcanfor).',
    primary: 'Apartar cita en el jardín',
    secondary: 'Hablar directo por WhatsApp',
    accent: 'Cotiza este paquete',
    link: 'Aviso de Privacidad',
  },
  footer: 'Casa Alcanfor Design System · Zapopan, Jalisco',
} as const
