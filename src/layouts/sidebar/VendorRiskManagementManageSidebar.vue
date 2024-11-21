<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'

export default {
  components: {},
  mixins: [permissionsMixin],
  emits: ['close'],
  data: () => ({}),
  computed: {
    ...mapGetters([
      'user',
      'workspace',
      'general',
      'isOpened',
      'openedSide',
      'manageableVendors',
      'isMobile',
    ]),
  },

  async mounted() {
    await this.$router.isReady()
  },
  methods: {},
}
</script>

<template>
  <li v-if="workspace">
    <router-link
      active-class="active"
      :to="{
        name: 'Home',
      }"
      class="single-link"
    >
      Dashboard
    </router-link>
  </li>

  <li v-if="manageableVendors.length" class="nav-item">
    <router-link
      active-class="active"
      :to="{
        name: 'VrmManage',
      }"
      class="single-link"
    >
      Companies
    </router-link>
  </li>

  <li v-if="manageableVendors.length" class="nav-item">
    <router-link
      active-class="active"
      :to="{
        name: 'VrmManageQuestionnaires',
      }"
      class="single-link"
    >
      Questionnaires
    </router-link>
  </li>

  <li v-if="manageableVendors.length" class="nav-item">
    <router-link
      active-class="active"
      :to="{
        name: 'VrmManageRemediationRequests',
      }"
      class="single-link"
    >
      Remediation requests
    </router-link>
  </li>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
