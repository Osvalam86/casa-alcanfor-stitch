import { useId } from 'react'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { IconFeature } from '@/components/molecules/IconFeature'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import { MEDIA_MD, useMediaQuery } from '@/lib/hooks/useMediaQuery'
import type { IconName } from '@/lib/icons'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

const featureTones = ['sage', 'gold', 'neutral', 'sageSoft'] as const

export type PromiseSectionProps = {
  eyebrow: string
  title: string
  description: string
  callout: { title: string; description: string }
  features: readonly { icon: IconName; title: string; description: string }[]
}

/** Texto editorial + bento 2×2 (en móvil, filas compactas como el diseño móvil). */
export function PromiseSection({ eyebrow, title, description, callout, features }: PromiseSectionProps) {
  const titleId = useId()
  const isDesktop = useMediaQuery(MEDIA_MD)

  return (
    <section aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface')}>
      <div className={cn(containerClasses, 'grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12')}>
        <div className="flex flex-col gap-6 lg:col-span-4">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} align="start" />
          <div className="flex flex-col gap-3 rounded-2xl bg-surface-strong p-6">
            <Heading as="h3" size="md" tone="accent">
              {callout.title}
            </Heading>
            <Text size="sm">{callout.description}</Text>
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:col-span-8">
          {features.map((feature, index) => (
            <li key={feature.title} className="flex">
              <IconFeature
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                tone={featureTones[index % featureTones.length]}
                layout={isDesktop ? 'stacked' : 'inline'}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
