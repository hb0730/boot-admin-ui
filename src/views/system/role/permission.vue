<script setup lang="ts">
import type { ElTreeV2 } from 'element-plus'
import { list } from '@/api/modules/system/permission'
import * as roleApi from '@/api/modules/system/role'
import { deepTree, getKeyList } from '@/utils'

const emit = defineEmits(['close', 'success'])

const modelValue = defineModel<any>({})

const menuTree = ref<any>([])

const treeLoading = ref(false)
const treeIds = ref<string[]>([])
const treeRef = ref<InstanceType<typeof ElTreeV2>>()
const treeProps = {
  children: 'children',
  label: 'title',
  value: 'id',
}
const isExpandAll = ref(false)
const isSelectAll = ref(false)
const isLinkage = ref(true)

const iconClass = computed(() => {
  return [
    'w-[22px]',
    'h-[22px]',
    'flex',
    'justify-center',
    'items-center',
    'outline-none',
    'rounded-[4px]',
    'cursor-pointer',
    'transition-colors',
    'hover:bg-[#0000000f]',
    'dark:hover:bg-[#ffffff1f]',
    'dark:hover:text-[#ffffffd9]',
  ]
})

async function onLoad() {
  const { success, data } = await list()
  if (success) {
    treeIds.value = getKeyList(data, 'id')
    menuTree.value = deepTree(data)
  }
}

async function onLoadMenuPerms() {
  treeLoading.value = true
  const { success, data } = await roleApi.getPerms(modelValue.value.id).finally(() => {
    treeLoading.value = false
  })
  if (success) {
    treeRef.value?.setCheckedKeys(data)
  }
}

function filterMethod(query: string, node: any) {
  return node.title.includes(query)
}

watch(isExpandAll, (val) => {
  val ? treeRef.value?.setExpandedKeys(treeIds.value) : treeRef.value?.setExpandedKeys([])
})

watch(isSelectAll, (val) => {
  val ? treeRef.value?.setCheckedKeys(treeIds.value) : treeRef.value?.setCheckedKeys([])
})

watch(modelValue, () => {
  onLoadMenuPerms()
})

function handleClose() {
  emit('close')
}

async function handleSave() {
  // 半选+已选择
  const ids = []
  const checkedKeys = treeRef.value?.getCheckedKeys() as string[]
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() as string[]
  ids.push(...checkedKeys)
  ids.push(...halfCheckedKeys)
  treeLoading.value = true
  const { success } = await roleApi.savePerms(modelValue.value.id, checkedKeys).finally(() => {
    treeLoading.value = false
  })
  if (success) {
    ElMessage.success('保存成功')
    emit('success')
  }
}

onMounted(() => {
  onLoad()
})
</script>

<template>
  <div class="w-full">
    <div class="w-full flex justify-between px-3 pb-4 pt-5">
      <div class="flex">
        <span :class="iconClass">
          <ReIcon
            v-tippy="{ content: '关闭' }"
            width="18px"
            height="18px" icon="i-ep:close"
            class="dark:text-white"
            @click="handleClose"
          />
        </span>
        <span class="ml-2" :class="[iconClass]">
          <ElPopconfirm
            title="确认保存吗？"
            @confirm="handleSave"
          >
            <template #reference>
              <ReIcon
                v-tippy="{ content: '保存菜单权限' }"
                width="18px"
                height="18px"
                icon="i-ep:check"
                class="dark:text-white"
              />
            </template>
          </ElPopconfirm>
        </span>
      </div>
      <p class="truncate font-bold">
        菜单权限
        {{ `${modelValue.roleName ? `（${modelValue.roleName}）` : ""}` }}
      </p>
    </div>
    <el-input
      placeholder="请输入菜单进行搜索"
      class="mb-1"
      clearable
    />
    <div class="flex flex-wrap">
      <el-checkbox v-model="isExpandAll" label="展开/折叠" />
      <el-checkbox v-model="isSelectAll" label="全选/全不选" />
      <!-- <el-checkbox v-model="isLinkage" label="父子联动" /> -->
    </div>

    <ElTreeV2
      ref="treeRef"
      show-checkbox
      :data="menuTree"
      :props="treeProps"
      :check-strictly="!isLinkage"
      :filter-method="filterMethod"
    >
      <template #default="{ node }">
        <span>{{ node.label }}</span>
      </template>
    </ElTreeV2>
  </div>
</template>

<style lang="scss" scoped>
</style>
