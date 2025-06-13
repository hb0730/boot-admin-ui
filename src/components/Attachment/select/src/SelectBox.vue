<script setup lang="ts">
import type { PageInfo, PlusDialogInstance } from 'plus-pro-components'
import type { AttachmentDialogProps } from './types'
import type { AttachmentList } from '@/api/modules/system/attachment/types'
import * as attachmentApi from '@/api/modules/system/attachment'
import Card from './Card.vue'

const props = withDefaults(defineProps<AttachmentDialogProps>(), {
  visible: false,
  multiple: false,
  title: '选择附件',
  width: '50%',
})
const emits = defineEmits(['update:visible', 'confirm'])
const dialogVisible = ref(props.visible)

const plusDialogFormRef = ref<Nullable<PlusDialogInstance>>(null)
const uploadVisible = ref(false)
const loading = ref(false)
const tableData = ref<any>([])
const selectedList = ref<AttachmentList.ResPage[]>([])

const searchModel = ref({
  displayName: '',
})
const pageTotal = ref(0)
const pagination = ref<PageInfo>({
  page: 1,
  pageSize: 10,
})

watch(() => props.visible, (val) => {
  dialogVisible.value = val
  if (!val) {
    selectedList.value = []
  }
})
const isSelected = computed(() => (item: AttachmentList.ResPage) => {
  return selectedList.value.some((i: AttachmentList.ResPage) => i.id === item.id)
})
const canSelect = computed(() => (item: AttachmentList.ResPage) => {
  return props.multiple || !isSelected.value(item)
})

function handleCancel() {
  dialogVisible.value = false
  emits('update:visible', false)
}

async function loadData() {
  loading.value = true
  const params = {
    ...searchModel.value,
    current: pagination.value.page,
    size: pagination.value.pageSize,
  }
  const { data, success } = await attachmentApi.page(params)
  if (success) {
    tableData.value = data.records
    pageTotal.value = data.total
  }
}

async function handleSelect(item: any) {
  // 选中&取消选中
  if (isSelected.value(item)) {
    selectedList.value = selectedList.value.filter((i: any) => i.id !== item.id)
  }
  else {
    if (props.multiple) {
      selectedList.value.push(item)
    }
    else {
      selectedList.value = [item]
    }
  }
}

async function handleUpload() {
  uploadVisible.value = true
}

async function handleConfirm() {
  dialogVisible.value = false
  emits('update:visible', false)
  emits('confirm', selectedList.value)
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <PlusDialog
    ref="plusDialogFormRef"
    v-model="dialogVisible"
    title="选择附件"
    :width="props.width"
    @cancel="handleCancel()"
    @confirm="handleConfirm"
  >
    <div class="mb-4">
      <el-row>
        <el-col :span="12">
          <div class="flex items-center">
            <el-input
              v-model="searchModel.displayName"
              placeholder="请输入附件名称"
              clearable
            />
            <div class="ml-2">
              <el-button
                type="primary"
                @click="loadData"
              >
                查询
              </el-button>
            </div>
            <div class="ml-2">
              <el-button @click="handleUpload">
                上传
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="grid grid-cols-3 mt-2 gap-x-2 gap-y-3 md:grid-cols-5 sm:grid-cols-3">
      <Card
        v-for="item in tableData"
        :key="item.id"
        :data="item"
        :selected="isSelected(item)"
        :can-select="canSelect(item)"
        @select="handleSelect"
      />
    </div>
    <PlusPagination
      v-model="pagination"
      :total="pageTotal"
      @change="loadData"
    />

    <template #footer>
      <el-button
        @click="handleCancel"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        :disabled="!multiple && selectedList.length === 0"
        @click="handleConfirm"
      >
        确定(已选择{{ selectedList.length }} {{ !multiple ? '/1' : '' }} 项)
      </el-button>
    </template>
  </PlusDialog>
  <MultipleUploadImg
    v-model="uploadVisible"
    @close="uploadVisible = false"
    @refresh="loadData"
  />
</template>
