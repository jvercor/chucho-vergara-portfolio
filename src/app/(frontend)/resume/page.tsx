import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import PageClient from './page.client'

import { TechnicalStack } from '@/components/Resume/TechnicalStack'
import { ExperienceList } from '@/components/Resume/ExperienceList'
import { EducationList } from '@/components/Resume/EducationList'
import { CertificationList } from '@/components/Resume/CertificationList'
import { LanguageList } from '@/components/Resume/LanguageList'
import { RenderHero } from '@/heros/RenderHero'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export default async function ResumePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const [companionPage, experiencesResult, educationsResult, certificationsResult, languagesResult] =
    await Promise.all([
      queryResumePage(),
      payload.find({
        collection: 'experience',
        depth: 1,
        draft: false,
        limit: 100,
        overrideAccess: true,
        sort: '-startYear',
      }),
      payload.find({
        collection: 'education',
        depth: 0,
        draft: false,
        limit: 100,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'certifications',
        depth: 0,
        draft: false,
        limit: 100,
        overrideAccess: true,
      }),
      payload.find({
        collection: 'languages',
        depth: 0,
        draft: false,
        limit: 100,
        overrideAccess: true,
      }),
    ])

  const experiences = experiencesResult.docs
  const educations = educationsResult.docs
  const certifications = certificationsResult.docs
  const languages = languagesResult.docs

  return (
    <div className="pb-24">
      <PageClient />
      {draft && <LivePreviewListener />}

      {companionPage?.hero && <RenderHero {...companionPage.hero} />}

      <section className="container my-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: Experience */}
        <div className="lg:col-span-8">
          <ExperienceList experiences={experiences} />
        </div>

        {/* Right: Education, Certifications, Languages */}
        <div className="lg:col-span-4 flex flex-col gap-12">
          <EducationList educations={educations} />
          <CertificationList certifications={certifications} />
          <LanguageList languages={languages} />
        </div>
      </section>

      <TechnicalStack experiences={experiences} />

      {companionPage?.layout && companionPage.layout.length > 0 && (
        <RenderBlocks blocks={companionPage.layout} />
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const companionPage = await queryResumePage()
  if (companionPage) return generateMeta({ doc: companionPage })
  return { title: 'Resume — Jesus Vergara' }
}

const queryResumePage = cache(async () => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    where: { slug: { equals: 'resume' } },
  })
  return result.docs?.[0] || null
})
