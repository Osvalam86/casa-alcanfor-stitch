import { useEffect, useId, useRef, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Text } from '@/components/atoms/Text'
import { Textarea } from '@/components/atoms/Textarea'
import { Alert } from '@/components/molecules/Alert'
import { FormField } from '@/components/molecules/FormField'
import { cn } from '@/lib/cn'
import type { QuoteField, QuoteValues } from '@/lib/validation/quote'

type Option = { value: string; label: string }

export type QuoteFormCopy = {
  eyebrow: string
  title: string
  description: string
  fields: {
    name: { label: string; placeholder: string }
    phone: { label: string; placeholder: string }
    email: { label: string; placeholder: string }
    eventType: { label: string; placeholder: string; options: readonly Option[] }
    date: { label: string }
    guests: { label: string; placeholder: string; min: number; max: number }
    comments: { label: string; placeholder: string }
    privacy: string
  }
  errors: Record<Exclude<QuoteField, 'comments'>, string>
  errorSummary: { title: string; count: string; countOne: string }
  submit: string
  privacyNote: string
  success: { title: string; description: string }
  submitError: string
}

export type QuoteFormProps = {
  copy: QuoteFormCopy
  requiredText: string
  loadingLabel: string
  titleId: string
  values: QuoteValues
  invalidFields: readonly QuoteField[]
  /** Cambia en cada envío con errores: mueve el foco al resumen */
  errorAttempt: number
  status: 'idle' | 'submitting' | 'success' | 'error'
  minDate: string
  /** Mensaje para la región viva (p. ej. llegada desde el calculador) */
  announcement: string
  /** Cambia cuando otro componente pide enfocar el primer campo */
  focusRequest: number
  onFieldChange: <K extends QuoteField>(field: K, value: QuoteValues[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const FIELD_IDS: Record<QuoteField, string> = {
  name: 'quote-name',
  phone: 'quote-phone',
  email: 'quote-email',
  eventType: 'quote-event-type',
  date: 'quote-date',
  guests: 'quote-guests',
  comments: 'quote-comments',
  privacy: 'quote-privacy',
}

export function QuoteForm({
  copy,
  requiredText,
  loadingLabel,
  titleId,
  values,
  invalidFields,
  errorAttempt,
  status,
  minDate,
  announcement,
  focusRequest,
  onFieldChange,
  onSubmit,
}: QuoteFormProps) {
  const summaryRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const privacyErrorId = useId()
  const fields = copy.fields

  const errorFor = (field: Exclude<QuoteField, 'comments'>) =>
    invalidFields.includes(field) ? copy.errors[field] : undefined

  useEffect(() => {
    if (errorAttempt > 0) summaryRef.current?.focus()
  }, [errorAttempt])

  useEffect(() => {
    if (focusRequest > 0) nameRef.current?.focus()
  }, [focusRequest])

  // Al enviar con éxito el formulario desaparece: el foco pasa al mensaje
  useEffect(() => {
    if (status === 'success') statusRef.current?.focus()
  }, [status])

  const listedErrors = invalidFields.filter((field): field is Exclude<QuoteField, 'comments'> => field !== 'comments')
  const countText =
    listedErrors.length === 1 ? copy.errorSummary.countOne : copy.errorSummary.count.replace('{count}', String(listedErrors.length))

  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-surface p-6 shadow-sm md:p-8 lg:p-12">
      <div className="flex flex-col gap-2">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <Heading as="h2" id={titleId}>
          {copy.title}
        </Heading>
        <Text tone="muted">{copy.description}</Text>
      </div>

      {/* Región viva presente desde el render inicial: anuncios y éxito */}
      <div ref={statusRef} role="status" tabIndex={-1} className="rounded-2xl">
        {status === 'success' ? (
          <Alert tone="success" title={copy.success.title}>
            <p>{copy.success.description}</p>
          </Alert>
        ) : announcement ? (
          <Alert tone="info">
            <p>{announcement}</p>
          </Alert>
        ) : null}
      </div>

      {status === 'success' ? null : (
        <form noValidate onSubmit={onSubmit} aria-labelledby={titleId} className="flex flex-col gap-6">
          {listedErrors.length > 0 ? (
            <div
              ref={summaryRef}
              tabIndex={-1}
              aria-labelledby={`${titleId}-errors`}
              className="rounded-2xl border-2 border-error bg-error-soft p-4 md:p-6"
            >
              <p id={`${titleId}-errors`} className="flex items-center gap-2 font-serif text-headline-sm text-text">
                <Icon name="error" size="lg" className="text-error" />
                {copy.errorSummary.title}
              </p>
              <p className="mt-1 font-sans text-body-sm text-text">{countText}</p>
              <ul className="mt-2 list-disc pl-6 font-sans text-body-sm">
                {listedErrors.map((field) => (
                  <li key={field}>
                    <a
                      href={`#${FIELD_IDS[field]}`}
                      onClick={(event) => {
                        event.preventDefault()
                        document.getElementById(FIELD_IDS[field])?.focus()
                      }}
                      className="text-error underline underline-offset-4 hover:text-text"
                    >
                      {copy.errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField id={FIELD_IDS.name} label={fields.name.label} required requiredText={requiredText} error={errorFor('name')}>
              {(control) => (
                <Input
                  {...control}
                  ref={nameRef}
                  name="name"
                  autoComplete="name"
                  placeholder={fields.name.placeholder}
                  value={values.name}
                  onChange={(event) => onFieldChange('name', event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.phone} label={fields.phone.label} required requiredText={requiredText} error={errorFor('phone')}>
              {(control) => (
                <Input
                  {...control}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={fields.phone.placeholder}
                  value={values.phone}
                  onChange={(event) => onFieldChange('phone', event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.email} label={fields.email.label} required requiredText={requiredText} error={errorFor('email')}>
              {(control) => (
                <Input
                  {...control}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={fields.email.placeholder}
                  value={values.email}
                  onChange={(event) => onFieldChange('email', event.target.value)}
                />
              )}
            </FormField>
            <FormField
              id={FIELD_IDS.eventType}
              label={fields.eventType.label}
              required
              requiredText={requiredText}
              error={errorFor('eventType')}
            >
              {(control) => (
                <Select
                  {...control}
                  name="eventType"
                  value={values.eventType}
                  onChange={(event) => onFieldChange('eventType', event.target.value)}
                >
                  <option value="" disabled>
                    {fields.eventType.placeholder}
                  </option>
                  {fields.eventType.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField id={FIELD_IDS.date} label={fields.date.label} required requiredText={requiredText} error={errorFor('date')}>
              {(control) => (
                <Input
                  {...control}
                  name="date"
                  type="date"
                  min={minDate}
                  value={values.date}
                  onChange={(event) => onFieldChange('date', event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.guests} label={fields.guests.label} error={errorFor('guests')}>
              {(control) => (
                <Input
                  {...control}
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={fields.guests.min}
                  max={fields.guests.max}
                  placeholder={fields.guests.placeholder}
                  value={values.guests}
                  onChange={(event) => onFieldChange('guests', event.target.value)}
                />
              )}
            </FormField>
            <FormField id={FIELD_IDS.comments} label={fields.comments.label} className="md:col-span-2">
              {(control) => (
                <Textarea
                  {...control}
                  name="comments"
                  placeholder={fields.comments.placeholder}
                  value={values.comments}
                  onChange={(event) => onFieldChange('comments', event.target.value)}
                />
              )}
            </FormField>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id={FIELD_IDS.privacy}
                name="privacy"
                required
                checked={values.privacy}
                aria-invalid={errorFor('privacy') ? true : undefined}
                aria-describedby={errorFor('privacy') ? privacyErrorId : undefined}
                onChange={(event) => onFieldChange('privacy', event.target.checked)}
              />
              <label htmlFor={FIELD_IDS.privacy} className="font-sans text-body-sm text-text-muted">
                {fields.privacy} <span className="text-caption text-text-muted">({requiredText})</span>
              </label>
            </div>
            {errorFor('privacy') ? (
              <p id={privacyErrorId} className="flex items-center gap-1.5 font-sans text-caption font-medium text-error">
                <Icon name="error" size="sm" />
                {errorFor('privacy')}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={status === 'submitting'}
              loadingLabel={loadingLabel}
              iconEnd={<Icon name="arrow-forward" />}
            >
              {copy.submit}
            </Button>
            {/* Región de alerta presente desde el inicio; solo se llena si el envío falla */}
            <p role="alert" className={cn('text-center font-sans text-body-sm text-error', status !== 'error' && 'sr-only')}>
              {status === 'error' ? copy.submitError : ''}
            </p>
            <p className="flex items-center justify-center gap-1.5 text-center font-sans text-caption text-text-muted">
              <Icon name="lock" size="sm" className="text-accent" />
              {copy.privacyNote}
            </p>
          </div>
        </form>
      )}
    </div>
  )
}
