/** Reglas del formulario de cotización (sin dependencias de UI). */

export type QuoteValues = {
  name: string
  phone: string
  email: string
  eventType: string
  date: string
  guests: string
  comments: string
  privacy: boolean
}

export type QuoteField = keyof QuoteValues

/** Orden en que se listan los errores (orden visual del formulario). */
export const QUOTE_FIELD_ORDER: QuoteField[] = ['name', 'phone', 'email', 'eventType', 'date', 'guests', 'comments', 'privacy']

export const EMPTY_QUOTE: QuoteValues = {
  name: '',
  phone: '',
  email: '',
  eventType: '',
  date: '',
  guests: '',
  comments: '',
  privacy: false,
}

export const GUESTS_MIN = 50
export const GUESTS_MAX = 500

/** Fecha local de hoy en formato yyyy-mm-dd (para min del input date). */
export function todayIso(now = new Date()) {
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

/** WhatsApp de México: 10 dígitos, opcionalmente con lada 52 o +52. */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('52'))
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Devuelve los campos inválidos, en el orden del formulario. */
export function validateQuote(values: QuoteValues, today = todayIso()): QuoteField[] {
  const invalid = new Set<QuoteField>()

  if (values.name.trim().length < 3) invalid.add('name')
  if (!isValidPhone(values.phone)) invalid.add('phone')
  if (!isValidEmail(values.email)) invalid.add('email')
  if (!values.eventType) invalid.add('eventType')
  if (!values.date || values.date < today) invalid.add('date')
  if (values.guests !== '') {
    const guests = Number(values.guests)
    if (!Number.isInteger(guests) || guests < GUESTS_MIN || guests > GUESTS_MAX) invalid.add('guests')
  }
  if (!values.privacy) invalid.add('privacy')

  return QUOTE_FIELD_ORDER.filter((field) => invalid.has(field))
}
