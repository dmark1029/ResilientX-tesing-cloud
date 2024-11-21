<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="datatable-container-full">
      <VulnerabilitiesTableWidget
        :workspace="workspace"
        :project="project"
        :calendar="false"
        :link="true"
        :grouped="true"
      />
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VulnerabilitiesTableWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTableWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VulnerabilitiesTableWidget, VBreadcrumb, VLoader },
  setup() {
    useMeta({
      title: `CVE`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    links: [],
  }),
  computed: {
    ...mapGetters(['project', 'loading', 'module', 'workspace']),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
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
          name: 'Workspaces',
        },
      },
      {
        label: this.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
      },
    ]

    if (this.project) {
      this.links.push({
        label: this.project.name,
        to: {
          name: 'ProjectOverview',
          params: { id: this.project.id },
        },
      })
    }

    this.links.push({
      label: 'CVE',
      to: {},
    })

    this.$store.dispatch('hideLoading')
  },
}
</script>
