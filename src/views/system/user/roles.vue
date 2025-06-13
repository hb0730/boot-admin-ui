<script setup lang="ts">
import type { ActionBarButtonsRow, FormChangeCallBackParams, PlusColumn } from 'plus-pro-components'
import type { System } from '@/api/modules/system/user/types'
import { list as roleApi } from '@/api/modules/system/role'
import * as userApi from '@/api/modules/system/user'

const props = defineProps({
  visible: Boolean,
  userId: String,
})
const emit = defineEmits(['update:visible'])
const localVisible = ref(props.visible)
const roles = ref<any>([])
const tableData = ref<any[]>([])
const submitLoading = ref(false)
const formColumns: PlusColumn[] = [
  {
    label: '角色名称',
    prop: 'roleId',
    valueType: 'select',
    options: computed(() => roles.value.map((item: any) => ({
      label: item.roleName,
      value: item.id,
    }))),
    formProps: {
      rules: {
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
      },
    },
  },
  {
    label: '到期时间',
    prop: 'endTime',
    valueType: 'date-picker',
    fieldProps: {
      type: 'date',
      placeholder: '请选择日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      disabledDate: (time: Date) => {
        return time.getTime() < new Date().getTime()
      },
    },
    formProps: {
      rules: {
        endTime: [
          { required: true, message: '请选择到期时间', trigger: 'change' },
          {
            validator: (_, value, callback) => {
              if (value && new Date(value).getTime() < new Date().getTime()) {
                callback(new Error('到期时间不能小于当前时间'))
              }
              else {
                callback()
              }
            },
            trigger: 'change',
          },
        ],
      },
    },
  },
]
const actionButtons: ActionBarButtonsRow[] = [
  {
    text: '删除',
    props: {
      type: 'primary',
      underline: 'never',
    },
    onClick: ({ index }) => {
      tableData.value.splice(index, 1)
    },

  },
]

async function onLoadRole() {
  const { success, data } = await roleApi({
    status: 1,
  })
  if (success) {
    roles.value = data
  }
}
async function getRoles() {
  const { success, data } = await userApi.getRoles(props.userId!)
  if (success) {
    tableData.value = data
  }
}

async function handleAdd() {
  tableData.value.push({
    roleId: '',
    roleName: '',
    endTime: '',
  })
}

async function handleFormChange(data: FormChangeCallBackParams) {
  // console.log(data)
  // tableData.value[data.index][data.prop] = data.value
  const { row, index } = data
  tableData.value[index] = row
}

async function handleCancel() {
  localVisible.value = false
}

async function handleConfirm() {
  // roleId是否重复
  const roleIdList = tableData.value.map(item => item.roleId)
  const roleIdSet = new Set(roleIdList)
  if (roleIdList.length !== roleIdSet.size) {
    ElMessage.error('角色重复')
    return
  }
  // id是否为空
  const idList = tableData.value.map(item => item.roleId)
  if (idList.includes('')) {
    ElMessage.error('角色不能为空')
    return
  }
  const body: System.ReqUserRoleForm[] = tableData.value.map(item => ({
    roleId: item.roleId,
    endTime: item.endTime,
  }))

  submitLoading.value = true
  const { success } = await userApi.saveRoles(props.userId!, body)
    .finally(() => {
      submitLoading.value = false
    })
  if (success) {
    ElMessage.success('操作成功')
    submitLoading.value = false
    localVisible.value = false
  }
}

watch(() => props.visible, (val) => {
  localVisible.value = val
  if (val) {
    getRoles()
  }
})
watch(() => localVisible.value, (val) => {
  emit('update:visible', val)
})

onMounted(() => {
  onLoadRole()
})
</script>

<template>
  <PlusDialog
    v-model="localVisible"
    title="分配角色"
    width="45%"
  >
    <PlusTable

      :columns="formColumns"
      :data="tableData"
      :action-bar="{
        buttons: actionButtons,
      }"
      editable="dblclick"
      @form-change="handleFormChange"
    >
      <template #title>
        <ElButton
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <ReIcon icon="i-ep:plus" class="el-icon" />
          </template>
          添加
        </ElButton>
      </template>
    </PlusTable>

    <template #footer>
      <ElButton
        @click="handleCancel"
      >
        取消
      </ElButton>
      <ElPopconfirm
        title="确认提交吗？"
        @confirm="handleConfirm"
      >
        <template #reference>
          <ElButton
            type="primary"
            :loading="submitLoading"
          >
            确定
          </ElButton>
        </template>
      </ElPopconfirm>
    </template>
  </PlusDialog>
</template>
