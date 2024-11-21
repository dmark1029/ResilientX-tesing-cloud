<template>
  <div v-if="loaded">
    <RiskMatrixQuestionnaires :workspace="workspace" type="vendors_questionnaires" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import RiskMatrixQuestionnaires from '/@src/components/RiskMatrixQuestionnaires.vue'

export default {
  components: {
    RiskMatrixQuestionnaires,
    VBreadcrumb,
  },
  props: ['project'],
  data: () => ({
    loaded: false,
    links: [],
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
        label: 'Risk Configuration',
        to: {},
      },
    ]

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    return {
      title: this.workspace?.name + ' Risk Configuration',
    }
  },
}
</script>
