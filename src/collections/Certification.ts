import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Certification: CollectionConfig = {
  slug: 'certifications',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'institution'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "AWS Certified Solutions Architect"',
      },
    },
    {
      name: 'institution',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Amazon Web Services"',
      },
    },
    {
      name: 'note',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional descriptor shown below the institution (e.g. "Professional Level").',
      },
    },
  ],
}
