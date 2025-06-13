# ReIcon

## 如何使用

```vue
<ReIcon icon="icon-name"  color="color" size="16px" />
```

## 说明

| 参数  | 说明     | 类型          | 默认值 |
| ----- | -------- | ------------- | ------ |
| icon  | 图标名称 | string        | -      |
| color | 颜色     | string        | -      |
| size  | 大小     | string,number | 16px   |

## 图标名称

1. 本地svg图标
   使用 `@/assets/svgs` 目录下的svg图标, 例如 `@/assets/svgs/icon-name.svg` 的图标名称为 `svg-icon:icon-name`
2. 在线iconify图标
   比如: 使用`iconify-logos:icon-name`的图标名称
3. 离线iconify图标
   比如: 安装`@iconify-json/mdi`后, 使用`i-logos:icon-name`的图标名称
