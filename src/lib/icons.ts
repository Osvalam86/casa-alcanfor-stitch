import spriteUrl from '@/assets/icons/sprite.svg?no-inline'

/** URL del sprite de Material Symbols (solo los íconos usados en el diseño). */
export const ICON_SPRITE_URL = spriteUrl

export const ICON_NAMES = [
  'ac-unit',
  'apartment',
  'arrow-forward',
  'calendar-month',
  'calendar-today',
  'call',
  'celebration',
  'chat',
  'check',
  'check-circle',
  'close',
  'cottage',
  'eco',
  'edit-note',
  'error',
  'event-available',
  'expand-more',
  'explore',
  'groups',
  'info',
  'local-florist',
  'lock',
  'lock-reset',
  'mail',
  'menu',
  'mode-fan',
  'nature-people',
  'north-east',
  'open-in-new',
  'phone-in-talk',
  'photo-camera',
  'pin-drop',
  'priority-high',
  'progress-activity',
  'public',
  'receipt-long',
  'restaurant',
  'schedule',
  'search',
  'square-foot',
  'star',
  'star-fill',
  'sunny',
  'support-agent',
  'umbrella',
  'verified',
  'wb-twilight',
  'yard',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export function iconHref(name: IconName) {
  return `${ICON_SPRITE_URL}#${name}`
}
