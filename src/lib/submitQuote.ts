import type { QuoteValues } from '@/lib/validation/quote'

/**
 * Envío de la solicitud de cotización (D5: simulado, no hay backend).
 * Cuando exista un endpoint, se reemplaza el cuerpo de esta función.
 */
export async function submitQuote(values: QuoteValues): Promise<void> {
  void values
  await new Promise((resolve) => window.setTimeout(resolve, 1200))
}
