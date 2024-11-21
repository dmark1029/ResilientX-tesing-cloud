<template>
  <router-view v-if="loaded" :key="project?.id" :project="project" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      loaded: false,
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      await this.$store.dispatch('addProject', this.$route.params.id)
      this.loaded = true
    },
  },
}
</script>