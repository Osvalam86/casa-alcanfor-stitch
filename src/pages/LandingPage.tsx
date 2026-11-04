import { useState, type MouseEvent } from 'react'
import { SkipLink } from '@/components/atoms/SkipLink'
import { BrandLockup } from '@/components/molecules/BrandLockup'
import { AvailabilityChecker, type AvailabilityCheckerValues } from '@/components/organisms/AvailabilityChecker'
import { ContactSection } from '@/components/organisms/ContactSection'
import { CtaBanner } from '@/components/organisms/CtaBanner'
import { EventsSection } from '@/components/organisms/EventsSection'
import { FaqSection } from '@/components/organisms/FaqSection'
import { GallerySection } from '@/components/organisms/GallerySection'
import { Hero } from '@/components/organisms/Hero'
import { LocationCard } from '@/components/organisms/LocationCard'
import { MobileActionBar } from '@/components/organisms/MobileActionBar'
import { MobileMenu } from '@/components/organisms/MobileMenu'
import { PricingSection } from '@/components/organisms/PricingSection'
import { ProcessSection } from '@/components/organisms/ProcessSection'
import { PromiseSection } from '@/components/organisms/PromiseSection'
import { QuoteForm } from '@/components/organisms/QuoteForm'
import { SiteFooter } from '@/components/organisms/SiteFooter'
import { SiteHeader } from '@/components/organisms/SiteHeader'
import { SpacesTabs } from '@/components/organisms/SpacesTabs'
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection'
import { TrustBar } from '@/components/organisms/TrustBar'
import { WhatsAppFab } from '@/components/organisms/WhatsAppFab'
import { LandingTemplate } from '@/components/templates/LandingTemplate'
import {
  availabilityChecker,
  ctaBanner,
  events,
  faq,
  floatingContact,
  footer,
  gallery,
  header,
  hero,
  location,
  pricing,
  process,
  promise,
  quoteForm,
  spaces,
  testimonials,
  trustBar,
} from '@/content/landing'
import { brand, contact, ui } from '@/content/site'
import { useFocusNotObscured } from '@/lib/hooks/useFocusNotObscured'
import { useInitialHashScroll } from '@/lib/hooks/useInitialHashScroll'
import { useQuoteForm } from '@/lib/hooks/useQuoteForm'
import { updateUrl, useSearchParamState } from '@/lib/hooks/useSearchParamState'

const SECTION_IDS = {
  hero: 'inicio',
  events: 'eventos',
  spaces: 'espacios',
  pricing: 'paquetes',
  gallery: 'galeria',
  faq: 'preguntas',
  contact: 'contacto',
} as const

const QUOTE_TITLE_ID = 'cotizacion-titulo'
const galleryFilterIds = gallery.filters.map((filter) => filter.id)
const spaceIds = spaces.items.map((item) => item.id)

/** Contenedor de la landing: lee content/, guarda el estado compartido y la URL. */
export function LandingPage() {
  const quote = useQuoteForm()
  useInitialHashScroll()
  useFocusNotObscured()
  const [galleryFilter, setGalleryFilter] = useSearchParamState('galeria', galleryFilterIds, 'todos')
  const [spaceId, setSpaceId] = useSearchParamState('espacio', spaceIds, 'salon')
  const [quoteAnnouncement, setQuoteAnnouncement] = useState('')
  const [quoteFocusRequest, setQuoteFocusRequest] = useState(0)

  const year = String(new Date().getFullYear())
  const brandLockup = <BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} />

  /** Calculador → formulario (D4): precarga, lleva el foco y anuncia el siguiente paso. */
  function handleChecker(values: AvailabilityCheckerValues) {
    const guestsLine = `${availabilityChecker.guestsNote} ${values.guests}`
    quote.prefill({
      eventType: values.eventType,
      date: values.date,
      comments: quote.values.comments.includes(availabilityChecker.guestsNote)
        ? quote.values.comments
        : [guestsLine, quote.values.comments].filter(Boolean).join('\n'),
    })
    setQuoteAnnouncement(availabilityChecker.handoff)
    setQuoteFocusRequest((request) => request + 1)
  }

  /** "Ver detalles y fotos": filtra la galería sin recargar y lleva el foco a la sección. */
  function handleEventLink(index: number, event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    const url = new URL(window.location.href)
    const filter = events.items[index].galleryFilter
    if (filter === 'todos') url.searchParams.delete('galeria')
    else url.searchParams.set('galeria', filter)
    url.hash = SECTION_IDS.gallery
    updateUrl(url, 'push')
    const target = document.getElementById(SECTION_IDS.gallery)
    target?.scrollIntoView()
    target?.focus({ preventScroll: true })
  }

  return (
    <LandingTemplate
      skipLink={<SkipLink targetId="main">{ui.skipLink}</SkipLink>}
      header={
        <SiteHeader
          brand={brandLockup}
          homeHref={`#${SECTION_IDS.hero}`}
          homeLabel={header.homeLabel}
          navLabel={header.navLabel}
          nav={header.nav}
          phone={{ display: contact.phoneDisplay, href: contact.phoneHref }}
          cta={header.cta}
          menuOpenLabel={header.menu.open}
          renderMenu={({ open, onClose }) => (
            <MobileMenu
              open={open}
              onClose={onClose}
              title={header.menu.title}
              closeLabel={header.menu.close}
              navLabel={header.navLabel}
              items={header.nav}
              cta={header.cta}
            />
          )}
        />
      }
      footer={
        <SiteFooter
          brand={<BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} tone="inverse" />}
          description={footer.description}
          headings={footer.headings}
          address={contact.address}
          phone={{ display: contact.phoneDisplay, href: contact.phoneHref }}
          hours={contact.visitHours}
          hoursNote={footer.hoursNote}
          social={footer.social}
          legal={footer.legal}
          copyright={footer.copyright.replace('{year}', year)}
        />
      }
      floating={
        <>
          <WhatsAppFab
            href={contact.whatsappHref}
            label={floatingContact.whatsappLabel}
            bubble={floatingContact.bubble}
            newTabHint={ui.newTabHint}
          />
          <MobileActionBar
            cta={floatingContact.mobileCta}
            whatsapp={{ href: contact.whatsappHref, label: floatingContact.whatsappLabel, newTabHint: ui.newTabHint }}
          />
        </>
      }
    >
      <Hero
        id={SECTION_IDS.hero}
        {...hero}
        checker={
          <AvailabilityChecker {...availabilityChecker} minDate={quote.today} onSubmit={handleChecker} />
        }
        trustBar={<TrustBar stats={trustBar.stats} />}
      />
      <EventsSection
        id={SECTION_IDS.events}
        eyebrow={events.eyebrow}
        title={events.title}
        description={events.description}
        carouselLabel={events.carouselLabel}
        linkLabel={events.linkLabel}
        items={events.items.map((item) => ({
          ...item,
          href:
            item.galleryFilter === 'todos'
              ? `#${SECTION_IDS.gallery}`
              : `?galeria=${item.galleryFilter}#${SECTION_IDS.gallery}`,
        }))}
        onLinkClick={handleEventLink}
      />
      <PromiseSection {...promise} />
      <SpacesTabs
        id={SECTION_IDS.spaces}
        {...spaces}
        selectedId={spaceId}
        onSelect={(id) => setSpaceId(id as (typeof spaceIds)[number])}
      />
      <PricingSection id={SECTION_IDS.pricing} {...pricing} />
      <ProcessSection {...process} />
      <GallerySection
        id={SECTION_IDS.gallery}
        {...gallery}
        activeFilter={galleryFilter}
        onFilterChange={(id) => setGalleryFilter(id as (typeof galleryFilterIds)[number])}
      />
      <TestimonialsSection {...testimonials} />
      <CtaBanner
        {...ctaBanner}
        whatsappCta={{ label: ctaBanner.whatsappCta, href: contact.whatsappHref, newTabHint: ui.newTabHint }}
      />
      <FaqSection id={SECTION_IDS.faq} {...faq} />
      <ContactSection
        id={SECTION_IDS.contact}
        titleId={QUOTE_TITLE_ID}
        form={
          <QuoteForm
            copy={quoteForm}
            requiredText={ui.requiredText}
            optionalText={ui.optionalText}
            loadingLabel={ui.loading}
            titleId={QUOTE_TITLE_ID}
            values={quote.values}
            invalidFields={quote.invalidFields}
            errorAttempt={quote.errorAttempt}
            status={quote.status}
            minDate={quote.today}
            announcement={quoteAnnouncement}
            focusRequest={quoteFocusRequest}
            onFieldChange={quote.setField}
            onSubmit={quote.handleSubmit}
          />
        }
        location={
          <LocationCard
            {...location}
            address={{ text: contact.address, note: contact.addressNote }}
            hours={{ text: contact.visitHours, note: contact.visitHoursNote }}
            phone={{ display: contact.phoneDisplay, href: contact.phoneHref }}
            whatsapp={{ display: contact.whatsappDisplay, href: contact.whatsappHref, label: contact.whatsappLabel }}
            newTabHint={ui.newTabHint}
            map={{ ...location.map, link: { label: location.map.link, href: contact.mapsHref } }}
          />
        }
      />
    </LandingTemplate>
  )
}
