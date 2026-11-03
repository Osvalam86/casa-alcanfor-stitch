import { useId, useState } from 'react'
import { AccordionItem } from '@/components/molecules/AccordionItem'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

export type FaqSectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  items: readonly { question: string; answer: string }[]
}

/** Acordeón exclusivo como en el diseño: abrir una pregunta cierra la anterior. */
export function FaqSection({ id, eyebrow, title, description, items }: FaqSectionProps) {
  const titleId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 md:gap-4">
          {items.map((item, index) => (
            <AccordionItem
              key={item.question}
              question={item.question}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <p>{item.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  )
}
