<script setup lang="ts">
import type { Auth } from '@/api/modules/auth/types'
import type { PlusColumn } from 'plus-pro-components'
import { getSubscribeMsg, updateSubscribeMsg } from '@/api/modules/auth'

const columns: PlusColumn[] = [
  {
    label: '通知类型',
    prop: 'name',
  },
  {
    label: '站内消息',
    prop: 'isSite',
    valueType: 'checkbox',
    editable: true,
  },
  {
    label: '邮件',
    prop: 'isEmail',
    valueType: 'checkbox',
    editable: true,
  },
  {
    label: '短信',
    prop: 'isSms',
    valueType: 'checkbox',
    editable: true,
  },
]

const tableData = ref<Auth.ResSubscribeMsg[]>([])
const isSite = ref(false)
const isEmail = ref(false)
const isSms = ref(false)
const loading = ref(false)

async function handleChange(type: 'SITE' | 'EMAIL' | 'SMS') {
  const drone = () => {
    if (type === 'SITE') {
      isSite.value = !isSite.value
    }
    else if (type === 'EMAIL') {
      isEmail.value = !isEmail.value
    }
    else {
      isSms.value = !isSms.value
    }
  }

  loading.value = true
  const msg = type === 'SITE' ? '站内消息' : type === 'EMAIL' ? '邮件' : '短信'
  ElMessageBox.confirm(`是否开启全部${msg}通知`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 发送请求
    const { success } = await updateSubscribeMsg({
      value: true,
      type,
    }).finally(() => {
      loading.value = false
    })
    if (success) {
      loadData()
      drone()
    }
  }).catch(() => {
    drone()
    loading.value = false
  })
}

async function handleModuleChange(scoped: any, type: 'SITE' | 'EMAIL' | 'SMS') {
  const { isRoot } = scoped.row
  if (isRoot) {
    const msg = type === 'SITE' ? '站内消息' : type === 'EMAIL' ? '邮件' : '短信'
    const key = type === 'SITE' ? 'isSite' : type === 'EMAIL' ? 'isEmail' : 'isSms'
    const value = scoped.row[key]
    const title = value ? `是否批量开启${msg}通知` : `是否批量关闭${msg}通知`
    const done = () => {
      scoped.row[key] = !value
    }

    loading.value = true
    ElMessageBox.confirm(title, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
    // 发送请求
      const { success } = await updateSubscribeMsg({
        value,
        type,
        name: scoped.row.name,
      }).finally(() => {
        loading.value = false
      })
      if (success) {
        loadData()
        done()
      }
    }).catch(() => {
      done()
      loading.value = false
    })
  }
  else {
    const key = type === 'SITE' ? 'isSite' : type === 'EMAIL' ? 'isEmail' : 'isSms'
    const value = scoped.row[key]
    const done = () => {
      scoped.row[key] = !value
    }
    // 发送请求
    loading.value = true
    const { success } = await updateSubscribeMsg({
      value,
      type,
      id: scoped.row.id,
    }).finally(() => {
      loading.value = false
    })
    if (success) {
      loadData()
      done()
    }
  }
}
async function loadData() {
  const { success, data } = await getSubscribeMsg()
  if (success) {
    data.forEach((item: any, index) => {
      item.id = index
    })
    tableData.value = data
  }
}
onMounted(() => {
  loadData()
})
</script>

<template>
  <LayInfo title="消息接收管理">
    <PlusTable
      :columns="columns" :data="tableData"
      :loading-status="loading"
    >
      <template #plus-header-isSite="scoped">
        <div class="flex items-center">
          <ElCheckbox v-model="isSite" @change="handleChange('SITE')" />
          <span class="ml-4">{{ scoped.label }}</span>
        </div>
      </template>
      <template #plus-header-isEmail="scoped">
        <div class="flex items-center">
          <ElCheckbox v-model="isEmail" @change="handleChange('EMAIL')" />
          <span class="ml-4">{{ scoped.label }}</span>
        </div>
      </template>
      <template #plus-header-isSms="scoped">
        <div class="flex items-center">
          <ElCheckbox v-model="isSms" @change="handleChange('SMS')" />
          <span class="ml-4">{{ scoped.label }}</span>
        </div>
      </template>
      <template #plus-cell-name="scoped">
        <span>{{ scoped.row.name }}</span>
        <ElTooltip v-if="scoped.row.desc" effect="dark" :content="scoped.row.desc" placement="top-start">
          <ReIcon icon="iconify-ep:question-filled" />
        </ElTooltip>
      </template>
      <template #plus-field-isSite="scoped">
        <ElCheckbox v-model="scoped.row.isSite" @change="handleModuleChange(scoped, 'SITE')" />
      </template>
      <template #plus-field-isEmail="scoped">
        <ElCheckbox v-model="scoped.row.isEmail" @change="handleModuleChange(scoped, 'EMAIL')" />
      </template>
      <template #plus-field-isSms="scoped">
        <ElCheckbox v-model="scoped.row.isSms" @change="handleModuleChange(scoped, 'SMS')" />
      </template>
    </PlusTable>
  </LayInfo>
</template>
