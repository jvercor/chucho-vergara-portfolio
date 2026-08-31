import type { CollectionConfig } from 'payload'

import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnderlineFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../access/authenticated'

export const JourneyPhases: CollectionConfig = {
  slug: 'journey-phases',
  labels: {
    singular: 'Journey Phase',
    plural: 'Journey Phases',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'location', 'startYear', 'endYear'],
    useAsTitle: 'title',
  },
  defaultSort: 'startYear',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Phase Title',
      required: true,
      admin: {
        description: 'The name of this chapter of your life, e.g. "The Discovery".',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Where this phase took place, e.g. "France • Israel".',
      },
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
      label: 'Current Phase',
      defaultValue: false,
    },
    {
      name: 'endYear',
      type: 'number',
      label: 'End Year',
      required: false,
      admin: {
        description:
          'Leave empty if this is your current phase. Set equal to Start Year for a single-year phase.',
        condition: (_, siblingData) => !siblingData?.isCurrent,
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          LinkFeature({}),
        ],
      }),
    },
    {
      name: 'stack',
      type: 'relationship',
      relationTo: 'stack',
      hasMany: true,
      label: 'Technologies Learned',
      admin: {
        description: 'Programming Languages, Frameworks, Infrastructure, and Databases picked up during this phase.',
      },
    },
  ],
}
