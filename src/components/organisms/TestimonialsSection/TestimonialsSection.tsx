import { useId } from 'react'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { TestimonialCard } from '@/components/molecules/TestimonialCard'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

export type TestimonialsSectionProps = {
  eyebrow: string
  title: string
  description: string
  /** Plantilla con {rating} */
  ratingLabel: string
  items: readonly { quote: string; author: string; meta: string; rating: number }[]
}

export function TestimonialsSection({ eyebrow, title, description, ratingLabel, items }: TestimonialsSectionProps) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-sunken')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
          {items.map((item) => (
            <li key={item.author} className="flex">
              <TestimonialCard
                {...item}
                ratingLabel={ratingLabel.replace('{rating}', String(item.rating))}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
