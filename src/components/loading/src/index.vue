<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps({
  loading: {
    require: false,
    type: Boolean,
    default: false
  }
});
const loading = toRef(props, "loading");
</script>

<template>
  <div v-loading="loading">
    <slot />
  </div>
</template>

<style scoped></style>
