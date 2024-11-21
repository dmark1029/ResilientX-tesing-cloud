<template>
  <div>
    <LoadingAction
      title="Automatic login"
      text="Please hang tight for just a few moments as we put the finishing touches on your personalized setup."
    />
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import LoadingAction from '/@src/components/LoadingAction.vue'

export default {
  name: 'LoginAuto',
  components: { LoadingAction },
  setup() {
    useMeta({
      title: 'Auto login',
      bodyAttrs: {},
    })
  },
  computed: {
    ...mapGetters(['theme', 'general']),
  },
  mounted() {
    this.verify()
  },
  beforeMount() {
    this.$store.dispatch('addBodyClass', 'authorization')
  },
  beforeUnmount() {
    this.$store.dispatch('addBodyClass', '')
  },
  methods: {
    async verify() {
      let token = this.$route.params.token

      await this.$store.dispatch('addAccessToken', token)

      setTimeout(() => {
        window.location.href = '/'
      }, 4000)
    },
  },
}
</script>
