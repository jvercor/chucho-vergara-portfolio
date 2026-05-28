import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText, backgroundImage }) => {
  const hasImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <div className="container">
      <div className="relative overflow-hidden rounded-lg flex items-center justify-center min-h-[400px]">
        {hasImage && (
          <Media
            resource={backgroundImage}
            fill
            imgClassName="object-cover object-center"
          />
        )}
        {!hasImage && <div className="absolute inset-0 bg-card" />}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 py-24 px-8">
          {richText && (
            <RichText
              className="mb-0 prose-xl [&_h1]:text-5xl [&_h2]:text-4xl [&_h3]:text-3xl [&_*]:!text-white [&_*]:[text-shadow:0_2px_12px_rgba(0,0,0,0.7)]"
              data={richText}
              enableGutter={false}
            />
          )}
          {(links || []).length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {(links || []).map(({ link }, i) => {
                const appearance =
                  link.appearance === 'outline' ? 'hero-outline' : 'primary'
                return <CMSLink key={i} size="clear" {...link} appearance={appearance} />
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
