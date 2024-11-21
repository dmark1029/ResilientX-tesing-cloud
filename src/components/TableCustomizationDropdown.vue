<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { ref } from 'vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import VCheckbox from '/@src/components/base/form/VCheckbox.vue'
import { defineProps, defineEmits } from 'vue'

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)

const props = defineProps({
  types: {
    type: Object,
    default: () => {},
  },
  id: {
    type: String,
    default: undefined,
  },
})

let localValues = localStorage.getItem(props.id)
if (localValues) {
  localValues = JSON.parse(localValues)
} else {
  localValues = {}
}

const emit = defineEmits(['typesUpdated'])

let selected = Object.assign(props.types, localValues)

const updateValues = () => {
  localStorage.setItem(props.id, JSON.stringify(selected))
  emit('typesUpdated', selected)
}
</script>

<template>
  <div class="toolbar-notifications is-hidden-mobile">
    <div
      ref="dropdownElement"
      class="dropdown is-spaced is-dots is-right dropdown-trigger"
    >
      <div
        tabindex="0"
        class="is-clickable"
        aria-haspopup="true"
        @click="dropdown.toggle"
        @keydown.space.prevent="dropdown.toggle"
      >
        <i aria-hidden="true" class="fa fa-cogs" />
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content has-text-left">
          <div class="heading p-2 pl-3">
            <div class="heading-left">
              <h6 class="heading-title">Visible columns</h6>
            </div>
          </div>
          <ul class="table-list p-2 pl-3 pr-3">
            <li v-for="(value, item) in types" :key="item" class="mb-4">
              <VField horizontal>
                <VControl raw subcontrol>
                  <VCheckbox
                    v-model="selected[item]"
                    :label="item"
                    @change="updateValues"
                  />
                </VControl>
              </VField>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
