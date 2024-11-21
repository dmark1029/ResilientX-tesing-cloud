<template>
  <div class="error-container">
    <div class="error-wrapper">
      <div class="error-inner has-has-text-centereded">
        <img
          class="dark-image"
          src="/@src/assets/illustrations/placeholders/error-2-dark.svg"
          alt=""
        />
        <h3 class="dark-inverted">Site Maintenance in Progress</h3>
        <p>
          We apologize for the inconvenience, but our website is currently undergoing
          scheduled maintenance. This is a necessary step to ensure that we provide you
          with the best possible service and experience. We will be back online shortly.
          Thank you for your patience.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'

export default {
  name: 'Maintenance',
  setup() {
    useMeta({
      title: 'Maintenance',
      bodyAttrs: {},
    })
  },
  data: () => ({}),
  computed: {
    ...mapGetters(['theme', 'general']),
  },
  beforeMount() {
    this.$store.dispatch('addBodyClass', 'authorization')
  },
  beforeUnmount() {
    this.$store.dispatch('addBodyClass', '')
  },
  mounted() {
    if (import.meta.env.VITE_MAINTENANCE_MODE !== 'true') {
      this.$router.push({ name: 'Home' })
    }
  },
  methods: {},
}
</script>

