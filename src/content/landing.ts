/**
 * Copy de la landing. Fuente de verdad: pantalla desktop de Stitch (D1).
 * Cambios aprobados: "temporada 2025/2026" → 2027 (D2), sin datos de ejemplo
 * precargados en formularios (D6) y textos nuevos de accesibilidad y validación,
 * marcados con "NUEVO" para revisión.
 * Los alt de las imágenes son NUEVOS (redactados a partir del data-alt de Stitch, D8).
 */
import eventBaptisms from '@/assets/images/event-baptisms.webp'
import eventBirthdays from '@/assets/images/event-birthdays.webp'
import eventCorporate from '@/assets/images/event-corporate.webp'
import eventShowers from '@/assets/images/event-showers.webp'
import eventWeddings from '@/assets/images/event-weddings.webp'
import eventXv from '@/assets/images/event-xv.webp'
import galleryCocktailBar from '@/assets/images/gallery-cocktail-bar.webp'
import galleryGardenCeremony from '@/assets/images/gallery-garden-ceremony.webp'
import galleryGardenNight from '@/assets/images/gallery-garden-night.webp'
import galleryTableSetting from '@/assets/images/gallery-table-setting.webp'
import galleryWeddingEntrance from '@/assets/images/gallery-wedding-entrance.webp'
import galleryXvDance from '@/assets/images/gallery-xv-dance.webp'
import heroWedding from '@/assets/images/hero-wedding.webp'
import map from '@/assets/images/map.jpg'
import spaceGarden from '@/assets/images/space-garden.webp'
import spaceSalon from '@/assets/images/space-salon.webp'
import spaceTerrace from '@/assets/images/space-terrace.webp'
import type {
  EventItem,
  FaqItem,
  GalleryFilterId,
  GalleryPhoto,
  IconFeatureItem,
  NavItem,
  PricingPlan,
  ProcessStepItem,
  SelectOption,
  SpaceItem,
  Testimonial,
} from './types'

const CONTACT_HREF = '#contacto'

export const header = {
  navLabel: 'Principal', // NUEVO: nombre del landmark <nav>
  homeLabel: 'Casa Alcanfor, inicio', // NUEVO: nombre del enlace de la marca
  nav: [
    { label: 'Eventos', href: '#eventos' },
    { label: 'Espacios', href: '#espacios' },
    { label: 'Paquetes', href: '#paquetes' },
    { label: 'Galería', href: '#galeria' },
    { label: 'Preguntas', href: '#preguntas' },
  ] satisfies NavItem[],
  cta: { label: 'Agenda tu visita', href: CONTACT_HREF },
  menu: {
    open: 'Abrir menú',
    close: 'Cerrar menú',
    title: 'Menú', // NUEVO: nombre del <dialog>
  },
} as const

export const hero = {
  badge: 'Jardín & Salón de Eventos en Zapopan',
  title: { before: 'Celebra donde cada momento ', emphasis: 'se vuelve recuerdo' },
  description:
    'Bodas, XV años, bautizos y eventos corporativos que se viven sin preocupaciones. Espacios de ensueño, un coordinador contigo de principio a fin y precio cerrado desde el primer día.',
  primaryCta: { label: 'Consulta disponibilidad', href: CONTACT_HREF },
  secondaryCta: { label: 'Recorre el salón', href: '#espacios' },
  highlights: [
    { icon: 'verified', label: 'Garantía de precio cerrado' },
    { icon: 'local-florist', label: '1,800 m² de jardines' },
  ],
  image: {
    src: heroWedding,
    alt: 'Banquete nocturno de boda en un patio de hacienda con arcos de cantera, mesas imperiales de madera y luces cálidas colgantes.',
    width: 1200,
    height: 655,
  },
  imageCard: { eyebrow: 'Jardín Principal', title: 'Cenas bajo el dosel centenario' },
} as const

export const availabilityChecker = {
  title: 'Calculador Exprés de Disponibilidad',
  eventType: {
    label: '¿Qué celebras?',
    options: [
      { value: 'Boda', label: 'Boda de ensueño' },
      { value: 'XV Años', label: 'XV Años' },
      { value: 'Bautizo / Comunión', label: 'Bautizo o Comunión' },
      { value: 'Cumpleaños / Aniversario', label: 'Cumpleaños o Aniversario' },
      { value: 'Corporativo / Gala', label: 'Gala Corporativa' },
      // Graduación no existe en el formulario: se envía como "Otro"
      { value: 'Otro', label: 'Graduación' },
    ] satisfies SelectOption[],
  },
  date: { label: 'Fecha tentativa' },
  guests: {
    label: 'No. de Invitados',
    defaultValue: '101 a 250 invitados',
    options: [
      { value: '50 a 100 invitados', label: '50 a 100 invitados' },
      { value: '101 a 250 invitados', label: '101 a 250 invitados' },
      { value: '251 a 450 invitados', label: '251 a 450 invitados' },
    ] satisfies SelectOption[],
  },
  submit: 'Ver fechas libres',
  // NUEVO (D4): no promete disponibilidad; lleva al formulario
  handoff: 'Completa tus datos y te confirmamos disponibilidad.',
  guestsNote: 'Invitados estimados:', // NUEVO: prefijo con el que el rango llega a "Cuéntanos tu idea"
  responseNote: 'Respuesta en menos de 2 horas en horario de oficina. Sin compromiso.',
} as const

export const trustBar = {
  stats: [
    { icon: 'celebration', tone: 'sage', value: '+1,200', label: 'Eventos realizados con éxito en Zapopan' },
    { icon: 'groups', tone: 'gold', value: 'Hasta 450', label: 'Invitados cómodamente distribuidos' },
    {
      icon: 'star-fill',
      tone: 'neutral',
      value: '4.9 ★',
      valueLabel: '4.9 de 5 estrellas', // NUEVO: lectura accesible de la cifra
      label: 'Más de 380 reseñas verificadas en Google',
    },
  ],
} as const

const eventImage = (src: string, alt: string, height = 437) => ({ src, alt, width: 800, height })

export const events = {
  eyebrow: 'Momentos Memorables',
  title: 'Un escenario hecho a la medida de tu celebración',
  description:
    'Cada evento tiene una vibra única. En Casa Alcanfor adaptamos arquitectura, mantelería, tiempos gastronómicos y producción técnica a tus sueños.',
  carouselLabel: 'Tipos de evento', // NUEVO: nombre de la región desplazable en móvil
  linkLabel: 'Ver detalles y fotos',
  items: [
    {
      title: 'Bodas de Ensueño',
      badge: 'Banquete & Civil',
      description:
        'Ceremonias al aire libre, banquete imperial bajo columnatas de cantera y pista estelar iluminada con luces cálidas de bistro.',
      image: eventImage(
        eventWeddings,
        'Ceremonia de boda en el jardín de la hacienda con arco floral blanco, sillas de madera y faroles entre la vegetación.',
      ),
      galleryFilter: 'bodas',
      linkContext: 'de Bodas de Ensueño',
    },
    {
      title: 'XV Años Inolvidables',
      badge: 'Producción VIP',
      description:
        'Diseño escénico vanguardista, cabina de DJ con robótica de concierto, pistas interactivas y menú juvenil de autor.',
      image: eventImage(eventXv, 'Salón decorado para XV años con centros de mesa florales altos, luces de hada y pista de parquet.'),
      galleryFilter: 'xv',
      linkContext: 'de XV Años',
    },
    {
      title: 'Bautizos y Primeras Comuniones',
      badge: 'Mañanas & Tardes',
      description:
        'Mañanas y tardes de jardín, ambiente familiar íntimo, juegos seguros para niños y carrusel de postres artesanales.',
      image: eventImage(
        eventBaptisms,
        'Banquete familiar de día bajo una veranda con mantelería en tonos pastel, hojas de olivo y jarrones de cerámica.',
        447,
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: 'Cumpleaños y Aniversarios',
      badge: 'Coctelería de Autor',
      description:
        'Cenas maridaje, barras de mixología con tequila y mezcal jalisciense, ambiente acústico o saxofón en vivo al atardecer.',
      image: eventImage(eventBirthdays, 'Terraza de noche con mesas iluminadas por velas y cócteles artesanales de mezcal.'),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: 'Baby Shower y Graduaciones',
      badge: 'Brunch & Jardín',
      description:
        'Espacios frescos y versátiles con decoración botánica personalizada, estaciones de mimosa y servicio de brunch artesanal.',
      image: eventImage(eventShowers, 'Brunch de día en un patio de piedra con guirnaldas florales, estación de mimosas y vista al jardín.'),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: 'Eventos Corporativos y Galas',
      badge: 'Empresas & Galas',
      description:
        'Audio profesional de microfonía, pantallas LED de alta definición, fibra óptica simétrica y servicio de meseros de etiqueta.',
      image: eventImage(
        eventCorporate,
        'Gala corporativa en el salón de techos altos de madera y muros de piedra, con pantallas de proyección y mesas de banquete.',
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
  ] satisfies EventItem[],
} as const

export const promise = {
  eyebrow: 'Nuestra Promesa',
  title: 'La tranquilidad de un evento sin letras chiquitas',
  description:
    'Sabemos el estrés que representa organizar un evento. En Casa Alcanfor unificamos locación, banquete y coordinación bajo un compromiso transparente de excelencia y calidez jalisciense.',
  callout: {
    title: 'Cero sorpresas',
    description:
      'El precio acordado en tu contrato es exactamente lo que pagarás. Sin tarifas ocultas por descorche, energía eléctrica adicional o uso de cocina.',
  },
  features: [
    {
      icon: 'support-agent',
      title: 'Coordinación Dedicada',
      description:
        'Una wedding planner y concierge exclusiva asignada a tu evento desde la firma de tu contrato hasta la partida del último invitado. Ella vela por tu minuto a minuto.',
    },
    {
      icon: 'receipt-long',
      title: 'Precio Cerrado y Transparente',
      description:
        'Cotizaciones desglosadas por persona y por concepto. Sin cargos sorpresa el día de la fiesta ni letras chiquitas. Tu presupuesto se respeta al 100%.',
    },
    {
      icon: 'restaurant',
      title: 'Gastronomía de Alta Escuela',
      description:
        'Cocina propia liderada por chefs jaliscienses con más de 15 años de trayectoria. Incluye cata previa para 4 personas y menús adaptables a cualquier dieta o alergia.',
    },
    {
      icon: 'ac-unit',
      title: 'Jardín y Salón Climatizado',
      description:
        'Disfruta lo mejor de ambos mundos: más de 40 árboles frondosos para cócteles al atardecer y un salón con aire acondicionado integral ante cualquier clima.',
    },
  ] satisfies IconFeatureItem[],
} as const

const spaceImage = (src: string, alt: string, height = 655) => ({ src, alt, width: 1200, height })

export const spaces = {
  eyebrow: 'Nuestros Espacios',
  title: 'Tres atmósferas que se complementan en armonía',
  description:
    'Diseñados para fluir armónicamente entre cóctel de bienvenida, ceremonia y recepción con la elegancia atemporal de una hacienda jalisciense.',
  tabsLabel: 'Espacios de Casa Alcanfor', // NUEVO: nombre del tablist
  items: [
    {
      id: 'salon',
      tab: { label: 'Salón Gran Alcanfor', icon: 'apartment' },
      imageBadge: 'Salón Techado Principal',
      image: spaceImage(
        spaceSalon,
        'Gran salón con techo de vigas de madera, candiles de hierro forjado, arcos de cantera y mesas de banquete sobre piso de parquet.',
      ),
      chips: { capacity: 'Capacidad: 450 pax', area: '620 m²' },
      title: 'Salón Gran Alcanfor',
      description:
        'Espacio techado de majestuosa escala con vigas de madera noble y muros de mampostería artesanal. Equipado con climatización integral silenciosa y tratamiento acústico de alta gama para banquetes inolvidables.',
      specs: [
        { icon: 'groups', label: 'Capacidad', value: 'Hasta 450 pax' },
        { icon: 'square-foot', label: 'Superficie', value: '620 m²' },
        { icon: 'mode-fan', label: 'Ambiente', value: 'Climatizado' },
      ],
      cta: { label: 'Agenda una visita guiada', href: CONTACT_HREF },
    },
    {
      id: 'jardin',
      tab: { label: 'Jardín Los Fresnos', icon: 'nature-people' },
      imageBadge: 'Jardín & Naturaleza',
      image: spaceImage(
        spaceGarden,
        'Jardín botánico de la hacienda al atardecer, con árboles maduros, pasto verde, pérgola y luces de hada.',
        670,
      ),
      chips: { capacity: 'Capacidad: 300 pax', area: '900 m²' },
      title: 'Jardín Los Fresnos',
      description:
        'Césped natural rodeado de fresnos y alcanfores añosos. Cuenta con una elegante carpa arquitectónica retráctil y pabellón cubierto adjunto que aseguran tu evento con plan de lluvia 100% garantizado sin perder el encanto campestre.',
      specs: [
        { icon: 'groups', label: 'Capacidad', value: 'Hasta 300 pax' },
        { icon: 'square-foot', label: 'Superficie', value: '900 m²' },
        { icon: 'umbrella', label: 'Garantía', value: 'Plan lluvia 100%' },
      ],
      cta: { label: 'Agenda una visita guiada', href: CONTACT_HREF },
    },
    {
      id: 'terraza',
      tab: { label: 'Terraza Mirador', icon: 'wb-twilight' },
      imageBadge: 'Área Lounge & Cóctel',
      image: spaceImage(
        spaceTerrace,
        'Terraza colonial con arcos al atardecer, salas lounge, faroles cálidos y balaustradas de piedra.',
      ),
      chips: { capacity: 'Capacidad: 120 pax', area: '210 m²' },
      title: 'Terraza Mirador',
      description:
        'El escenario perfecto para cócteles íntimos, bodas civiles y recepciones boutique. Disfruta de atardeceres dorados inigualables sobre el valle con barra de mixología independiente y mobiliario lounge de autor.',
      specs: [
        { icon: 'groups', label: 'Capacidad', value: 'Hasta 120 pax' },
        { icon: 'square-foot', label: 'Superficie', value: '210 m²' },
        { icon: 'sunny', label: 'Experiencia', value: 'Vista al atardecer' },
      ],
      cta: { label: 'Agenda una visita guiada', href: CONTACT_HREF },
    },
  ] satisfies SpaceItem[],
} as const

export const pricing = {
  eyebrow: 'Experiencias Completas',
  title: 'Inversión clara pensada para que sólo te dediques a disfrutar',
  description:
    'Nuestros paquetes incluyen todo lo esencial sin sorpresas. Puedes personalizar o sumar complementos según el estilo de tu día.',
  featuredLabel: 'Más elegido',
  note: 'Precios de referencia para 2027. Pueden variar según fecha y número de invitados.',
  plans: [
    {
      eyebrow: 'Opción Base',
      title: 'Esencial',
      description: 'Para celebraciones íntimas que buscan calidez, libertad y encanto natural.',
      price: { prefix: 'Desde', amount: '$690', unit: 'por invitado' },
      features: [
        { before: 'Renta de instalaciones por ', strong: '6 horas' },
        'Mobiliario básico en madera y mantelería neutra',
        'Servicio de refresco y hielo ilimitado',
        'Personal de apoyo y vigilancia',
        'Descorche libre nacional sin costo adicional',
      ],
      cta: { label: 'Cotiza este paquete', href: CONTACT_HREF },
    },
    {
      eyebrow: 'Experiencia Recomendada',
      title: 'Celebración',
      description: 'La fórmula favorita con gastronomía, ambientación y producción impecable.',
      price: { prefix: 'Desde', amount: '$950', unit: 'por invitado' },
      features: [
        { before: 'Renta por ', strong: '8 horas completas' },
        'Banquete gourmet de 3 tiempos a elección',
        'Barra libre de coctelería y refrescos por 6 horas',
        'Iluminación arquitectónica y audio profesional',
        'Suite privada para anfitriones',
        'Coordinación dedicada el día del evento',
      ],
      cta: { label: 'Cotiza este paquete', href: CONTACT_HREF },
      featured: true,
    },
    {
      eyebrow: 'All-Inclusive Luxury',
      title: 'Gran Gala',
      description: 'Para anfitriones que desean una celebración magna con el más alto nivel de detalle.',
      price: { prefix: 'Desde', amount: '$1,350', unit: 'por invitado' },
      features: [
        { before: 'Renta exclusiva por ', strong: '10 horas completas' },
        'Banquete de autor de 4 tiempos + tornaboda',
        'Barra libre de destilados prémium por 8 horas',
        'Mobiliario de diseñador y vajilla importada',
        'Show de fuegos pirotécnicos fríos y pista iluminada',
        'Suite con amenidades prémium y wedding planner integral',
      ],
      cta: { label: 'Cotiza este paquete', href: CONTACT_HREF },
    },
  ] satisfies PricingPlan[],
} as const

export const process = {
  eyebrow: 'Proceso Transparente',
  title: 'Planear tu evento nunca fue tan sencillo',
  description: 'Te acompañamos en cada etapa con claridad absoluta, sin tecnicismos ni estrés.',
  steps: [
    {
      number: '01',
      icon: 'edit-note',
      title: 'Cuéntanos tu idea',
      description:
        'Compártenos tu fecha tentativa, número de invitados y el tipo de evento que imaginas para enviarte una propuesta preliminar a tu medida.',
      tag: 'Primer contacto',
    },
    {
      number: '02',
      icon: 'cottage',
      title: 'Visita Casa Alcanfor',
      description:
        'Recorre el salón, los jardines y las terrazas en persona o por videollamada guiada. Disfruta un café con nuestra coordinadora.',
      tag: 'Experiencia sensorial',
    },
    {
      number: '03',
      icon: 'lock-reset',
      title: 'Aparta tu fecha',
      description:
        'Bloquea tu día oficial con un anticipo inicial accesible del 20% y congelamos el precio total por contrato sin letras chiquitas.',
      tag: 'Certeza y contrato',
    },
    {
      number: '04',
      icon: 'celebration',
      title: 'Celebra',
      description:
        'Relájate. Nuestro equipo de coordinación, logística y banquete se encarga de cada detalle para que tú sólo disfrutes con tus invitados.',
      tag: 'Tu gran día',
    },
  ] satisfies ProcessStepItem[],
} as const

const galleryImage = (src: string, alt: string) => ({ src, alt, width: 800, height: 437 })

export const gallery = {
  eyebrow: 'Galería Fotográfica',
  title: 'Cada rincón cuenta una historia',
  filtersLabel: 'Filtrar fotos', // NUEVO: nombre del grupo de filtros
  // NUEVO: anuncio tras filtrar ({count} se reemplaza)
  resultsAnnouncement: 'Mostrando {count} fotos',
  filters: [
    { id: 'todos', label: 'Todos' },
    { id: 'bodas', label: 'Bodas' },
    { id: 'jardin', label: 'Jardín Nocturno' },
    { id: 'detalles', label: 'Banquete & Detalles' },
    { id: 'xv', label: 'XV Años' },
  ] satisfies { id: GalleryFilterId; label: string }[],
  photos: [
    {
      category: 'bodas',
      caption: 'Entrada Nupcial',
      aspect: 'portrait',
      image: galleryImage(
        galleryWeddingEntrance,
        'Novios sonriendo bajo la columnata iluminada de la hacienda, rodeados de olivos y centros de mesa florales.',
      ),
    },
    {
      category: 'jardin',
      caption: 'Jardín Bajo las Estrellas',
      aspect: 'square',
      wide: true,
      image: galleryImage(
        galleryGardenNight,
        'Banquete nocturno en el jardín con luces cálidas entre grandes árboles de alcanfor e invitados cenando.',
      ),
    },
    {
      category: 'detalles',
      caption: 'Montaje de Autor',
      aspect: 'portrait',
      image: galleryImage(
        galleryTableSetting,
        'Detalle de mesa con servilletas de lino, platos de cerámica, cubiertos dorados y arreglo de rosas blancas.',
      ),
    },
    {
      category: 'xv',
      caption: 'Vals & Pista Robótica',
      aspect: 'square',
      image: galleryImage(galleryXvDance, 'Baile de XV años en el gran salón con luces láser, efecto de niebla y pista brillante.'),
    },
    {
      category: 'detalles',
      caption: 'Barra de Coctelería',
      aspect: 'portrait',
      image: galleryImage(
        galleryCocktailBar,
        'Cócteles de autor decorados con romero y toronja sobre la barra exterior de cantera.',
      ),
    },
    {
      category: 'bodas',
      caption: 'Ceremonia en el Jardín',
      aspect: 'square',
      wide: true,
      image: galleryImage(
        galleryGardenCeremony,
        'Ceremonia civil en el jardín con pasillo floral, pérgola rústica de madera y luz dorada entre los árboles.',
      ),
    },
  ] satisfies GalleryPhoto[],
} as const

export const testimonials = {
  eyebrow: 'Historias Reales',
  title: 'La voz de quienes celebraron con nosotros',
  description: 'Más de una década creando recuerdos entrañables para familias y empresas de todo el país.',
  ratingLabel: 'Calificación: {rating} de 5', // NUEVO: lectura accesible de las estrellas
  items: [
    {
      quote:
        '“Nuestra boda en Casa Alcanfor superó todo lo que soñamos. Mariana, nuestra coordinadora, no nos dejó un solo minuto con dudas. La comida fue elogiada por todos los invitados de Guadalajara y CDMX.”',
      author: 'Sofía & Alejandro',
      meta: 'Boda Octubre 2024 · 220 Invitados',
      rating: 5,
    },
    {
      quote:
        '“Los XV años de mi hija Camila fueron mágicos. La iluminación de los árboles y la seguridad del lugar nos dieron una tranquilidad invaluable. Cumplieron todo lo pactado sin un solo peso extra.”',
      author: 'Familia Morales Barba',
      meta: 'XV Años Diciembre 2024 · 180 Invitados',
      rating: 5,
    },
    {
      quote:
        '“El evento de fin de año de nuestra empresa fue impecable. Puntualidad, servicio de meseros de diez y el salón climatizado perfecto. Definitivamente volveremos para nuestra gala 2025.”',
      author: 'Ing. Roberto Delgado',
      meta: 'Director General · Gala Corporativa',
      rating: 5,
    },
  ] satisfies Testimonial[],
} as const

export const ctaBanner = {
  eyebrow: 'Fechas Limitadas por Temporada',
  title: '¿Tienes una fecha especial en mente?',
  description:
    'Las fechas de fin de semana para temporada alta 2027 se reservan con hasta 14 meses de anticipación. Asegura tu día hoy mismo y congela el precio actual.',
  primaryCta: { label: 'Apartar cita en el jardín', href: CONTACT_HREF },
  whatsappCta: 'Hablar directo por WhatsApp',
} as const

export const faq = {
  eyebrow: 'Preguntas Frecuentes',
  title: 'Resolvemos tus dudas con claridad',
  description: 'Todo lo que necesitas saber antes de tu primera visita a Casa Alcanfor.',
  items: [
    {
      question: '¿Con cuánto tiempo de anticipación debo reservar mi fecha?',
      answer:
        'Recomendamos apartar entre 8 y 14 meses antes para bodas y sábados de temporada alta. Para eventos de viernes o domingo, 4 a 6 meses suele ser suficiente.',
    },
    {
      question: '¿Qué incluye cada paquete y qué costo adicional podría surgir?',
      answer:
        'Todos los paquetes incluyen la renta del espacio, mobiliario, mantelería, vajilla fina, personal de servicio, hielo y refresco ilimitado, y seguridad. No hay costos ocultos de limpieza o descorche nacional; cualquier adicional (hora extra, DJ, barra de postres) se cotiza por separado antes de firmar.',
    },
    {
      question: '¿Puedo contratar proveedores externos de música, fotografía o decoración?',
      answer:
        'Sí, totalmente. Tienes libertad absoluta de traer a tus proveedores favoritos sin penalizaciones. Solo solicitamos que asistan al scouting técnico previo con nuestra coordinadora.',
    },
    {
      question: '¿Cómo funciona el plan de lluvia en las áreas de jardín?',
      answer:
        'Contamos con toldos arquitectónicos de alta gama y la garantía inmediata de migración o montaje híbrido en el Gran Salón climatizado sin costo extra imprevisto.',
    },
    {
      question: '¿Cuáles son las formas de pago y su política de cambios de fecha?',
      answer:
        'Se reserva con el 20%, el saldo se divide en cómodas mensualidades sin intereses hasta 15 días antes del evento. Si requieres cambio de fecha por causa de fuerza mayor, reubicamos sin penalización sujeto a calendario con 60 días de aviso.',
    },
    {
      question: '¿Tienen opciones de menú para restricciones dietéticas o veganas?',
      answer:
        'Sí. Nuestro chef ejecutivo diseña adaptaciones vegetarianas, veganas, sin gluten, keto o para comensales con alergias específicas, sin costo adicional en el banquete.',
    },
    {
      question: '¿Los precios incluyen IVA y pueden emitir factura fiscal?',
      answer:
        'Todos nuestros presupuestos desglosan impuestos de manera transparente y emitimos factura electrónica (CFDI) por cada anticipo y abono recibido.',
    },
    {
      question: '¿Las instalaciones cuentan con accesibilidad para personas con movilidad reducida?',
      answer:
        'Sí, todas las áreas de jardín, terrazas, salón principal y sanitarios cuentan con rampas suaves de cantera, accesos a nivel de piso y espacios acondicionados sin escalones pronunciados.',
    },
  ] satisfies FaqItem[],
} as const

export const quoteForm = {
  eyebrow: 'Contacto Directo',
  title: 'Solicita tu cotización',
  description:
    'Llena este breve formulario y en menos de 2 horas un coordinador te enviará propuesta personalizada con fechas libres y cotización formal.',
  fields: {
    name: { label: 'Nombre completo', placeholder: 'Ej. Mariana González' },
    phone: { label: 'WhatsApp', placeholder: 'Ej. 33 0000 0000' },
    email: { label: 'Correo', placeholder: 'ejemplo@correo.example' },
    eventType: {
      label: 'Tipo de evento',
      placeholder: 'Selecciona una opción',
      options: [
        { value: 'Boda', label: 'Boda' },
        { value: 'XV Años', label: 'XV Años' },
        { value: 'Bautizo / Comunión', label: 'Bautizo o Primera Comunión' },
        { value: 'Cumpleaños / Aniversario', label: 'Cumpleaños o Aniversario' },
        { value: 'Corporativo / Gala', label: 'Evento Corporativo o Gala' },
        { value: 'Otro', label: 'Otro festejo especial' },
      ] satisfies SelectOption[],
    },
    date: { label: 'Fecha tentativa' },
    guests: { label: 'Número de invitados', placeholder: 'Ej. 180', min: 50, max: 500 },
    comments: {
      label: 'Cuéntanos tu idea',
      placeholder: 'Cuéntanos si requieres ceremonia civil en jardín, banquete en salón, fecha flexible, etc.',
    },
    // Del diseño móvil (D6); sin marcar por defecto
    privacy: 'Acepto el aviso de privacidad y autorizo el envío de cotización y recordatorio por WhatsApp.',
  },
  // NUEVO salvo phone (copy del diseño): mensajes de validación
  errors: {
    name: 'Escribe tu nombre completo.',
    phone: 'Escribe un número de WhatsApp de 10 dígitos.',
    email: 'Escribe un correo válido, por ejemplo ejemplo@correo.example.',
    eventType: 'Selecciona el tipo de evento.',
    date: 'Elige una fecha tentativa a partir de hoy.',
    guests: 'El número de invitados debe estar entre 50 y 500.',
    privacy: 'Acepta el aviso de privacidad para continuar.',
  },
  // NUEVO: resumen de errores al enviar ({count} se reemplaza)
  errorSummary: {
    title: 'Revisa los campos marcados',
    count: 'Hay {count} campos por corregir:',
    countOne: 'Hay 1 campo por corregir:',
  },
  submit: 'Enviar solicitud',
  privacyNote: 'Tus datos están protegidos. No compartimos tu información con terceros ni enviamos spam.',
  success: {
    title: '¡Solicitud recibida con éxito!',
    description:
      'Nuestro coordinador de eventos se comunicará contigo vía WhatsApp o llamada en breve para compartir el presupuesto formal y disponibilidad de fechas.',
  },
  submitError: 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.', // NUEVO
} as const

export const location = {
  eyebrow: 'Ubicación Estratégica',
  title: 'Ven a conocernos',
  labels: {
    address: 'Dirección',
    hours: 'Horarios para Visitas Guiadas',
    phone: 'Atención Telefónica y WhatsApp',
  },
  map: {
    image: { src: map, alt: '', width: 800, height: 800 },
    label: 'Zapopan Poniente · Fácil acceso vehicular',
    link: 'Abrir GPS',
  },
} as const

export const footer = {
  description:
    'Hacienda contemporánea de hospitalidad artesanal y jardines centenarios en el corazón de Zapopan, Jalisco.',
  headings: {
    location: 'Ubicación',
    hours: 'Horario de Atención',
    social: 'Social',
  },
  hoursNote: 'Visitas guiadas previa reservación',
  // D7: sin URL real no se renderizan
  social: [
    { label: 'Instagram', icon: 'photo-camera', href: null },
    { label: 'Facebook', icon: 'public', href: null },
    { label: 'Contacto', icon: 'mail', href: null },
  ],
  legal: [
    { label: 'Aviso de Privacidad', href: null },
    { label: 'Términos de Servicio', href: null },
  ],
  copyright: '© {year} Casa Alcanfor. Todos los derechos reservados. Zapopan, Jalisco.',
} as const

export const floatingContact = {
  bubble: '¿Tienes dudas? Escríbenos',
  whatsappLabel: 'Contacto por WhatsApp',
  mobileCta: { label: 'Consulta disponibilidad', href: CONTACT_HREF },
} as const
