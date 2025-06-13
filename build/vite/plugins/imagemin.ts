import viteImagemin from 'vite-plugin-imagemin'

// 图片压缩
// https://github.com/anncwb/vite-plugin-imagemin
export function configImageminPlugin() {
  return viteImagemin({
    verbose: false,
    // https://github.com/imagemin/imagemin-gifsicle
    gifsicle: {
      optimizationLevel: 3,
    },
    // https://github.com/imagemin/imagemin-optipng
    optipng: {
      optimizationLevel: 7,
    },
    // https://github.com/imagemin/imagemin-mozjpeg
    mozjpeg: {
      quality: 30,
    },
    // https://github.com/imagemin/imagemin-pngquant
    pngquant: {
      quality: [0.8, 0.9],
    },
    // https://github.com/svg/svgo/#what-it-can-do
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  })
}
