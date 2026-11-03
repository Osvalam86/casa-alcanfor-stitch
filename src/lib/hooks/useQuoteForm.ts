import { useMemo, useState, type FormEvent } from 'react'
import { submitQuote } from '@/lib/submitQuote'
import { EMPTY_QUOTE, todayIso, validateQuote, type QuoteField, type QuoteValues } from '@/lib/validation/quote'

export type QuoteStatus = 'idle' | 'submitting' | 'success' | 'error'

/** Estado y envío del formulario de cotización (lo usa el contenedor LandingPage). */
export function useQuoteForm() {
  const [values, setValues] = useState<QuoteValues>(EMPTY_QUOTE)
  const [showErrors, setShowErrors] = useState(false)
  const [status, setStatus] = useState<QuoteStatus>('idle')
  // Cambia en cada envío con errores: el formulario mueve el foco al resumen
  const [errorAttempt, setErrorAttempt] = useState(0)
  const today = todayIso()

  const invalidFields = useMemo<QuoteField[]>(
    () => (showErrors ? validateQuote(values, today) : []),
    [showErrors, values, today],
  )

  function setField<K extends QuoteField>(field: K, value: QuoteValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  /** Precarga desde el calculador de disponibilidad (D4). */
  function prefill(partial: Partial<QuoteValues>) {
    setValues((current) => ({ ...current, ...partial }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    const invalid = validateQuote(values, today)
    setShowErrors(true)
    if (invalid.length > 0) {
      setErrorAttempt((attempt) => attempt + 1)
      return
    }

    setStatus('submitting')
    try {
      await submitQuote(values)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return { values, setField, prefill, invalidFields, errorAttempt, status, handleSubmit, today }
}
