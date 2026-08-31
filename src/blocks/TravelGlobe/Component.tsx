import React from 'react'

import type { TravelGlobeBlock as TravelGlobeBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

import { GlobeCanvas } from './GlobeCanvas'
import { travelGlobeCountries } from './countries'

export const TravelGlobeBlock: React.FC<TravelGlobeBlockProps> = ({ heading, body, travels }) => {
  if (!travels || travels.length === 0) return null

  const countryByCode = new Map(travelGlobeCountries.map((c) => [c.value, c]))

  const points = travels
    .map((t, i) => {
      const country = countryByCode.get(t.country)
      if (!country) return null
      return {
        id: `travel-${i}`,
        lat: country.lat,
        lon: country.lon,
        countryLabel: country.label,
        photo: t.photo,
      }
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <section className="container py-section-gap">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left panel — text content */}
        <div className="space-y-6 text-center lg:text-left">
          {heading && (
            <h2 className="font-headline-md text-headline-md text-foreground">{heading}</h2>
          )}
          {body && <RichText data={body} enableGutter={false} />}
        </div>

        {/* Right panel — rotating globe with photo markers */}
        <GlobeCanvas travels={points} />
      </div>
    </section>
  )
}
