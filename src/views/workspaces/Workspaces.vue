<template>
  <router-view v-if="loaded" :key="workspace?.id" :workspace="workspace" />
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loaded: false,
    }
  },
  computed: {
    ...mapGetters(['workspace']),
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    getData() {
      return axios
        .get('/workspace/' + this.$route.params.id)
        .then((res) => {
          this.$store.dispatch('addWorkspace', res.data.data)
          this.loaded = true
        })
        .catch(() => {})
    },
  },
}
</script>