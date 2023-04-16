/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const typography = require('@tailwindcss/typography')
const defaultTheme = require('tailwindcss/defaultTheme')

const getCssVarName = name => `--fxui-${name}`

const cssVar = name => `var(${name})`

const getVarsForColors = (
  name,
  variants = ['lightest', 'lighter', 'default', 'darker', 'darkest'],
) => {
  const prefix = getCssVarName(`color-${name}-`)
  const values = variants.map(variant => cssVar(`${prefix}${variant}`))

  const result = Object.fromEntries(
    variants.map((variant, i) => [variant, values[i]]),
  )

  if (result.default) {
    return {
      ...result,
      DEFAULT: result.default,
    }
  }

  return result
}

const contentFiles = ['src/**/*.{vue,ts,js}']

if (process.env.TAILWIND_STORIES) {
  console.log('[tailwind] Purging stories files')
  contentFiles.push('stories/**/*.{vue,ts,js}')
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: contentFiles,
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'media-hover': {
          raw: '(hover: hover)',
        },
      },
      colors: {
        primary: getVarsForColors('primary'),
        secondary: getVarsForColors('secondary'),
        error: getVarsForColors('error'),
        success: getVarsForColors('success'),
        surface: getVarsForColors(
          'surface',
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        ),
        prose: getVarsForColors(
          'prose',
          [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        ),
        white: cssVar(getCssVarName('color-white')),
        black: cssVar(getCssVarName('color-black')),
        background: cssVar(getCssVarName('color-background')),
        'opaque-background': cssVar(getCssVarName('color-opaque-background')),
      },
      animation: {
        shake: 'shake .3s linear',
      },
      keyframes: {
        shake: {
          '0%': {
            transform: 'translateX(0px)',
          },
          '10%': {
            transform: 'translateX(4px)',
          },
          '30%': {
            transform: 'translateX(-4px)',
          },
          '50%': {
            transform: 'translateX(2px)',
          },
          '70%': {
            transform: 'translateX(-2px)',
          },
          '90%': {
            transform: 'translateX(1px)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      },
    },

    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      primary: [...defaultTheme.fontFamily.sans],
      headings: [...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [typography()],
}
