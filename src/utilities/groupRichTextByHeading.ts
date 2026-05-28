import type {
  SerializedHeadingNode,
  SerializedParagraphNode,
} from '@payloadcms/richtext-lexical'

export type CardSegment = {
  type: 'card'
  heading: SerializedHeadingNode
  body: SerializedParagraphNode[]
}

export type PassthroughSegment = {
  type: 'passthrough'
  nodes: Record<string, unknown>[]
}

export type Segment = CardSegment | PassthroughSegment

type RichTextData = {
  root: {
    children: Record<string, unknown>[]
  }
}

/**
 * Splits a Lexical rich-text tree into segments for the Project detail page.
 *
 * Rules:
 *  - An h2 heading opens a new CardSegment. Paragraphs that immediately follow
 *    accumulate into its body until the next h2 or a non-paragraph node.
 *  - Everything else (blocks, h1/h3/h4, horizontal rules, leading paragraphs)
 *    goes into a PassthroughSegment.
 *  - Consecutive passthrough nodes are merged into a single PassthroughSegment.
 */
export function groupRichTextByHeading(data: RichTextData | null | undefined): Segment[] {
  const nodes = data?.root?.children ?? []
  const segments: Segment[] = []

  let currentCard: CardSegment | null = null
  let currentPassthrough: PassthroughSegment | null = null

  const flushCard = () => {
    if (currentCard) {
      segments.push(currentCard)
      currentCard = null
    }
  }

  const flushPassthrough = () => {
    if (currentPassthrough) {
      segments.push(currentPassthrough)
      currentPassthrough = null
    }
  }

  const addToPassthrough = (node: Record<string, unknown>) => {
    flushCard()
    if (!currentPassthrough) {
      currentPassthrough = { type: 'passthrough', nodes: [] }
    }
    currentPassthrough.nodes.push(node)
  }

  for (const node of nodes) {
    const n = node as Record<string, unknown>

    if (n['type'] === 'heading' && n['tag'] === 'h2') {
      flushCard()
      flushPassthrough()
      currentCard = { type: 'card', heading: n as unknown as SerializedHeadingNode, body: [] }
    } else if (n['type'] === 'paragraph' && currentCard) {
      currentCard.body.push(n as unknown as SerializedParagraphNode)
    } else {
      addToPassthrough(n)
    }
  }

  flushCard()
  flushPassthrough()

  return segments
}
