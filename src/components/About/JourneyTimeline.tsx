import React from 'react'
import type { JourneyPhase } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'

function YearRange({
  startYear,
  endYear,
  isCurrent,
}: {
  startYear: number
  endYear?: number | null
  isCurrent?: boolean | null
}) {
  if (isCurrent) return <>{startYear} – Present</>
  if (endYear == null || endYear === startYear) return <>{startYear}</>
  return (
    <>
      {startYear} – {endYear}
    </>
  )
}

function PhaseStackTags({ stack, alignEnd }: { stack: JourneyPhase['stack']; alignEnd?: boolean }) {
  if (!stack?.length) return null

  return (
    <div className={`flex gap-2 mt-4 flex-wrap ${alignEnd ? 'md:justify-end' : ''}`}>
      {stack.map((entry) => {
        if (typeof entry !== 'object') return null
        return (
          <span
            key={entry.id}
            className="px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink font-label-caps text-[10px]"
          >
            {entry.title}
          </span>
        )
      })}
    </div>
  )
}

function PhaseHeading({ phase }: { phase: JourneyPhase }) {
  return (
    <>
      <h3 className="font-headline-sm text-headline-sm text-foreground">{phase.title}</h3>
      <p className="font-label-caps text-label-caps text-muted-foreground mt-1">
        {phase.location} •{' '}
        <YearRange startYear={phase.startYear} endYear={phase.endYear} isCurrent={phase.isCurrent} />
      </p>
    </>
  )
}

function PhaseCard({ phase, alignEnd }: { phase: JourneyPhase; alignEnd?: boolean }) {
  return (
    <div className="glass-card border border-border/40 bg-card/80 neon-glow-pink p-6 rounded-lg transition-all duration-500 hover:-translate-y-1">
      <div className="md:hidden mb-4">
        <PhaseHeading phase={phase} />
      </div>
      {phase.description && (
        <div className="font-body-sm text-body-sm text-muted-foreground">
          <RichText data={phase.description} />
        </div>
      )}
      <PhaseStackTags stack={phase.stack} alignEnd={alignEnd} />
    </div>
  )
}

function TimelineDot() {
  return (
    <div className="absolute left-[-32px] md:left-1/2 top-6 md:top-1/2 w-3 h-3 rounded-full bg-background border-2 border-border transform md:-translate-x-1/2 md:-translate-y-1/2 group-hover:border-neon-pink group-hover:bg-neon-pink group-hover:shadow-[0_0_10px_rgba(255,1,251,0.5)] transition-all z-10" />
  )
}

export function JourneyTimeline({ phases }: { phases: JourneyPhase[] }) {
  if (phases.length === 0) return null

  return (
    <section className="container my-16 flex flex-col gap-12 relative">
      <div className="flex flex-col gap-2">
        <h2 className="font-headline-md text-headline-md text-foreground flex items-center gap-3">
          <FontAwesomeIcon icon={faRoute} className="text-neon-pink w-6 h-6" />
          The Journey
        </h2>
        <div className="h-[2px] w-16 bg-gradient-to-r from-neon-pink to-transparent" />
      </div>

      <div className="relative pl-8 md:pl-0">
        {/* Timeline line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2" />

        <div className="flex flex-col gap-8 md:gap-16">
          {phases.map((phase, index) => {
            const isEven = index % 2 === 1
            return (
              <div
                key={phase.id}
                className="relative flex flex-col md:flex-row md:items-center justify-between w-full group"
              >
                <TimelineDot />

                {isEven ? (
                  <>
                    <div className="w-full md:w-5/12 md:text-right md:pr-12 order-2 md:order-1 mt-4 md:mt-0">
                      <PhaseCard phase={phase} alignEnd />
                    </div>
                    <div className="hidden md:block w-5/12 pl-12 order-2">
                      <PhaseHeading phase={phase} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="hidden md:block w-5/12 text-right pr-12">
                      <PhaseHeading phase={phase} />
                    </div>
                    <div className="w-full md:w-5/12 md:pl-12">
                      <PhaseCard phase={phase} />
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
