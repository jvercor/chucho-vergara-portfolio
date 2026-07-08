import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'

export const Education: CollectionConfig = {
  slug: 'education',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'institution', 'yearFrom'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Degree / Program',
      required: true,
      admin: {
        description: 'e.g. "M.S. Computer Science" or "B.S. Software Engineering"',
      },
    },
    {
      name: 'institution',
      type: 'text',
      required: true,
    },
    {
      name: 'yearFrom',
      type: 'number',
      label: 'Start Year',
      required: true,
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      label: 'Currently Enrolled',
      defaultValue: false,
    },
    {
      name: 'yearTo',
      type: 'number',
      label: 'End Year',
      required: false,
      admin: {
        description: 'Leave empty if currently enrolled.',
        condition: (_, siblingData) => !siblingData?.isCurrent,
      },
    },
  ],
}
