<script setup lang="ts">
import VButton from '/@src/components/base/button/VButton.vue'
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  wizard: any
}>()

const wizard = props.wizard

import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const general = computed(() => store.state.general.general)
const workspace = computed(() => store.state.workspace.workspace)

let modules
if (workspace.value?.activeLicense?.show_unlicensed) {
  modules = workspace.value?.activeLicense?.modules
} else {
  modules = workspace.value?.activeLicense?.modules.map((module) => module.slug)
}

if (!modules) {
  modules = []
}

wizard.setStep({
  number: 2,
  canNavigate: true,
  previousStepFn: async () => {
    router.push('/cem/start')
  },
  validateStepFn: async () => {
    router.push('/cem/start/asset')
  },
})

const filteredSchedules = Object.fromEntries(
  Object.entries(general.value.schedules.types).filter(
    ([key, value]) => value !== 'Custom'
  )
)

const addMonitor = (monitor) => {
  if (wizard.data.monitors.includes(monitor.slug)) {
    wizard.data.monitors.splice(wizard.data.monitors.indexOf(monitor.slug), 1)

    if (monitor.slug === 'exposure') {
      wizard.data.discovery = false
    }
  } else {
    wizard.data.monitors.push(monitor.slug)
  }
}

const toggleDiscovery = () => {
  if (wizard.data.monitors.includes('exposure')) {
    wizard.data.discovery = !wizard.data.discovery
  }
}
</script>

<template>
  <div id="wizard-step-0" class="inner-wrapper is-active">
    <div class="step-content">
      <div class="step-title">
        <h2 class="dark-inverted">What you want to monitor?</h2>
      </div>

      <div class="wizard-types">
        <div class="columns is-multiline">
          <template
            v-for="monitor in general.monitors
              .filter((m) => m.active)
              .filter((m) => modules.includes(m.module))"
            :key="monitor.slug"
          >
            <div class="column is-4">
              <div
                :class="[
                  wizard.data.monitors.includes(monitor.slug)
                    ? 'wizard-card active'
                    : 'wizard-card',
                ]"
              >
                <h3 class="dark-inverted">{{ monitor.name }}</h3>
                <p>{{ monitor.description }}</p>
                <div class="button-wrap">
                  <VButton
                    color="primary"
                    class="type-select-button"
                    rounded
                    elevated
                    bold
                    @click="addMonitor(monitor)"
                  >
                    {{
                      wizard.data.monitors.includes(monitor.slug) ? 'Unselect' : 'Select'
                    }}
                  </VButton>
                </div>
              </div>
            </div>

            <div v-if="monitor.slug === 'exposure'" class="column is-4">
              <div
                :class="[
                  wizard.data.discovery
                    ? 'wizard-card active'
                    : wizard.data.monitors.includes(monitor.slug)
                      ? 'wizard-card'
                      : 'wizard-card is-disabled',
                ]"
              >
                <h3 class="dark-inverted">Asset Discovery</h3>
                <p>Identifying and cataloging digital assets.</p>
                <div class="button-wrap">
                  <VButton
                    color="primary"
                    class="type-select-button"
                    rounded
                    elevated
                    bold
                    @click="toggleDiscovery(monitor)"
                  >
                    {{ wizard.data.discovery ? 'Unselect' : 'Select' }}
                  </VButton>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="project-budget">
          <h4>How often?</h4>
          <div class="project-budget-inner">
            <div class="budget-item">
              <a
                v-for="(title, value) in filteredSchedules"
                :key="value"
                :class="[
                  value === wizard.data.schedule
                    ? 'budget-item-inner is-active'
                    : 'budget-item-inner',
                ]"
                tabindex="0"
                role="button"
                @click="wizard.data.schedule = value"
              >
                <span>{{ title }}</span>
              </a>
            </div>
          </div>
          <h4 class="mt-4 mb-2">OR</h4>
          <div class="project-budget-inner">
            <div class="budget-item">
              <a
                :class="[
                  'one-time' === wizard.data.schedule
                    ? 'budget-item-inner is-active'
                    : 'budget-item-inner',
                ]"
                style="min-width: 120px"
                tabindex="0"
                role="button"
                @click="wizard.data.schedule = 'one-time'"
              >
                <span>One-time scan</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="wizard-buttons" :class="[wizard.canNavigate && 'is-active']">
    <div class="wizard-buttons-inner">
      <VButton
        class="wizard-button-previous"
        :disabled="wizard.previousStepFn === null"
        :color="wizard.previousStepFn === null ? 'light' : 'primary'"
        bold
        elevated
        @click="() => wizard?.previousStepFn?.()"
      >
        Previous
      </VButton>
      <VButton
        type="submit"
        class="wizard-button-previous"
        :disabled="wizard.validateStepFn === null"
        :color="wizard.validateStepFn === null ? 'light' : 'primary'"
        bold
        elevated
      >
        Next
      </VButton>
    </div>
  </div>
</template>
