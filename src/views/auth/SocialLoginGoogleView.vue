<template>
  <div>
    <LoadingAction
      title="Verifying your login details"
      text="Sit tight for a moment while we confirm your login credentials, it should take few seconds."
    />
  </div>
</template>

<script>
import Form from '/@src/form'
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import LoadingAction from '/@src/components/LoadingAction.vue'

export default {
  name: 'VerifySocialCallbackView',
  components: { LoadingAction },
  setup() {
    useMeta({
      title: 'Google login callback',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['theme', 'general', 'redirectUrl']),
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
    verify() {
      return new Promise((resolve, reject) => {
        this.form
          .get('/login/google/callback', { params: this.$route.query })
          .then(async (res) => {
            await this.$store.dispatch('addAccessToken', res.data.data.access_token)

            setTimeout(() => {
              if (this.redirectUrl) {
                window.location.href = this.redirectUrl
              } else {
                window.location.href = '/'
              }
            }, 2000)
            resolve()
          })
          .catch((e) => {
            if (e.response?.data?.message) {
              this.$store.dispatch('addAlert', {
                text: e.response.data.message,
                type: 'danger',
              })
            }

            this.$router.push({ name: 'Home' })

            reject()
          })
      })
    },
  },
}
</script>
