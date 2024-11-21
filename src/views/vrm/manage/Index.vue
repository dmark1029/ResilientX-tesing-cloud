<template>
  <div v-if="loaded">
    <VendorsManageComponent :add="false" :limit="1000" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VendorsManageComponent from '/@src/components/vendors-manage/VendorsManageComponent.vue'

export default {
  components: {
    VendorsManageComponent,
    VBreadcrumb,
  },
  props: ['project'],
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapGetters(['loading', 'search', 'isMobile', 'workspace']),
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
        label: 'Companies',
        to: {},
      },
    ]

    this.loaded = true
  },
  methods: {},
  metaInfo() {
    return {
      title: 'Companies',
    }
  },
}
</script>
