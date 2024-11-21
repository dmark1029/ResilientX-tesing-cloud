<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="datatable-container-full">
      <VendorVulnerabilitiesTableWidget
        :workspace-collection-id="workspace.id"
        :calendar="false"
        :link="true"
        :grouped="true"
        :detailed="true"
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
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VendorVulnerabilitiesTableWidget from '/@src/components/vendors/assets/VendorVulnerabilitiesTableWidget.vue'

export default {
  components: {
    VendorVulnerabilitiesTableWidget,
    VBreadcrumb,
    VLoader,
  },
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
        label: 'CVE',
        to: {},
      },
    ]

    this.$store.dispatch('hideLoading')
  },
  methods: {},
}
</script>
