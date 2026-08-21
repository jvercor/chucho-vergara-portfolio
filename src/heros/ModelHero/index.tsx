'use client'

import React, { useCallback, useState } from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ModelViewer } from '@/components/ModelViewer'
import { PageLoader } from '@/components/PageLoader'

export const ModelHero: React.FC<Page['hero']> = ({
  badge,
  heading,
  tagline,
  links,
  backgroundImage,
  mobileBackgroundImage,
}) => {
  const hasBg = !!(backgroundImage && typeof backgroundImage === 'object')
  const [bgLoaded, setBgLoaded] = useState(!hasBg)
  const [modelReady, setModelReady] = useState(false)

  const handleBgLoad = useCallback(() => setBgLoaded(true), [])
  const handleModelReady = useCallback(() => setModelReady(true), [])

  const ready = bgLoaded && modelReady

  return (
    <>
      <PageLoader ready={ready} />
      <div className="relative -mt-[10.4rem] h-[calc(100svh+10.4rem)]">
      {/* Background texture — desktop */}
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 lg:block hidden -z-10">
          <Media fill imgClassName="object-contain object-center" priority resource={backgroundImage} onLoad={handleBgLoad} />
        </div>
      )}
      {/* Background texture — mobile */}
      {(mobileBackgroundImage || backgroundImage) && (
        <div className="absolute inset-0 lg:hidden -z-10">
          <Media
            fill
            imgClassName="object-cover"
            priority
            resource={
              typeof mobileBackgroundImage === 'object' && mobileBackgroundImage
                ? mobileBackgroundImage
                : typeof backgroundImage === 'object' && backgroundImage
                  ? backgroundImage
                  : undefined
            }
          />
        </div>
      )}

      {/* Full-bleed canvas — fills the entire hero at every breakpoint */}
      <div className="absolute inset-0">
        <ModelViewer onReady={handleModelReady} />
      </div>

      {/* Text overlay — absolutely positioned over the canvas, left-aligned */}
      <div className="absolute inset-0 pt-[10.4rem] z-10 pointer-events-none">
        <div className="container h-full flex flex-col justify-start lg:justify-center pb-8 lg:pb-16">
          <div className="max-w-md space-y-6 pointer-events-auto pt-8 lg:pt-0">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
                <span
                  className="w-2 h-2 rounded-full bg-neon-pink animate-pulse"
                  aria-hidden="true"
                />
                <span className="font-label-caps text-[10px] uppercase tracking-widest text-primary">
                  {badge}
                </span>
              </div>
            )}

            {heading && (
              <h1 className="text-headline-lg md:text-headline-xl bg-gradient-to-r from-foreground via-foreground to-neon-pink bg-clip-text text-transparent">
                {heading}
              </h1>
            )}

            {tagline && <p className="text-body-lg text-muted-foreground">{tagline}</p>}

            {Array.isArray(links) && links.length > 0 && (
              <div className="flex flex-row items-start gap-4 pt-2">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} {...link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
