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
    defaultColumns: ['title'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}
