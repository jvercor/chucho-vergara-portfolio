import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'

import type { Media, Project, Stack } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Media as MediaComponent } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { ProjectContentRenderer } from './ProjectContentRenderer'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    collection: 'projects',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return projects.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/projects/' + decodedSlug
  const project = await queryProjectBySlug({ slug: decodedSlug })

  if (!project) return <PayloadRedirects url={url} />

  const coverImage = project.coverImage && typeof project.coverImage === 'object'
    ? (project.coverImage as Media)
    : null

  const stack = (project.stack ?? []).filter(
    (s): s is Stack => typeof s === 'object',
  )

  const launchDateLabel = project.launchDate
    ? new Date(project.launchDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="container py-section-gap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">

          {/* Left column */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-12 h-[2px] bg-neon-pink" />
              <span className="font-label-caps text-label-caps text-neon-pink uppercase tracking-widest">
                Featured Project
              </span>
            </div>

            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground mb-6 tracking-tighter">
              {project.title}
            </h1>

            {project.shortDescription && (
              <p className="font-body-lg text-body-lg text-muted-foreground max-w-2xl">
                {project.shortDescription}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex flex-wrap gap-x-12 gap-y-6 mt-12 pt-8 border-t border-border/30">
              {project.clientLocation && (
                <div>
                  <span className="block font-label-caps text-label-caps text-muted-foreground uppercase mb-2">
                    Location
                  </span>
                  <span className="text-foreground font-body-md">{project.clientLocation}</span>
                </div>
              )}

              {launchDateLabel && (
                <div>
                  <span className="block font-label-caps text-label-caps text-muted-foreground uppercase mb-2">
                    Launch Date
                  </span>
                  <span className="text-foreground font-body-md">{launchDateLabel}</span>
                </div>
              )}

              {stack.length > 0 && (
                <div>
                  <span className="block font-label-caps text-label-caps text-muted-foreground uppercase mb-2">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {stack.map((s) => (
                      <span
                        key={s.id}
                      className="px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink font-label-caps text-[10px]"
                      >
                        {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs — visible on mobile (below metadata), hidden on md+ where they float on image */}
            {(project.liveUrl || project.repoUrl) && (
              <div className="flex flex-wrap gap-4 mt-10 md:hidden">
                {project.liveUrl && (
                  <Button variant="solid" size="clear" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo
                    </a>
                  </Button>
                )}
                {project.repoUrl && (
                  <Button variant="hero-outline" size="clear" asChild>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      View Source
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Right column — cover image */}
          {coverImage && (
            <div className="relative group md:min-w-[42%]">
              {/* Decorative glow border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-russian-violet to-neon-pink opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-lg" />

              {/* Image */}
              <div className="relative overflow-hidden aspect-video bg-background border border-border/30 rounded-lg">
                <MediaComponent
                  resource={coverImage}
                  fill
                  imgClassName="object-cover transition-all duration-700"
                />
              </div>

              {/* CTAs — float over image on md+, hidden on mobile */}
              {(project.liveUrl || project.repoUrl) && (
                <div className="hidden md:flex absolute bottom-6 left-6 gap-4 flex-wrap">
                  {project.liveUrl && (
                    <Button variant="solid" size="clear" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.repoUrl && (
                    <Button variant="hero-outline" size="clear" className="backdrop-blur-sm" asChild>
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                        View Source
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      {project.content && (
        <section className="container">
          <ProjectContentRenderer data={project.content} />
        </section>
      )}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const project = await queryProjectBySlug({ slug: decodedSlug })

  return generateMeta({ doc: project })
}

const queryProjectBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
