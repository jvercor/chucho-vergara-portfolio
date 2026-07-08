import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Stack: CollectionConfig = {
  slug: 'stack',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'subtitle'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: false,
      admin: {
        description: 'Set the category so this item appears in the correct column of the Technical Stack section on the Resume page.',
      },
      options: [
        { label: 'Programming Language', value: 'programming-language' },
        { label: 'Framework & Library', value: 'framework' },
        { label: 'Infrastructure', value: 'infrastructure' },
        { label: 'Database', value: 'database' },
      ],
    },
    {
      name: 'subtitle',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional descriptor shown below the name (e.g. "Fullstack", "ML Systems"). Most relevant for Frameworks.',
        condition: (_, siblingData) => siblingData?.category === 'framework',
      },
    },
  ],
}
