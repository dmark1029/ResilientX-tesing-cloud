<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="datatable-container-full">
      <SubdomainsTableWidget :project="project" :calendar="false" />
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
import SubdomainsTableWidget from '/@src/components/modules/cyber-ex/widgets/SubdomainsTableWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { SubdomainsTableWidget, VBreadcrumb, VLoader },
  setup() {
    useMeta({
      title: `Subdomains`,
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
            label: 'Subdomains',
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
