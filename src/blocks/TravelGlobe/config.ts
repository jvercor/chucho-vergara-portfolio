import type { Block } from 'payload'

import { HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { travelGlobeCountries } from './countries'

export const TravelGlobe: Block = {
  slug: 'travelGlobe',
  interfaceName: 'TravelGlobeBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      admin: {
        description: 'Short heading above the intro text (e.g. "Everywhere I\'ve Been").',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      label: 'Body',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Supporting text next to the globe.',
      },
    },
    {
      name: 'travels',
      type: 'array',
      label: 'Countries Visited',
      minRows: 1,
      admin: {
        description: 'Each entry places a photo card on the globe over the selected country.',
      },
      fields: [
        {
          name: 'country',
          type: 'select',
          required: true,
          label: 'Country',
          options: travelGlobeCountries.map(({ value, label }) => ({ value, label })),
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Photo',
        },
      ],
    },
  ],
  labels: {
    plural: 'Travel Globes',
    singular: 'Travel Globe',
  },
}
