<script>
import { ref } from 'vue'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import { mapGetters } from 'vuex'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown },
  props: ['wizard'],
  data() {
    return {
      dropdownElement: null,
      dropdown: null,
      onceImageErrored,
    }
  },
  computed: {
    ...mapGetters(['general']), // Assuming you have Vuex getters defined
  },
  created() {
    this.dropdownElement = ref(null)
  },
}
</script>

<template>
  <nav class="wizard-navigation">
    <RouterLink to="/" class="wizard-brand">
      <img :src="general.settings?.logo?.sidebar" class="hero-image" alt="logo" />
    </RouterLink>

    <div class="navbar-item is-wizard-title">
      <span class="title-wrap">
        Step {{ wizard.step }}: <span>{{ wizard.stepTitle }}</span>
      </span>
    </div>

    <VDropdown class="wizard-dropdown">
      <template #button="{ toggle }">
        <div
          tabindex="0"
          role="button"
          class="is-trigger"
          @click="toggle"
          @keydown.space.prevent="toggle"
        >
          <i aria-hidden="true" class="fa fa-chevron-down" />
        </div>
      </template>
      <template #content="{ close }">
        <RouterLink
          :class="[wizard.step < 1 && 'is-disabled']"
          class="dropdown-item kill-drop"
          tabindex="0"
          to="/start"
          @click.passive="close"
        >
          Step 1: Project
        </RouterLink>
        <RouterLink
          :class="[wizard.step < 2 && 'is-disabled']"
          class="dropdown-item kill-drop"
          tabindex="0"
          to="/start/collection"
          @click.passive="close"
        >
          Step 2: Collection
        </RouterLink>
        <RouterLink
          :class="[wizard.step < 3 && 'is-disabled']"
          class="dropdown-item kill-drop"
          tabindex="0"
          to="/start/asset"
          @click.passive="close"
        >
          Step 3: Asset
        </RouterLink>
      </template>
    </VDropdown>

    <!--    <div class="navbar-item is-dark-mode">-->
    <!--      <div class="navbar-icon">-->
    <!--        <label class="dark-mode">-->
    <!--          <span />-->
    <!--        </label>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <UserProfileDropdown />-->
  </nav>
</template>
