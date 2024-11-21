<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <SupplyChain />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import SupplyChain from '/src/components/vendors/supplychain/SupplyChain.vue'

export default {
  components: {
    VBreadcrumb,
    SupplyChain,
    VLoader,
  },
  setup() {
    useMeta({
      title: `Supply Chain`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    links: [],
  }),
  computed: {
    ...mapGetters(['workspace', 'loading', 'module']),
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
        label: 'Supply Chain',
        to: {},
      },
    ]

    this.$store.dispatch('hideLoading')
  },
  methods: {},
}
</script>
