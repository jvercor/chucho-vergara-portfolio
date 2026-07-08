import React from 'react'
import type { Experience, Stack } from '@/payload-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faLayerGroup, faCloud, faDatabase } from '@fortawesome/free-solid-svg-icons'

type StackItem = Extract<NonNullable<Experience['stack']>[number], object>

const CATEGORY_CONFIG = {
  'programming-language': {
    label: 'LANGUAGES',
    icon: faCode,
    colSpan: 'md:col-span-4',
    accentClass: 'text-neon-pink',
  },
  framework: {
    label: 'FRAMEWORKS & LIBS',
    icon: faLayerGroup,
    colSpan: 'md:col-span-8',
    accentClass: 'text-secondary',
  },
  infrastructure: {
    label: 'INFRASTRUCTURE',
    icon: faCloud,
    colSpan: 'md:col-span-8',
    accentClass: 'text-tertiary',
  },
  database: {
    label: 'DATABASES',
    icon: faDatabase,
    colSpan: 'md:col-span-4',
    accentClass: 'text-secondary',
  },
} as const

type Category = keyof typeof CATEGORY_CONFIG

function aggregateStack(experiences: Experience[]): Map<Category, StackItem[]> {
  const seen = new Set<number>()
  const grouped = new Map<Category, StackItem[]>()

  for (const category of Object.keys(CATEGORY_CONFIG) as Category[]) {
    grouped.set(category, [])
  }

  // experiences arrive sorted by startYear desc — first occurrence of an item wins
  for (const exp of experiences) {
    if (!exp.stack) continue
    for (const item of exp.stack) {
      if (typeof item !== 'object') continue
      if (seen.has(item.id)) continue
      seen.add(item.id)
      const category = item.category as Category
      if (grouped.has(category)) {
        grouped.get(category)!.push(item)
      }
    }
  }

  return grouped
}

function ProgrammingLanguageColumn({ items }: { items: StackItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.id}
          className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-mono-code font-mono-code"
        >
          {item.title}
        </span>
      ))}
    </div>
  )
}

function FrameworkColumn({ items }: { items: StackItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col">
          <span className="text-foreground font-bold text-body-md">{item.title}</span>
          {item.subtitle && (
            <span className="text-muted-foreground text-body-sm">{item.subtitle}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function InfrastructureColumn({ items }: { items: StackItem[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-foreground">
          <div className="w-2 h-2 rounded-full bg-neon-pink" />
          <span className="text-body-md">{item.title}</span>
        </div>
      ))}
    </div>
  )
}

function DatabaseColumn({ items }: { items: StackItem[] }) {
  return (
    <ul className="space-y-2 text-muted-foreground font-mono-code text-mono-code">
      {items.map((item) => (
        <li key={item.id}>• {item.title}</li>
      ))}
    </ul>
  )
}

function CategoryCard({
  category,
  items,
}: {
  category: Category
  items: StackItem[]
}) {
  const config = CATEGORY_CONFIG[category]

  return (
    <div
      className={`${config.colSpan} glass-card border border-border/40 bg-card/80 rounded-xl p-8 flex flex-col gap-6`}
    >
      <div className={`flex items-center gap-3 ${config.accentClass}`}>
        <FontAwesomeIcon icon={config.icon} className="w-4 h-4" />
        <h3 className="font-label-caps text-label-caps">{config.label}</h3>
      </div>

      {category === 'programming-language' && <ProgrammingLanguageColumn items={items} />}
      {category === 'framework' && <FrameworkColumn items={items} />}
      {category === 'infrastructure' && <InfrastructureColumn items={items} />}
      {category === 'database' && <DatabaseColumn items={items} />}
    </div>
  )
}

export function TechnicalStack({ experiences }: { experiences: Experience[] }) {
  const grouped = aggregateStack(experiences)

  const hasAnyItems = Array.from(grouped.values()).some((items) => items.length > 0)
  if (!hasAnyItems) return null

  return (
    <section className="container my-16">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline-sm text-headline-sm text-foreground">Technical Stack</h2>
        <div className="h-[1px] flex-grow bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((category) => {
          const items = grouped.get(category) ?? []
          if (items.length === 0) return null
          return <CategoryCard key={category} category={category} items={items} />
        })}
      </div>
    </section>
  )
}
