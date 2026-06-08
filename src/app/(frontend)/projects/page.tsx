import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'

import { LargeCard, SmallCard } from '@/components/ProjectCards'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function Page() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const companionPage = await queryProjectsPage()

  const { docs: projects } = await payload.find({
    collection: 'projects',
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: '-launchDate',
    where: {
      _status: { equals: 'published' },
    },
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      coverImage: true,
      launchDate: true,
      stack: true,
      repoUrl: true,
      clientLocation: true,
      updatedAt: true,
      createdAt: true,
      meta: true,
    },
  })

  const [featured, spotlight, ...rest] = projects

  return (
    <div className="pb-24">
      <PageClient />
      {draft && <LivePreviewListener />}

      {companionPage?.hero && <RenderHero {...companionPage.hero} />}

      {/* Bento — top two projects */}
      {featured && (
        <section className="container mb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <LargeCard
              project={featured}
              colClass={spotlight ? 'md:col-span-8' : 'md:col-span-12'}
            />
            {spotlight && <SmallCard project={spotlight} />}
          </div>
        </section>
      )}

      {/* All remaining projects — 3-per-row */}
      {rest.length > 0 && (
        <section className="container mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((project) => (
              <SmallCard key={project.id} project={project} colClass="" />
            ))}
          </div>
        </section>
      )}

      {companionPage?.layout && companionPage.layout.length > 0 && (
        <RenderBlocks blocks={companionPage.layout} />
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const companionPage = await queryProjectsPage()
  if (companionPage) return generateMeta({ doc: companionPage })
  return { title: 'Projects — Jesus Vergara' }
}

const queryProjectsPage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: { slug: { equals: 'projects' } },
  })
  return result.docs?.[0] || null
})
