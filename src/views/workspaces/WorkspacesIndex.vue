<template>
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

        <VDropdown icon="fa fa-filter">
          <template #content>
            <a href="#" class="dropdown-item" @click.prevent.stop="filterData('all')">
              {{ $t('All') }}
            </a>
            <a href="#" class="dropdown-item" @click.prevent.stop="filterData('active')">
              {{ $t('Active') }}
            </a>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent.stop="filterData('disabled')"
            >
              {{ $t('Archived') }}
            </a>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent.stop="filterData('favorite')"
            >
              {{ $t('Favorite') }}
            </a>
          </template>
        </VDropdown>

        <div class="buttons">
          <VButton
            v-if="user.type === 'LicenseManager'"
            color="primary"
            raised
            @click="showModal = true"
          >
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add</span>
          </VButton>
        </div>
      </div>

      <div v-if="loading" class="app-init-wrapper">
        <VLoader class="is-grey" :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="workspaces.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div" class="columns is-multiline">
          <!--Grid item-->
          <div v-for="item in workspaces.data" :key="item.id" class="column is-6">
            <div class="tile-grid-item" @click="navigateToWorkspace(item)">
              <div class="tile-grid-item-inner">
                <div class="v-avatar">
                  <img
                    v-if="item.setting?.logo"
                    class="avatar"
                    :src="item.setting.logo"
                  />
                </div>

                <div class="meta">
                  <span class="dark-inverted">{{ item.name }}</span>
                  <span>
                    <span>{{ item.setting?.name }}</span>
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
                      >{{ item.projects_count }} projects</span
                    >
                    <i
                      v-if="hasUEM(item)"
                      aria-hidden="true"
                      class="fas fa-circle icon-separator is-hidden-mobile"
                    />
                    <span v-if="hasUEM(item)" class="is-hidden-mobile">UEM</span>
                    <i
                      v-if="hasTPRM(item)"
                      aria-hidden="true"
                      class="fas fa-circle icon-separator is-hidden-mobile"
                    />
                    <span v-if="hasTPRM(item)" class="is-hidden-mobile">TPRM</span>
                    <i
                      v-if="!hasLicense(item)"
                      aria-hidden="true"
                      class="fas fa-circle icon-separator is-hidden-mobile"
                    />
                    <span v-if="!hasLicense(item)" class="is-hidden-mobile"
                      >NO LICENSE</span
                    >
                  </span>
                </div>
                <div class="right-menu">
                  <Favorite
                    :id="item.id"
                    type="workspace"
                    :value="item.favorite"
                    @saved="getData"
                  />
                  <div
                    :class="
                      canPerformAction('workspaces', 'update', item) ? '' : 'disabled'
                    "
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
                  <WorkspaceDropdown :item="item" @edit="editWorkspace" />
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <Pagination :limit="5" :data="workspaces" @pagination-change-page="getData" />

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>

    <div>
      <Modal v-if="showModal" :editable="editable" @closeModal="hideModal" />

      <AreYouSureModal ref="confirmDialogue" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/@src/axios'
import { useMeta } from 'vue-meta'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import Modal from '/@src/components/workspaces/WorkspacesModal.vue'
import Favorite from '../../components/favorites/FavoriteComponent.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import Pagination from '/@src/components/Pagination.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import NoData from '/@src/components/NoData.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import WorkspaceDropdown from '/@src/components/workspaces/WorkspaceDropdown.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { VRM_PRODUCT } from '/@src/models/constants'
export default {
  components: {
    VBreadcrumb,
    WorkspaceDropdown,
    VLoader,
    VTag,
    NoData,
    VButton,
    VDropdown,
    VControl,
    Pagination,
    Modal,
    AreYouSureModal,
    Favorite,
  },
  mixins: [permissionsMixin],
  setup() {
    useMeta({
      title: `Workspaces`,
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    filter: 'active',
    links: [],
    search: '',
  }),
  computed: {
    ...mapGetters(['workspaces', 'user', 'loading', 'product']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  mounted() {
    this.$store.dispatch('showLoading')

    if (this.product !== VRM_PRODUCT) {
      this.$store.commit('setProject', null)
    }

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
    ]

    this.getData()
  },
  methods: {
    async navigateToWorkspace(workspace) {
      if (this.product === VRM_PRODUCT) {
        this.$router.push({
          name: 'VendorOverview',
          params: { id: workspace.id },
        })
      } else {
        this.$router.push({
          name: 'WorkspacesView',
          params: { id: workspace.id },
        })
      }
    },
    navigateToWorkspaceUsers(workspace) {
      this.$router.push({
        name: 'WorkspaceUsersView',
        params: { id: workspace.id },
      })
    },
    navigateToWorkspaceLicenses(workspace) {
      this.$router.push({
        name: 'WorkspaceLicensesView',
        params: { id: workspace.id },
      })
    },
    navigateToWorkspaceSettings(workspace) {
      this.$router.push({
        name: 'WorkspaceSettingsView',
        params: { id: workspace.id },
      })
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getData()
    },
    editWorkspace(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    filterData(filter) {
      this.filter = filter
      this.getData()
    },
    getData(page = 1) {
      axios
        .get(`/workspace?q=${this.search}&filter=${this.filter}&page=${page}`)
        .then((res) => {
          this.$store.dispatch('addWorkspaces', res.data)
          this.$store.dispatch('hideLoading')
        })
        .catch(() => {})
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
          .post(`/workspace/${item.id}?_method=PUT`, {
            status: item.status === 'disabled' ? 'active' : 'disabled',
            name: item.name,
          })
          .then(async () => {
            await this.getData()
          })
          .catch(() => {})
      }

      await axios.get('/profile').then((res) => {
        const { data } = res.data
        this.$store.dispatch('addUser', data)
      })
    },
  },
}
</script>
