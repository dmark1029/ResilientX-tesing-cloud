<script setup lang="ts">
import { useWizard } from '/@src/composable/useWizard'
import Navigation from '/@src/views/cem/onboarding/Navigation.vue'
import { useMeta } from 'vue-meta'
import VProgress from '/@src/components/base/progress/VProgress.vue'

const wizard = useWizard()

useMeta({
  title: 'Onboarding ' + wizard?.stepTitle,
})
</script>

<template>
  <div>
    <!--Wizard Navbar-->
    <Navigation v-model:step="wizard.step" :title="wizard.stepTitle" :wizard="wizard" />

    <!--Wizard Progress Bar-->
    <VProgress
      id="wizard-progress"
      class="wizard-progress"
      color="primary"
      size="smaller"
      :value="(wizard.step / 4) * 100"
      :max="100"
    />

    <!--Main Wrapper-->
    <form
      method="post"
      novalidate
      class="wizard-v1-wrapper"
      @submit.prevent="() => wizard?.validateStepFn?.()"
    >
      <RouterView :key="true" :wizard="wizard" />
    </form>
  </div>
</template>
