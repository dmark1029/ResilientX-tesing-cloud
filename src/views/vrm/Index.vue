<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import { mapGetters } from 'vuex'
import { VRM_PRODUCT } from '/@src/models/constants'
export default {
  data() {
    return {
      loaded: false,
    }
  },
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await this.setProduct()
  },
  methods: {
    setProduct() {
      this.$store.dispatch('addProduct', VRM_PRODUCT)
    },
  },
}
</script>