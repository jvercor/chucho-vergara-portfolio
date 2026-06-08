import type { Block } from 'payload'

export const LogoWall: Block = {
  slug: 'logoWall',
  interfaceName: 'LogoWallBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      admin: {
        description: 'Section heading displayed above the logos (e.g. "My Current Stack").',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
        description: 'Optional sentence below the eyebrow.',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 1,
      admin: {
        description: 'Each logo is a gray SVG that turns white (dark theme) or black (light theme) on hover.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Name',
          admin: {
            description: 'Used as the accessible label (e.g. "Next.js").',
          },
        },
        {
          name: 'svg',
          type: 'textarea',
          required: true,
          label: 'SVG Code',
          admin: {
            description:
              'Paste raw SVG markup with gray fills. IMPORTANT: use inline fill/stroke attributes — not CSS classes from <style>/<defs>. Class names like .fil0 are global and will collide when multiple logos render on the same page, making some logos invisible. Also remove the <?xml ...?> prolog, width/height attributes, and any <defs> block.',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Logo Walls',
    singular: 'Logo Wall',
  },
}
