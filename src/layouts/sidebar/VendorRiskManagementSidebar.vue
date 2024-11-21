<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'

export default {
  components: { VAvatar, VModal },
  mixins: [permissionsMixin],
  emits: ['close'],
  data: () => ({
    activeCompaniesDropdown: false,
    activeExposureDropdown: false,
    activeQuestionnairesDropdown: false,
    activeZapierDropdown: false,
    zapierModal: false,
  }),
  computed: {
    ...mapGetters([
      'user',
      'workspace',
      'general',
      'isOpened',
      'openedSide',
      'manageableVendors',
      'isMobile',
    ]),
  },

  async mounted() {
    await this.$router.isReady()

    this.activeCompaniesDropdown =
      this.$router.currentRoute.value.name === 'VendorsView' ||
      this.$router.currentRoute.value.name === 'VrmReports' ||
      this.$router.currentRoute.value.name === 'VendorsContacts' ||
      this.$router.currentRoute.value.name === 'VrmRemediationRequests'

    this.activeExposureDropdown =
      this.$router.currentRoute.value.name === 'VRMIssues' ||
      this.$router.currentRoute.value.name === 'VRMAssets' ||
      this.$router.currentRoute.value.name === 'VRMVulnerabilities' ||
      this.$router.currentRoute.value.name === 'VRMTechnologies' ||
      this.$router.currentRoute.value.name === 'VRMTyposquatting' ||
      this.$router.currentRoute.value.name === 'VRMSbom' ||
      this.$router.currentRoute.value.name === 'VRMEmailLeaksView' ||
      this.$router.currentRoute.value.name === 'VrmRiskMatrix' ||
      this.$router.currentRoute.value.name === 'VRMEvents'

    this.activeQuestionnairesDropdown =
      this.$router.currentRoute.value.name === 'VendorsQuestionnaires' ||
      this.$router.currentRoute.value.name === 'VendorsQuestionnairesTemplates' ||
      this.$router.currentRoute.value.name === 'VendorsQuestionnairesAnswers' ||
      this.$router.currentRoute.value.name === 'VendorsQuestionnairesRiskConfiguration'

    this.activeZapierDropdown =
      this.$router.currentRoute.value.name === 'VendorsInvites' ||
      this.$router.currentRoute.value.name === 'VendorsWorkflows'

    if (
      !this.activeExposureDropdown &&
      !this.activeCompaniesDropdown &&
      !this.activeQuestionnairesDropdown &&
      !this.activeZapierDropdown
    ) {
      this.activeCompaniesDropdown = true
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close')
    },
    toggleCompaniesDropdown() {
      this.activeCompaniesDropdown = !this.activeCompaniesDropdown
    },
    toggleExposureDropdown() {
      this.activeExposureDropdown = !this.activeExposureDropdown
    },
    toggleQuestionnairesDropdown() {
      this.activeQuestionnairesDropdown = !this.activeQuestionnairesDropdown
    },
    toggleZapierDropdown() {
      this.activeZapierDropdown = !this.activeZapierDropdown
    },
  },
}
</script>

<template>
  <template v-if="workspace.licenses_count">
    <li v-if="workspace">
      <router-link
        active-class="active"
        :to="{
          name: 'VendorOverview',
          params: { id: workspace.id },
        }"
        class="single-link"
      >
        Dashboard
      </router-link>
    </li>

    <li
      :class="[
        activeCompaniesDropdown
          ? 'collapse-links has-children active'
          : 'collapse-links has-children',
      ]"
    >
      <div class="collapse-wrap">
        <a tabindex="0" class="parent-link" @click="toggleCompaniesDropdown()">
          Companies
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            data-icon="feather:chevron-right"
            class="iconify rtl-hidden iconify--feather"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18l6-6l-6-6"
            ></path>
          </svg>
        </a>
      </div>
      <ul v-if="activeCompaniesDropdown" class="collapse-content">
        <li id="assets-link" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsView',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Suppliers
          </router-link>
        </li>
        <li id="assets-link" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsContacts',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Contacts
          </router-link>
        </li>
        <li id="assets-link" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VrmRemediationRequests',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('issues', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
            class="is-submenu"
          >
            Remediation Requests
          </router-link>
        </li>
        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMReports',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('issues', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Reports
          </router-link>
        </li>
        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMSupplyChain',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('issues', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Supply Chain
          </router-link>
        </li>
      </ul>
    </li>

    <li
      :class="[
        activeExposureDropdown
          ? 'collapse-links has-children active'
          : 'collapse-links has-children',
      ]"
    >
      <div class="collapse-wrap">
        <a tabindex="0" class="parent-link" @click="toggleExposureDropdown()">
          Cyber Posture
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            data-icon="feather:chevron-right"
            class="iconify rtl-hidden iconify--feather"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18l6-6l-6-6"
            ></path>
          </svg>
        </a>
      </div>
      <ul v-if="activeExposureDropdown" class="collapse-content">
        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMIssues',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('issues', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Issues
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMAssets',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('issues', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Third-Party Assets
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMVulnerabilities',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('scans', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
            @click="closeSidebar"
          >
            CVE
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMTechnologies',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('scans', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Technologies
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMSbom',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('scans', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            SBOM
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMTyposquatting',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('scans', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
            @click="closeSidebar"
          >
            Typosquatting
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMEmailLeaksView',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('scans', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
            @click="closeSidebar"
          >
            Credential leaks
          </router-link>
        </li>

        <li v-if="workspace" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VRMEvents',
              params: { id: workspace.id },
            }"
            :class="
              canPerformAction('events', 'view') ? 'is-submenu' : 'is-submenu is-disabled'
            "
          >
            Events
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VrmRiskMatrix',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Risk Configuration
          </router-link>
        </li>
      </ul>
    </li>

    <li
      :class="[
        activeQuestionnairesDropdown
          ? 'collapse-links has-children active'
          : 'collapse-links has-children',
      ]"
    >
      <div class="collapse-wrap">
        <a tabindex="0" class="parent-link" @click="toggleQuestionnairesDropdown()">
          Questionnaires
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            data-icon="feather:chevron-right"
            class="iconify rtl-hidden iconify--feather"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18l6-6l-6-6"
            ></path>
          </svg>
        </a>
      </div>
      <ul v-if="activeQuestionnairesDropdown" class="collapse-content">
        <li class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsQuestionnaires',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            List
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsQuestionnairesAnswers',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Answers
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsQuestionnairesTemplates',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Templates
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsQuestionnairesRiskConfiguration',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Risk Configuration
          </router-link>
        </li>
      </ul>
    </li>

    <li
      :class="[
        activeZapierDropdown
          ? 'collapse-links has-children active'
          : 'collapse-links has-children',
      ]"
    >
      <div class="collapse-wrap">
        <a tabindex="0" class="parent-link" @click="toggleZapierDropdown()">
          Automations
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            data-icon="feather:chevron-right"
            class="iconify rtl-hidden iconify--feather"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m9 18l6-6l-6-6"
            ></path>
          </svg>
        </a>
      </div>
      <ul v-if="activeZapierDropdown" class="collapse-content">
        <li id="assets-link" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsInvites',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Onboarding
          </router-link>
        </li>

        <li id="assets-link" class="nav-item">
          <router-link
            active-class="active"
            :to="{
              name: 'VendorsWorkflows',
              params: { id: workspace.id },
            }"
            class="is-submenu"
          >
            Workflows
          </router-link>
        </li>

        <li id="assets-link" class="nav-item">
          <a
            :class="
              zapierModal ? 'is-submenu active router-link-exact-active' : 'is-submenu'
            "
            @click="zapierModal = true"
          >
            Integrations
          </a>
        </li>
      </ul>
    </li>

    <VModal
      is="div"
      :open="zapierModal"
      title="Integrations"
      size="big"
      :noscroll="true"
      @close="zapierModal = false"
    >
      <template #content>
        <div class="p-5 has-text-centered">
          <VAvatar
            class="integration-avatar pt-3 pb-3"
            :picture="`/assets/integrations/zapier.svg`"
            size="big"
          />

          <p class="mb-5">
            Integrate ResilientX TPRM with leading tools via Zapier.<br />
            Integration requires you to generate long lived personal access token in
            <router-link to="/profile">profile section.</router-link>
          </p>
          <a
            href="https://zapier.com/apps/resilientx/integrations"
            target="_blank"
            class="button v-button is-primary"
            >Add integration</a
          >
        </div>
      </template>
    </VModal>
  </template>
  <template v-else>
    <li>
      <a>No license found.</a>
    </li>
  </template>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
