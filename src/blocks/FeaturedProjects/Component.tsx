import type { FeaturedProjectsBlock as FeaturedProjectsBlockProps, Project } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'

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

const StackTags: React.FC<{ stack: Project['stack'] }> = ({ stack }) => {
  if (!stack?.length) return null
  const tags = stack.slice(0, 3)

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((entry) => {
        if (typeof entry !== 'object') return null
        return (
          <span
            key={entry.id}
            className="px-3 py-1 rounded-full bg-neon-pink/10 text-neon-pink font-label-caps text-[10px]"
          >
            {entry.title}
          </span>
        )
      })}
    </div>
  )
}

const LargeCard: React.FC<{ project: Project }> = ({ project }) => {
  const { title, shortDescription, coverImage, stack, repoUrl, slug } = project

  return (
    <div className="md:col-span-8 group">
      <a href={`/projects/${slug}`} className="glass-card rounded-xl overflow-hidden flex flex-col h-full border border-border/40 bg-card/80 neon-glow-pink group-hover:border-neon-pink transition-all duration-500">
        {coverImage && typeof coverImage === 'object' && (
          <div className="aspect-video w-full overflow-hidden bg-muted relative">
            <Media
              resource={coverImage}
              fill
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-8 space-y-4 flex-grow">
          <StackTags stack={stack} />
          <h3 className="font-headline-sm text-headline-sm text-card-foreground">{title}</h3>
          {shortDescription && (
            <p className="font-body-md text-body-md text-muted-foreground">{shortDescription}</p>
          )}
          {repoUrl && (
            <div className="pt-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-neon-pink text-base">terminal</span>
              <span className="font-mono-code text-mono-code text-muted-foreground">
                git clone {repoUrl}
              </span>
            </div>
          )}
        </div>
      </a>
    </div>
  )
}

const SmallCard: React.FC<{ project: Project }> = ({ project }) => {
  const { title, shortDescription, coverImage, stack, slug } = project

  return (
    <div className="md:col-span-4 group">
      <a href={`/projects/${slug}`} className="glass-card rounded-xl overflow-hidden flex flex-col h-full border border-border/40 bg-card/80 neon-glow-pink group-hover:border-neon-pink transition-all duration-500">
        {coverImage && typeof coverImage === 'object' && (
          <div className="aspect-square w-full overflow-hidden bg-muted relative">
            <Media
              resource={coverImage}
              fill
              imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-8 space-y-4 flex-grow">
          <StackTags stack={stack} />
          <h3 className="font-headline-sm text-headline-sm text-card-foreground">{title}</h3>
          {shortDescription && (
            <p className="font-body-md text-body-md text-muted-foreground">{shortDescription}</p>
          )}
        </div>
      </a>
    </div>
  )
}
