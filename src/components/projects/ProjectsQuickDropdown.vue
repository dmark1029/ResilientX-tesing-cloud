<template>
  <div id="project-quick-dropdown">
    <VDropdown v-if="project" ref="dropdown" class="project-dropdown" spaced>
      <template #button="{ toggle }">
        <VAvatar
          size="small"
          :picture="project.logo"
          tabindex="0"
          @keydown.space.prevent="toggle"
          @click="toggleDropdown(toggle)"
        />
      </template>

      <template #content="{ close }">
        <div v-if="loading">
          <VLoader :active="true" size="small">
            <div style="height: 50px; margin: 50px" />
          </VLoader>
        </div>
        <div v-else>
          <a
            v-for="p in projects"
            :key="p.id"
            class="dropdown-item dropdown-block"
            :class="[p.id === project.id && 'is-active']"
            role="button"
            tabindex="0"
            @click="
              () => {
                selectProject(p)
                close()
              }
            "
          >
            <VAvatar size="small" :picture="p.logo" />

            <div class="meta">
              <span class="dark-inverted">{{ p.name }}</span>
              <span class="is-hidden-mobile"
                >{{ p.assets_count }} assets / {{ p.tasks_count }} scans</span
              >
            </div>
          </a>
        </div>

        <router-link
          :to="{ name: 'WorkspacesView', params: { id: project.workspace.id } }"
          class="dropdown-item dropdown-block"
          @click.capture="close"
        >
          View all projects
        </router-link>
        <router-link
          :to="{ name: 'Workspaces' }"
          class="dropdown-item dropdown-block"
          @click.capture="close"
        >
          View all workspaces
        </router-link>
      </template>
    </VDropdown>
  </div>

  <div id="project-quick-dropdown-title">
    <h1 class="title is-5 mb-0">
      {{ project?.name }}
    </h1>
    <small class="has-text-light">{{ project?.workspace?.name }}</small>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown, VAvatar },
  data() {
    return {
      loading: false,
      open: false,
      id: '',
      projects: [],
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  methods: {
    getProjects() {
      return axios
        .get(`/project?id=${this.project.workspace.id}&q=&filter=active&sort=viewed`)
        .then((res) => {
          this.id = this.project.id
          this.projects = res.data.data.splice(1)

          this.projects.length = Math.min(this.projects.length, 3)
        })
        .catch(() => {})
    },
    async toggleDropdown(toggle) {
      toggle()

      this.open = !this.open

      if (this.open) {
        if (!this.projects.length || this.id !== this.project.id) {
          this.loading = true
          await this.getProjects()
          this.loading = false
        }
      }
    },
    selectProject(project) {
      this.$store.commit('setProject', project)

      this.$router.push({
        name: 'ProjectOverview',
        params: { id: project.id },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@media only screen and (width <= 767px) {
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