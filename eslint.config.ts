import antfu from '@antfu/eslint-config'

export default antfu({
  // 忽略验证的文件夹
  ignores: [
    'node_modules',
    'dist',
    '.github',
  ],
  vue: true,
  typescript: true,
  unocss: true,
  formatters: true,
  stylistic: true,
  rules: {
    // 允许使用 process.env
    'node/prefer-global/process': 'off',
    // 允许 console.log
    'no-console': 'off',
    // 允许使用未定义变量
    'no-undef': 'off',
    // 命名空间
    'ts/no-namespace': 'off',
  },
  languageOptions: {
    globals: {
      h: 'readonly',
      unref: 'readonly',
      provide: 'readonly',
      inject: 'readonly',
      markRaw: 'readonly',
      defineAsyncComponent: 'readonly',
      nextTick: 'readonly',
      useRoute: 'readonly',
      useRouter: 'readonly',
      Message: 'readonly',
    },
  },
})
