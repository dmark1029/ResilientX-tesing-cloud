<template>
  <div v-if="loaded">
    <IssuesComponent :project="project" :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IssuesComponent from '/@src/components/issues/IssuesComponent.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'

export default {
  components: {
    VBreadcrumb,
    IssuesComponent,
  },
  props: ['project'],

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
      label: 'Issues',
      to: {},
    })

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' Issues',
      }
    }
    return {
      title: this.workspace?.name + ' Issues',
    }
  },
}
</script>
