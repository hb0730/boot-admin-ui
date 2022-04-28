<script setup lang="ts"></script>

<template>
  <div>
    <div class="avue-crud__menu">
      <div class="avue-crud__left">
        <slot name="opera-left" />
      </div>
      <div class="avue-crud__right">
        <slot name="opera-right" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
