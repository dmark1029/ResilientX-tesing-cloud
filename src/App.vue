<template>
  <div>
    <!-- Modal for Mobile Users -->
    <div v-if="isMobile && !allowAccess" class="modal-overlay">
      <div class="modal-content-mobile">
        <img
          src="/images/icons/navbar/desktop_version_tablet.png"
          alt="desktop version only for tablet"
        />
        <p class="desktop-version desktop-only">Desktop version only</p>
        <p class="desktop-version desktop-only-description">
          Please use a desktop for the best experience.
        </p>
      </div>
    </div>

    <div v-if="isTablet && !allowAccess" class="modal-overlay">
      <div class="modal-content-tablet">
        <img
          src="/images/icons/navbar/desktop_version_tablet.png"
          alt="desktop version only for tablet"
        />
        <p class="desktop-version desktop-only">Desktop version only</p>
        <p class="desktop-version desktop-only-description">
          Please use a desktop for the best experience.
        </p>
      </div>
    </div>

    <!-- Main Application Content -->
    <div v-if="(!isMobile && !isTablet) || allowAccess">
      <metainfo>
        <template #title="{ content }"> {{ content }} - {{ suffix }} </template>
      </metainfo>
      <div v-if="loading">
        <Transition name="fade-slow" mode="out-in">
          <div v-if="loading" class="app-init-wrapper">
            <VLoader :active="true">
              <div />
            </VLoader>
          </div>
        </Transition>
      </div>
      <div v-else-if="$route.meta.layout === 'app'">
        <AppLayout theme="labels">
          <Suspense>
            <RouterView v-slot="{ Component }" :key="$route.path">
              <Transition name="translate-page-x" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </AppLayout>
      </div>
      <div v-else-if="$route.meta.layout === 'minimal'">
        <MinimalLayout>
          <Suspense>
            <RouterView v-slot="{ Component }" :key="$route.path">
              <Transition name="fade-slow" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </MinimalLayout>
      </div>
      <div v-else-if="$route.meta.layout === 'auth'">
        <AuthLayout>
          <Suspense>
            <RouterView v-slot="{ Component }" :key="$route.path">
              <Transition name="fade-slow" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </AuthLayout>
      </div>
      <div v-else-if="$route.meta.layout === 'notfound'">
        <AuthLayout>
          <Suspense>
            <RouterView v-slot="{ Component }" :key="$route.path">
              <Transition name="fade-slow" mode="out-in">
                <component :is="Component" />
              </Transition>
            </RouterView>
          </Suspense>
        </AuthLayout>
      </div>

      <IdleComponent />

      <div v-if="alert" class="alert-fixed">
        <VSnack
          :title="alert"
          :color="alertType"
          white
          solid
          icon="fas fa-thermometer-half"
        >
          <i class="fa fa-times" @click="$store.dispatch('addAlert', null)" />
        </VSnack>
      </div>
    </div>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import { mapGetters } from 'vuex'
import { axios } from './axios'
import Translation from './helpers/translation'
import AppLayout from './layouts/AppLayout.vue'
import IdleComponent from './components/IdleComponent.vue'
import MinimalLayout from './layouts/MinimalLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import VLoader from './components/base/loader/VLoader.vue'
import VSnack from './components/base/snack/V-Snack.vue'

export default {
  components: {
    MinimalLayout,
    IdleComponent,
    AppLayout,
    RouterView,
    AuthLayout,
    VLoader,
    VSnack,
  },
  data() {
    return {
      filtered: [],
      loading: true,
      q: null,
      suffix: '',
      isMobile: false,
      isTablet: false,
      allowAccess: false,
      screenWidth: window.innerWidth,
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'user',
      'theme',
      'bodyClass',
      'general',
      'alert',
      'alertType',
    ]),
  },
  watch: {
    screenWidth(newWidth) {
      this.checkDeviceType()
    },
    bodyClass(data) {
      document.body.className = data
    },
  },
  async mounted() {
    this.checkDeviceType()
    window.addEventListener('resize', this.updateScreenWidth)
    if (!this.isMobile || this.allowAccess) {
      await this.initApp()
      this.loading = false
      this.clarityJavascript()
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenWidth)
  },
  methods: {
    updateScreenWidth() {
      this.screenWidth = window.innerWidth
    },
    checkDeviceType() {
      this.isMobile = this.screenWidth < 360
      this.isTablet = this.screenWidth >= 360 && this.screenWidth < 1024
    },
    async initApp() {
      return new Promise((resolve) => {
        if (import.meta.env.VITE_MAINTENANCE_MODE === 'true') {
          const urlParams = new URLSearchParams(window.location.search)

          if (urlParams.get('token') !== import.meta.env.VITE_MAINTENANCE_BY_PASS_TOKEN) {
            this.$router.push({ name: 'Maintenance' })
            resolve()
            return
          }
        }

        axios
          .get('/general')
          .then((res) => {
            const { data } = res.data
            Translation.switchLanguage(Translation.getLanguage(), data.translations)
            this.$store.dispatch('addGeneral', data)

            this.$store.dispatch('addIsMobile', window.screen.width < 767)

            if (data.settings === null) {
              this.$router.push({ name: 'NotFound' })
            }

            this.suffix = this.general.settings.title
          })
          .catch(() => {
            this.$router.push({ name: 'Error' })
          })
          .finally(() => {
            resolve()
          })
      })
    },
    clarityJavascript() {
      let id = import.meta.env.VITE_CLARITY_ID
      if (id) {
        let clarityScript = document.createElement('script')
        clarityScript.textContent =
          '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "' +
          id +
          '");'
        document.head.appendChild(clarityScript)
      }
    },
  },
  metaInfo() {
    return {
      link: [{ rel: 'icon', href: this.general?.settings?.logo?.favicon ?? '' }],
    }
  },
}
</script>

<style scoped lang="scss">
.desktop-version {
  font-family: Poppins;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000b3b;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content-tablet {
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    position: absolute;
    top: 160px;

    img {
      height: 160px;
    }
    .desktop-only {
      margin-top: 40px;
      font-size: 32px;
      font-weight: 600;
      line-height: 1.2;
    }

    .desktop-only-description {
      margin-top: 20px;
      font-size: 18px;
      line-height: 1.5;
    }
  }

  .modal-content-mobile {
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    position: absolute;
    top: 160px;

    img {
      height: 84px;
    }
    .desktop-only {
      margin-top: 24px;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.33;
    }

    .desktop-only-description {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}
</style>