<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '/@src/mixins/permissionsMixin'

export default {
  mixins: [permissionsMixin],
  computed: {
    ...mapGetters(['workspace', 'project']),
    isActiveRoute() {
      return (routeName) =>
        this.$route.name === routeName && this.$route.params.id === this.workspace.id
    },
  },
  async mounted() {
    await this.$router.isReady()
  },
}
</script>

<template>
  <template v-if="workspace.licenses_count">
    <template v-if="project">
      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExVulnerabilitiesView',
            params: { id: project.id },
          }"
          class="single-link"
        >
          CVE
        </router-link>
      </li>

      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExTyposquattingView',
            params: { id: project.id },
          }"
          class="single-link"
        >
          Typosquatting
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExEmailLeaksView',
            params: { id: project.id },
          }"
          class="single-link"
        >
          Credential leaks
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExRiskConfigurationView',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Risk Configuration
        </router-link>
      </li>
    </template>

    <template v-if="workspace && !project">
      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExVulnerabilitiesView',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          CVE
        </router-link>
      </li>

      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExTyposquattingView',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Typosquatting
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExEmailLeaksView',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Credential leaks
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExRiskConfigurationView',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Risk Configuration
        </router-link>
      </li>
    </template>
  </template>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
.active-link {
  background-color: var(--dark-table-color);
}
</style>
