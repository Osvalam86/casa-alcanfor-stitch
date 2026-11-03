import { Badge } from '@/components/atoms/Badge'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Image } from '@/components/atoms/Image'
import { Text } from '@/components/atoms/Text'
import { TextLink } from '@/components/atoms/TextLink'
import { cn } from '@/lib/cn'

export type EventCardProps = {
  title: string
  description: string
  badge: string
  image: { src: string; alt: string }
  link: { label: string; href: string }
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/** Tarjeta de tipo de evento. El texto del enlace se repite: el título va como contexto oculto. */
export function EventCard({ title, description, badge, image, link, headingLevel = 'h3', className }: EventCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-sm transition-shadow duration-300 hover:shadow-xl',
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden md:h-64">
        <Image
          src={image.src}
          alt={image.alt}
          className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <Badge variant="sage" className="absolute top-4 right-4">
          {badge}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <Heading as={headingLevel} size="md">
            {title}
          </Heading>
          <Text size="sm" tone="muted">
            {description}
          </Text>
        </div>
        <TextLink href={link.href} srContext={title} iconEnd={<Icon name="arrow-forward" size="sm" />}>
          {link.label}
        </TextLink>
      </div>
    </article>
  )
}
