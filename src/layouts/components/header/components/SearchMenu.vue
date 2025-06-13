<script setup lang="ts">
import type { InputInstance } from 'element-plus'
import Search from '@/assets/svgs/search.svg?component'
import { useAuthStore } from '@/store'

const router = useRouter()
const authStore = useAuthStore()

const menuList = computed(() => authStore.flatMenuListGet().filter(item => !item.meta.isHide))
const activePath = ref('')
function mouseoverMenuItem(menu: Menu.MenuOptions) {
  activePath.value = menu.path
}

const menuInputRef = ref<InputInstance | null>(null)
const isShowSearch = ref<boolean>(false)
const searchMenu = ref<string>('')

watch(isShowSearch, (val) => {
  if (val) {
    document.addEventListener('keydown', keyboardOperation)
  }
  else {
    document.removeEventListener('keydown', keyboardOperation)
  }
})

function handleOpen() {
  isShowSearch.value = true
  nextTick(() => {
    setTimeout(() => {
      menuInputRef.value?.focus()
    })
  })
}

const searchList = ref<Menu.MenuOptions[]>([])
function updateSearchList() {
  searchList.value = searchMenu.value
    ? menuList.value.filter(
      item =>
        (item.path.toLowerCase().includes(searchMenu.value.toLowerCase())
          || item.meta.title.toLowerCase().includes(searchMenu.value.toLowerCase()))
          && !item.meta?.isHide,
    )
    : []
  activePath.value = searchList.value.length ? searchList.value[0].path : ''
}

const debouncedUpdateSearchList = useDebounceFn(updateSearchList, 300)

watch(searchMenu, debouncedUpdateSearchList)

const menuListRef = ref<Element | null>(null)
function keyPressUpOrDown(direction: number) {
  const length = searchList.value.length
  if (length === 0)
    return
  const index = searchList.value.findIndex(item => item.path === activePath.value)
  const newIndex = (index + direction + length) % length
  activePath.value = searchList.value[newIndex].path
  nextTick(() => {
    if (!menuListRef.value?.firstElementChild)
      return
    const menuItemHeight = menuListRef.value.firstElementChild.clientHeight + 12 || 0
    menuListRef.value.scrollTop = newIndex * menuItemHeight
  })
}

function keyboardOperation(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    keyPressUpOrDown(-1)
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    keyPressUpOrDown(1)
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    handleClickMenu()
  }
}

function handleClickMenu() {
  const menu = searchList.value.find(item => item.path === activePath.value)
  if (!menu)
    return
  if (menu.meta?.isLink)
    window.open(menu.meta.isLink, '_blank')
  else router.push(menu.path)
  searchMenu.value = ''
  isShowSearch.value = false
}
</script>

<template>
  <div class="search-menu">
    <ReIcon icon="svg-icon:search" class="toolBar-icon" size="16" @click="handleOpen" />
    <ElDialog v-model="isShowSearch" class="search-dialog" :width="600" :show-close="false" top="10vh">
      <el-input
        ref="menuInputRef"
        v-model="searchMenu"
        placeholder="菜单搜索：支持菜单名称、路径"
        size="large"
        clearable
        :prefix-icon="Search"
      />
      <div v-if="searchList.length" ref="menuListRef" class="menu-list">
        <div
          v-for="item in searchList"
          :key="item.path"
          class="menu-item" :class="[{ 'menu-active': item.path === activePath }]"
          @mouseenter="mouseoverMenuItem(item)"
          @click="handleClickMenu()"
        >
          <div class="menu-lf">
            <ReIcon :icon="item.meta.icon" class="menu-icon" />
            <span class="menu-title">{{ item.meta.title }}</span>
          </div>
          <ReIcon icon="svg-icon:enter-outlined" class="menu-enter" @click="handleClickMenu" />
        </div>
      </div>
      <ElEmpty v-else class="mb20 mt20" :image-size="100" description="暂无菜单" />
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.search-menu {
  :deep(.el-dialog) {
    border-radius: 4px;
    .el-dialog__header {
      display: none;
    }
  }
  .menu-list {
    max-height: 515px;
    margin-top: 15px;
    overflow: auto;
    .menu-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      padding: 0 20px;
      margin: 10px 0;
      color: var(--el-text-color-secondary);
      cursor: pointer;
      background-color: transparent;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      transition: all 0.2s ease;
      .menu-lf {
        display: flex;
        align-items: center;
      }
      .menu-icon {
        margin-right: 8px;
        font-size: 16px;
      }
      .menu-title {
        font-size: 14px;
      }
      .menu-enter {
        font-size: 17px;
      }
    }
    .menu-active {
      color: #ffffff;
      background-color: var(--el-color-primary);
      .menu-icon {
        font-size: 18px;
      }
      .menu-title {
        font-size: 16px;
      }
      .menu-enter {
        font-size: 19px;
      }
    }
  }
}
</style>
