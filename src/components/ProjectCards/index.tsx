import type { Project } from '@/payload-types'

import { Media } from '@/components/Media'
import React from 'react'

export const StackTags: React.FC<{ stack: Project['stack'] }> = ({ stack }) => {
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

export const LargeCard: React.FC<{ project: Project; colClass?: string }> = ({
  project,
  colClass = 'md:col-span-8',
}) => {
  const { title, shortDescription, coverImage, stack, repoUrl, slug } = project

  return (
    <div className={`${colClass} group h-full`}>
      <a
        href={`/projects/${slug}`}
        className="glass-card rounded-xl overflow-hidden flex flex-col h-full border border-border/40 bg-card/80 neon-glow-pink group-hover:border-neon-pink transition-all duration-500"
      >
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

export const SmallCard: React.FC<{ project: Project; colClass?: string }> = ({
  project,
  colClass = 'md:col-span-4',
}) => {
  const { title, shortDescription, coverImage, stack, slug } = project

  return (
    <div className={`${colClass} group h-full`}>
      <a
        href={`/projects/${slug}`}
        className="glass-card rounded-xl overflow-hidden flex flex-col h-full border border-border/40 bg-card/80 neon-glow-pink group-hover:border-neon-pink transition-all duration-500"
      >
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

