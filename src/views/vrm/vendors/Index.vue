<template>
  <div class="page-content-inner">
    <div style="position: absolute; right: 40px; z-index: 25; top: 15px">
      <VTabs
        slider
        type="rounded"
        selected="your"
        :tabs="[
          { label: 'Your companies', value: 'your' },
          { label: 'Other companies', value: 'public' },
        ]"
        @update:selected="
          (value) => {
            value === 'your' ? selectYour() : selectPublic()
          }
        "
      >
        <template #tab=""></template>
      </VTabs>
    </div>

    <div v-if="filter === 'your'">
      <VendorsComponent v-if="workspace" :workspace="workspace" />
    </div>

    <div v-if="filter === 'public'">
      <VendorsPublicComponent v-if="workspace" :workspace="workspace" />
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsComponent from '/@src/components/vendors/VendorsComponent.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VendorsPublicComponent from '/@src/components/vendors/VendorsPublicComponent.vue'

export default {
  components: {
    VendorsPublicComponent,
    VTabs,
    VendorsComponent,
    VBreadcrumb,
  },
  mixins: [permissionsMixin],
  props: ['workspace'],
  data: () => ({
    filter: 'your',
    editable: null,
    showImportModal: false,
    showScanNowModal: false,
    scanNowItem: null,
    search: '',
    links: [],
  }),
  computed: {
    ...mapGetters(['projectAssets', 'loading', 'isMobile']),
  },
  beforeCreate() {
    this.$store.dispatch('addVendors', null)
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
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
      },
      {
        label: 'Companies',
        to: {},
      },
    ]

    this.$store.dispatch('hideLoading')
  },
  methods: {
    selectPublic() {
      this.$store.dispatch('addVendors', null)
      this.filter = 'public'
    },
    selectYour() {
      this.$store.dispatch('addVendors', null)
      this.filter = 'your'
    },
  },

  metaInfo() {
    return {
      title: this.workspace?.name + ' Companies',
    }
  },
}
</script>
