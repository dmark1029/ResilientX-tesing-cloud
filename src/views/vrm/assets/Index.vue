<template>
  <div class="page-content-inner">
    <VendorsAssetsComponent :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsAssetsComponent from '/@src/components/vendors/assets/VendorsAssetsComponent.vue'

export default {
  components: {
    VendorsAssetsComponent,
    VBreadcrumb,
  },
  mixins: [permissionsMixin],
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

    this.links.push({
      label: 'Assets',
      to: {},
    })
  },
  methods: {},
  metaInfo() {
    return {
      title: this.workspace.name + ' - Assets',
    }
  },
}
</script>
