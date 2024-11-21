<template>
  <VModal
    is="div"
    :open="idleModal"
    title="Your session has been inactive for some time"
    size="medium"
    @close="continueSession"
  >
    <template #content>
      <div class="has-text-centered">
        <h5 class="mt-0 mb-2">
          Please click 'Continue with Session' to resume or you will be automatically
          logged out.
        </h5>
        <div class="p-3">
          <button class="button v-button v-modal-close mr-3" @click="logout">
            Logout
          </button>
          <span class="button v-button is-raised is-primary" @click="continueSession"
            >Continue session</span
          >
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { computed } from 'vue'
import { useIdle, useTimestamp } from '@vueuse/core'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import { axios } from '/@src/axios'

export default {
  components: {
    VModal,
  },
  data: () => ({
    idleModal: false,
    idle: false,
    idledFor: 0,
    options: {
      idle: 600000, // 10 minutes
      logout: 660000, // 11 minutes
    },
  }),
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    idledFor: function () {
      if (this.idledFor * 1000 >= this.options.logout && this.user) {
        this.logout()
      }
      if (this.idledFor * 1000 >= this.options.idle && this.user) {
        this.idleModal = true
      }
    },
  },
  mounted() {
    const environment = import.meta.env.VITE_ENV

    if (environment === 'development') {
      this.options = {
        idle: 600000 * 4, // 10 minutes
        logout: 660000 * 4, // 11 minutes
      }
    } else if (environment === 'testing') {
      this.options = {
        idle: 3600000 * 4, // 60 minutes
        logout: 3660000 * 4, // 61 minutes
      }
    } else if (environment === 'staging') {
      this.options = {
        idle: 3600000 * 4, // 60 minutes
        logout: 3660000 * 4, // 61 minutes
      }
    } else {
      this.options = {
        idle: 600000, // 10 minutes
        logout: 660000, // 11 minutes
      }
    }

    const { idle, lastActive } = useIdle(this.options.idle)

    this.idle = idle

    const now = useTimestamp({ interval: 1000 })

    this.idledFor = computed(() => Math.floor((now.value - lastActive.value) / 1000))
  },
  methods: {
    continueSession() {
      window.location.reload()
    },
    async logout() {
      if (this.user) {
        await axios
          .post('/logout')
          .then(() => {
            this.$store.dispatch('removeAccessToken')
          })
          .catch(() => {})
      }

      window.location.reload()
    },
  },
}
</script>