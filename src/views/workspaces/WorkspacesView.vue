<template>
  <div>
    <div class="page-content-inner">
      <div>
        <div class="tile-grid-toolbar mb-5">
          <VControl icon="fa fa-search">
            <input
              v-model="search"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>

          <VDropdown
            :icon="filter !== 'all' ? 'fa fa-filter has-text-primary' : 'fa fa-filter'"
          >
            <template #content>
              <a href="#" class="dropdown-item" @click.prevent.stop="filterData('all')">
                {{ $t('All') }}
              </a>
              <a
                href="#"
                :class="filter === 'active' ? 'dropdown-item is-active' : 'dropdown-item'"
                @click.prevent.stop="filterData('active')"
              >
                {{ $t('Active') }}
              </a>
              <a
                href="#"
                :class="
                  filter === 'disabled' ? 'dropdown-item is-active' : 'dropdown-item'
                "
                @click.prevent.stop="filterData('disabled')"
              >
                {{ $t('Archived') }}
              </a>
              <a
                href="#"
                :class="
                  filter === 'favorite' ? 'dropdown-item is-active' : 'dropdown-item'
                "
                @click.prevent.stop="filterData('favorite')"
              >
                {{ $t('Favorite') }}
              </a>
            </template>
          </VDropdown>

          <VDropdown
            :icon="searchTags.length ? 'fa fa-tags has-text-primary' : 'fa fa-tags'"
          >
            <template #content>
              <div class="pt-1 pl-3 pr-3 pb-1">
                <span v-if="tags.length">
                  <span
                    v-for="tag in tags"
                    :key="tag"
                    :class="
                      searchTags.includes(tag.id)
                        ? 'tag is-primary elevated is-clickable mr-2 mb-2'
                        : 'tag is-primary is-outlined is-clickable mr-2 mb-2'
                    "
                    @click="filterTag(tag.id)"
                    >{{ tag.name }}</span
                  >
                </span>
                <span v-else>-</span>
              </div>
            </template>
          </VDropdown>

          <div v-if="canPerformAction('projects', 'create')" class="buttons">
            <router-link
              :to="{ name: 'OnboardingProject' }"
              :class="
                licenseCanCreateProject()
                  ? 'button v-button is-raised is-primary'
                  : 'button v-button is-raised is-primary is-disabled'
              "
            >
              <span class="icon">
                <i aria-hidden="true" class="fas fa-plus" />
              </span>
              <span>Add</span>
            </router-link>
          </div>
        </div>

        <div v-if="loading" class="app-init-wrapper">
          <VLoader class="is-grey" :active="true">
            <div />
          </VLoader>
        </div>
        <div v-else class="tile-grid tile-grid-v2">
          <!--List Empty Search Placeholder -->
          <NoData :meta="workspaceProjects.meta" :search="search" />

          <!--Tile Grid v1-->
          <TransitionGroup name="list" tag="div" class="columns is-multiline">
            <!--Grid item-->
            <div
              v-for="item in workspaceProjects.data"
              :key="item.id"
              class="column is-6"
            >
              <div
                :class="
                  canViewProject(item) ? 'tile-grid-item' : 'tile-grid-item is-disabled'
                "
                @click="navigateToProject(item)"
              >
                <div class="tile-grid-item-inner">
                  <div class="v-avatar">
                    <img v-if="item.logo" class="avatar" :src="item.logo" />
                  </div>

                  <div class="meta">
                    <span class="dark-inverted mb-1">{{ item.name }}</span>
                    <span>
                      <span v-if="item.tags.length" class="text-muted fw-semibold mb-1">
                        <VTag
                          v-for="tag in item.tags"
                          :key="tag"
                          :label="tag"
                          rounded
                          class="mr-2"
                        />
                      </span>
                      <span v-else class="text-muted fw-semibold mb-1">-</span>

                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator is-hidden-mobile"
                      />
                      <span class="is-hidden-mobile">{{ item.assets_count }} assets</span>
                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator is-hidden-mobile"
                      />
                      <span class="is-hidden-mobile"
                        >{{ item.collections_count }} groups</span
                      >
                      <i
                        aria-hidden="true"
                        class="fas fa-circle icon-separator is-hidden-mobile"
                      />
                      <span class="is-hidden-mobile"
                        >{{ item.monitors_count }} monitors</span
                      >
                    </span>
                  </div>
                  <div class="right-menu">
                    <Favorite
                      :id="item.id"
                      type="project"
                      :value="item.favorite"
                      @saved="getProjects"
                    />
                    <div
                      :class="canPerformAction('projects', 'update') ? '' : 'disabled'"
                      @click.stop.prevent="toggleArchive(item)"
                    >
                      <VTag
                        v-if="item.status === 'active'"
                        color="success"
                        label="Active"
                        rounded
                      />
                      <VTag v-else color="danger" label="Archived" rounded />
                    </div>
                    <ProjectDropdown :item="item" @edit="editWorkspace" />
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <Pagination
        :limit="5"
        :data="workspaceProjects"
        @pagination-change-page="getProjects"
      />

      <div class="breadcrumb-wrapper">
        <VBreadcrumb :items="links" :center="true" />
      </div>
    </div>
    <div>
      <Modal
        v-if="showModal"
        :editable="editable"
        :workspace="workspace"
        @closeModal="hideModal"
      />

      <AreYouSureModal ref="confirmDialogue" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import Modal from '/@src/components/projects/ProjectsModal.vue'
import Favorite from '../../components/favorites/FavoriteComponent.vue'
import _ from 'lodash'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import Pagination from '/@src/components/Pagination.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'
import NoData from '/@src/components/NoData.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import ProjectDropdown from '/@src/components/projects/ProjectDropdown.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VBreadcrumb,
    ProjectDropdown,
    VTag,
    NoData,
    VLoader,
    VDropdown,
    VControl,
    Pagination,
    Modal,
    Favorite,
    AreYouSureModal,
  },
  mixins: [permissionsMixin],
  props: ['workspace'],
  data: () => ({
    showModal: false,
    links: [],
    filter: 'active',
    editable: null,
    search: '',
    searchTags: [],
    tags: [],
  }),
  computed: {
    ...mapGetters(['workspaceProjects', 'loading', 'user']),
  },
  watch: {
    search: _.debounce(function () {
      this.getProjects()
    }, 500),
  },

  async mounted() {
    this.$store.dispatch('showLoading')

    this.$store.commit('setProject', null)

    await Promise.all([this.getProjects()])
      .then(() => {
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
            label: this.workspace?.name,
            to: {},
          },
        ]
      })
      .finally(() => {
        this.getTags()
        this.$store.dispatch('hideLoading')
      })
  },
  methods: {
    getTags() {
      if (!this.tags.length) {
        return axios
          .get('/tag/projects?workspace_id=' + this.workspace.id)
          .then((res) => {
            this.tags = res.data.data
          })
          .catch(() => {})
      }
    },
    navigateToProject(project) {
      if (!this.canViewProject(project)) {
        return false
      }

      this.$router.push({
        name: 'ProjectOverview',
        params: { id: project.id },
      })
    },

    getProjects(page = 1) {
      return axios
        .get(`/project`, {
          params: {
            id: this.workspace.id,
            q: this.search,
            filter: this.filter,
            tags: this.searchTags,
            page: page,
          },
        })
        .then((res) => {
          this.$store.dispatch('addWorkspaceProjects', res.data)
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getProjects()
    },
    editWorkspace(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    filterData(filter) {
      this.filter = filter
      this.getProjects()
    },
    filterTag(tag) {
      const index = this.searchTags.indexOf(tag)

      if (index !== -1) {
        this.searchTags.splice(index, 1)
      } else {
        this.searchTags.push(tag)
      }
      this.getProjects()
    },
    async toggleArchive(item) {
      let ok = false
      if (item.status === 'disabled') {
        ok = true
      } else {
        ok = await this.$refs.confirmDialogue.show({
          title: 'Confirmation',
          message: 'Are you sure you want to archive this item?',
          okButton: 'Yes',
          cancelButton: 'No',
        })
      }
      if (ok) {
        await axios
          .post(`/project/${item.id}?_method=PUT`, {
            status: item.status === 'disabled' ? 'active' : 'disabled',
            name: item.name,
          })
          .then(async () => {
            await this.getProjects()
          })
          .catch(() => {})
      }

      await axios.get('/profile').then((res) => {
        const { data } = res.data
        this.$store.dispatch('addUser', data)
        this.$store.dispatch('addWorkspace', this.workspace)
      })
    },
  },
  metaInfo() {
    return {
      title: this.workspace?.name,
    }
  },
}
</script>
