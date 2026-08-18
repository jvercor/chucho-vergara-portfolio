'use client'

import React from 'react'

import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ModelViewer } from '@/components/ModelViewer'

export const ModelHero: React.FC<Page['hero']> = ({
  badge,
  heading,
  tagline,
  links,
  backgroundImage,
  mobileBackgroundImage,
}) => {
  return (
    <div className="relative -mt-[10.4rem]">
      {/* Background texture — desktop */}
      {backgroundImage && typeof backgroundImage === 'object' && (
        <div className="absolute inset-0 lg:block hidden -z-10">
          <Media fill imgClassName="object-contain object-center" priority resource={backgroundImage} />
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

      {/* Left panel — text content */}
      <div className="relative z-10 container flex flex-col lg:flex-row items-center min-h-screen pt-[10.4rem] pb-8 lg:pb-16 gap-8 lg:gap-16">
        <div className="flex-1 space-y-6 pt-8 lg:pt-0">
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

        {/* Right panel — 3D model */}
        <div className="flex-1 w-full h-[45vh] lg:h-auto lg:self-stretch">
          <ModelViewer />
        </div>
      </div>
    </div>
  )
}
