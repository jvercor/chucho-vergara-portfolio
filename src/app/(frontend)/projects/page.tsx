import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const projects = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 100,
    sort: '-launchDate',
    select: {
      title: true,
      slug: true,
      shortDescription: true,
      coverImage: true,
      launchDate: true,
      stack: true,
      clientLocation: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Projects</h1>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.docs.map((project) => (
            <a key={project.id} href={`/projects/${project.slug}`} className="block group">
              <article className="border border-border rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h2>
                  {project.shortDescription && (
                    <p className="text-on-surface-variant text-sm mb-4">{project.shortDescription}</p>
                  )}
                  {project.clientLocation && (
                    <p className="text-xs text-on-surface-variant">{project.clientLocation}</p>
                  )}
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Projects — Jesus Vergara',
  }
}
