<template>
  <div class="page-content-inner">
    <VendorsQuestionnaireAnswersComponent :workspace="workspace" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsQuestionnaireAnswersComponent from '/@src/components/vendors/questionnaires/VendorsQuestionnaireAnswersComponent.vue'

export default {
  components: {
    VendorsQuestionnaireAnswersComponent,
    VBreadcrumb,
  },
  mixins: [permissionsMixin],
  props: ['workspace'],
  data: () => ({
    filter: 'active',
    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    search: '',
    links: [],
  }),
  computed: {
    ...mapGetters(['projectAssets', 'loading', 'isMobile']),
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
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
      },
      {
        label: 'Questionnaire Answers',
        to: {},
      },
    ]

    this.$store.dispatch('hideLoading')
  },
  methods: {},

  metaInfo() {
    return {
      title: 'Questionnaire Answers',
    }
  },
}
</script>
