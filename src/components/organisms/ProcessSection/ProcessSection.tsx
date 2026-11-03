import { useId } from 'react'
import { ProcessStep } from '@/components/molecules/ProcessStep'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

export type ProcessSectionProps = {
  eyebrow: string
  title: string
  description: string
  steps: readonly { number: string; icon: IconName; title: string; description: string; tag: string }[]
}

export function ProcessSection({ eyebrow, title, description, steps }: ProcessSectionProps) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-strong')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
        <div className="relative">
          {/* Línea de progreso decorativa (desktop) */}
          <div aria-hidden="true" className="absolute inset-x-12 top-12 hidden h-0.5 bg-border-subtle/40 lg:block" />
          <ol className="relative z-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.number} className="flex">
                <ProcessStep {...step} highlight={index === steps.length - 1} className="w-full" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
