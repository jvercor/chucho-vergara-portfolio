import type { FeaturedProjectsBlock as FeaturedProjectsBlockProps, Project } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { LargeCard, SmallCard } from '@/components/ProjectCards'

export const FeaturedProjectsBlock: React.FC<FeaturedProjectsBlockProps> = async ({
  subtitle,
  projectOne,
  projectTwo,
}) => {
  const payload = await getPayload({ config: configPromise })

  const resolveProject = async (ref: FeaturedProjectsBlockProps['projectOne']): Promise<Project | null> => {
    if (!ref) return null
    const id = typeof ref === 'object' ? ref.id : ref
    try {
      return await payload.findByID({ collection: 'projects', id, depth: 1 })
    } catch {
      return null
    }
  }

  const [large, small] = await Promise.all([resolveProject(projectOne), resolveProject(projectTwo)])

  if (!large && !small) return null

  return (
    <section className="container py-section-gap">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="space-y-4">
          <h2 className="font-headline-md text-headline-md text-foreground">Featured Projects</h2>
          {subtitle && (
            <p className="font-body-md text-body-md text-muted-foreground max-w-lg">{subtitle}</p>
          )}
        </div>
        <a
          className="text-neon-pink font-label-caps text-label-caps border-b border-neon-pink/30 hover:border-neon-pink transition-all pb-1"
          href="/projects"
        >
          View All Projects
        </a>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {large && <LargeCard project={large} />}
        {small && <SmallCard project={small} />}
      </div>
    </section>
  )
}

