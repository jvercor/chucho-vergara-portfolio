import type { Block } from 'payload'

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  interfaceName: 'FeaturedProjectsBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'projectOne',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      label: 'Project (Large)',
    },
    {
      name: 'projectTwo',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      label: 'Project (Small)',
    },
  ],
  labels: {
    plural: 'Featured Projects',
    singular: 'Featured Projects',
  },
}
