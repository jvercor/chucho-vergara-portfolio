import type { CollectionConfig } from 'payload'

import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'

export const Experience: CollectionConfig = {
  slug: 'experience',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['company', 'role', 'startYear'],
    useAsTitle: 'company',
  },
  defaultSort: '-startYear',
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'companyUrl',
      type: 'text',
      label: 'Company URL',
      required: false,
      admin: {
        description: 'Optional link to the company website.',
      },
    },
    {
      name: 'role',
      type: 'text',
      label: 'Job Title / Role',
      required: true,
    },
    {
      name: 'startYear',
      type: 'number',
      label: 'Start Year',
      required: true,
    },
    {
      name: 'isCurrent',
      type: 'checkbox',
      label: 'Current Job',
      defaultValue: false,
    },
    {
      name: 'endYear',
      type: 'number',
      label: 'End Year',
      required: false,
      admin: {
        description: 'Leave empty if this is your current position.',
        condition: (_, siblingData) => !siblingData?.isCurrent,
      },
    },
    {
      name: 'bullets',
      type: 'array',
      label: 'Bullet Points',
      fields: [
        {
          name: 'content',
          type: 'richText',
          label: false,
          editor: lexicalEditor({
            features: [
              BoldFeature(),
              ItalicFeature(),
              UnderlineFeature(),
              LinkFeature({}),
            ],
          }),
        },
      ],
    },
    {
      name: 'stack',
      type: 'relationship',
      relationTo: 'stack',
      hasMany: true,
      label: 'Tech Stack Used',
      admin: {
        description: 'Programming Languages, Frameworks, Infrastructure, and Databases used in this role.',
      },
    },
  ],
}
