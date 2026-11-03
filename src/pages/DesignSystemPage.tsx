import { useState, type ReactNode } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Divider } from '@/components/atoms/Divider'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { IconButton } from '@/components/atoms/IconButton'
import { Image } from '@/components/atoms/Image'
import { Input } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Select } from '@/components/atoms/Select'
import { SkipLink } from '@/components/atoms/SkipLink'
import { Spinner } from '@/components/atoms/Spinner'
import { Text } from '@/components/atoms/Text'
import { Textarea } from '@/components/atoms/Textarea'
import { TextLink } from '@/components/atoms/TextLink'
import { AccordionItem } from '@/components/molecules/AccordionItem'
import { Alert } from '@/components/molecules/Alert'
import { BrandLockup } from '@/components/molecules/BrandLockup'
import { ContactInfoItem } from '@/components/molecules/ContactInfoItem'
import { EventCard } from '@/components/molecules/EventCard'
import { FilterChip } from '@/components/molecules/FilterChip'
import { FormField } from '@/components/molecules/FormField'
import { GalleryItem } from '@/components/molecules/GalleryItem'
import { IconFeature } from '@/components/molecules/IconFeature'
import { PricingCard } from '@/components/molecules/PricingCard'
import { ProcessStep } from '@/components/molecules/ProcessStep'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { SpecItem } from '@/components/molecules/SpecItem'
import { StatItem } from '@/components/molecules/StatItem'
import { TestimonialCard } from '@/components/molecules/TestimonialCard'
import { designSystem as ds } from '@/content/designSystem'
import { brand, contact, ui } from '@/content/site'
import { cn } from '@/lib/cn'
import { ICON_NAMES, type IconName } from '@/lib/icons'

/* Muestras de tokens: nombre del token → clase que lo pinta */
const colorSwatches: Record<keyof typeof ds.tokens.colorGroups, { token: string; className: string }[]> = {
  surfaces: [
    { token: 'surface', className: 'bg-surface' },
    { token: 'surface-raised', className: 'bg-surface-raised' },
    { token: 'surface-sunken', className: 'bg-surface-sunken' },
    { token: 'surface-muted', className: 'bg-surface-muted' },
    { token: 'surface-strong', className: 'bg-surface-strong' },
    { token: 'surface-stronger', className: 'bg-surface-stronger' },
    { token: 'surface-header', className: 'bg-surface-header' },
    { token: 'surface-disabled', className: 'bg-surface-disabled' },
    { token: 'surface-inverse', className: 'bg-surface-inverse' },
    { token: 'surface-inverse-strong', className: 'bg-surface-inverse-strong' },
  ],
  text: [
    { token: 'text', className: 'bg-text' },
    { token: 'text-strong', className: 'bg-text-strong' },
    { token: 'text-muted', className: 'bg-text-muted' },
    { token: 'text-on-inverse-muted', className: 'bg-text-on-inverse-muted' },
    { token: 'border', className: 'bg-border' },
    { token: 'border-subtle', className: 'bg-border-subtle' },
    { token: 'border-control', className: 'bg-border-control' },
  ],
  accent: [
    { token: 'accent', className: 'bg-accent' },
    { token: 'accent-strong', className: 'bg-accent-strong' },
    { token: 'accent-on-inverse', className: 'bg-accent-on-inverse' },
    { token: 'accent-soft', className: 'bg-accent-soft' },
    { token: 'on-accent-soft', className: 'bg-on-accent-soft' },
  ],
  actions: [
    { token: 'action', className: 'bg-action' },
    { token: 'action-hover', className: 'bg-action-hover' },
    { token: 'action-secondary', className: 'bg-action-secondary' },
    { token: 'action-secondary-hover', className: 'bg-action-secondary-hover' },
    { token: 'sage-soft', className: 'bg-sage-soft' },
  ],
  states: [
    { token: 'error', className: 'bg-error' },
    { token: 'error-soft', className: 'bg-error-soft' },
    { token: 'success', className: 'bg-success' },
    { token: 'success-soft', className: 'bg-success-soft' },
    { token: 'warning', className: 'bg-warning' },
    { token: 'warning-soft', className: 'bg-warning-soft' },
    { token: 'info', className: 'bg-info' },
    { token: 'info-soft', className: 'bg-info-soft' },
  ],
}

const typeScale = [
  { token: 'display-hero', className: 'font-serif text-display-hero' },
  { token: 'headline-lg', className: 'font-serif text-headline-lg' },
  { token: 'headline-md', className: 'font-serif text-headline-md' },
  { token: 'headline-sm', className: 'font-serif text-headline-sm' },
  { token: 'headline-xs', className: 'font-serif text-headline-xs' },
  { token: 'display-hero-mobile', className: 'font-serif text-display-hero-mobile' },
  { token: 'headline-lg-mobile', className: 'font-serif text-headline-lg-mobile' },
  { token: 'headline-md-mobile', className: 'font-serif text-headline-md-mobile' },
]

const bodyScale = [
  { token: 'subheading', className: 'text-subheading' },
  { token: 'body-lg', className: 'text-body-lg' },
  { token: 'body-md', className: 'text-body-md' },
  { token: 'body-sm', className: 'text-body-sm' },
  { token: 'caption', className: 'text-caption' },
  { token: 'label-md', className: 'text-label-md' },
]

const spacingScale = [
  { token: 'space-xs', className: 'w-space-xs' },
  { token: 'space-sm', className: 'w-space-sm' },
  { token: 'space-md', className: 'w-space-md' },
  { token: 'gutter', className: 'w-gutter' },
  { token: 'space-lg', className: 'w-space-lg' },
  { token: 'space-xl', className: 'w-space-xl' },
  { token: 'margin', className: 'w-margin' },
  { token: 'space-2xl', className: 'w-space-2xl' },
]

const radiusScale = [
  { token: 'radius-sm · shadow-sm', className: 'rounded-sm shadow-sm' },
  { token: 'radius-xl · shadow-md', className: 'rounded-xl shadow-md' },
  { token: 'radius-2xl · shadow-ambient', className: 'rounded-2xl shadow-ambient' },
  { token: 'radius-3xl · shadow-xl', className: 'rounded-3xl shadow-xl' },
  { token: 'arch (rounded-t-full)', className: 'rounded-t-full rounded-b-sm' },
  { token: 'radius-full', className: 'rounded-full' },
]

const statIcons: IconName[] = ['celebration', 'groups', 'star-fill']
const statTones = ['sage', 'gold', 'neutral'] as const
const specIcons: IconName[] = ['groups', 'square-foot', 'mode-fan']
const processIcons: IconName[] = ['edit-note', 'celebration']

/* Envoltorios de presentación locales de esta página */
function DsSection({
  id,
  eyebrow,
  title,
  description,
  inverse = false,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  inverse?: boolean
  children: ReactNode
}) {
  const titleId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-surface={inverse ? 'inverse' : undefined}
      className={cn('py-space-xl md:py-space-2xl', inverse ? 'bg-surface-inverse' : 'odd:bg-surface even:bg-surface-sunken')}
    >
      <div className="mx-auto flex max-w-page flex-col gap-space-xl px-margin-mobile lg:px-12">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleId={titleId}
          align="start"
          tone={inverse ? 'inverse' : 'default'}
        />
        {children}
      </div>
    </section>
  )
}

function Specimen({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Heading as="h3" size="md">
        {title}
      </Heading>
      {children}
    </div>
  )
}

export function DesignSystemPage() {
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [activeFilter, setActiveFilter] = useState(0)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  function simulateLoading() {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 2000)
  }

  return (
    <>
      <title>{ds.meta.title}</title>
      <meta name="robots" content="noindex" />

      <SkipLink targetId="main">{ui.skipLink}</SkipLink>

      <header className="border-b border-border bg-surface-header">
        <div className="mx-auto flex max-w-page flex-col gap-6 px-margin-mobile py-space-lg lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} />
            <TextLink href="/" variant="subtle" iconEnd={<Icon name="arrow-forward" size="sm" />}>
              {ds.intro.homeLink}
            </TextLink>
          </div>
          <div className="flex flex-col gap-3">
            <Eyebrow>{ds.intro.eyebrow}</Eyebrow>
            <Heading as="h1" size="display">
              {ds.intro.title}
            </Heading>
            <Text size="subheading" tone="muted" className="max-w-2xl">
              {ds.intro.description}
            </Text>
          </div>
          <nav aria-label={ds.intro.navLabel}>
            <ul className="flex flex-wrap gap-2">
              {ds.intro.nav.map((item) => (
                <li key={item.id}>
                  <ButtonLink href={`#${item.id}`} variant="outline" size="sm">
                    {item.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        {/* 01 · Tokens */}
        <DsSection id="tokens" eyebrow={ds.tokens.eyebrow} title={ds.tokens.title} description={ds.tokens.description}>
          <Specimen title={ds.tokens.colorsTitle}>
            {(Object.keys(colorSwatches) as (keyof typeof colorSwatches)[]).map((group) => (
              <div key={group} className="flex flex-col gap-3">
                <Eyebrow as="span" tone="muted">
                  {ds.tokens.colorGroups[group]}
                </Eyebrow>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {colorSwatches[group].map((swatch) => (
                    <li key={swatch.token} className="overflow-hidden rounded-xl border border-border bg-surface-raised">
                      <span aria-hidden="true" className={cn('block h-16', swatch.className)} />
                      <code className="block p-2 font-sans text-caption text-text">--color-{swatch.token}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Specimen>

          <Specimen title={ds.tokens.typographyTitle}>
            <ul className="flex flex-col divide-y divide-border">
              {typeScale.map((type) => (
                <li key={type.token} className="flex flex-col gap-1 py-3">
                  <code className="font-sans text-caption text-text-muted">text-{type.token}</code>
                  <span className={cn('text-text-strong', type.className)}>{ds.tokens.typographySample}</span>
                </li>
              ))}
              {bodyScale.map((type) => (
                <li key={type.token} className="flex flex-col gap-1 py-3">
                  <code className="font-sans text-caption text-text-muted">text-{type.token}</code>
                  <span className={cn('font-sans text-text', type.className)}>{ds.tokens.bodySample}</span>
                </li>
              ))}
              <li className="flex flex-col gap-1 py-3">
                <code className="font-sans text-caption text-text-muted">text-label-caps</code>
                <Eyebrow>{ds.tokens.eyebrowSample}</Eyebrow>
              </li>
            </ul>
          </Specimen>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.tokens.spacingTitle}>
              <ul className="flex flex-col gap-3">
                {spacingScale.map((space) => (
                  <li key={space.token} className="flex items-center gap-4">
                    <code className="w-28 shrink-0 font-sans text-caption text-text-muted">{space.token}</code>
                    <span aria-hidden="true" className={cn('h-3 rounded-xs bg-accent', space.className)} />
                  </li>
                ))}
              </ul>
            </Specimen>
            <Specimen title={ds.tokens.radiiTitle}>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {radiusScale.map((radius) => (
                  <li key={radius.token} className="flex flex-col items-center gap-2">
                    <span aria-hidden="true" className={cn('block size-20 bg-surface-strong', radius.className)} />
                    <code className="text-center font-sans text-caption text-text-muted">{radius.token}</code>
                  </li>
                ))}
              </ul>
            </Specimen>
          </div>
        </DsSection>

        {/* 02 · Átomos */}
        <DsSection id="atomos" eyebrow={ds.atoms.eyebrow} title={ds.atoms.title} description={ds.atoms.description}>
          <Specimen title={ds.atoms.buttonsTitle}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Eyebrow as="span" tone="muted">
                  {ds.atoms.buttonGroups.primary}
                </Eyebrow>
                <div className="flex flex-wrap items-center gap-3">
                  <Button>{ds.atoms.buttons.primary}</Button>
                  <Button iconEnd={<Icon name="calendar-month" />}>{ds.atoms.buttons.primary}</Button>
                  <Button disabled>{ds.atoms.buttons.disabled}</Button>
                  <Button loading={loading} loadingLabel={ui.loading} onClick={simulateLoading}>
                    {ds.atoms.buttons.loadingDemo}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Eyebrow as="span" tone="muted">
                  {ds.atoms.buttonGroups.secondary}
                </Eyebrow>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" iconEnd={<Icon name="arrow-forward" />}>
                    {ds.atoms.buttons.secondary}
                  </Button>
                  <Button variant="outline">{ds.atoms.buttons.outline}</Button>
                  <Button variant="secondary" disabled>
                    {ds.atoms.buttons.secondaryDisabled}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Eyebrow as="span" tone="muted">
                  {ds.atoms.buttonGroups.accent}
                </Eyebrow>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="accent" iconStart={<Icon name="support-agent" />}>
                    {ds.atoms.buttons.accent}
                  </Button>
                  <TextLink href="#atomos" iconEnd={<Icon name="arrow-forward" size="sm" />}>
                    {ds.atoms.buttons.textAction}
                  </TextLink>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Eyebrow as="span" tone="muted">
                  {ds.atoms.buttonGroups.sizes}
                </Eyebrow>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">{ds.atoms.buttons.small}</Button>
                  <Button size="md">{ds.atoms.buttons.medium}</Button>
                  <Button size="lg">{ds.atoms.buttons.large}</Button>
                </div>
              </div>
            </div>
          </Specimen>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.atoms.linksTitle}>
              <div className="flex flex-wrap items-center gap-6">
                <TextLink
                  href="#moleculas"
                  srContext={ds.atoms.links.arrowContext}
                  iconEnd={<Icon name="arrow-forward" size="sm" />}
                >
                  {ds.atoms.links.arrow}
                </TextLink>
                <TextLink href="#atomos" variant="inline">
                  {ds.atoms.links.inline}
                </TextLink>
                <TextLink href="https://maps.google.com/?q=Zapopan+Jalisco" variant="caps" newTabHint={ui.newTabHint}>
                  {ds.atoms.links.caps}
                </TextLink>
                <TextLink href={contact.phoneHref} variant="subtle" iconStart={<Icon name="call" className="text-accent" />}>
                  {contact.phoneDisplay}
                </TextLink>
              </div>
            </Specimen>
            <Specimen title={ds.atoms.iconButtonsTitle}>
              <div className="flex flex-wrap items-center gap-4">
                <IconButton label={ds.atoms.iconButtons.menu} variant="soft">
                  <Icon name="menu" size="lg" />
                </IconButton>
                <IconButton label={ds.atoms.iconButtons.close}>
                  <Icon name="close" size="lg" />
                </IconButton>
                <IconButton label={ds.atoms.iconButtons.whatsapp} variant="filled" size="lg">
                  <Icon name="chat" size="2xl" />
                </IconButton>
              </div>
            </Specimen>
          </div>

          <Specimen title={ds.atoms.inputsTitle}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label={ds.atoms.inputs.name.label} hint={ds.atoms.inputs.name.hint} required requiredText={ui.requiredText}>
                {(control) => <Input {...control} autoComplete="name" placeholder={ds.atoms.inputs.name.placeholder} />}
              </FormField>
              <FormField label={ds.atoms.inputs.date.label} hint={ds.atoms.inputs.date.hint}>
                {(control) => <Input {...control} type="date" defaultValue={ds.atoms.inputs.date.value} />}
              </FormField>
              <FormField
                label={ds.atoms.inputs.phone.label}
                error={ds.atoms.inputs.phone.error}
                required
                requiredText={ui.requiredText}
              >
                {(control) => (
                  <Input {...control} type="tel" autoComplete="tel" inputMode="tel" defaultValue={ds.atoms.inputs.phone.value} />
                )}
              </FormField>
              <FormField label={ds.atoms.inputs.folio.label} hint={ds.atoms.inputs.folio.hint}>
                {(control) => <Input {...control} disabled defaultValue={ds.atoms.inputs.folio.value} />}
              </FormField>
              <FormField label={ds.atoms.inputs.eventType.label}>
                {(control) => (
                  <Select {...control} defaultValue="">
                    <option value="" disabled>
                      {ds.atoms.inputs.eventType.placeholder}
                    </option>
                    {ds.atoms.inputs.eventType.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                )}
              </FormField>
              <FormField label={ds.atoms.inputs.comments.label}>
                {(control) => <Textarea {...control} placeholder={ds.atoms.inputs.comments.placeholder} />}
              </FormField>
              <div className="flex items-start gap-3 md:col-span-2">
                <Checkbox
                  id="ds-privacy"
                  checked={privacyAccepted}
                  onChange={(event) => setPrivacyAccepted(event.target.checked)}
                />
                <label htmlFor="ds-privacy" className="font-sans text-body-sm text-text-muted">
                  {ds.atoms.inputs.privacy}
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="ds-label-demo" requiredText={ui.requiredText}>
                  {ds.atoms.inputs.name.label}
                </Label>
                <Input id="ds-label-demo" autoComplete="off" placeholder={ds.atoms.inputs.name.placeholder} />
              </div>
            </div>
          </Specimen>

          <Specimen title={ds.atoms.badgesTitle}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="goldSolid">{ds.atoms.badges.featured}</Badge>
                <Badge variant="gold">{ds.atoms.badges.recommended}</Badge>
                <Badge variant="neutral">{ds.atoms.badges.season}</Badge>
                <Badge variant="sage">{ds.atoms.badges.sage}</Badge>
                <Badge variant="outline" dot>
                  {ds.atoms.badges.onImage}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="neutral" icon={<Icon name="mode-fan" size="sm" />}>
                  {ds.atoms.badges.climate}
                </Badge>
                <Badge variant="neutral" icon={<Icon name="umbrella" size="sm" />}>
                  {ds.atoms.badges.rain}
                </Badge>
                <Badge variant="neutral" icon={<Icon name="square-foot" size="sm" />}>
                  {ds.atoms.badges.area}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" dot>
                  {ds.atoms.badges.available}
                </Badge>
                <Badge variant="error" dot>
                  {ds.atoms.badges.blocked}
                </Badge>
                <Badge variant="warning" dot>
                  {ds.atoms.badges.limited}
                </Badge>
              </div>
              <div className="relative h-40 overflow-hidden rounded-2xl">
                <Image src={ds.atoms.image.src} alt="" />
                <Badge variant="onImage" dot className="absolute top-4 left-4">
                  {ds.atoms.badges.onImage}
                </Badge>
              </div>
            </div>
          </Specimen>

          <Specimen title={ds.atoms.iconsTitle}>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {ICON_NAMES.map((name) => (
                <li key={name} className="flex flex-col items-center gap-2 rounded-xl bg-surface-raised p-3 text-center">
                  <Icon name={name} size="xl" className="text-accent" />
                  <code className="font-sans text-caption break-all text-text-muted">{name}</code>
                </li>
              ))}
            </ul>
          </Specimen>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.atoms.typographyAtomsTitle}>
              <div className="flex flex-col gap-3">
                <Eyebrow>{ds.molecules.sectionHeader.eyebrow}</Eyebrow>
                <Heading as="h4" size="section">
                  {ds.molecules.sectionHeader.title}
                </Heading>
                <Heading as="h4" size="lg">
                  {ds.molecules.eventCard.title}
                </Heading>
                <Heading as="h4" size="md" tone="accent">
                  {ds.molecules.iconFeature.title}
                </Heading>
                <Text tone="muted">{ds.molecules.sectionHeader.description}</Text>
                <Text size="caption" tone="muted">
                  {ds.tokens.captionSample}
                </Text>
              </div>
            </Specimen>
            <Specimen title={ds.atoms.imagesTitle}>
              <div className="mx-auto aspect-4/5 w-full max-w-xs overflow-hidden rounded-t-full rounded-b-2xl border-4 border-surface-raised/60 shadow-2xl">
                <Image src={ds.atoms.image.src} alt={ds.atoms.image.alt} />
              </div>
            </Specimen>
          </div>

          <Specimen title={ds.atoms.dividersTitle}>
            <div className="flex flex-col gap-6">
              <Divider />
              <Divider variant="botanical" />
              <Spinner label={ds.atoms.spinnerLabel} />
            </div>
          </Specimen>
        </DsSection>

        {/* 03 · Moléculas */}
        <DsSection
          id="moleculas"
          eyebrow={ds.molecules.eyebrow}
          title={ds.molecules.title}
          description={ds.molecules.description}
        >
          <Specimen title={ds.molecules.labels.sectionHeader}>
            <SectionHeader
              headingLevel="h4"
              eyebrow={ds.molecules.sectionHeader.eyebrow}
              title={ds.molecules.sectionHeader.title}
              description={ds.molecules.sectionHeader.description}
            />
          </Specimen>

          <Specimen title={ds.molecules.labels.iconFeature}>
            <div className="grid gap-6 md:grid-cols-2">
              <IconFeature
                icon="support-agent"
                title={ds.molecules.iconFeature.title}
                description={ds.molecules.iconFeature.description}
                headingLevel="h4"
              />
              <IconFeature
                icon="receipt-long"
                tone="gold"
                layout="inline"
                title={ds.molecules.iconFeature.inlineTitle}
                description={ds.molecules.iconFeature.inlineDescription}
                headingLevel="h4"
                className="self-start bg-surface-raised"
              />
            </div>
          </Specimen>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.molecules.labels.stats}>
              <dl className="grid gap-6 rounded-2xl bg-surface-raised p-6">
                {ds.molecules.stats.map((stat, index) => (
                  <StatItem
                    key={stat.label}
                    icon={statIcons[index]}
                    tone={statTones[index]}
                    value={stat.value}
                    valueLabel={'valueLabel' in stat ? stat.valueLabel : undefined}
                    label={stat.label}
                  />
                ))}
              </dl>
            </Specimen>
            <Specimen title={ds.molecules.labels.specs}>
              <dl className="grid grid-cols-3 gap-4 rounded-2xl bg-surface-raised p-6">
                {ds.molecules.specs.map((spec, index) => (
                  <SpecItem key={spec.label} icon={specIcons[index]} label={spec.label} value={spec.value} />
                ))}
              </dl>
            </Specimen>
          </div>

          <div className="grid gap-space-xl lg:grid-cols-3">
            <Specimen title={ds.molecules.labels.eventCard}>
              <EventCard {...ds.molecules.eventCard} headingLevel="h4" />
            </Specimen>
            <Specimen title={ds.molecules.labels.gallery}>
              <GalleryItem {...ds.molecules.gallery} />
            </Specimen>
            <Specimen title={ds.molecules.labels.testimonial}>
              <TestimonialCard {...ds.molecules.testimonial} rating={5} />
            </Specimen>
          </div>

          <Specimen title={ds.molecules.labels.pricing}>
            <div className="grid gap-8 pt-4 md:grid-cols-2">
              {ds.molecules.pricing.map((plan) => (
                <PricingCard
                  key={plan.title}
                  eyebrow={plan.eyebrow}
                  title={plan.title}
                  description={plan.description}
                  price={plan.price}
                  features={[...plan.features]}
                  cta={plan.cta}
                  featured={'featuredLabel' in plan}
                  featuredLabel={'featuredLabel' in plan ? plan.featuredLabel : undefined}
                  headingLevel="h4"
                />
              ))}
            </div>
          </Specimen>

          <Specimen title={ds.molecules.labels.process}>
            <ol className="grid gap-6 md:grid-cols-2">
              {ds.molecules.process.map((step, index) => (
                <li key={step.number}>
                  <ProcessStep
                    {...step}
                    icon={processIcons[index]}
                    highlight={index === ds.molecules.process.length - 1}
                    headingLevel="h4"
                  />
                </li>
              ))}
            </ol>
          </Specimen>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.molecules.labels.accordion}>
              <div className="flex flex-col gap-4">
                {ds.molecules.accordion.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    question={item.question}
                    open={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                    headingLevel="h4"
                  >
                    <p>{item.answer}</p>
                  </AccordionItem>
                ))}
              </div>
            </Specimen>
            <Specimen title={ds.molecules.labels.contact}>
              <dl className="flex flex-col gap-4 rounded-3xl bg-surface-raised p-8">
                <ContactInfoItem icon="pin-drop" label={ds.molecules.contactLabels.address} note={contact.addressNote}>
                  {contact.address}
                </ContactInfoItem>
                <ContactInfoItem icon="schedule" label={ds.molecules.contactLabels.hours} note={contact.visitHoursNote}>
                  {contact.visitHours}
                </ContactInfoItem>
                <ContactInfoItem icon="phone-in-talk" label={ds.molecules.contactLabels.phone}>
                  <a href={contact.phoneHref} className="underline underline-offset-4 hover:text-accent">
                    {contact.phoneDisplay}
                  </a>
                </ContactInfoItem>
              </dl>
            </Specimen>
          </div>

          <div className="grid gap-space-xl lg:grid-cols-2">
            <Specimen title={ds.molecules.labels.filters}>
              <div className="flex flex-wrap gap-2">
                {ds.molecules.filters.map((filter, index) => (
                  <FilterChip key={filter} pressed={activeFilter === index} onClick={() => setActiveFilter(index)}>
                    {filter}
                  </FilterChip>
                ))}
              </div>
            </Specimen>
            <Specimen title={ds.molecules.labels.brand}>
              <BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} />
            </Specimen>
          </div>

          <Specimen title={ds.molecules.labels.alerts}>
            <div className="grid gap-4 md:grid-cols-3">
              <Alert tone="success" title={ds.molecules.alerts.successTitle}>
                <p>{ds.molecules.alerts.success}</p>
              </Alert>
              <Alert tone="info">
                <p>{ds.molecules.alerts.info}</p>
              </Alert>
              <Alert tone="error" title={ds.molecules.alerts.errorTitle}>
                <p>{ds.molecules.alerts.error}</p>
              </Alert>
            </div>
          </Specimen>
        </DsSection>

        {/* 04 · Superficie oscura: valida el foco en data-surface="inverse" */}
        <DsSection
          id="superficie-oscura"
          eyebrow={ds.inverse.eyebrow}
          title={ds.inverse.title}
          description={ds.inverse.description}
          inverse
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="#superficie-oscura" variant="inverse" size="lg" iconEnd={<Icon name="calendar-today" />}>
                {ds.inverse.primary}
              </ButtonLink>
              <ButtonLink
                href={contact.whatsappHref}
                variant="inverseSubtle"
                size="lg"
                newTabHint={ui.newTabHint}
                iconEnd={<Icon name="chat" />}
              >
                {ds.inverse.secondary}
              </ButtonLink>
              <Button variant="accent" size="lg">
                {ds.inverse.accent}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <TextLink href="#superficie-oscura" variant="onInverse">
                {ds.inverse.link}
              </TextLink>
              <TextLink href={contact.phoneHref} variant="onInverse" iconStart={<Icon name="call" size="sm" />}>
                {contact.phoneDisplay}
              </TextLink>
            </div>
            <BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} tone="inverse" />
          </div>
        </DsSection>
      </main>

      <footer className="bg-surface-strong">
        <Text size="sm" tone="muted" className="mx-auto max-w-page px-margin-mobile py-space-lg lg:px-12">
          {ds.footer}
        </Text>
      </footer>
    </>
  )
}
