import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'

import { JourneyTimeline } from '@/components/About/JourneyTimeline'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function AboutPage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const [companionPage, phasesResult] = await Promise.all([
    queryAboutPage(),
    payload.find({
      collection: 'journey-phases',
      depth: 1,
      draft: false,
      limit: 100,
      overrideAccess: true,
      sort: 'startYear',
    }),
  ])

  const phases = phasesResult.docs

  return (
    <div className="pb-24">
      <PageClient />
      {draft && <LivePreviewListener />}

      {companionPage?.hero && <RenderHero {...companionPage.hero} />}

      <JourneyTimeline phases={phases} />

      {companionPage?.layout && companionPage.layout.length > 0 && (
        <RenderBlocks blocks={companionPage.layout} />
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const companionPage = await queryAboutPage()
  if (companionPage) return generateMeta({ doc: companionPage })
  return { title: 'About — Jesus Vergara' }
}

const queryAboutPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: { slug: { equals: 'about' } },
  })
  return result.docs?.[0] || null
})
