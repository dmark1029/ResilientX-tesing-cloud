<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import { mapGetters } from 'vuex'
import { UEM_PRODUCT } from '/@src/models/constants'

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
      this.$store.dispatch('addProduct', UEM_PRODUCT)
    },
  },
}
</script>