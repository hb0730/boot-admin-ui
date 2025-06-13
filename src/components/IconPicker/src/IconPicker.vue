<script setup lang="ts">
import epIcons from './data/icons.ep'
import logosIcons from './data/icons.logos'
import riIcons from './data/icons.ri'
import svgIcons from './data/icons.svg'
import tablerIcons from './data/icons.tabler'

const modelValue = defineModel<string>()

const icons = [epIcons, riIcons, svgIcons, logosIcons, tablerIcons]
const iconName = ref(icons[0].prefix)
const search = ref('')
const pageSize = ref(40)
const currentPage = ref(1)
const currentIconNameIndex = computed(() => {
  return icons.findIndex(item => item.prefix === unref(iconName))
})

function popoverShow() {
  init(unref(modelValue))
}

async function init(icon?: string) {
  if (!icon)
    return
  // icon 是否满足前缀:名称的格式 [svg-icon,iconify-,i-,iconfont-]
  const [prefix, name] = icon.split(':')
  if (!prefix || !name)
    return
  // 查询当前icon的前缀
  const wrapIndex = icons.findIndex(item => item.prefix === prefix)
  if (wrapIndex === -1)
    return
  // 切换当前icon的前缀
  iconName.value = prefix
  // 查询当前icon的索引
  const index = filterItemIcons(icons[wrapIndex].data).findIndex(item => item === icon)
  // 计算当前icon的页码
  await nextTick()
  currentPage.value = Math.ceil((index + 1) / unref(pageSize))
}

function filterItemIcons(icons: string[]) {
  return icons.filter(item => item.includes(unref(search)))
}

function inputClear() {
  init(unref(modelValue))
}

function tabChange() {
  currentPage.value = 1
}

function filterIcons(icons: string[]) {
  const start = (unref(currentPage) - 1) * unref(pageSize)
  const end = unref(currentPage) * unref(pageSize)
  return icons.slice(start, end)
}
function iconSelect(icon: string) {
  // 如果是同一个icon则不做处理，则相当于点击了清空按钮
  if (icon === unref(modelValue)) {
    modelValue.value = ''
    return
  }
  modelValue.value = icon
}

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div class="box flex items-center justify-center">
    <ElInput v-model="modelValue" disabled clearable>
      <template #append>
        <ElPopover
          placement="bottom"
          trigger="click"
          :width="350"
          :popper-options="{
            placement: 'auto',
          }"
          :popper-style="{
            padding: '0',
          }"
          @show="popoverShow"
        >
          <template #reference>
            <div
              class="h-[32px] w-[40px] flex cursor-pointer items-center justify-center"
            >
              <ReIcon v-if="modelValue" :icon="modelValue" />
              <ReIcon v-else icon="svg-icon:search-eye-line" />
            </div>
          </template>
          <ElInput
            v-model="search"
            class="px-2 pt-2"
            placeholder="搜索图标"
            clearable
            @clear="inputClear"
          />
          <ElTabs v-model="iconName" tab-position="top" @tab-change="tabChange">
            <ElTabPane v-for="item in icons" :key="item.name" :label="item.name" :name="item.prefix">
              <ElScrollbar height="190px">
                <ul class="ml-2 flex flex-wrap px-2">
                  <li
                    v-for="icon in filterIcons(filterItemIcons(item.data))"
                    :key="icon"
                    class="icon-item mr-2 mt-1 flex cursor-pointer items-center justify-center border border-[#e5e7eb] p-2 hover:border-color-[var(--el-color-primary)]!"
                    :style="{
                      border: `1px solid ${
                        icon === modelValue ? 'var(--el-color-primary)' : 'var(--el-border-color)'
                      }`,
                    }"
                    @click="iconSelect(icon)"
                  >
                    <ReIcon :icon="icon" />
                  </li>
                </ul>
              </ElScrollbar>
            </ElTabPane>
          </ElTabs>
          <div
            class="h-9 w-full flex items-center overflow-auto border-t border-[#e5e7eb]"
          >
            <ElPagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              class="ml-2 flex-auto"
              :pager-count="5"

              background
              size="small"
              layout="pager"
              :total="filterItemIcons(icons[currentIconNameIndex].data).length"
            />
            <el-button
              class="ml-2 mr-2 justify-end"
              type="danger"
              size="small"
              text
              bg
              @click="clear"
            >
              清空
            </el-button>
          </div>
        </ElPopover>
      </template>
    </ElInput>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px #ccc;
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px #ccc;
}

:deep(.el-input-group__append) {
  padding: 0;
}
:deep(.el-tabs__item) {
  height: 30px;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
  position: static;
  margin: 0;
  box-shadow: 0 2px 5px rgb(0 0 0 / 6%);
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}

:deep(.el-tabs__content) {
  margin-top: 4px;
}
</style>
