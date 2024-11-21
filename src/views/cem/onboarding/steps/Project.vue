<script setup lang="ts">
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import VButton from '/@src/components/base/button/VButton.vue'

const props = defineProps<{
  wizard: any
}>()

const wizard = props.wizard
const router = useRouter()
wizard.setStep({
  number: 1,
  canNavigate: true,
  validateStepFn: async () => {
    if (!wizard.data.name) {
      return false
    }
    await router.push('/cem/start/collection')
  },
  previousStepFn: () => {
    router.push({ name: 'Home' })
  },
})
</script>

<template>
  <div id="wizard-step-1" class="inner-wrapper is-active">
    <div class="step-content">
      <div class="step-title">
        <h2 class="dark-inverted">What is this project about?</h2>
        <p>Manage better by adding all relevant project information</p>
      </div>

      <div class="project-info">
        <div class="project-info-head">
          <div class="project-info">
            <div class="project-name">
              <VField>
                <VControl>
                  <VInput v-model="wizard.data.name" placeholder="Project Name" />
                </VControl>
              </VField>
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

<style scoped>
.input {
  background-color: #353538 !important;
}
</style>