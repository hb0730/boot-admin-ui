import path from 'node:path'
import { lookupCollection, lookupCollections } from '@iconify/json'
import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import pkg from '../package.json'

async function generateIcon() {
  // 拿到全部图标集的原始数据
  const raw = await lookupCollections()

  // 取出可使用的图标集数据用于 inquirer 选择，并按名称排序
  const collections = Object.entries(raw).map(([id, item]: [string, any]) => ({
    ...item,
    id,
  })).sort((a, b) => a.name.localeCompare(b.name))

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入您要图标名称',
        validate: (value) => {
          if (!value) {
            return '请输入图标名称'
          }
          return true
        },
      },
      {
        type: 'confirm',
        name: 'online',
        message: '是否使用在线图标集',
      },
    ])
    // ↓命令行问答的答案
    .then(async (answers) => {
      const { name, online } = answers
      // 切割图标名称
      const iconSet = name.split(' ')
      console.log(iconSet)
      const genCollections = collections.filter(item => iconSet.includes(item.id))
      const prefixSet: string[] = []

      for (const info of genCollections) {
        const setData = await lookupCollection(info.id)
        if (setData) {
          const { icons, prefix } = setData
          // ↓生成对应的图标数据
          let prefixName = ''
          if (online) {
            prefixName = `iconify-${prefix}`
          }
          else {
            prefixName = `i-${prefix}`
          }
          const data = Object.keys(icons).map(item => `${prefixName}:${item}`)
          await fs.writeFileSync(
            path.join(path.resolve(process.cwd(), 'src/components/IconPicker/src/data'), `icons.${prefix}.ts`),
            `export default ${JSON.stringify({ name: info.name, prefix: prefixName, data })}`,
          )
          // ↓分类处理完成，push类型名称
          prefixSet.push(prefix)
        }
      }
      console.log(
        `✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - Icon generated successfully:' + `[${prefixSet}]`,
      )
    })
}

generateIcon()
