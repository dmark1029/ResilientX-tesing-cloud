<template>
  <div v-if="loaded">
    <EventsComponent :project="project" :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EventsComponent from '/@src/components/events/EventsComponent.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'

export default {
  components: {
    VBreadcrumb,
    EventsComponent,
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
      label: 'Events',
      to: {},
    })

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' Events',
      }
    }

    return {
      title: this.workspace?.name + ' Events',
    }
  },
}
</script>
