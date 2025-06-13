<script setup lang="ts">
const title = defineModel('title')
</script>

<template>
  <div class="ml-[120px] max-w-[70%] min-w-[180px]">
    <h3 class="my-8">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
