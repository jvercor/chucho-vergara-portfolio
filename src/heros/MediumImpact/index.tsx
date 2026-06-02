import React from 'react'

import type { Page } from '@/payload-types'
import type { DefaultNodeTypes, SerializedLinkNode } from '@payloadcms/richtext-lexical'
import {
  RichText as ConvertRichText,
  JSXConvertersFunction,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') throw new Error('Expected value to be an object')
  const slug = (value as { slug?: string }).slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const heroConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  heading: ({ node, nodesToJSX }) => {
    if (node.tag === 'h1') {
      return (
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground mb-6">
          {nodesToJSX({ nodes: node.children })}
        </h1>
      )
    }
    const Tag = node.tag as 'h2' | 'h3' | 'h4'
    return <Tag className="text-foreground">{nodesToJSX({ nodes: node.children })}</Tag>
  },
  paragraph: ({ node, nodesToJSX }) => (
    <p className="font-body-lg text-body-lg text-muted-foreground">
      {nodesToJSX({ nodes: node.children })}
    </p>
  ),
})

export const MediumImpactHero: React.FC<Page['hero']> = ({
  richText,
  downloadFile,
  downloadLabel,
}) => {
  const fileUrl =
    downloadFile && typeof downloadFile === 'object' ? downloadFile.url ?? null : null

  return (
    <div className="container flex flex-col md:flex-row justify-between items-end gap-12 mb-section-gap pt-16">
      <div className="max-w-3xl">
        {richText && (
          <ConvertRichText converters={heroConverters} data={richText} className="max-w-none" />
        )}
      </div>

      {fileUrl && (
        <a
          href={fileUrl}
          download
          className="shrink-0 inline-flex items-center gap-3 bg-primary text-on-primary font-label-caps text-label-caps px-8 py-4 rounded transition-all duration-300 hover:brightness-110"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            download
          </span>
          {downloadLabel ?? 'DOWNLOAD'}
        </a>
      )}
    </div>
  )
}
