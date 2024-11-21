<template>
  <div class="page-content-inner">
    <AssetsComponent :workspace="workspace" :project="project" type="subdomain" />

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
    showModal: false,
    filter: 'active',
    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    search: '',
    links: [],
  }),
  computed: {
    ...mapGetters(['projectAssets', 'loading', 'isMobile', 'workspace']),
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
      label: 'Subdomains',
      to: {},
    })

    this.$store.dispatch('hideLoading')

    if (this.$route.query.open) {
      this.showModal = true
    }
  },
  methods: {},

  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' Subdomains',
      }
    }
    return {
      title: this.workspace?.name + ' Subdomains',
    }
  },
}
</script>
