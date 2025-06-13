<script setup lang="ts">
import { useMessageListHook } from './utils/hook'

const {
  plusPageRef,
  readingVisible,
  columns,
  readingData,
  loadData,
} = useMessageListHook()
</script>

<template>
  <LayInfo title="我的消息">
    <PlusPage
      ref="plusPageRef"
      :columns="columns"
      :request="loadData"
      :search="{
        showNumber: 2,
      }"
    />

    <NoticeReading v-model:visible="readingVisible" title="消息内容" width="45%" :data="readingData" />
  </LayInfo>
</template>
