import React from 'react'
import type { Language } from '@/payload-types'

const LEVEL_LABELS: Record<Language['level'], string> = {
  native: 'Native',
  fluent: 'Fluent',
  advanced: 'Advanced',
  intermediate: 'Intermediate',
  basic: 'Basic',
}

export function LanguageList({ languages }: { languages: Language[] }) {
  if (languages.length === 0) return null

  return (
    <div className="glass-card border border-border/40 bg-card/80 rounded-xl p-8">
      <h2 className="font-label-caps text-label-caps text-foreground mb-6">LANGUAGES</h2>

      <div className="space-y-3">
        {languages.map((lang) => (
          <div key={lang.id} className="flex items-center justify-between">
            <span className="text-body-md text-foreground font-bold">{lang.title}</span>
            <span className="text-body-sm text-muted-foreground">{LEVEL_LABELS[lang.level]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
