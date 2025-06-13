import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'flx-center': 'flex items-center justify-center',
    'flx-justify-between': 'flex items-center justify-between',
    'flx-align-center': 'flex items-center',
    'fixed-bottom': 'fixed bottom-0 left-0 right-0',
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
      autoInstall: false,
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
  content: {
    // pipeline: {
    //   include: [
    //     // default
    //     /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
    //     // extra
    //     'src/**/*.{vue,ts,tsx,jsx}',
    //   ],
    // },
    // filesystem: [
    //   'src/**/*.{vue,ts,tsx,jsx}',
    // ],
  },
})
