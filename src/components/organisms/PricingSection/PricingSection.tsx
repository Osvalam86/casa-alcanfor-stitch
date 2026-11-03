import { useId } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { PricingCard } from '@/components/molecules/PricingCard'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

type RichText = string | { before: string; strong: string; after?: string }

type Plan = {
  eyebrow: string
  title: string
  description: string
  price: { prefix: string; amount: string; unit: string }
  features: readonly RichText[]
  cta: { label: string; href: string }
  featured?: boolean
}

export type PricingSectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  featuredLabel: string
  note: string
  plans: readonly Plan[]
}

function renderRichText(text: RichText) {
  if (typeof text === 'string') return text
  return (
    <>
      {text.before}
      <strong>{text.strong}</strong>
      {text.after}
    </>
  )
}

export function PricingSection({ id, eyebrow, title, description, featuredLabel, note, plans }: PricingSectionProps) {
  const titleId = useId()

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
        <ul className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <li key={plan.title} className={cn('flex', plan.featured && 'lg:mt-6')}>
              <PricingCard
                eyebrow={plan.eyebrow}
                title={plan.title}
                description={plan.description}
                price={plan.price}
                features={plan.features.map(renderRichText)}
                cta={plan.cta}
                featured={plan.featured}
                featuredLabel={featuredLabel}
                className="w-full"
              />
            </li>
          ))}
        </ul>
        <p className="inline-flex items-center gap-2 self-center rounded-3xl md:rounded-full border border-border-subtle bg-surface-sunken px-6 py-2.5 text-center font-sans text-body-sm font-medium text-accent">
          <Icon name="info" size="sm" />
          {note}
        </p>
      </div>
    </section>
  )
}
