<template>
  <div v-if="loaded">
    <ReportGenerationComponent :workspace="workspace" :navigation="true" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import ReportGenerationComponent from '/@src/components/vendors/reports/ReportGenerationComponent.vue'

export default {
  components: {
    ReportGenerationComponent,
    VBreadcrumb,
  },
  data: () => ({
    loaded: false,
    links: [],
  }),
  computed: {
    ...mapGetters(['workspace']),
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
        label: 'Reports',
        to: {},
      },
    ]

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    return {
      title: this.workspace?.name + ' Reports',
    }
  },
}
</script>
