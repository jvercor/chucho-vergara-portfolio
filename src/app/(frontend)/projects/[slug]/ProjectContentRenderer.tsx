import React from 'react'
import RichText from '@/components/RichText'
import { NarrativeCard } from './NarrativeCard'
import { groupRichTextByHeading } from '@/utilities/groupRichTextByHeading'
import type { Project } from '@/payload-types'

type Props = {
  data: Project['content']
}

function buildMiniState(nodes: Record<string, unknown>[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: nodes,
      direction: 'ltr' as const,
    },
  }
}

export function ProjectContentRenderer({ data }: Props) {
  if (!data) return null

  const segments = groupRichTextByHeading(data as Parameters<typeof groupRichTextByHeading>[0])

  if (segments.length === 0) return null

  return (
    <div className="space-y-16">
      {segments.map((segment, index) => {
        if (segment.type === 'card') {
          return <NarrativeCard key={index} {...segment} />
        }

        return (
          <RichText
            key={index}
            data={buildMiniState(segment.nodes) as Parameters<typeof RichText>[0]['data']}
            enableGutter={false}
            enableProse
          />
        )
      })}
    </div>
  )
}
