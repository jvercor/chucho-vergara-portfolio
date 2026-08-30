import React from 'react'

import type { Page } from '@/payload-types'
import { Media } from '@/components/Media'

export const TerminalHero: React.FC<Page['hero']> = ({
  heading,
  tagline,
  backgroundImage,
  heroCode,
  heroCodeFilename,
}) => {
  return (
    <section className="container py-[15px] lg:py-section-gap">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left panel — text content */}
        <div className="space-y-6 text-center lg:text-left">
          {heading && (
            <h1 className="text-headline-lg-mobile md:text-headline-xl bg-gradient-to-r from-foreground via-foreground to-neon-pink bg-clip-text text-transparent">
              {heading}
            </h1>
          )}

          {tagline && <p className="text-body-lg text-muted-foreground">{tagline}</p>}
        </div>

        {/* Right panel */}
        <div className="relative overflow-hidden rounded-2xl min-h-[450px] lg:min-h-[580px]">
          {/* Background image */}
          {backgroundImage && typeof backgroundImage === 'object' && (
            <div className="absolute inset-0">
              <Media fill imgClassName="object-cover" priority resource={backgroundImage} />
            </div>
          )}

          {/* Terminal window — hardcoded shell, CMS-editable code */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden w-full lg:max-w-[85%] shadow-2xl">
              {/* Title bar */}
              <div className="bg-surface-container px-3 py-1.5 md:px-4 md:py-2 flex items-center justify-between border-b border-outline-variant">
                <div className="flex gap-2" aria-hidden="true">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">
                  {heroCodeFilename ?? 'code'}
                </span>
                <div className="w-6 md:w-12" aria-hidden="true" />
              </div>
              {/* Code content */}
              <pre className="p-4 font-mono-ascii text-mono-ascii text-on-surface-variant overflow-x-auto text-center">
                <code>{heroCode ?? ''}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
