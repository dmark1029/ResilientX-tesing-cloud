<script>
import { mapGetters } from 'vuex'
import { getCurrentManager } from 'vue-meta'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import ActivityPanel from '/@src/layouts/panel/ActivityPanel.vue'
import ProjectPanel from '/@src/layouts/panel/ProjectPanel.vue'
import ModulesQuickDropdown from '/@src/components/modules/ModulesQuickDropdown.vue'
import Sideblock from '/@src/components/navigation/desktop/Sideblock.vue'
import SideInner from '/@src/components/navigation/desktop/SideInner.vue'
import UserProfileDropdown from '/@src/components/UserProfileDropdown.vue'
import VViewWrapper from '/@src/components/base/layouts/VViewWrapper.vue'
import VPageContentWrapper from '/@src/components/base/layouts/VPageContentWrapper.vue'
import VPageContent from '/@src/components/base/layouts/VPageContent.vue'
import Navbar from '/@src/components/navigation/desktop/Navbar.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VMessage from '/@src/components/base/message/VMessage.vue'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import LicenseStatus from '/@src/components/licenses/LicenseStatus.vue'
import VendorSidebar from '/@src/layouts/sidebar/VendorSidebar.vue'
import CyberExposureSidebar from '/@src/layouts/sidebar/CyberExposureSidebar.vue'
import InnerSidebar from '/@src/layouts/sidebar/InnerSidebar.vue'
import NoProjectSidebar from '/@src/layouts/sidebar/NoProjectSidebar.vue'
import { UEM_PRODUCT, VRM_PRODUCT } from '/@src/models/constants'
import { axios } from '/@src/axios'
import RiskSidebar from '/@src/layouts/sidebar/RiskSidebar.vue'
import BetaMode from '/@src/components/BetaMode.vue'

export default {
  components: {
    BetaMode,
    NoProjectSidebar,
    RiskSidebar,
    VendorSidebar,
    CyberExposureSidebar,
    InnerSidebar,
    LicenseStatus,
    VProgress,
    VMessage,
    VLoader,
    Navbar,
    VPageContent,
    VPageContentWrapper,
    VViewWrapper,
    UserProfileDropdown,
    Sideblock,
    SideInner,
    ProjectPanel,
    ActivityPanel,
    ModulesQuickDropdown,
  },
  mixins: [permissionsMixin],
  props: {
    theme: {
      type: String,
      default: 'default',
    },
    closeOnChange: {
      type: Boolean,
      default: false,
    },
    openOnMounted: Boolean,
    nowrap: Boolean,
  },
  data() {
    return {
      // viewWrapper: useViewWrapper(),
      // panels: usePanels(),
      filter: null,
      displaySearch: false,
      route: this.$route,
      isDesktopSidebarOpen: localStorage.getItem('isDesktopSidebarOpen') || false,
      pageTitle: null,
      hide: false,
      UEM_PRODUCT,
      VRM_PRODUCT,
      id: '',
      projects: [],
      sidebarLink: '',
    }
  },
  computed: {
    ...mapGetters([
      'general',
      'user',
      'workspace',
      'project',
      'isMobile',
      'loading',
      'processing',
      'processingCount',
      'processingOriginalCount',
      'product',
    ]),
    manager() {
      return getCurrentManager()
    },
  },
  watch: {
    manager: {
      deep: true,
      handler() {
        this.pageTitle = this.manager.target.context.active.title
        if (this.project) {
          this.projectName = this.project.name
        }
      },
    },
    '$route.name'() {
      if (this.$route.name === 'Home') {
        this.isDesktopSidebarOpen = false
      }
      if (this.closeOnChange && this.isDesktopSidebarOpen) {
        this.isDesktopSidebarOpen = false
      }

      if (this.isMobile) {
        this.isDesktopSidebarOpen = false
      }
    },
    isDesktopSidebarOpen() {
      // used to resize charts in various widgets
      window.dispatchEvent(new Event('resize'))
    },
    '$route.fullPath'() {
      if (this.closeOnChange && this.isDesktopSidebarOpen) {
        this.isDesktopSidebarOpen = false
      }

      if (this.isMobile) {
        this.isDesktopSidebarOpen = false
      }
    },
  },
  mounted() {
    var width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (width > 767) {
      this.isDesktopSidebarOpen = localStorage.getItem('isDesktopSidebarOpen') === 'true'

      if (!this.project) {
        this.isDesktopSidebarOpen = false
      }
    }
    this.sidebarLink = ''
  },
  methods: {
    openDesktopSidebar(param) {
      this.sidebarLink = param
      this.isDesktopSidebarOpen = true
    },
    toggleSidebar() {
      console.log(this.sidebarLink)
      if (
        this.sidebarLink === 'risks' ||
        this.sidebarLink === 'inventory' ||
        this.sidebarLink === 'automations' ||
        this.sidebarLink === 'questionnaires' ||
        this.sidebarLink === 'companies'
      ) {
        this.isDesktopSidebarOpen = !this.isDesktopSidebarOpen
        localStorage.setItem('isDesktopSidebarOpen', this.isDesktopSidebarOpen)
      }
    },
    navigateTo(route) {
      this.$router.push(route)
    },

    editProfile() {
      this.$router.push({
        name: 'Profile',
        query: { view: 'personal' },
      })
    },
    changePassword() {
      this.$router.push({
        name: 'Profile',
        query: { view: 'password' },
      })
    },
    accessToken() {
      this.$router.push({
        name: 'Profile',
        query: { view: 'tokens' },
      })
    },
    sessions() {
      this.$router.push({
        name: 'Profile',
        query: { view: 'sessions' },
      })
    },
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

<template>
  <div class="sidebar-layout">
    <div class="app-overlay" />

    <Navbar :theme="theme">
      <template #title>
        <div class="brand">
          <ModulesQuickDropdown @click.stop.prevent="" />
        </div>

        <div class="separator" />
      </template>

      <!-- Custom navbar toolbar -->
      <template #toolbar>
        <ProjectPanel />
        <v-tooltip text="View workspaces" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-if="product === UEM_PRODUCT"
              v-bind="props"
              density="compact"
              class="v-button button project-button"
              @click="navigateTo({ name: 'Workspaces' })"
            >
              <img src="/images/icons/navbar/vuesax_linear_people.svg" alt="workspaces" />
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="View workspaces" location="bottom">
          <template #activator="{ props }">
            <v-btn
              v-if="product === VRM_PRODUCT"
              v-bind="props"
              class="v-button button project-button"
              @click="navigateTo({ name: 'VRMWorkspaces' })"
            >
              <img src="/images/icons/navbar/vuesax_linear_people.svg" alt="workspaces" />
            </v-btn>
          </template>
        </v-tooltip>

        <ActivityPanel v-if="product !== VRM_PRODUCT" />

        <div
          class="user-account is-flex is-justify-content-center is-align-items-center px-0"
          density="compact"
          @click="navigateTo({ name: 'Profile' })"
        >
          <v-btn id="profile-activator" class="select-profile" variant="text" border>
            <img src="/images/icons/navbar/frame.png" alt="user account" />
          </v-btn>

          <v-menu activator="#profile-activator">
            <v-list class="menu-list mt-1 pb-1">
              <v-list-item class="dropdown-block dropdown-item" tabindex="0">
                <div class="view-profile px-3 py-2">
                  <span>{{ user.name }}</span>
                  <span class="email">{{ user.email }}</span>
                </div>
              </v-list-item>
              <hr class="dropdown-divider" />
              <v-list-item
                class="dropdown-block sub-item"
                role="button"
                tabindex="0"
                @click="editProfile"
              >
                <div class="meta-project pl-4 is-flex is-align-items-end">
                  <img
                    src="/images/icons/navbar/vuesax-linear-user-edit.svg"
                    alt="edit your profile"
                  />
                  <span class="is-hidden-mobile is-two-thirds p-0 ml-3"
                    >Edit your profile</span
                  >
                </div>
              </v-list-item>
              <v-list-item
                class="dropdown-block sub-item"
                role="button"
                tabindex="0"
                @click="changePassword"
              >
                <div class="meta-project pl-4 is-flex is-align-items-end">
                  <img
                    src="/images/icons/navbar/editpassword.svg"
                    alt="change password"
                  />
                  <span class="is-hidden-mobile is-two-thirds p-0 ml-3"
                    >Change password</span
                  >
                </div>
              </v-list-item>
              <v-list-item
                class="dropdown-block sub-item"
                role="button"
                tabindex="0"
                @click="sessions"
              >
                <div class="meta-project pl-4 is-flex is-align-items-end">
                  <img src="/images/icons/navbar/sessions.svg" alt="access tokens" />
                  <span class="is-hidden-mobile is-two-thirds p-0 ml-3"
                    >Active sessions</span
                  >
                </div>
              </v-list-item>
              <v-list-item
                class="dropdown-block sub-item"
                role="button"
                tabindex="0"
                @click="accessToken"
              >
                <div class="meta-project pl-4 is-flex is-align-items-end">
                  <img src="/images/icons/navbar/accesstokens.svg" alt="access tokens" />
                  <span class="is-hidden-mobile is-two-thirds p-0 ml-3"
                    >Access tokens</span
                  >
                </div>
              </v-list-item>
              <v-list-item
                class="dropdown-block sub-item mb-2"
                role="button"
                tabindex="0"
                @click="logout"
              >
                <div class="meta-project pl-4 is-flex is-align-items-end">
                  <img
                    src="/images/icons/navbar/vuesax-linear-logout.svg"
                    alt="log out"
                  />
                  <span class="is-hidden-mobile is-two-thirds p-0 ml-3">Log out</span>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </Navbar>

    <SideInner>
      <template #header></template>
      <template #links>
        <InnerSidebar
          @toggle="isDesktopSidebarOpen = !isDesktopSidebarOpen"
          @close="
            () => {
              isDesktopSidebarOpen = false
              sidebarLink = ''
            }
          "
          @open="openDesktopSidebar"
        />
      </template>
    </SideInner>

    <Transition name="slide-x">
      <Sideblock v-if="isDesktopSidebarOpen" :theme="theme">
        <template #header> </template>
        <template #links>
          <template v-if="product === UEM_PRODUCT">
            <RiskSidebar v-if="sidebarLink === 'risks'" />
            <CyberExposureSidebar v-else @close="isDesktopSidebarOpen = false" />
          </template>
          <template v-else-if="product === VRM_PRODUCT">
            <VendorSidebar :title="sidebarLink" @close="isDesktopSidebarOpen = false" />
          </template>
          <NoProjectSidebar v-else />
        </template>
        <template #bottom-links>
          <UserProfileDropdown up />
        </template>
      </Sideblock>
    </Transition>

    <VViewWrapper :opened="isDesktopSidebarOpen">
      <VPageContentWrapper>
        <VPageContent class="is-relative">
          <div v-if="!hide && processing" class="is-relative processing-bar">
            <VMessage closable class="mb-0 mt-3" @close="hide = true">
              <p>
                <i class="fa fa-sync rotating mr-2"></i>
                We are in the process of gathering asset information. Kindly await as we
                conduct our scans.
                <small>Running {{ processingCount }} scans..</small>
              </p>
            </VMessage>
            <VProgress
              style="margin-top: -5px; position: relative"
              class="mb-0"
              :value="processingOriginalCount - processingCount"
              :max="processingOriginalCount"
              size="tiny"
              :color="`primary`"
            />
            <span
              class="new-indicator pulsate"
              style="
                position: absolute;
                top: 10px;
                left: 10px;
                inset-inline-end: 1px;
                display: block;
                width: 8px;
                height: 8px;
                border-radius: var(--radius-rounded);
                background: var(--danger);
              "
            />
          </div>

          <BetaMode />

          <LicenseStatus v-if="workspace" />

          <div class="page-title has-has-text-centereded">
            <!-- Sidebar Trigger -->
            <div
              class="vuero-hamburger nav-trigger push-resize"
              tabindex="0"
              role="button"
              @click="toggleSidebar()"
            >
              <span class="menu-toggle has-chevron">
                <span :class="[isDesktopSidebarOpen && 'active']" class="icon-box-toggle">
                  <span class="rotate">
                    <i
                      aria-hidden="true"
                      class="icon-line-top"
                      style="background: white"
                    />
                    <i
                      aria-hidden="true"
                      class="icon-line-center"
                      style="background: white"
                    />
                    <i
                      aria-hidden="true"
                      class="icon-line-bottom"
                      style="background: white"
                    />
                  </span>
                </span>
              </span>
            </div>

            <div class="title-wrap">
              <h1 class="title is-4">
                {{ pageTitle }}
              </h1>
            </div>
          </div>

          <slot />
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>

    <div v-if="loading" class="app-init-wrapper">
      <VLoader :active="true">
        <div />
      </VLoader>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-list {
  background: var(--sidebar-color) !important;
  box-shadow: none !important;
  padding-bottom: 0px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  min-width: 212px;

  .dropdown-divider {
    background: #434656;
  }
  .sub-item {
    display: flex !important;
  }
  .logout {
    button {
      background: var(--dark-primary) !important;
      width: 140px;
      letter-spacing: 1px !important;
      font-size: 14px;
    }
  }
}

.fixed-item {
  border-bottom-left-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}

.select-profile {
  padding: 0;
  width: 100%;
  height: 100% !important;
  border-radius: 50%;
}
.dropdown-block {
  display: block;
  min-height: 40px !important;

  &:hover {
    background: var(--dark-hover-color) !important;
  }

  .meta-project {
    &:hover {
      background: transparent;
    }
    span {
      padding: 10px 12px;
      font-family: Poppins;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.43;
      letter-spacing: 0.25px;
      text-align: left;
      color: #e1e1ef;
    }
  }

  .view-profile {
    margin-inline-start: 10px;
    display: grid;

    span {
      padding: 0;

      &:first-child {
        font-family: Poppins;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: 0.5px;
        text-align: left;
        color: var(--dark-table-text-color);
      }

      &:last-child {
        font-family: Poppins;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: 0.25px;
        text-align: left;
        color: var(--dark-table-sm-text-color);
      }
    }
  }
}

@media only screen and (width <=767px) {
  .dropdown-content .dropdown-block {
    display: flex;
    align-items: center;
    padding: 16px;
  }

  .meta {
    margin-left: 10px;
  }
}
</style>