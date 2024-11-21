<template>
  <div>
    <VModal is="div" :open="true" title="Book a demo" size="big" :noscroll="true">
      <template #content>
        <div>
          <h1 class="title is-4">Book Your Demo Now and Get 14 -Days Free Trial</h1>
          <p class="">Get Your Dedicated and Tailored Demo with one of our Executives.</p>
          <div
            class="meetings-iframe-container mt-5"
            data-src="https://meetings-eu1.hubspot.com/jim-biniyaz?embed=true"
          />

          <div class="buttons">
            <button
              v-if="user"
              type="button"
              aria-hidden="false"
              class="button v-button is-dark-outlined"
              @click="logout"
            >
              <span> Logout </span>
            </button>
            <router-link
              :to="{ name: 'Support' }"
              target="_blank"
              type="button"
              aria-hidden="false"
              class="button v-button is-raised is-primary"
              ><span> Contact us </span></router-link
            >
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  name: 'BookDemo',
  components: { VModal },
  setup() {
    useMeta({
      title: 'Book a demo',
      bodyAttrs: {},
      script: [
        {
          src: 'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js',
        },
      ],
    })
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    if (!this.user) {
      this.$router.push({
        name: 'Login',
      })
    }
    if (!this.user.needDemo) {
      this.$router.push({
        name: 'Home',
      })
    }
  },
  methods: {
    logout() {
      axios
        .post('/logout')
        .then(() => {
          this.$store.dispatch('removeAccessToken')
          window.location.reload()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.buttons {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-top: 10px;

  .button {
    margin: 0 4px;
    min-width: 180px;
  }
}
</style>
