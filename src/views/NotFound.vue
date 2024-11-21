<template>
  <div class="error-container">
    <div class="error-wrapper">
      <div class="error-inner has-has-text-centereded">
        <div class="bg-number dark-inverted">404</div>
        <img
          class="light-image"
          src="/@src/assets/illustrations/placeholders/error-5.svg"
          alt=""
        />
        <img
          class="dark-image"
          src="/@src/assets/illustrations/placeholders/error-5-dark.svg"
          alt=""
        />
        <h3 class="dark-inverted">Page not found</h3>
        <p>
          Looks like an unexpected problem occurred. Please try again or contact the
          website administrator.
        </p>
        <div class="button-wrap">
          <VButton color="primary" elevated rounded @click="$router.push('/')">
            Take me home
          </VButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import VButton from '/@src/components/base/button/VButton.vue'

export default {
  name: 'NotFound',
  components: { VButton },
  setup() {
    useMeta({
      title: 'Not found',
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
  mounted() {},
  methods: {},
}
</script>

