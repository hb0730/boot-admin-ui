import path from 'node:path'
import fs from 'fs-extra'
import inquirer from 'inquirer'

async function generateIcon() {
  // 获取 src/assets/svgs下的所有svg文件名称
  const svgFiles = await fs.readdir(path.resolve(process.cwd(), 'src/assets/svgs'))
  // 过滤出svg文件
  const svgIcons = svgFiles.filter(item => item.endsWith('.svg'))

  inquirer.prompt([
    {
      name: 'isGenerate',
      type: 'confirm',
      message: '是否将本地svg图标转换为icons.ts文件',
      default: true,
    },
  ]).then(async (answers) => {
    const { isGenerate } = answers
    if (!isGenerate) {
      return
    }
    let icons = svgIcons.map(item => item.replace('.svg', ''))
    icons = icons.map((item) => {
      return `svg-icon:${item}`
    })
    await fs.writeFileSync(
      path.resolve(process.cwd(), 'src/components/IconPicker/src/data/', `icons.svg.ts`),
      `export default ${JSON.stringify({ name: 'Local Svg', prefix: 'svg-icon', data: icons })}`,
    )
  })

  console.log(
    `✨ Icon generated successfully with ${svgIcons.length} svg icons`,
  )
}

generateIcon()
