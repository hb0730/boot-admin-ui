<script setup lang="ts">
import { ValueType } from './utils/const'
import { useDictItems } from './utils/useDictItem'

const props = defineProps({
  dict: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const {
  currentDict,
  plusPageRef,
  title,
  dialogLoading,
  formModel,
  formVisible,
  formRules,
  tableColumns,
  tableActionButtons,
  keyExtraSchemas,
  addNew,
  onLoad,
  formSave,
} = useDictItems()

// 本地状态来管理 visible 的变化
const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  localVisible.value = val
  if (val) {
    currentDict.value = props.dict
    plusPageRef.value?.getList()
  }
})
// 监听本地状态的变化，触发父组件的事件
watch(localVisible, (val) => {
  emit('update:visible', val)
})
</script>

<template>
  <ElDrawer
    v-model="localVisible"
    size="65%"
    :title="title"
  >
    <template #default>
      <PlusPage
        ref="plusPageRef"
        :columns="tableColumns"
        :request="onLoad"
        :is-card="false"
        :table="{
          actionBar: {
            buttons: tableActionButtons,
          },
          hasIndexColumn: true,
        }"
      >
        <template #table-title>
          <div class="table-title">
            <el-button v-auth="['sys:dict:item:query']" type="primary" @click="addNew">
              <template #icon>
                <ReIcon icon="i-ep:plus" class="el-icon" />
              </template>
              新增
            </el-button>
          </div>
        </template>
      </PlusPage>

      <PlusDialogForm
        v-model:visible="formVisible"
        v-model="formModel"
        :form="{
          columns: tableColumns,
          labelWidth: '100px',
          rules: formRules,
        }"
        :dialog="{
          title: formModel.id ? '编辑字典项' : '新增字典项',
          width: '45%',
          confirmLoading: dialogLoading,
        }"
        @confirm="formSave"
      >
        <template #plus-field-extraParams>
          <!-- 额外参数配置 -->
          <div class="w-full">
            <ElFormItem
              v-for="({ name, type }) in keyExtraSchemas"
              :key="name"
              :prop="`extraParams.${name}`"
              :label="name"
              :rules="[{ required: true, message: `请输入 ${name}`, trigger: 'blur' }]"
            >
              <ElInput
                v-if="ValueType.STRING === type" v-model="formModel.extraParams[name]" :placeholder="`请输入 ${name}`"
                allow-clear
              />
              <ElInputNumber
                v-else-if="ValueType.INTEGER === type || ValueType.DECIMAL === type"
                v-model="formModel.extraParams[name]"
                :placeholder="`请输入 ${name}`"
                :min="0"
                :precision="ValueType.INTEGER === type ? 0 : 4"
                allow-clear
                controls-position="right"
              />
              <!-- 布尔值 -->
              <ElSwitch
                v-else-if="ValueType.BOOLEAN === type"
                v-model="formModel.extraParams[name]"
                active-text="是"
                inactive-text="否"
              />
              <!-- 颜色 -->
              <template v-if="ValueType.COLOR === type">
                <ElInput
                  v-model="formModel.extraParams[name]"
                  :placeholder="`请输入 ${name}`"
                  allow-clear
                >
                  <template #append>
                    <el-color-picker v-model="formModel.extraParams[name]" />
                  </template>
                </ElInput>
              </template>
            </ElFormItem>
          </div>
        </template>
      </PlusDialogForm>
    </template>
  </ElDrawer>
</template>
