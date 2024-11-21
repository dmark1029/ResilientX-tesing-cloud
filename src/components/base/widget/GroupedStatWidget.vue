<script setup lang="ts">
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

const groupClass =
  props.labels.length === 3
    ? 'group column is-2-desktop is-4-mobile is-4-tablet is-4-widescreen is-4-fullhd'
    : props.labels.length === 6
      ? 'group column is-2-desktop is-2-mobile is-2-tablet is-2-widescreen is-2-fullhd'
      : props.labels.length === 5
        ? 'group column is-one-fifth'
        : 'group column is-3-desktop is-6-mobile is-3-tablet is-3-widescreen is-3-fullhd'
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
    <div class="chart-group columns is-mobile is-multiline mb-2">
      <div :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart1" />
          </div>
          <span class="dark-inverted">{{ props.values[0] }}</span>
          <p>{{ props.labels[0] }}</p>
        </div>
      </div>
      <div :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart2" />
          </div>
          <span class="dark-inverted">{{ props.values[1] }}</span>
          <p>{{ props.labels[1] }}</p>
        </div>
      </div>
      <div :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart3" />
          </div>
          <span class="dark-inverted">{{ props.values[2] }}</span>
          <p>{{ props.labels[2] }}</p>
        </div>
      </div>
      <div v-if="props.labels[3]" :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart4" />
          </div>
          <span class="dark-inverted">{{ props.values[3] }}</span>
          <p>{{ props.labels[3] }}</p>
        </div>
      </div>
      <div v-if="props.labels[4]" :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart4" />
          </div>
          <span class="dark-inverted">{{ props.values[4] }}</span>
          <p>{{ props.labels[4] }}</p>
        </div>
      </div>
      <div v-if="props.labels[5]" :class="groupClass">
        <div class="group-content">
          <div class="chart-container" :class="[props.gauge && 'is-gauge']">
            <slot name="chart4" />
          </div>
          <span class="dark-inverted">{{ props.values[5] }}</span>
          <p>{{ props.labels[5] }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stat-widget {
  &.grouped-stat-widget {
    .group-content {
      transition: all 0.3s;
      &:hover {
        transform: scale(1.05);
      }
    }
    .chart-group {
      .group {
        text-align: center;

        .chart-container {
          margin-top: -5px;

          &.is-gauge {
            margin-bottom: 30px;
          }
        }

        span {
          display: block;
          font-family: var(--font);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.2rem;
        }

        p {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
