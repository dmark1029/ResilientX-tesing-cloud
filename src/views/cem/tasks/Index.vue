<template>
  <div v-if="loaded">
    <TasksComponent :project="project" :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import TasksComponent from '/@src/components/tasks/TasksComponent.vue'

export default {
  components: {
    TasksComponent,
    VBreadcrumb,
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapGetters(['loading', 'search', 'isMobile', 'project', 'workspace']),
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
      label: 'Scans',
      to: {},
    })

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    return {
      title: this.project ? `${this.project.name} Scans` : `${this.workspace.name} Scans`,
    }
  },
}
</script>
