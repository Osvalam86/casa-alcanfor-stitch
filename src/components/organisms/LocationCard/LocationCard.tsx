import { useId } from 'react'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Image } from '@/components/atoms/Image'
import { TextLink } from '@/components/atoms/TextLink'
import { ContactInfoItem } from '@/components/molecules/ContactInfoItem'

export type LocationCardProps = {
  eyebrow: string
  title: string
  labels: { address: string; hours: string; phone: string }
  address: { text: string; note: string }
  hours: { text: string; note: string }
  phone: { display: string; href: string }
  whatsapp: { display: string; href: string; label: string }
  newTabHint: string
  map: {
    image: { src: string; alt: string; width: number; height: number }
    label: string
    link: { label: string; href: string }
  }
}

export function LocationCard({ eyebrow, title, labels, address, hours, phone, whatsapp, newTabHint, map }: LocationCardProps) {
  const titleId = useId()

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby={titleId} className="flex flex-col gap-6 rounded-3xl bg-surface p-6 shadow-sm md:p-8 lg:p-10">
        <div className="flex flex-col gap-2">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading as="h2" id={titleId} size="lg">
            {title}
          </Heading>
        </div>
        <dl className="flex flex-col gap-4">
          <ContactInfoItem icon="pin-drop" label={labels.address} note={address.note}>
            {address.text}
          </ContactInfoItem>
          <ContactInfoItem icon="schedule" label={labels.hours}>
            {hours.text}
            <span className="block text-caption">{hours.note}</span>
          </ContactInfoItem>
          <ContactInfoItem icon="phone-in-talk" label={labels.phone}>
            <a href={phone.href} className="underline-offset-4 hover:text-accent hover:underline">
              {phone.display}
            </a>
            {' · '}
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:text-accent hover:underline"
            >
              {whatsapp.label}: {whatsapp.display}
              <span className="sr-only"> {newTabHint}</span>
            </a>
          </ContactInfoItem>
        </dl>
      </section>

      <div className="relative flex h-80 items-end overflow-hidden rounded-3xl bg-surface-muted p-4 shadow-sm md:p-6">
        <Image
          src={map.image.src}
          alt={map.image.alt}
          width={map.image.width}
          height={map.image.height}
          className="absolute inset-0"
        />
        <div className="relative flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-surface/95 p-4 shadow-md backdrop-blur-md">
          <p className="flex items-center gap-2 font-sans text-label-md font-medium text-text-strong">
            <Icon name="explore" size="lg" className="text-accent" />
            {map.label}
          </p>
          <TextLink href={map.link.href} variant="caps" newTabHint={newTabHint} className="min-h-control-sm">
            {map.link.label}
          </TextLink>
        </div>
      </div>
    </div>
  )
}
