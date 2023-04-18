/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */
const typography = require('@tailwindcss/typography')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

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

const contentFiles = ['index.html', 'src/**/*.{vue,ts,js}']

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

      lsm: { max: '639px' },
      lmd: { max: '767px' },
      llg: { max: '1023px' },
      lxl: { max: '1279px' },
      l2xl: { max: '1535px' },
    },
    fontFamily: {
      primary: [...defaultTheme.fontFamily.sans],
      headings: [...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [
    typography(),
    plugin(
      ({ addUtilities, addComponents, e, config, theme, matchUtilities }) => {
        const addSafeAreaInset = (side, value) =>
          `calc(${value} + env(safe-area-inset-${side}))`

        matchUtilities(
          {
            pts: value => ({
              paddingTop: addSafeAreaInset('top', value),
            }),
            prs: value => ({
              paddingRight: addSafeAreaInset('right', value),
            }),
            pbs: value => ({
              paddingBottom: addSafeAreaInset('bottom', value),
            }),
            pls: value => ({
              paddingLeft: addSafeAreaInset('left', value),
            }),
            pxs: value => ({
              paddingLeft: addSafeAreaInset('left', value),
              paddingRight: addSafeAreaInset('right', value),
            }),
            pys: value => ({
              paddingTop: addSafeAreaInset('top', value),
              paddingBottom: addSafeAreaInset('bottom', value),
            }),
            ps: value => ({
              paddingTop: addSafeAreaInset('top', value),
              paddingBottom: addSafeAreaInset('bottom', value),
              paddingLeft: addSafeAreaInset('left', value),
              paddingRight: addSafeAreaInset('right', value),
            }),
            mts: value => ({
              marginTop: addSafeAreaInset('top', value),
            }),
            mrs: value => ({
              marginRight: addSafeAreaInset('right', value),
            }),
            mbs: value => ({
              marginBottom: addSafeAreaInset('bottom', value),
            }),
            mls: value => ({
              marginLeft: addSafeAreaInset('left', value),
            }),
            mxs: value => ({
              marginLeft: addSafeAreaInset('left', value),
              marginRight: addSafeAreaInset('right', value),
            }),
            mys: value => ({
              marginTop: addSafeAreaInset('top', value),
              marginBottom: addSafeAreaInset('bottom', value),
            }),
            ms: value => ({
              marginTop: addSafeAreaInset('top', value),
              marginBottom: addSafeAreaInset('bottom', value),
              marginLeft: addSafeAreaInset('left', value),
              marginRight: addSafeAreaInset('right', value),
            }),
            tops: value => ({
              top: addSafeAreaInset('top', value),
            }),
            rights: value => ({
              right: addSafeAreaInset('right', value),
            }),
            bottoms: value => ({
              bottom: addSafeAreaInset('bottom', value),
            }),
            lefts: value => ({
              left: addSafeAreaInset('left', value),
            }),
            translatexs: value => ({
              transform: `translateX(${addSafeAreaInset('left', value)})`,
            }),
            translateys: value => ({
              transform: `translateY(${addSafeAreaInset('top', value)})`,
            }),
          },
          {
            values: theme('inset'),
          },
        )
      },
    ),
  ],
}
