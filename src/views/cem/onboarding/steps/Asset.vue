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
  number: 3,
  canNavigate: true,
  canSkip: true,
  validateStepFn: async () => {
    router.push('/cem/start/success')
  },
  previousStepFn: async () => {
    router.push('/cem/start/collection')
  },
})
function convertToDomain(url: string) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  const parsedUrl = new URL(url)
  let domain = parsedUrl.hostname
  domain = domain.replace(/\/$/, '')
  wizard.data.asset = domain
}
</script>

<template>
  <div id="wizard-step-1" class="inner-wrapper is-active">
    <div class="step-content">
      <div class="step-title">
        <h2 class="dark-inverted">What is the domain name?</h2>
        <p>Enter your first asset so we can initialize discovery & scans</p>
      </div>

      <div class="project-info">
        <div class="project-info-head">
          <div class="project-info">
            <div class="project-name">
              <VField>
                <VControl>
                  <VInput v-model="wizard.data.asset" placeholder="Asset value" />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="wizard.data.asset && wizard.data.asset.startsWith('http')"
        class="step-title"
      >
        <p class="mb-1 mt-5 is-size-6">You have entered URL.</p>
        <p class="mx-auto mb-5 is-size-6">Do you want to convert it to domain?</p>
        <VButton
          color="primary"
          class="type-select-button"
          rounded
          elevated
          bold
          @click="() => convertToDomain(wizard.data.asset)"
        >
          Convert
        </VButton>
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
        {{ wizard.data.asset ? 'Next' : 'Skip' }}
      </VButton>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.step-title {
  .button {
    min-width: 140px;
  }
}
.input {
  background-color: #353538 !important;
  padding: 11px 12px !important;

  &::placeholder {
    text-align: center !important;
  }
}
</style>
