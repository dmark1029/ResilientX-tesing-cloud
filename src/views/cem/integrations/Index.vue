<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div>
      <div class="user-grid user-grid-v4">
        <TransitionGroup
          name="list"
          tag="div"
          class="columns is-multiline is-flex-tablet-p is-half-tablet-p"
        >
          <!--Grid item-->
          <div
            v-for="integration in general.integrations"
            :key="integration.value"
            class="column is-flex is-3"
          >
            <div
              class="grid-item"
              @click="
                () => {
                  selectedIntegration = integration
                  title = integration.name
                  showModal = true
                }
              "
            >
              <VAvatar
                class="integration-avatar pt-3 pb-3"
                :picture="`/assets/integrations/` + integration.value + `.svg`"
                size="big"
              />
              <h3 class="dark-inverted">
                {{ integration.name }}
              </h3>
              <p>{{ integration.description }}</p>
              <div class="button-wrap has-has-text-centereded">
                <button type="button" class="button v-button mb-3 is-raised is-primary">
                  More details
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>

    <Modal
      v-if="showModal && project"
      :integration="selectedIntegration"
      :title="title"
      :project="project"
      @closeModal="hideModal"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Modal from '/@src/components/integrations/IntegrationsModal.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VBreadcrumb,
    VAvatar,
    Modal,
    VLoader,
  },
  props: ['project'],
  data: () => ({
    showModal: false,
    selectedIntegration: null,
    title: null,
  }),
  computed: {
    ...mapGetters(['general', 'loading']),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
  },
  async mounted() {
    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
      },
      {
        label: 'Workspaces',
        to: {
          name: 'Workspaces',
        },
      },
      {
        label: this.project.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.project.workspace.id },
        },
      },
      {
        label: this.project.name,
        to: {
          name: 'ProjectOverview',
          params: { id: this.project.id },
        },
      },
      {
        label: 'Integrations',
        to: {},
      },
    ]

    this.$store.dispatch('hideLoading')

    if (this.$route.query.open) {
      this.showModal = true
    }
  },
  methods: {
    hideModal() {
      this.showModal = false
      this.integration = null
    },
  },
  metaInfo() {
    return {
      title: this.project?.name + ' Integrations',
    }
  },
}
</script>

