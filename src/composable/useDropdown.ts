/**
 * useDropdown Composition API
 */

import type { Ref } from 'vue'
import { reactive, ref, watchEffect } from 'vue'
import { onClickOutside } from '@vueuse/core'

export interface DropdownOptions {
  clickOutside?: boolean
}

/**
 * Generate refs to handle a dropdown state
 */
export function useDropdown(
  container: Ref<HTMLElement | undefined>,
  options: DropdownOptions = { clickOutside: true }
) {
  const isOpen = ref(false)

  if (options.clickOutside) {
    onClickOutside(container, () => {
      isOpen.value = false
    })
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  watchEffect(() => {
    if (!container.value) {
      return
    }

    if (isOpen.value) {
      const tableElement = container.value.parentNode.parentNode.parentNode.parentNode;
      let currentHeight = 0;

      if (tableElement && tableElement.tagName === 'TABLE') {
        currentHeight = tableElement.scrollHeight
      }

      container.value.classList.add('is-active')

      if (tableElement && tableElement.tagName === 'TABLE') {
        if (currentHeight !== tableElement.scrollHeight) {
          // logic that toggles height for tables if there is dropdown
          container.value.parentNode.parentNode.parentNode.parentNode.style.paddingBottom = (tableElement.scrollHeight-currentHeight)+10+'px';
        }
      }
    } else {
      container.value.classList.remove('is-active')

      if (container.value.parentNode.tagName === 'TD') {
        const tableElement = container.value.parentNode.parentNode.parentNode.parentNode;

        if (tableElement && tableElement.tagName === 'TABLE') {
          container.value.parentNode.parentNode.parentNode.parentNode.style.paddingBottom = '0px';
        }
      }
    }
  })

  return reactive({
    isOpen,
    open,
    close,
    toggle,
  })
}
