<template>
  <VModal is="div" :open="showWizard" :title="title" size="big" @close="closeModal">
    <template #content>
      <WizardWorkspaceComponent v-if="!selectedWorkspace" @selected="workspaceSelected" />
      <!-- eslint-disable prettier-vue/prettier -->
		<WizardProjectComponent
        v-else-if="!selectedProject"
        :workspace="selectedWorkspace"
        @selected="projectSelected"
        @back="selectedWorkspace = null;title = 'Select workspace to launch scans'"
      />
      <WizardModuleComponent
        v-else-if="!selectedModule"
        :workspace="selectedWorkspace"
        @selected="moduleSelected"
        @back="selectedProject = null;title = 'Select project to launch scans'"
      />
      <WizardAssetComponent
        v-else-if="!selectedAssets.length"
        :project="selectedProject"
        :module="selectedModule"
        @selected="assetsSelected"
        @back="selectedModule = null;title = 'Select security app to launch scans'"
      />
      <WizardStartComponent
        v-else
        :workspace="selectedWorkspace"
        :project="selectedProject"
        :module="selectedModule"
        :assets="selectedAssets"
        @back="selectedAssets = [];title = 'Select assets to launch scans'"
        @close="closeModal"
      />
		<!--eslint-enable-->
      <div v-if="selectedWorkspace && !selectedAssets.length" class="modal-body pt-0">
        <hr class="mt-0" />
        <div class="breadcrumb-wrapper">
          <nav
            role="navigation"
            class="breadcrumb has-undefined-separator"
            aria-label="breadcrumbs"
            itemscope=""
            itemtype="https://schema.org/BreadcrumbList"
            center="true"
          >
            <ul>
              <li>
                <a
                  v-tooltip="`Selected workspace`"
                  class="router-link-active router-link-exact-active breadcrumb-item"
                >
                  <span>{{ selectedWorkspace.name }}</span>
                </a>
              </li>
              <li v-if="selectedProject">
                <a
                  v-tooltip="`Selected project`"
                  class="router-link-active router-link-exact-active breadcrumb-item"
                >
                  <span>{{ selectedProject.name }}</span>
                </a>
              </li>
              <li v-if="selectedModule">
                <a
                  v-tooltip="`Selected module`"
                  class="router-link-active router-link-exact-active breadcrumb-item"
                >
                  <span>{{ selectedModule.name }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import WizardWorkspaceComponent from './wizard/WizardWorkspaceComponent.vue'
import WizardProjectComponent from './wizard/WizardProjectComponent.vue'
import WizardModuleComponent from './wizard/WizardModuleComponent.vue'
import WizardAssetComponent from './wizard/WizardAssetComponent.vue'
import WizardStartComponent from './wizard/WizardStartComponent.vue'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    WizardStartComponent,
    WizardAssetComponent,
    WizardModuleComponent,
    WizardProjectComponent,
    WizardWorkspaceComponent,
  },
  data: () => ({
    form: new Form({}),
    selectedWorkspace: null,
    selectedProject: null,
    selectedModule: null,
    selectedAssets: [],
    title: '',
  }),
  computed: {
    ...mapGetters(['showWizard', 'project', 'workspace', 'module']),
  },
  watch: {
    showWizard(value) {
      if (value) {
        if (this.workspace) {
          this.workspaceSelected(this.workspace)
        }
        if (this.project) {
          this.projectSelected(this.project)
        }
        if (this.module) {
          if (this.workspace) {
            this.workspace.activeLicenses.forEach((license) => {
              if (this.module.id === license.module.id) {
                this.moduleSelected(this.module)
              }
            })
          }
        }
      }
    },
  },
  mounted() {
    this.title = 'Select workspace to launch scans'
  },
  methods: {
    workspaceSelected(item) {
      this.selectedWorkspace = item
      this.title = 'Select project to launch scans'
    },
    projectSelected(item) {
      this.selectedProject = item
      this.title = 'Select security app to launch scans'
    },
    moduleSelected(item) {
      this.selectedModule = item
      this.title = 'Select assets to launch scans'
    },
    assetsSelected(item) {
      this.selectedAssets = item
      this.title = 'Launch scans'
    },
    closeModal() {
      this.selectedWorkspace = null
      this.selectedProject = null
      this.selectedModule = null
      this.selectedAssets = []

      this.$store.dispatch('addShowWizard', false)
    },
  },
}
</script>
