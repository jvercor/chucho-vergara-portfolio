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
    {
      name: 'badge',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Availability label shown above the heading (e.g. "Available for new opportunities").',
      },
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Primary headline (e.g. "Jesus Vergara Cortes").',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Short subtitle below the heading (e.g. "Sr. Full-stack Engineer").',
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => ['highImpact', 'homeHero'].includes(type),
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
    {
      name: 'heroCode',
      type: 'code',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Code snippet displayed in the terminal window on the right panel.',
        language: 'rust',
      },
    },
    {
      name: 'heroCodeFilename',
      type: 'text',
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Filename shown in the terminal window header (e.g. "system_init.rs").',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Full-bleed background image for the right panel.',
      },
    },
    {
      name: 'foregroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        condition: (_, { type } = {}) => type === 'homeHero',
        description: 'Floating card image overlaid on the right panel background.',
      },
    },
  ],
  label: false,
}
