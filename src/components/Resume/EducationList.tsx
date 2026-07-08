import React from 'react'
import type { Education } from '@/payload-types'

function YearRange({ yearFrom, yearTo, isCurrent }: { yearFrom: number; yearTo?: number | null; isCurrent?: boolean | null }) {
  const end = isCurrent ? 'Present' : yearTo ?? ''
  return (
    <span className="text-muted-foreground text-body-sm font-mono-code">
      {yearFrom} — {end}
    </span>
  )
}

export function EducationList({ educations }: { educations: Education[] }) {
  if (educations.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-headline-sm text-headline-sm text-foreground">Education</h2>
      </div>

      <div className="space-y-8">
        {educations.map((edu) => (
          <div key={edu.id} className="border-b border-border pb-6">
            <h4 className="font-bold text-foreground text-body-md mb-1">{edu.title}</h4>
            <p className="text-primary text-body-sm mb-2">{edu.institution}</p>
            <YearRange yearFrom={edu.yearFrom} yearTo={edu.yearTo} isCurrent={edu.isCurrent} />
          </div>
        ))}
      </div>
    </div>
  )
}
