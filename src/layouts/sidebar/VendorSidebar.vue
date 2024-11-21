<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: { VModal },
  mixins: [permissionsMixin],
  props: ['title'],
  emits: ['close'],
  data: () => ({
    zapierModal: false,
  }),
  computed: {
    ...mapGetters([
      'user',
      'workspace',
      'project',
      'general',
      'isOpened',
      'openedSide',
      'isMobile',
    ]),
    isActiveRoute() {
      return (routeName) =>
        this.$route.name === routeName && this.$route.params.id === this.workspace.id
    },
  },
  async mounted() {
    await this.$router.isReady()
  },
}
</script>

<template>
  <template v-if="workspace.licenses_count">
    <template v-if="(workspace && title === 'companies') || (workspace && title === '')">
      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VendorsView',
            params: { id: workspace.id },
          }"
          class="single-link"
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
          class="single-link"
        >
          Contacts
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VrmRemediationRequests',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Remediation Requests
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VRMReports',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Reports
        </router-link>
      </li>
    </template>

    <template v-if="workspace && title === 'questionnaires'">
      <li class="nav-item">
        <router-link
          :class="{ 'active-link': isActiveRoute('VendorsQuestionnaires') }"
          :to="{
            name: 'VendorsQuestionnaires',
            params: { id: workspace.id },
          }"
          class="single-link"
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
          class="single-link"
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
          class="single-link"
        >
          Template
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VendorsQuestionnairesRiskConfiguration',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Risk Configuration
        </router-link>
      </li>
    </template>
    <template v-if="workspace && title === 'automations'">
      <li id="assets-link" class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VendorsInvites',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Onboarding
        </router-link>
      </li>

      <li class="nav-item">
        <router-link
          active-class="active"
          :to="{
            name: 'VendorsWorkflows',
            params: { id: workspace.id },
          }"
          class="single-link"
        >
          Workflows
        </router-link>
      </li>

      <li class="nav-item">
        <a
          class="single-link"
          :class="
            zapierModal ? 'is-submenu active router-link-exact-active' : 'is-submenu'
          "
          @click="zapierModal = true"
        >
          Integrations
        </a>
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
  </template>
  <template v-else>
    <li>
      <a>No license found.</a>
    </li>
  </template>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
.active-link {
  background-color: var(--dark-table-color);
}
</style>
