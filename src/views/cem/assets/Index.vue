<template>
  <div class="page-content-inner">
    <AssetsComponent :project="project" :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import AssetsComponent from '/@src/components/assets/AssetsComponent.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'

export default {
  components: {
    VBreadcrumb,
    AssetsComponent,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    links: [],
  }),
  computed: {
    ...mapGetters(['projectAssets', 'isMobile', 'workspace']),
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
      label: 'Assets',
      to: {},
    })
  },
  methods: {},
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' - Assets',
      }
    }

    return {
      title: this.workspace.name + ' - Assets',
    }
  },
}
</script>
