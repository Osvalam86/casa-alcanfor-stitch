import { useId, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { Icon } from '@/components/atoms/Icon'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { FormField } from '@/components/molecules/FormField'

type Option = { value: string; label: string }

export type AvailabilityCheckerValues = { eventType: string; date: string; guests: string }

export type AvailabilityCheckerProps = {
  title: string
  eventType: { label: string; options: readonly Option[] }
  date: { label: string }
  guests: { label: string; defaultValue: string; options: readonly Option[] }
  submit: string
  responseNote: string
  /** Fecha mínima (hoy) */
  minDate: string
  /** No consulta disponibilidad: entrega los datos al formulario de cotización (D4) */
  onSubmit: (values: AvailabilityCheckerValues) => void
}

export function AvailabilityChecker({
  title,
  eventType,
  date,
  guests,
  submit,
  responseNote,
  minDate,
  onSubmit,
}: AvailabilityCheckerProps) {
  const titleId = useId()
  const [values, setValues] = useState<AvailabilityCheckerValues>({
    eventType: eventType.options[0]?.value ?? '',
    date: '',
    guests: guests.defaultValue,
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border-subtle bg-surface-raised p-5 shadow-2xl lg:p-8">
        <h2 id={titleId} className="mb-4 flex items-center gap-2 font-sans text-label-caps uppercase text-accent">
          <Icon name="event-available" size="lg" />
          {title}
        </h2>
        <form
          aria-labelledby={titleId}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FormField label={eventType.label}>
            {(control) => (
              <Select
                {...control}
                value={values.eventType}
                onChange={(event) => setValues((current) => ({ ...current, eventType: event.target.value }))}
              >
                {eventType.options.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label={date.label}>
            {(control) => (
              <Input
                {...control}
                type="date"
                min={minDate}
                value={values.date}
                onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
              />
            )}
          </FormField>
          <FormField label={guests.label}>
            {(control) => (
              <Select
                {...control}
                value={values.guests}
                onChange={(event) => setValues((current) => ({ ...current, guests: event.target.value }))}
              >
                {guests.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Button type="submit" size="lg" fullWidth iconEnd={<Icon name="search" />}>
            {submit}
          </Button>
        </form>
      </div>
      <p className="flex items-center justify-center gap-2 text-center font-sans text-body-sm font-medium text-accent">
        <Icon name="schedule" size="sm" />
        {responseNote}
      </p>
    </div>
  )
}
