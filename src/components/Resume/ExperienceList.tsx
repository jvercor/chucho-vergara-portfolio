import React from 'react'
import type { Experience, Stack } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

function YearRange({ startYear, endYear, isCurrent }: { startYear: number; endYear?: number | null; isCurrent?: boolean | null }) {
  const end = isCurrent ? 'PRESENT' : endYear ?? ''
  return (
    <span className="text-muted-foreground font-mono-code text-mono-code mt-2 md:mt-0">
      {startYear} — {end}
    </span>
  )
}

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-4 mb-12">
        <h2 className="font-headline-sm text-headline-sm text-foreground">Professional Experience</h2>
        <div className="h-[1px] flex-grow bg-border" />
      </div>

      <div className="space-y-16">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-8 border-l border-border group">
            {/* Timeline dot */}
            <div
              className={`absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full transition-transform shadow-[0_0_10px_rgba(255,1,251,0.5)] ${
                index === 0
                  ? 'bg-neon-pink group-hover:scale-150'
                  : 'bg-border group-hover:bg-neon-pink'
              }`}
            />

            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-foreground leading-tight">
                  {exp.role}
                </h3>
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-pink font-label-caps text-label-caps tracking-wider hover:underline"
                  >
                    {exp.company.toUpperCase()}
                  </a>
                ) : (
                  <p className="text-neon-pink font-label-caps text-label-caps tracking-wider">
                    {exp.company.toUpperCase()}
                  </p>
                )}
              </div>
              <YearRange
                startYear={exp.startYear}
                endYear={exp.endYear}
                isCurrent={exp.isCurrent}
              />
            </div>

            {exp.bullets && exp.bullets.length > 0 && (
              <div className="bg-card/60 border border-border/30 p-6 rounded-xl mb-4">
                <ul className="space-y-2 text-muted-foreground list-disc pl-4">
                  {exp.bullets.map((bullet) =>
                    bullet.content ? (
                      <li key={bullet.id ?? undefined}>
                        <RichText data={bullet.content} />
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
