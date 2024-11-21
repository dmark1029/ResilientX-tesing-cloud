import type { InjectionKey } from 'vue'
import { computed, reactive, ref, shallowRef } from 'vue'

/**
 * Using typescript types allow better developer experience
 * with autocompletion and compiler error prechecking
 */
import type { WizardData } from '/@src/models/wizard'
import sleep from '/@src/utils/sleep'

interface WizardStepOptions {
  number: number
  canNavigate?: boolean
  previousStepFn?: () => Promise<void>
  validateStepFn?: () => Promise<void>
}

export type WizardContext = ReturnType<typeof createWizardContext>
export const useWizardSymbolContext = Symbol('wizard') as InjectionKey<WizardContext>

function createWizardContext() {
  const step = ref(1)
  const loading = ref(false)
  const canNavigate = ref(false)
  const previousStepFn = shallowRef<WizardStepOptions['previousStepFn'] | null>()
  const validateStepFn = shallowRef<WizardStepOptions['validateStepFn'] | null>()
  const data = reactive<WizardData>({
    name: 'Initial project',
    monitors: [
        'exposure'
    ],
    schedule: 'weeklyOn',
    asset: null,
    discovery: true
  })

  const stepTitle = computed(() => {
    switch (step.value) {
      case 2:
        return 'Collection'
      case 3:
        return 'Asset'
      case 4:
        return 'Finish'
      case 1:
      default:
        return 'Project'
    }
  })

  function setLoading(value: boolean) {
    loading.value = value
  }

  function setStep(options?: WizardStepOptions) {
    step.value = options?.number || 1
    canNavigate.value = options?.canNavigate ?? false
    previousStepFn.value = options?.previousStepFn ?? null
    validateStepFn.value = options?.validateStepFn ?? null
  }

  async function save() {
    loading.value = true

    // simulate saving data
    await sleep(2000)

    loading.value = false
  }

  function reset() {
    data.name = 'Initial project'
    data.monitors = [
      'exposure'
    ]
    data.schedule = 'weeklyOn'
    data.asset = null
    data.discovery = false
  }

  return reactive({
    canNavigate,
    previousStepFn,
    validateStepFn,
    step,
    loading,
    stepTitle,
    data,
    setLoading,
    setStep,
    save,
    reset,
  })
}

const wizardContext = createWizardContext();

export function useWizard() {
  return wizardContext;
}
