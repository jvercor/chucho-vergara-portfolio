import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Language: CollectionConfig = {
  slug: 'languages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'level'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Language',
      required: true,
      admin: {
        description: 'e.g. "English", "Spanish"',
      },
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Native', value: 'native' },
        { label: 'Fluent', value: 'fluent' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Basic', value: 'basic' },
      ],
    },
  ],
}
