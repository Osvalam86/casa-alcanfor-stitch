import { useId } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Image } from '@/components/atoms/Image'
import { Text } from '@/components/atoms/Text'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { SpecItem } from '@/components/molecules/SpecItem'
import { cn } from '@/lib/cn'
import { useRovingTabs } from '@/lib/hooks/useRovingTabs'
import type { IconName } from '@/lib/icons'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

type Space = {
  id: string
  tab: { label: string; icon: IconName }
  imageBadge: string
  image: { src: string; alt: string; width: number; height: number }
  chips: { capacity: string; area: string }
  title: string
  description: string
  specs: readonly { icon: IconName; label: string; value: string }[]
  cta: { label: string; href: string }
}

export type SpacesTabsProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  tabsLabel: string
  items: readonly Space[]
  selectedId: string
  onSelect: (id: string) => void
}

/** Patrón APG de pestañas con activación automática (la pestaña activa vive en la URL). */
export function SpacesTabs({ id, eyebrow, title, description, tabsLabel, items, selectedId, onSelect }: SpacesTabsProps) {
  const baseId = useId()
  const titleId = `${baseId}-title`
  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  )
  const { onKeyDown, registerTab } = useRovingTabs(items.length, selectedIndex, (index) => onSelect(items[index].id))

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-strong')}>
      <div className={cn(containerClasses, 'flex flex-col gap-8 md:gap-12')}>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} align="start" />
          <div
            role="tablist"
            aria-label={tabsLabel}
            className="flex gap-2 overflow-x-auto rounded-2xl border border-border-subtle bg-surface p-1.5 shadow-sm"
          >
            {items.map((item, index) => {
              const selected = index === selectedIndex
              return (
                <button
                  key={item.id}
                  ref={registerTab(index)}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onSelect(item.id)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    'flex min-h-control-md shrink-0 items-center gap-2 rounded-xl px-4 font-sans text-label-md whitespace-nowrap transition-surface md:px-5',
                    selected
                      ? 'bg-action font-semibold text-on-action shadow-sm'
                      : 'text-text-muted hover:bg-surface-muted hover:text-text-strong',
                  )}
                >
                  <Icon name={item.tab.icon} size="md" />
                  {item.tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            hidden={index !== selectedIndex}
            className="grid grid-cols-1 items-center overflow-hidden rounded-3xl bg-surface shadow-sm lg:grid-cols-12"
          >
            <div className="relative h-56 overflow-hidden md:h-80 lg:col-span-7 lg:h-panel-media">
              <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-surface-inverse-strong/30 via-transparent to-transparent"
              />
              <Badge variant="onImage" dot className="absolute top-4 left-4 md:top-6 md:left-6">
                {item.imageBadge}
              </Badge>
            </div>
            <div className="flex flex-col gap-6 p-6 md:p-8 lg:col-span-5 lg:p-12">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">{item.chips.capacity}</Badge>
                  <Badge variant="neutral">{item.chips.area}</Badge>
                </div>
                <Heading as="h3" size="lg">
                  {item.title}
                </Heading>
              </div>
              <Text tone="muted">{item.description}</Text>
              <dl className="grid grid-cols-3 gap-4 border-t border-surface-stronger pt-4">
                {item.specs.map((spec) => (
                  <SpecItem key={spec.label} icon={spec.icon} label={spec.label} value={spec.value} />
                ))}
              </dl>
              <div className="pt-2">
                <ButtonLink
                  href={item.cta.href}
                  size="lg"
                  srContext={item.title}
                  iconEnd={<Icon name="calendar-month" />}
                  className="w-full sm:w-auto"
                >
                  {item.cta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
