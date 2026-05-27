/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        'neon-pink': 'var(--neon-pink)',
        'blue-violet': 'var(--blue-violet)',
        'dark-violet': 'var(--dark-violet)',
        'russian-violet': 'var(--russian-violet)',
        'surface-black': 'var(--surface-black)',
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
