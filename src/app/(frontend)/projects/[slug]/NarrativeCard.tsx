import React from 'react'
import type { SerializedHeadingNode, SerializedParagraphNode } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import type { CardSegment } from '@/utilities/groupRichTextByHeading'

function extractHeadingText(node: SerializedHeadingNode): string {
  return node.children
    .map((child) => {
      const c = child as Record<string, unknown>
      if (c['type'] === 'text') return (c['text'] as string) ?? ''
      // recurse into inline containers (links, etc.)
      if (Array.isArray(c['children'])) {
        return extractHeadingText({ children: c['children'] } as unknown as SerializedHeadingNode)
      }
      return ''
    })
    .join('')
}

function buildMiniState(nodes: SerializedParagraphNode[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      children: nodes as unknown as Record<string, unknown>[],
      direction: 'ltr' as const,
    },
  }
}

export function NarrativeCard({ heading, body }: CardSegment) {
  const headingText = extractHeadingText(heading)

  return (
    <article className="glass-card border border-border/40 bg-card/80 neon-glow-pink group transition-all duration-500 rounded-xl p-8 md:p-12">
      <h2 className="font-headline-md text-headline-md text-foreground flex items-center gap-3 mb-8">
        <span className="w-2 h-8 bg-neon-pink rounded-full shrink-0" aria-hidden="true" />
        {headingText}
      </h2>
      {body.length > 0 && (
        <RichText
          className="space-y-4 text-muted-foreground [&_p]:font-body-lg [&_p]:text-body-lg"
          data={buildMiniState(body) as Parameters<typeof RichText>[0]['data']}
          enableGutter={false}
          enableProse={false}
        />
      )}
    </article>
  )
}
