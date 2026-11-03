import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'

export type TestimonialCardProps = {
  quote: string
  author: string
  meta: string
  rating: number
  /** Texto de la calificación para lectores, p. ej. "Calificación: 5 de 5" */
  ratingLabel: string
  className?: string
}

/** Cita testimonial: <figure> con <blockquote> y atribución en <figcaption>. */
export function TestimonialCard({ quote, author, meta, rating, ratingLabel, className }: TestimonialCardProps) {
  return (
    <figure className={cn('flex h-full flex-col justify-between gap-6 rounded-3xl bg-surface p-6 shadow-sm md:p-8', className)}>
      <div className="flex flex-col gap-4">
        <p className="flex gap-1 text-accent">
          {Array.from({ length: rating }, (_, index) => (
            <Icon key={index} name="star-fill" size="md" />
          ))}
          <span className="sr-only">{ratingLabel}</span>
        </p>
        <blockquote className="font-sans text-body-md text-text italic">
          <p>{quote}</p>
        </blockquote>
      </div>
      <figcaption className="flex flex-col border-t border-surface-stronger pt-4">
        <span className="font-serif text-headline-sm text-text-strong">{author}</span>
        <span className="font-sans text-label-caps uppercase text-accent">{meta}</span>
      </figcaption>
    </figure>
  )
}
