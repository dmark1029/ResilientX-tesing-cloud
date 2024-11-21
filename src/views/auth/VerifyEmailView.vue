<template>
  <div>
    <LoadingAction
      title=" Verifying your email"
      text="Give us a quick second as we diligently confirm your email address. We're almost there!"
    />
  </div>
</template>

<script>
import Form from '/@src/form'
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import LoadingAction from '/@src/components/LoadingAction.vue'

export default {
  name: 'VerifyEmailView',
  components: { LoadingAction },
  setup() {
    useMeta({
      title: 'Email verification',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['theme', 'general']),
  },
  mounted() {
    this.form.id = this.$route.params.id
    this.form.hash = this.$route.params.hash
    this.form.expires = this.$route.query.expires
    this.form.signature = this.$route.query.signature
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
          .post('/verify')
          .then((res) => {
            if (res.data.data.success) {
              axios.get('/profile').then((res) => {
                const { data } = res.data
                this.$store.dispatch('addUser', data)
              })

              this.$store.dispatch('addAlert', {
                text: 'Email verified.',
                type: 'success',
              })

              setTimeout(() => {
                this.$router.push({ name: 'Home' })
              }, 4000)
              resolve()
            }
            this.$store.dispatch('addAlert', {
              text: res.data.data.error,
              type: 'danger',
            })

            setTimeout(() => {
              this.$router.push({ name: 'Home' })
            }, 4000)

            reject()
          })
          .catch((e) => {
            if (e.response.status === 401) {
              this.$store.dispatch('addAlert', {
                text: 'Please login before verifying email.',
                type: 'danger',
              })
            } else {
              this.$store.dispatch('addAlert', {
                text: 'Failed to verify email.',
                type: 'danger',
              })
            }

            reject()
          })
      })
    },
  },
}
</script>
