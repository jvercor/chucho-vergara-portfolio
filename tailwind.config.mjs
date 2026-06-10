/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        // Original CSS-var based tokens
        'neon-pink': 'var(--neon-pink)',
        'blue-violet': 'var(--blue-violet)',
        'dark-violet': 'var(--dark-violet)',
        'russian-violet': 'var(--russian-violet)',
        'surface-black': 'var(--surface-black)',
        // Full DESIGN.md palette (static — dark-theme design system)
        'on-surface': '#e2e2e2',
        'on-surface-variant': '#dcbed3',
        'on-primary': '#5c005a',
        'on-background': '#e2e2e2',
        'outline-variant': '#564051',
        'outline': '#a4899d',
        'surface': '#131313',
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-variant': '#353535',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1b1b1b',
        'surface-container': '#1f1f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        'surface-tint': '#ffabf1',
        'primary-fixed': '#ffd7f4',
        'primary-fixed-dim': '#ffabf1',
        'on-primary-fixed': '#380037',
        'on-primary-fixed-variant': '#81007f',
        'primary-container': '#ff01fb',
        'on-primary-container': '#51004f',
        'inverse-primary': '#a900a7',
        'secondary': '#dcb8ff',
        'on-secondary': '#480081',
        'secondary-container': '#7701d0',
        'on-secondary-container': '#dcb7ff',
        'tertiary': '#dab9ff',
        'on-tertiary': '#470084',
        'tertiary-container': '#ae76f0',
        'on-tertiary-container': '#3e0075',
        'inverse-surface': '#e2e2e2',
        'inverse-on-surface': '#303030',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        'headline-lg': ['var(--font-geist-sans)', 'sans-serif'],
        'headline-lg-mobile': ['var(--font-geist-sans)', 'sans-serif'],
        'headline-xl': ['var(--font-geist-sans)', 'sans-serif'],
        'headline-md': ['var(--font-geist-sans)', 'sans-serif'],
        'headline-sm': ['var(--font-geist-sans)', 'sans-serif'],
        'body-lg': ['var(--font-inter)', 'sans-serif'],
        'body-md': ['var(--font-inter)', 'sans-serif'],
        'body-sm': ['var(--font-inter)', 'sans-serif'],
        'label-caps': ['var(--font-inter)', 'sans-serif'],
        'mono-code': ['var(--font-geist-mono)', 'monospace'],
        'mono-ascii': ['var(--font-geist-mono)', 'monospace'],
      },
      fontSize: {
        'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '800' }],
        'headline-xl': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-md': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '800' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '800' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.08em', fontWeight: '700' }],
        'mono-code': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'mono-ascii': ['5px', { lineHeight: '6px', fontWeight: '400' }],
      },
      spacing: {
        'gutter': '16px',
        'section-gap': '120px',
        'margin-mobile': '16px',
        'margin-desktop': '32px',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
