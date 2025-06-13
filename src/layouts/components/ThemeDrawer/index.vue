<script setup lang="ts">
import { isObject } from '@vueuse/core'
import { ElDrawer, ElTooltip } from 'element-plus'
import { DEFAULT_PRIMARY } from '@/config'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store'
import { LayoutMode } from '@/utils/enums'
import mittBus from '@/utils/mittBus'

// 打开主题设置
const drawerVisible = ref(false)
mittBus.on('openThemeDrawer', () => (drawerVisible.value = true))

const globalStore = useGlobalStore()
const {
  layout,
  primary,
  isGrey,
  isWeak,
  colorMode,
  asideInverted,
  headerInverted,
  isCollapse,
  isAccordion,
  watermark,
  breadcrumb,
  breadcrumbIcon,
  tabs,
  tabsIcon,
  footer,
} = storeToRefs(globalStore)

const colorModeOptions = [
  {
    label: '浅色',
    value: 'light',
    icon: 'svg-icon:sunny',
    tips: '切换为浅色模式',
  },
  {
    label: '深色',
    value: 'dark',
    icon: 'svg-icon:moon',
    tips: '切换为深色模式',
  },
  {
    label: '自动',
    value: 'auto',
    icon: 'svg-icon:sun-moon',
    tips: '根据系统自动切换',
  },
]

const { changePrimary, changeGreyOrWeak, setAsideTheme, setHeaderTheme } = useTheme()

// 设置布局方式
function setLayout(val: LayoutMode) {
  globalStore.setGlobalState('layout', val)
  setAsideTheme()
}

// 预定义主题颜色
const colorList = [
  DEFAULT_PRIMARY,
  '#daa96e',
  '#0c819f',
  '#409eff',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6',
]
</script>

<template>
  <ElDrawer v-model="drawerVisible" title="布局设置" size="290px">
    <!-- 布局样式 -->
    <ElDivider class="divider" content-position="center">
      布局样式
    </ElDivider>
    <div class="layout-box">
      <ElTooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div
          class="layout-item layout-vertical"
          :class="[{ 'is-active': layout === 'vertical' }]"
          @click="setLayout(LayoutMode.vertical)"
        >
          <div class="layout-dark" />
          <div class="layout-container">
            <div class="layout-light" />
            <div class="layout-content" />
          </div>
          <ReIcon v-if="layout === 'vertical'" icon="svg-icon:circle-check-filled" class="el-icon" />
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div
          class="layout-item layout-classic"
          :class="[{ 'is-active': layout === 'classic' }]"
          @click="setLayout(LayoutMode.classic)"
        >
          <div class="layout-dark" />
          <div class="layout-container">
            <div class="layout-light" />
            <div class="layout-content" />
          </div>
          <ReIcon v-if="layout === 'classic'" icon="svg-icon:circle-check-filled" class="el-icon" />
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div
          class="layout-item layout-transverse"
          :class="[{ 'is-active': layout === 'transverse' }]"
          @click="setLayout(LayoutMode.transverse)"
        >
          <div class="layout-dark" />
          <div class="layout-content" />
          <ReIcon v-if="layout === 'transverse'" icon="svg-icon:circle-check-filled" class="el-icon" />
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div
          class="layout-item layout-columns"
          :class="[{ 'is-active': layout === 'columns' }]"
          @click="setLayout(LayoutMode.columns)"
        >
          <div class="layout-dark" />
          <div class="layout-light" />
          <div class="layout-content" />
          <ReIcon v-if="layout === 'columns'" icon="svg-icon:circle-check-filled" class="el-icon" />
        </div>
      </ElTooltip>
    </div>
    <div class="theme-item">
      <span>
        侧边栏反转色
        <ElTooltip effect="dark" content="侧边栏颜色变为深色模式" placement="top">
          <ReIcon icon="svg-icon:question-filled" class="el-icon" />
        </ElTooltip>
      </span>
      <ElSwitch v-model="asideInverted" @change="setAsideTheme" />
    </div>
    <div class="theme-item mb50">
      <span>
        头部反转色
        <ElTooltip effect="dark" content="头部颜色变为深色模式" placement="top">
          <ReIcon icon="svg-icon:question-filled" class="el-icon" />
        </ElTooltip>
      </span>
      <ElSwitch v-model="headerInverted" @change="setHeaderTheme" />
    </div>
    <!-- 全局主题 -->
    <ElDivider class="divider" content-position="center">
      全局主题
    </ElDivider>
    <div class="theme-item">
      <span>主题颜色</span>
      <ElColorPicker v-model="primary" :predefine="colorList" @change="changePrimary" />
    </div>
    <div class="theme-item">
      <span>暗黑模式</span>
      <ElSegmented v-model="colorMode" :options="colorModeOptions">
        <template #default="{ item }">
          <ElTooltip :content="isObject(item) ? item.tips : item" placement="top">
            <ReIcon :icon="isObject(item) ? item.icon : item" class="el-icon" />
          </ElTooltip>
        </template>
      </ElSegmented>
    </div>
    <div class="theme-item">
      <span>灰色模式</span>
      <ElSwitch v-model="isGrey" @change="changeGreyOrWeak('grey', !!$event)" />
    </div>

    <div class="theme-item mb40">
      <span>色弱模式</span>
      <ElSwitch v-model="isWeak" @change="changeGreyOrWeak('weak', !!$event)" />
    </div>

    <!-- 界面设置 -->
    <ElDivider class="divider" content-position="center">
      界面设置
    </ElDivider>

    <div class="theme-item">
      <span>菜单折叠</span>
      <ElSwitch v-model="isCollapse" />
    </div>

    <div class="theme-item">
      <span>菜单手风琴</span>
      <ElSwitch v-model="isAccordion" />
    </div>

    <div class="theme-item">
      <span>水印</span>
      <ElSwitch v-model="watermark" />
    </div>

    <div class="theme-item">
      <span>面包屑</span>
      <ElSwitch v-model="breadcrumb" />
    </div>

    <div class="theme-item">
      <span>面包屑图标</span>
      <ElSwitch v-model="breadcrumbIcon" />
    </div>

    <div class="theme-item">
      <span>标签栏</span>
      <ElSwitch v-model="tabs" />
    </div>

    <div class="theme-item">
      <span>标签栏图标</span>
      <ElSwitch v-model="tabsIcon" />
    </div>

    <div class="theme-item">
      <span>页脚</span>
      <ElSwitch v-model="footer" />
    </div>
  </ElDrawer>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
