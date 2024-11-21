<script setup lang="ts">
export type VTagColor =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'orange'
  | 'blue'
  | 'green'
  | 'purple'
  | 'white'
  | 'light'
  | 'solid'

export type VTagSize = 'tiny'

export interface VTagProps {
  label?: string | number
  color?: VTagColor
  size?: VTagSize
  rounded?: boolean
  curved?: boolean
  outlined?: boolean
  elevated?: boolean
  remove?: boolean
}

const props = withDefaults(defineProps<VTagProps>(), {
  label: undefined,
  color: undefined,
  size: undefined,
})
</script>

<template>
  <small
    class="tag"
    :class="[
      props.color && 'is-' + props.color,
      props.size && 'is-' + props.size,
      props.rounded && 'is-rounded',
      props.curved && 'is-curved',
      props.outlined && 'is-outlined',
      props.elevated && 'is-elevated',
      props.remove && 'is-delete',
    ]"
    ><slot>{{ props.label }}</slot></small
  >
</template>
