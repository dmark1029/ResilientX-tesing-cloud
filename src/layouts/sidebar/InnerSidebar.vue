<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'
import { UEM_PRODUCT } from '/@src/models/constants'

export default {
  mixins: [permissionsMixin],
  emits: ['close', 'toggle', 'open'],
  data: () => ({
    activeAssetsDropdown: false,
    sidebarButtons: [
      { src: '/images/icons/navbar/house.svg', alt: 'house', text: 'Home' },
      { src: '/images/icons/navbar/dashboard.svg', alt: 'dashboard', text: 'Dashboard' },
      { src: '/images/icons/navbar/inventory.svg', alt: 'inventory', text: 'Inventory' },
      { src: '/images/icons/navbar/issues.svg', alt: 'danger', text: 'Issues' },
      { src: '/images/icons/navbar/reports.svg', alt: 'reports', text: 'Reports' },
      { src: '/images/icons/navbar/risks.svg', alt: 'risks', text: 'Risks' },
      {
        src: '/images/icons/navbar/integration.svg',
        alt: 'integration',
        text: 'Integration',
      },
      { src: '/images/icons/navbar/setting.svg', alt: 'setting', text: 'Setting' },
      { src: '/images/icons/navbar/manage.svg', alt: 'manage', text: 'Management' },
      { src: '/images/icons/navbar/support.svg', alt: 'support', text: 'Support' },
    ],
    activeSidebarButtons: [
      { src: '/images/icons/navbar/vuesax_linear_house.svg', alt: 'house', text: 'Home' },
      {
        src: '/images/icons/navbar/vuesax_bold_dashboard.svg',
        alt: 'dashboard',
        text: 'Dashboard',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_shield-tick.svg',
        alt: 'inventory',
        text: 'Inventory',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_danger.svg',
        alt: 'danger',
        text: 'Issues',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_presention-chart.svg',
        alt: 'reports',
        text: 'Reports',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_lock-slash.svg',
        alt: 'risks',
        text: 'Risks',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_programming-arrows.svg',
        alt: 'integration',
        text: 'Integration',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_setting-2.svg',
        alt: 'setting',
        text: 'Setting',
      },
      {
        src: '/images/icons/navbar/vuesax-bold-lock-tick.svg',
        alt: 'management',
        text: 'Management',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_message-question.svg',
        alt: 'support',
        text: 'Support',
      },
    ],
    tprmSidebarButtons: [
      { src: '/images/icons/navbar/house.svg', alt: 'house', text: 'Home' },
      { src: '/images/icons/navbar/dashboard.svg', alt: 'dashboard', text: 'Dashboard' },
      {
        src: '/images/icons/navbar/vuesax_linear_company.svg',
        alt: 'companies',
        text: 'Companies',
      },
      {
        src: '/images/icons/navbar/vuesax_linear_task-square.svg',
        alt: 'questionnaires',
        text: 'Questionnaires',
      },
      {
        src: '/images/icons/navbar/vuesax_linear_play-cricle.svg',
        alt: 'automation',
        text: 'Automations',
      },
      { src: '/images/icons/navbar/setting.svg', alt: 'setting', text: 'Setting' },
      { src: '/images/icons/navbar/support.svg', alt: 'support', text: 'Support' },
    ],
    tprmActiveSidebarButtons: [
      { src: '/images/icons/navbar/vuesax_linear_house.svg', alt: 'house', text: 'Home' },
      {
        src: '/images/icons/navbar/vuesax_bold_dashboard.svg',
        alt: 'dashboard',
        text: 'Dashboard',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_company.svg',
        alt: 'companies',
        text: 'Companies',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_task-square.svg',
        alt: 'questionnaires',
        text: 'Questionnaires',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_play-cricle.svg',
        alt: 'automation',
        text: 'Automations',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_setting-2.svg',
        alt: 'setting',
        text: 'Setting',
      },
      {
        src: '/images/icons/navbar/vuesax_bold_message-question.svg',
        alt: 'support',
        text: 'Support',
      },
    ],
    activeIndex: null,
    UEM_PRODUCT,
  }),
  computed: {
    ...mapGetters([
      'user',
      'workspace',
      'project',
      'product',
      'general',
      'isOpened',
      'openedSide',
      'isMobile',
    ]),
    filteredSidebarButtons() {
      return this.product === this.UEM_PRODUCT ? this.sidebarButtons : []
    },
    filteredTprmSidebarButtons() {
      return this.product !== this.UEM_PRODUCT ? this.tprmSidebarButtons : []
    },
  },
  watch: {
    filteredSidebarButtons(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.activeIndex = 0
      }
    },
    filteredTprmSidebarButtons(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.activeIndex = 0
      }
    },
  },
  async mounted() {
    await this.$router.isReady()
    const savedIndex = localStorage.getItem('activeSidebarIndex')
    if (savedIndex !== null) {
      this.activeIndex = parseInt(savedIndex, 10)
    }
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggle')
    },
    selectButton(button, index) {
      if (button.text === 'Integration' && !this.project?.id) {
        return
      }
      localStorage.setItem('activeSidebarIndex', index)
      this.activeIndex = index
      this.$emit('close')
      switch (button.text) {
        case 'Home':
          this.$router.push({
            name: 'Home',
          })
          break
        case 'Issues':
          if (this.project?.id) {
            this.$router.push({
              name: 'ProjectIssuesView',
              params: { id: this.project?.id },
            })
          } else {
            this.$router.push({
              name: 'WorkspaceIssuesView',
              params: { id: this.workspace.id },
            })
          }
          break
        case 'Inventory':
          this.$emit('open', 'inventory')
          break
        case 'Reports':
          if (this.project?.id) {
            this.$router.push({
              name: 'ProjectReportsView',
              params: { id: this.project?.id },
            })
          } else {
            this.$router.push({
              name: 'WorkspaceReportsView',
              params: { id: this.workspace.id },
            })
          }
          break
        case 'Risks':
          this.$emit('open', 'risks')
          break
        case 'Integration':
          if (this.project?.id) {
            this.$router.push({
              name: 'ProjectIntegrationsView',
              params: { id: this.project?.id },
            })
          }
          break
        case 'Setting':
          this.$router.push({
            name: 'WorkspaceUsersView',
            params: { id: this.workspace?.id },
          })
          break
        case 'Management':
          this.$router.push({
            name: 'Manage',
          })
          break
        case 'Dashboard':
          if (this.project?.id) {
            this.$router.push({
              name: 'ProjectOverview',
              params: { id: this.project?.id },
            })
          } else {
            this.$router.push({
              name: 'WorkspaceOverview',
              params: { id: this.workspace.id },
            })
          }
          break
        case 'Support':
          this.$router.push({
            name: 'Support',
            params: { id: this.workspace.id },
          })
          break
        default:
          console.warn(`No route defined for button text: ${button.text}`)
      }
    },
    selectTPRMButton(button, index) {
      this.activeIndex = index
      switch (button.text) {
        case 'Home':
          this.$router.push({
            name: 'Home',
          })
          this.$emit('close')
          break
        case 'Dashboard':
          this.$router.push({
            name: 'VendorOverview',
            params: { id: this.workspace.id },
          })
          this.$emit('close')
          break
        case 'Companies':
          this.$emit('open', 'companies')
          break
        case 'Questionnaires':
          this.$emit('open', 'questionnaires')
          break
        case 'Automations':
          this.$emit('open', 'automations')
          break
        case 'Setting':
          this.$router.push({
            name: 'WorkspaceSettingsView',
            params: { id: this.workspace.id },
          })
          this.$emit('close')
          break
        case 'Support':
          this.$router.push({
            name: 'Support',
            params: { id: this.workspace.id },
          })
          this.$emit('close')
          break
        default:
          console.warn(`No route defined for button text: ${button.text}`)
      }
    },
    getButtonSrc(index) {
      if (this.activeIndex === index) {
        return this.product === UEM_PRODUCT
          ? this.activeSidebarButtons[index].src
          : this.tprmActiveSidebarButtons[index].src
      } else {
        return this.product === UEM_PRODUCT
          ? this.sidebarButtons[index].src
          : this.tprmSidebarButtons[index].src
      }
    },
  },
}
</script>

<template>
  <div :class="`drop-menu ` + user.type.toLowerCase()">
    <div
      class="is-flex is-justify-content-center is-align-items-center three-line-menu"
      @click="toggleSidebar"
    >
      <img src="/images/icons/navbar/drop-menu.png" alt="brand" />
    </div>
    <ul class="has-slimscroll">
      <li
        v-for="(button, index) in filteredSidebarButtons"
        :key="index"
        :class="
          button.text === 'Integration' && !project
            ? 'not-allowed'
            : '' + 'link-' + button.text.toLowerCase()
        "
      >
        <v-btn
          role="button"
          :class="button.text === 'Integration' && !project ? 'not-allowed' : ''"
          @click="selectButton(button, index)"
        >
          <img
            :src="getButtonSrc(index)"
            :alt="button.alt"
            :class="{ 'active-img': activeIndex === index }"
          />
        </v-btn>
        <span class="menu-item">{{ button.text }}</span>
        <v-tooltip
          v-if="button.text === 'Integration' && !project"
          activator="parent"
          location="end"
          >No project selected.</v-tooltip
        >
      </li>
      <li
        v-for="(button, index) in filteredTprmSidebarButtons"
        :key="index"
        :style="
          button.alt === 'support' ? 'position: absolute; bottom: 110px; left: 29px;' : ''
        "
      >
        <v-btn role="button" @click="selectTPRMButton(button, index)">
          <img
            :src="getButtonSrc(index)"
            :alt="button.alt"
            :class="{ 'active-img': activeIndex === index }"
          />
        </v-btn>
        <span class="menu-item">{{ button.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';

.sidebar-inner .sidebar-inner-body .drop-menu ul li {
  &.link-management {
    display: none;
  }
}

.sidebar-inner .sidebar-inner-body .drop-menu.licensemanager ul li {
  &.link-management {
    display: flex;
  }
}
</style>
