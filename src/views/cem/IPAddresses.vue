<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="datatable-container-full">
      <IpsTableWidget :project="project" :calendar="false" />
    </div>
    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import IpsTableWidget from '/@src/components/modules/cyber-ex/widgets/IpsTableWidget.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VBreadcrumb, IpsTableWidget, VLoader },
  setup() {
    useMeta({
      title: `IP Addresses`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    links: [],
  }),
  computed: {
    ...mapGetters(['project', 'loading', 'module']),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
  },
  async mounted() {
    await Promise.all([this.getData()])
      .then(() => {
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
            label: this.project.workspace.name,
            to: {
              name: 'WorkspacesView',
              params: { id: this.project.workspace.id },
            },
          },
          {
            label: this.project.name,
            to: {
              name: 'ProjectOverview',
              params: { id: this.project.id },
            },
          },
          {
            label: 'IP Addresses',
            to: {},
          },
        ]
      })
      .finally(() => {
        this.$store.dispatch('hideLoading')
      })
  },
  methods: {
    async getData() {
      await this.$store.dispatch('addProject', this.$route.params.id)
    },
  },
}
</script>
