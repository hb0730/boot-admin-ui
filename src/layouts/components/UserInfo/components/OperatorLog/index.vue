<script setup lang="ts">
import { useOperatorLog } from './hook'

const { tableColumns, onLoad } = useOperatorLog()
</script>

<template>
  <LayInfo title="操作日志">
    <PlusPage
      :is-card="false"
      :columns="tableColumns"
      :request="onLoad"
    />
  </LayInfo>
</template>
