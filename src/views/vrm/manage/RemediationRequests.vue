<template>
  <div>
    <VendorsManageIssueRemediationComponent />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsManageIssueRemediationComponent from '/@src/components/vendors-manage/VendorsManageIssueRemediationComponent.vue'

export default {
  components: {
    VendorsManageIssueRemediationComponent,
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
        label: 'Remediation Requests',
        to: {},
      },
    ]
  },
  methods: {},
  metaInfo() {
    return {
      title: 'Remediation requests',
    }
  },
}
</script>
