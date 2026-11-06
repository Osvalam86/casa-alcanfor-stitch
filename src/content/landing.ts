/**
 * Copy de la landing. Fuente de verdad: pantalla desktop de Stitch (D1).
 * Cambios aprobados: "temporada 2025/2026" → 2027 (D2), sin datos de ejemplo
 * precargados en formularios (D6) y textos nuevos de accesibilidad y validación,
 * marcados con "NUEVO" para revisión.
 * Los alt de las imágenes son NUEVOS (redactados a partir del data-alt de Stitch, D8) y se
 * revisaron en QA mirando cada foto: describen lo que se ve, sin repetir el texto que las rodea.
 */
import { images } from '@/assets/images/generated/manifest'
import type {
  EventItem,
  FaqItem,
  GalleryFilterId,
  GalleryPhoto,
  IconFeatureItem,
  ImageContent,
  NavItem,
  PricingPlan,
  ProcessStepItem,
  ResponsiveImage,
  SelectOption,
  SpaceItem,
  Testimonial,
} from './types'

// Fotos con variantes AVIF (pnpm images); el alt se escribe aquí, mirando cada foto
const {
  eventBaptisms,
  eventBaptismsSquare,
  eventBirthdays,
  eventBirthdaysSquare,
  eventCorporate,
  eventCorporateSquare,
  eventShowers,
  eventShowersSquare,
  eventWeddings,
  eventWeddingsSquare,
  eventXv,
  eventXvSquare,
  galleryCocktailBar,
  galleryGardenCeremony,
  galleryGardenNight,
  galleryTableSetting,
  galleryWeddingEntrance,
  galleryXvDance,
  heroVertical,
  map,
  spaceGarden,
  spaceSalon,
  spaceTerrace,
} = images

const withAlt = (image: ResponsiveImage, alt: string): ImageContent => ({ ...image, alt })

const CONTACT_HREF = '#contacto'

export const header = {
  navLabel: 'Principal', // NUEVO: nombre del landmark <nav>
  homeLabel: ', ir al inicio', // NUEVO: complemento oculto del nombre del enlace de la marca (2.5.3)
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
  badge: 'Jardín & salón de eventos en Zapopan',
  title: { before: 'Celebra donde cada momento ', emphasis: 'se vuelve recuerdo' },
  description:
    'Bodas, XV años, bautizos y eventos corporativos que se viven sin preocupaciones. Espacios de ensueño, un coordinador contigo de principio a fin y precio cerrado desde el primer día.',
  primaryCta: { label: 'Consulta disponibilidad', href: CONTACT_HREF },
  secondaryCta: { label: 'Recorre el salón', href: '#espacios' },
  highlights: [
    { icon: 'verified', label: 'Garantía de precio cerrado' },
    { icon: 'local-florist', label: '1,800 m² de jardines' },
  ],
  image: withAlt(
    heroVertical,
    'Invitados brindan al atardecer en una mesa larga con velas, flores blancas y jarrones de barro, en el patio empedrado de una hacienda con arcos de cantera, buganvilias y series de luces.',
  ),
  imageCard: { eyebrow: 'Jardín principal', title: 'Cenas bajo el dosel centenario' },
} as const

export const availabilityChecker = {
  title: 'Calculador exprés de disponibilidad',
  eventType: {
    label: '¿Qué celebras?',
    // Los value son datos del formulario (se envían tal cual); solo cambia el texto visible
    options: [
      { value: 'Boda', label: 'Boda de ensueño' },
      { value: 'XV Años', label: 'XV años' },
      { value: 'Bautizo / Comunión', label: 'Bautizo o comunión' },
      { value: 'Cumpleaños / Aniversario', label: 'Cumpleaños o aniversario' },
      { value: 'Corporativo / Gala', label: 'Gala corporativa' },
      // Graduación no existe en el formulario: se envía como "Otro"
      { value: 'Otro', label: 'Graduación' },
    ] satisfies SelectOption[],
  },
  date: { label: 'Fecha tentativa' },
  guests: {
    label: 'Núm. de invitados',
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

/**
 * Espacio de no separación en los títulos de eventos: une «de» e «y» con la palabra siguiente
 * para que no queden solas al final de línea (la tarjeta compacta es angosta). No cambia el copy.
 */
const NBSP = String.fromCharCode(160)

/** Foto completa + recorte 1:1 para la miniatura de la tarjeta compacta; mismo alt (es la misma escena) */
const eventImage = (image: ResponsiveImage, square: ResponsiveImage, alt: string) => ({ ...withAlt(image, alt), square })

export const events = {
  eyebrow: 'Momentos memorables',
  title: 'Un escenario hecho a la medida de tu celebración',
  description:
    'Cada evento tiene una vibra única. En Casa Alcanfor adaptamos arquitectura, mantelería, tiempos gastronómicos y producción técnica a tus sueños.',
  linkLabel: 'Ver detalles y fotos',
  items: [
    {
      title: `Bodas de${NBSP}ensueño`,
      badge: 'Banquete & civil',
      description:
        'Ceremonias al aire libre, banquete imperial bajo columnatas de cantera y pista estelar iluminada con luces cálidas de bistró.',
      image: eventImage(
        eventWeddings,
        eventWeddingsSquare,
        'Altar en el jardín con arco de flores blancas y cortinas de gasa; un pasillo de piedra con pétalos y faroles separa a los invitados sentados en sillas de madera.',
      ),
      galleryFilter: 'bodas',
      linkContext: 'de bodas de ensueño',
    },
    {
      title: 'XV años inolvidables',
      badge: 'Producción VIP',
      description:
        'Diseño escénico vanguardista, cabina de DJ con robótica de concierto, pistas interactivas y menú juvenil de autor.',
      image: eventImage(
        eventXv,
        eventXvSquare,
        'Salón iluminado en tonos rosa y lila con letras luminosas «XV» al fondo, invitados bailando en la pista de parquet y mesas redondas con centros florales altos.',
      ),
      galleryFilter: 'xv',
      linkContext: 'de XV años',
    },
    {
      title: `Bautizos y${NBSP}primeras comuniones`,
      badge: 'Mañanas & tardes',
      description:
        'Mañanas y tardes de jardín, ambiente familiar íntimo, juegos seguros para niños y carrusel de postres artesanales.',
      image: eventImage(
        eventBaptisms,
        eventBaptismsSquare,
        'Comida familiar de día en una mesa larga bajo los arcos de una veranda; al centro, una pareja sostiene a un bebé con ropón blanco entre flores blancas y guías de olivo.',
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: `Cumpleaños y${NBSP}aniversarios`,
      badge: 'Coctelería de autor',
      description:
        'Cenas maridaje, barras de mixología con tequila y mezcal jalisciense, ambiente acústico o saxofón en vivo al atardecer.',
      image: eventImage(
        eventBirthdays,
        eventBirthdaysSquare,
        'Amigos brindando con margaritas en una cena nocturna en el patio, entre velas y un pastel de cumpleaños, con un trío de cuerdas tocando al fondo.',
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: `Baby shower y${NBSP}graduaciones`,
      badge: 'Brunch & jardín',
      description:
        'Espacios frescos y versátiles con decoración botánica personalizada, estaciones de mimosa y servicio de brunch artesanal.',
      // TODO(foto): la imagen muestra una graduación, no un baby shower. Entre las fotos descargadas
      // de Stitch (design/images) no hay una de baby shower: falta conseguirla o generarla.
      // El alt describe lo que sí se ve (la graduación).
      image: eventImage(
        eventShowers,
        eventShowersSquare,
        'Graduados con toga y birrete brindan con su familia en una mesa larga bajo una pérgola con flores, junto a una barra de mimosas y jugos.',
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
    {
      title: `Eventos corporativos y${NBSP}galas`,
      badge: 'Empresas & galas',
      description:
        'Audio profesional de microfonía, pantallas LED de alta definición, fibra óptica simétrica y servicio de meseros de etiqueta.',
      image: eventImage(
        eventCorporate,
        eventCorporateSquare,
        'Ceremonia de premiación en el salón de vigas de madera y muros de piedra: invitados en mesas redondas miran un escenario con pantalla y oradores en el podio.',
      ),
      galleryFilter: 'todos',
      linkContext: 'en la galería completa',
    },
  ] satisfies EventItem[],
} as const

export const promise = {
  eyebrow: 'Nuestra promesa',
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
      title: 'Coordinación dedicada',
      description:
        'Un coordinador de bodas y concierge exclusivo asignado a tu evento desde la firma de tu contrato hasta la partida del último invitado. Él vela por tu minuto a minuto.',
    },
    {
      icon: 'receipt-long',
      title: 'Precio cerrado y transparente',
      description:
        'Cotizaciones desglosadas por persona y por concepto. Sin cargos sorpresa el día de la fiesta ni letras chiquitas. Tu presupuesto se respeta al 100%.',
    },
    {
      icon: 'restaurant',
      title: 'Gastronomía de alta escuela',
      description:
        'Cocina propia liderada por chefs jaliscienses con más de 15 años de trayectoria. Incluye cata previa para 4 personas y menús adaptables a cualquier dieta o alergia.',
    },
    {
      icon: 'ac-unit',
      title: 'Jardín y salón climatizado',
      description:
        'Disfruta lo mejor de ambos mundos: más de 40 árboles frondosos para cócteles al atardecer y un salón con aire acondicionado integral ante cualquier clima.',
    },
  ] satisfies IconFeatureItem[],
} as const

const spaceImage = withAlt

export const spaces = {
  eyebrow: 'Nuestros espacios',
  title: 'Tres atmósferas que se complementan en armonía',
  description:
    'Diseñados para fluir armónicamente entre cóctel de bienvenida, ceremonia y recepción con la elegancia atemporal de una hacienda jalisciense.',
  tabsLabel: 'Espacios de Casa Alcanfor', // NUEVO: nombre del tablist
  items: [
    {
      id: 'salon',
      tab: { label: 'Salón Gran Alcanfor', icon: 'apartment' },
      imageBadge: 'Salón techado principal',
      image: spaceImage(
        spaceSalon,
        'Salón vacío montado para banquete: mesas redondas con flores blancas rodean una pista de parquet bajo candiles de hierro forjado, entre arcos de cantera y ventanales al jardín.',
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
      imageBadge: 'Jardín & naturaleza',
      image: spaceImage(
        spaceGarden,
        'Jardín de noche con césped, sendero de piedra iluminado, árboles cubiertos de series de luces y un kiosco de hierro con flores, frente a la casona de la hacienda.',
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
      imageBadge: 'Área lounge & cóctel',
      image: spaceImage(
        spaceTerrace,
        'Portal de arcos de cantera al anochecer con salas, mesas altas y faroles; los invitados conversan con cócteles junto a una fuente de piedra.',
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
  eyebrow: 'Experiencias completas',
  title: 'Inversión clara pensada para que solo te dediques a disfrutar',
  description:
    'Nuestros paquetes incluyen todo lo esencial sin sorpresas. Puedes personalizar o sumar complementos según el estilo de tu día.',
  featuredLabel: 'Más elegido',
  note: 'Precios de referencia para 2027. Pueden variar según fecha y número de invitados.',
  plans: [
    {
      eyebrow: 'Opción base',
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
      eyebrow: 'Experiencia recomendada',
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
      // Antetítulo descriptivo (el nombre del paquete es "Gran Gala")
      eyebrow: 'Todo incluido',
      title: 'Gran Gala',
      description: 'Para anfitriones que desean una celebración magna con el más alto nivel de detalle.',
      price: { prefix: 'Desde', amount: '$1,350', unit: 'por invitado' },
      features: [
        { before: 'Renta exclusiva por ', strong: '10 horas completas' },
        'Banquete de autor de 4 tiempos + tornaboda',
        'Barra libre de destilados prémium por 8 horas',
        'Mobiliario de diseñador y vajilla importada',
        'Show de fuegos pirotécnicos fríos y pista iluminada',
        'Suite con amenidades prémium y coordinador de bodas integral',
      ],
      cta: { label: 'Cotiza este paquete', href: CONTACT_HREF },
    },
  ] satisfies PricingPlan[],
} as const

export const process = {
  eyebrow: 'Proceso transparente',
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
        'Relájate. Nuestro equipo de coordinación, logística y banquete se encarga de cada detalle para que tú solo disfrutes con tus invitados.',
      tag: 'Tu gran día',
    },
  ] satisfies ProcessStepItem[],
} as const

const galleryImage = withAlt

export const gallery = {
  eyebrow: 'Galería fotográfica',
  title: 'Cada rincón cuenta una historia',
  filtersLabel: 'Filtrar fotos', // NUEVO: nombre del grupo de filtros
  // NUEVO: anuncio tras filtrar ({count} se reemplaza)
  resultsAnnouncement: 'Mostrando {count} fotos',
  filters: [
    { id: 'todos', label: 'Todos' },
    { id: 'bodas', label: 'Bodas' },
    { id: 'jardin', label: 'Jardín nocturno' },
    { id: 'detalles', label: 'Banquete & detalles' },
    { id: 'xv', label: 'XV años' },
  ] satisfies { id: GalleryFilterId; label: string }[],
  photos: [
    {
      category: 'bodas',
      caption: 'Entrada nupcial',
      aspect: 'portrait',
      image: galleryImage(
        galleryWeddingEntrance,
        'Novios de espaldas, tomados de la mano, caminan por un sendero empedrado bajo un arco de piedra cubierto de flores blancas, hacia mesas largas con velas entre olivos y los arcos de una hacienda.',
      ),
    },
    {
      category: 'jardin',
      caption: 'Jardín bajo las estrellas',
      aspect: 'square',
      wide: true,
      image: galleryImage(
        galleryGardenNight,
        'Invitados cenan en mesas largas con velas y flores blancas bajo un árbol enorme del que cuelgan cortinas de luces, frente a los arcos iluminados de una hacienda con buganvilias.',
      ),
    },
    {
      category: 'detalles',
      caption: 'Montaje de autor',
      aspect: 'portrait',
      image: galleryImage(
        galleryTableSetting,
        'Mesa de madera rústica con plato de cerámica moteada, servilleta de lino atada con eucalipto, cubiertos dorados, copas de cristal labrado, velas y un jarrón de barro con rosas blancas; al fondo, arcos y series de luces.',
      ),
    },
    {
      category: 'xv',
      // Cambio respecto al diseño (README): la foto nueva no muestra la pista robótica
      caption: 'Vals entre arcos',
      aspect: 'square',
      image: galleryImage(
        galleryXvDance,
        'Quinceañera con vestido turquesa y tiara baila con sus chambelanes de esmoquin sobre una pista de parquet, en un patio con arcos de cantera bajo series de luces, mientras los invitados aplauden desde sus mesas.',
      ),
    },
    {
      category: 'detalles',
      caption: 'Barra de coctelería',
      aspect: 'portrait',
      image: galleryImage(
        galleryCocktailBar,
        'Dos cócteles con rodaja de toronja y romero sobre una barra de cantera, junto a botellas de mezcal, un plato de toronjas y un jigger dorado; al fondo, invitados conversan en un patio con arcos y luces.',
      ),
    },
    {
      category: 'bodas',
      caption: 'Ceremonia en el jardín',
      aspect: 'square',
      wide: true,
      image: galleryImage(
        galleryGardenCeremony,
        'Novios tomados de las manos frente al oficiante bajo una pérgola de madera con flores blancas y gasas, con invitados sentados a ambos lados de un pasillo cubierto de pétalos, al atardecer.',
      ),
    },
  ] satisfies GalleryPhoto[],
} as const

export const testimonials = {
  eyebrow: 'Historias reales',
  title: 'La voz de quienes celebraron con nosotros',
  description: 'Más de una década creando recuerdos entrañables para familias y empresas de todo el país.',
  ratingLabel: 'Calificación: {rating} de 5', // NUEVO: lectura accesible de las estrellas
  items: [
    {
      quote:
        '“Nuestra boda en Casa Alcanfor superó todo lo que soñamos. Mariana, nuestra coordinadora, no nos dejó un solo minuto con dudas. La comida fue elogiada por todos los invitados de Guadalajara y CDMX.”',
      author: 'Sofía & Alejandro',
      meta: 'Boda, octubre de 2024 · 220 invitados',
      rating: 5,
    },
    {
      quote:
        '“Los XV años de mi hija Camila fueron mágicos. La iluminación de los árboles y la seguridad del lugar nos dieron una tranquilidad invaluable. Cumplieron todo lo pactado sin un solo peso extra.”',
      author: 'Familia Morales Barba',
      meta: 'XV años, diciembre de 2024 · 180 invitados',
      rating: 5,
    },
    {
      quote:
        '“El evento de fin de año de nuestra empresa fue impecable. Puntualidad, servicio de meseros de diez y el salón climatizado perfecto. Definitivamente volveremos para nuestra gala 2025.”',
      author: 'Ing. Roberto Delgado',
      meta: 'Director general · Gala corporativa',
      rating: 5,
    },
  ] satisfies Testimonial[],
} as const

export const ctaBanner = {
  eyebrow: 'Fechas limitadas por temporada',
  title: '¿Tienes una fecha especial en mente?',
  description:
    'Las fechas de fin de semana para temporada alta 2027 se reservan con hasta 14 meses de anticipación. Asegura tu día hoy mismo y congela el precio actual.',
  primaryCta: { label: 'Apartar cita en el jardín', href: CONTACT_HREF },
  whatsappCta: 'Hablar directo por WhatsApp',
} as const

export const faq = {
  eyebrow: 'Preguntas frecuentes',
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
        'Se reserva con el 20% y el saldo se divide en cómodas mensualidades sin intereses hasta 15 días antes del evento. Si requieres cambio de fecha por causa de fuerza mayor, reubicamos sin penalización sujeto a calendario con 60 días de aviso.',
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
  eyebrow: 'Contacto directo',
  title: 'Solicita tu cotización',
  description:
    'Llena este breve formulario y en menos de 2 horas un coordinador te enviará una propuesta personalizada con fechas libres y cotización formal.',
  fields: {
    name: { label: 'Nombre completo', placeholder: 'Ej. Mariana González' },
    phone: { label: 'WhatsApp', placeholder: 'Ej. 33 0000 0000' },
    email: { label: 'Correo', placeholder: 'ejemplo@correo.example' },
    eventType: {
      label: 'Tipo de evento',
      placeholder: 'Selecciona una opción',
      options: [
        { value: 'Boda', label: 'Boda' },
        { value: 'XV Años', label: 'XV años' },
        { value: 'Bautizo / Comunión', label: 'Bautizo o primera comunión' },
        { value: 'Cumpleaños / Aniversario', label: 'Cumpleaños o aniversario' },
        { value: 'Corporativo / Gala', label: 'Evento corporativo o gala' },
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
  eyebrow: 'Ubicación estratégica',
  title: 'Ven a conocernos',
  labels: {
    address: 'Dirección',
    hours: 'Horarios para visitas guiadas',
    phone: 'Atención telefónica y WhatsApp',
  },
  map: {
    image: withAlt(map, ''),
    label: 'Zapopan Poniente · Fácil acceso vehicular',
    link: 'Abrir GPS',
  },
} as const

export const footer = {
  description:
    'Hacienda contemporánea de hospitalidad artesanal y jardines centenarios en el corazón de Zapopan, Jalisco.',
  headings: {
    location: 'Ubicación',
    hours: 'Horario de atención',
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
    { label: 'Aviso de privacidad', href: null },
    { label: 'Términos de servicio', href: null },
  ],
  copyright: '© {year} Casa Alcanfor. Todos los derechos reservados. Zapopan, Jalisco.',
} as const

export const floatingContact = {
  bubble: '¿Tienes dudas? Escríbenos',
  whatsappLabel: 'Contacto por WhatsApp',
  mobileCta: { label: 'Consulta disponibilidad', href: CONTACT_HREF },
} as const
