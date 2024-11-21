<template>
  <div v-if="loaded">
    <VendorIssuesComponent :workspace-collection-id="workspace.id" :detailed="true" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorIssuesComponent from '/@src/components/vendors/assets/VendorIssuesComponent.vue'

export default {
  components: {
    VendorIssuesComponent,
    VBreadcrumb,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapGetters(['loading', 'search', 'isMobile', 'workspace']),
  },
  async mounted() {
    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
      },
      {
        label: 'Workspaces',
        to: {
          name: 'VRMWorkspaces',
        },
      },
      {
        label: this.workspace.name,
        to: {
          name: 'VendorOverview',
          params: { id: this.workspace.id },
        },
      },
      {
        label: 'Issues',
        to: {},
      },
    ]

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    return {
      title: this.workspace?.name + ' Issues',
    }
  },
}
</script>
