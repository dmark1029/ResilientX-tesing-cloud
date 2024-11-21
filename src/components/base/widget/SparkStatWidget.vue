<script setup lang="ts">
const props = defineProps<{
  straight?: boolean
}>()
</script>

<template>
  <div class="stat-widget spark-tile-widget" :class="[props.straight && 'is-straight']">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.stat-widget {
  &.spark-tile-widget {
    border-radius: 19px;
    padding: 0;
  }
  &:hover {
    transform: translateY(-5px);
    border-color: var(--dark-sidebar-light-15);
  }
}
</style>
