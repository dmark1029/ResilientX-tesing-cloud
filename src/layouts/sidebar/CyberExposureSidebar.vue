<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [permissionsMixin],
  emits: ['close'],
  data: () => ({
    activeAssetsDropdown: false,
    activeDashboardDropdown: false,
  }),
  computed: {
    ...mapGetters([
      'user',
      'workspace',
      'project',
      'general',
      'isOpened',
      'openedSide',
      'isMobile',
    ]),
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
            name: 'ProjectAssetsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('assets', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Assets
        </router-link>
      </li>

      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectCollectionsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('collections', 'view')
              ? 'single-link'
              : 'single-link is-disabled'
          "
        >
          Groups
        </router-link>
      </li>

      <!--      <li id="assets-link" class="nav-item">-->
      <!--        <router-link-->
      <!--          active-class="active"-->
      <!--          :to="{-->
      <!--            name: 'CyberExSbomView',-->
      <!--            params: { id: project.id },-->
      <!--          }"-->
      <!--          :class="-->
      <!--            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'-->
      <!--          "-->
      <!--        >-->
      <!--          SBOM-->
      <!--        </router-link>-->
      <!--      </li>-->

      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectEventsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('events', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Events
        </router-link>
      </li>

      <li class="divider" />

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectAssetDomainsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Domains
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectAssetSubdomainsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Subdomains
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectAssetIPsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          IP Addresses
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'ProjectOverviewCloud',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Cloud accounts
        </router-link>
      </li>

      <li class="divider" />

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExTechnologiesView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Technologies
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExCertificatesView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Certificates
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'CyberExPortsView',
            params: { id: project.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Ports
        </router-link>
      </li>
    </template>

    <template v-if="workspace && !project">
      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceAssetsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('assets', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Assets
        </router-link>
      </li>

      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCollectionsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('collections', 'view')
              ? 'single-link'
              : 'single-link is-disabled'
          "
        >
          Groups
        </router-link>
      </li>

      <li id="reports-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExSbomView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          SBOM
        </router-link>
      </li>

      <li class="divider" />

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceAssetDomainsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Domains
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceAssetSubdomainsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Subdomains
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceAssetIPsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          IP Addresses
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceOverviewCloud',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Cloud accounts
        </router-link>
      </li>

      <li class="divider" />

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExTechnologiesView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Technologies
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExCertificatesView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Certificates
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExPortsView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Ports
        </router-link>
      </li>

      <!-- <li class="divider" />

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'WorkspaceCyberExTyposquattingView',
            params: { id: workspace.id },
          }"
          :class="
            canPerformAction('scans', 'view') ? 'single-link' : 'single-link is-disabled'
          "
        >
          Typosquatting
        </router-link>
      </li> -->
    </template>
  </template>
  <template v-else>
    <li>
      <a>No license found.</a>
    </li>
  </template>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
