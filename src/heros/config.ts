import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Home Hero',
          value: 'homeHero',
        },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => type === 'highImpact',
        },
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'downloadFile',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, { type } = {}) => type === 'mediumImpact',
        description: 'Optional file (e.g. PDF résumé) — renders a download button when set.',
      },
    },
    {
      name: 'downloadLabel',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'mediumImpact',
        description: 'Label shown on the download button (e.g. "DOWNLOAD PDF").',
      },
    },
  ],
  label: false,
}
