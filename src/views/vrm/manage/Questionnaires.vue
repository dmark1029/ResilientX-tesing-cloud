<template>
  <div>
    <VendorsManageQuestionnairesLinkComponent />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsManageQuestionnairesLinkComponent from '/@src/components/vendors-manage/VendorsManageQuestionnairesLinkComponent.vue'

export default {
  components: {
    VendorsManageQuestionnairesLinkComponent,
    VBreadcrumb,
  },
  data: () => ({
    links: [],
  }),
  computed: {
    ...mapGetters(['manageableVendors']),
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
        label: 'Questionnaires',
        to: {},
      },
    ]
  },
  methods: {},
  metaInfo() {
    return {
      title: 'Questionnaires',
    }
  },
}
</script>
