<template>
  <div v-if="product !== VRM_PRODUCT" class="centered-drop">
    <v-btn
      id="project-panel-activator"
      class="select-project2"
      variant="text"
      border
      @click="toggleDropdown()"
    >
      {{ project ? project.name : 'Select a project' }}
      <i v-if="open" class="fa fa-chevron-up"></i>
      <i v-else class="fa fa-chevron-down"></i>
    </v-btn>

    <v-menu activator="#project-panel-activator">
      <v-list
        class="menu-list mt-1"
        :style="
          latestProjects.length > 3 ? { maxHeight: '130px', overflowY: 'auto' } : {}
        "
        style="width: 180px"
      >
        <v-list-item
          v-for="p in latestProjects"
          :key="p.id"
          class="dropdown-block dropdown-item"
          role="button"
          tabindex="0"
          @click="
            () => {
              selectProject(p.id)
            }
          "
        >
          <div
            class="meta-project is-flex is-justify-content-space-between is-align-items-center"
          >
            <span class="dark-inverted">{{ p.name }}</span>
            <span v-if="p.id === selectedProject">
              <i class="fa fa-check"></i>
            </span>
          </div>
        </v-list-item>
      </v-list>
      <div class="fixed-item menu-list">
        <hr class="dropdown-divider" />
        <v-list-item class="dropdown-block sub-item" role="button" tabindex="0">
          <div class="meta-project pl-4 is-flex is-align-items-end" @click="addProject">
            <img src="/images/icons/navbar/add.svg" alt="add a project" />
            <span class="is-hidden-mobile is-two-thirds p-0 ml-3">Add a project</span>
          </div>
        </v-list-item>
        <v-list-item
          class="dropdown-block sub-item"
          :class="project ? '' : 'is-disabled'"
          role="button"
          tabindex="0"
        >
          <div
            class="meta-project pl-4 is-flex is-align-items-end"
            :style="{ cursor: project ? '' : 'not-allowed' }"
            @click="showAllProjects"
          >
            <img
              src="/images/icons/navbar/vuesax_linear_eye.svg"
              alt="view all projects"
            />
            <span class="is-hidden-mobile is-two-thirds p-0 ml-3">View all projects</span>
          </div>
        </v-list-item>
      </div>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { VRM_PRODUCT } from '/@src/models/constants'

export default {
  mixins: [permissionsMixin],
  data: () => ({
    open: false,
    projects: [],
    selectedProject: '',
    id: null,
    VRM_PRODUCT,
  }),
  computed: {
    ...mapGetters(['project', 'workspace', 'product', 'latestProjects']),
  },
  mounted() {
    if (this.project) {
      this.selectedProject = this.project.id
      this.projects = {
        [this.project.id]: this.project.name,
      }
    }
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open
    },
    addProject() {
      this.$router.push({
        name: 'OnboardingProject',
      })
    },
    showAllProjects() {
      this.$store.commit('setProject', null)
      const mappedRoute = this.mapRoute()
      if (mappedRoute) {
        this.$router.push(mappedRoute)
      } else {
        this.$router.push({
          name: 'WorkspaceOverview',
          params: { id: this.workspace.id },
        })
      }
    },
    selectProject(id) {
      if (id) {
        this.$store.dispatch('addProject', id)

        const mappedRoute = this.mapRoute(id)

        if (mappedRoute) {
          this.$router.push(mappedRoute)
        } else {
          this.$router.push({
            name: 'ProjectOverview',
            params: { id: id },
          })
        }
      }
    },
    mapRoute(projectId = null) {
      // AI

      const currentRoute = this.$route.name

      if (projectId) {
        // switching workspace to project

        if (currentRoute === 'WorkspaceOverview') {
          return {
            name: 'ProjectOverview',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceReportsView') {
          return {
            name: 'ProjectReportsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetsView') {
          return {
            name: 'ProjectAssetsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetsView') {
          return {
            name: 'ProjectAssetsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetsView') {
          return {
            name: 'ProjectAssetsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetsView') {
          return {
            name: 'ProjectAssetsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCollectionsView') {
          return {
            name: 'ProjectCollectionsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceIssuesView') {
          return {
            name: 'ProjectIssuesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceEventsView') {
          return {
            name: 'ProjectEventsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExVulnerabilitiesView') {
          return {
            name: 'CyberExVulnerabilitiesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExEmailLeaksView') {
          return {
            name: 'CyberExEmailLeaksView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetDomainsView') {
          return {
            name: 'ProjectAssetDomainsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetSubdomainsView') {
          return {
            name: 'ProjectAssetSubdomainsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceAssetIPsView') {
          return {
            name: 'ProjectAssetIPsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExTechnologiesView') {
          return {
            name: 'CyberExTechnologiesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExPortsView') {
          return {
            name: 'CyberExPortsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExCertificatesView') {
          return {
            name: 'CyberExCertificatesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceCyberExTyposquattingView') {
          return {
            name: 'CyberExTyposquattingView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'WorkspaceOverviewCloud') {
          return {
            name: 'ProjectOverviewCloud',
            params: { id: projectId },
          }
        }

        // switching project to project

        if (currentRoute === 'ProjectOverview') {
          return {
            name: 'ProjectOverview',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectReportsView') {
          return {
            name: 'ProjectReportsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectOverviewCloud') {
          return {
            name: 'ProjectOverviewCloud',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectAssetsView') {
          return {
            name: 'ProjectAssetsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectCollectionsView') {
          return {
            name: 'ProjectCollectionsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectIssuesView') {
          return {
            name: 'ProjectIssuesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectEventsView') {
          return {
            name: 'ProjectEventsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExVulnerabilitiesView') {
          return {
            name: 'CyberExVulnerabilitiesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExEmailLeaksView') {
          return {
            name: 'CyberExEmailLeaksView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectAssetDomainsView') {
          return {
            name: 'ProjectAssetDomainsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectAssetSubdomainsView') {
          return {
            name: 'ProjectAssetSubdomainsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'ProjectAssetIPsView') {
          return {
            name: 'ProjectAssetIPsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExTechnologiesView') {
          return {
            name: 'CyberExTechnologiesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExPortsView') {
          return {
            name: 'CyberExPortsView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExCertificatesView') {
          return {
            name: 'CyberExCertificatesView',
            params: { id: projectId },
          }
        }

        if (currentRoute === 'CyberExTyposquattingView') {
          return {
            name: 'CyberExTyposquattingView',
            params: { id: projectId },
          }
        }
      } else {
        // switching project to workspace

        if (currentRoute === 'ProjectOverview') {
          return {
            name: 'WorkspaceOverview',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectReportsView') {
          return {
            name: 'WorkspaceReportsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectOverviewCloud') {
          return {
            name: 'WorkspaceOverviewCloud',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectAssetsView') {
          return {
            name: 'WorkspaceAssetsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectCollectionsView') {
          return {
            name: 'WorkspaceCollectionsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectIssuesView') {
          return {
            name: 'WorkspaceIssuesView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectEventsView') {
          return {
            name: 'WorkspaceEventsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExVulnerabilitiesView') {
          return {
            name: 'WorkspaceCyberExVulnerabilitiesView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExEmailLeaksView') {
          return {
            name: 'WorkspaceCyberExEmailLeaksView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectAssetDomainsView') {
          return {
            name: 'WorkspaceAssetDomainsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectAssetSubdomainsView') {
          return {
            name: 'WorkspaceAssetSubdomainsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'ProjectAssetIPsView') {
          return {
            name: 'WorkspaceAssetIPsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExTechnologiesView') {
          return {
            name: 'WorkspaceCyberExTechnologiesView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExPortsView') {
          return {
            name: 'WorkspaceCyberExPortsView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExCertificatesView') {
          return {
            name: 'WorkspaceCyberExCertificatesView',
            params: { id: this.workspace.id },
          }
        }

        if (currentRoute === 'CyberExTyposquattingView') {
          return {
            name: 'WorkspaceCyberExTyposquattingView',
            params: { id: this.workspace.id },
          }
        }
      }

      return null
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-list {
  background: var(--sidebar-color) !important;
  box-shadow: none !important;
  padding-bottom: 0px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;

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