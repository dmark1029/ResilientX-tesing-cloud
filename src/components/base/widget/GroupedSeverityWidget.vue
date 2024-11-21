<!-- Risks by Severity -->
<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    title?: string
    values?: any[]
    labels?: any[]
    straight?: boolean
    gauge?: boolean
  }>(),
  {
    title: 'Grouped stats widget',
    values: () => [],
    labels: () => [],
  }
)
const total = computed(() => {
  return props.values.reduce((acc, value) => acc + value, 0)
})
const getWidthPercentage = (value: number) => {
  if (total.value === 0) return 0
  return (value / total.value) * 100
}
const getClassByLabel = (label: string) => {
  switch (label.toLowerCase()) {
    case 'critical':
      return 'is-critical'
    case 'high':
      return 'is-danger'
    case 'medium':
      return 'is-warning'
    case 'low':
      return 'is-info'
    default:
      return ''
  }
}
</script>

<template>
  <div
    class="stat-widget grouped-stat-widget is-straight"
    :class="[props.straight && 'is-straight']"
  >
    <div class="widget-head">
      <h3 class="dark-inverted">
        {{ props.title }}
      </h3>
    </div>
    <div class="">
      <div class="widget-body is-flex">
        <div
          v-for="(value, index) in props.values"
          :key="index"
          class="tag chip"
          :class="getClassByLabel(props.labels[index])"
          :style="{
            width: getWidthPercentage(value) + '%',
            backgroundColor: 'lightblue',
            textAlign: 'center',
          }"
        ></div>
      </div>
      <div class="widget-content is-flex is-justify-content-center">
        <div
          v-for="(value, index) in props.values"
          :key="index"
          class="each-widget is-flex is-align-items-center is-justify-content-flex-start mb-2"
        >
          <span
            class="risk-color tag"
            :class="getClassByLabel(props.labels[index])"
          ></span>
          <span class="risk-number">{{ value }}</span>
          <span class="risk-type">{{ props.labels[index] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stat-widget {
  &.grouped-stat-widget {
    width: 100%;
    padding: 20px 32.5px;
    .group-content {
      transition: all 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }

    .widget-body {
      width: 100%;
      height: 18px;
      margin: 6px 0 20px;

      .tag.chip {
        height: 18px !important;
        border-radius: 0px !important;
      }
    }

    .widget-content {
      flex-wrap: wrap;

      .each-widget {
        width: 50%;
        span {
          margin: 0 5px;
          &.risk-color {
            width: 6px !important;
            height: 16px;
            padding-left: 0;
            border-radius: 0px;
          }
          &:first-child {
            margin-left: 0px;
          }

          
          &.risk-number {
            font-size: 14px;
            font-weight: 600;
            line-height: 1.2;
          }

          &.risk-type {
            font-size: 12px;
            line-height: 1.5;
          }
        }
      }
    }
  }
}
</style>
