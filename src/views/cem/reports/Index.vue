<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <ReportGenerationComponent
      :workspace="workspace"
      :project="project"
      :navigation="true"
    />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import ReportGenerationComponent from '/@src/components/reports/ReportGenerationComponent.vue'

export default {
  components: {
    ReportGenerationComponent,
    VBreadcrumb,
    VLoader,
  },
  props: ['project'],
  data: () => ({
    showModal: false,
    selectedIntegration: null,
    title: null,
  }),
  computed: {
    ...mapGetters(['general', 'loading', 'workspace']),
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
    ]

    if (this.workspace) {
      this.links.push({
        label: this.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
      })
    }

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
      label: 'Reports',
      to: {},
    })

    this.$store.dispatch('hideLoading')
  },
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' Reports',
      }
    }
    return {
      title: this.workspace?.name + ' Reports',
    }
  },
}
</script>

