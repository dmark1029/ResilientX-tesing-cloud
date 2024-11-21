<template>
  <div>
    <div class="columns is-hidden-mobile">
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/assets-count"
          title="Assets"
          color="#77d2f3"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/assets-count?type=domain"
          title="Domains"
          color="#8168b1"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/assets-count?type=subdomain"
          title="Subdomains"
          color="#ffa880"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/assets-count?type=ipv4"
          title="IP Addresses"
          color="#ff9eb8"
          class="spark-component"
        />
      </div>
    </div>
    <div>
      <div v-if="!loading" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column is-3 pt-0 pb-0">
              <VField>
                <VControl>
                  <VInput v-model="search" type="text" placeholder="Search..." />
                </VControl>
              </VField>
            </div>
            <div v-if="!type" class="column is-3 pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchType"
                    :attrs="{ id }"
                    :options="general.assets.types"
                    placeholder="Type"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading || !projectAssets" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <NoData :meta="projectAssets?.meta" :search="search" />

        <TransitionGroup name="list" tag="div">
          <div v-if="projectAssets?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Asset"
                    slug="asset"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Name']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Name"
                    slug="name"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Company']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Company"
                    slug="company"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Exposure score']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Exposure score"
                    slug="exposure_score"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Status']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Type']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Type"
                    slug="type"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Scanned']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Scanned"
                    slug="scanned_date"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px; vertical-align: middle">
                    <div class="is-inline-block" style="margin-top: 5px">
                      <TableCustomizationDropdown
                        id="assets-table"
                        :types="columns"
                        @typesUpdated="loadColumns"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in projectAssets.data"
                  :key="item.id"
                  v-table-click="() => goToAsset(item)"
                  class="is-clickable"
                >
                  <td>
                    <a
                      :href="'http://' + item.value"
                      target="_blank"
                      @click.stop.prevent="openLink(item.value)"
                      ><i class="fa fa-external-link-alt mr-1"
                    /></a>
                    {{ item.value }}
                    <span v-if="item.private_network" class="ml-1">
                      <span class="tag is-small is-capitalized">Private network</span>
                    </span>
                  </td>
                  <td v-if="columns['Name']">
                    {{ item.name }}
                  </td>
                  <td v-if="columns['Company']">
                    <span
                      v-if="
                        item.collections.filter((collection) => {
                          return collection.status === 'active'
                        }).length
                      "
                    >
                      <router-link
                        v-for="collection in item.collections.filter((collection) => {
                          return collection.status === 'active'
                        })"
                        :key="collection"
                        :to="{
                          name: 'ProjectCollectionView',
                          params: {
                            id: collection.project_id,
                            collection: collection.id,
                          },
                        }"
                        class="mr-2"
                        @click.stop.prevent=""
                        >{{ collection.name }}</router-link
                      >
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Exposure score']">
                    <AssetExposureScoreBadge
                      v-if="item.exposure_score !== null"
                      :previous-score="item.previous_exposure_score"
                      :score="item.exposure_score"
                      class="mr-2"
                    />
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Status']">
                    <a
                      :class="
                        canPerformAction('assets', 'update')
                          ? 'is-clickable'
                          : 'is-disabled'
                      "
                      @click.stop.prevent="toggleArchive(item)"
                    >
                      <span v-if="item.status === 'active'" class="tag is-success mr-2"
                        >Active</span
                      >
                      <span v-else class="tag is-danger mr-2">Archived</span>
                    </a>
                  </td>
                  <td v-if="columns['Type']">
                    {{ item.type_text }}
                  </td>
                  <td v-if="columns['Scanned']">
                    {{ item.scanned_date_text }}
                  </td>

                  <td class="text-end">
                    <Favorite
                      :id="item.id"
                      class="mt-2"
                      type="asset"
                      :value="item.favorite"
                      @saved="getAssets"
                    />

                    <router-link :to="getAssetViewURL(item)" @click.stop.prevent="">
                      <button
                        v-tooltip="'View asset'"
                        :class="
                          canPerformAction('assets', 'view')
                            ? 'button is-dark-outlined mr-2'
                            : 'button is-dark-outlined is-disabled mr-2'
                        "
                      >
                        <span class="icon is-small fa fa-eye"></span>
                      </button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="projectAssets"
          :per-page="limit"
          @pagination-change-page="getAssets"
          @per-page-change="
            (perPage) => {
              $store.dispatch('addLimit', perPage)
              getAssets()
            }
          "
        />

        <div>
          <AreYouSureModal ref="confirmDialogue" />

          <AssetsModal
            v-if="showModal"
            :editable="editable"
            :project="project"
            :collection="collection"
            @closeModal="hideModal"
          />

          <ImportAssetsModal
            v-if="showImportModal"
            :project="project"
            @closeModal="hideModal"
          />

          <TasksModal
            v-if="showScanNowModal"
            :asset="scanNowItem"
            :project="project"
            @close="onCloseScanModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/@src/axios'

import AssetsModal from '/@src/components/assets/AssetsModal.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import VInput from '/@src/components/base/form/VInput.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import SparkStatsComponent from '/@src/components/modules/widgets/SparkStatsComponent.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import projectMixin from '/@src/mixins/projectMixin'
import ImportAssetsModal from '/@src/components/assets/ImportAssetsModal.vue'
import TasksModal from '/@src/components/tasks/TasksModal.vue'
import Favorite from '../../../components/favorites/FavoriteComponent.vue'
import permissionsMixin from '/@src/mixins/permissionsMixin'

export default {
  components: {
    TableSortableHeader,
    SparkStatsComponent,
    TableCustomizationDropdown,
    VInput,
    Multiselect,
    VField,
    AssetExposureScoreBadge,
    Pagination,
    VLoader,
    NoData,
    VControl,
    ImportAssetsModal,
    TasksModal,
    Favorite,
    AreYouSureModal,
    AssetsModal,
  },
  mixins: [permissionsMixin, urlMixin, projectMixin],
  props: ['project', 'workspace', 'type', 'collection'],
  data: () => ({
    showModal: false,
    loading: false,

    search: '',
    searchGroup: '',
    searchStatus: 'active',
    searchType: '',
    searchPriority: '',
    searchTags: [],
    sort: '',
    perPage: '15',

    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    tags: [],
    tagsLoaded: null,
    countries: [],
    columns: {
      Name: false,
      Company: true,
      'Exposure score': true,
      Groups: true,
      Status: true,
      Type: true,
      Scanned: true,
      Tags: true,
    },
    bulkCheck: [],
    bulkChecked: false,
    bulkAction: undefined,
    bulkActionLoading: false,
  }),
  computed: {
    ...mapGetters(['projectAssets', 'isMobile', 'general', 'module', 'limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchGroup: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchType: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchPriority: _.debounce(function () {
      this.getAssets()
    }, 500),
    searchTags: _.debounce(function () {
      this.getAssets()
    }, 500),
    sort: _.debounce(function () {
      this.getAssets()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addProjectAssets', null)

    if (this.$route.query.type) {
      this.searchType = this.$route.query.type
    }

    if (this.type) {
      this.searchType = this.type
    }

    if (this.collection) {
      this.searchGroup = this.collection.id
    }

    this.loadColumns()

    await Promise.all([this.getAssets()]).then(() => {
      this.loading = false
      if (this.project) {
        this.getTags()
      }
    })

    if (this.$route.query.open) {
      this.showModal = true
    }
  },
  methods: {
    toggleBulkCheckAll() {
      if (this.bulkCheck.length === this.projectAssets.data.length) {
        this.bulkCheck = []
      } else {
        this.bulkCheck = this.projectAssets.data.map((item) => item.id)
      }
    },
    async performBulkAction() {
      this.bulkActionLoading = true

      const requests = []

      if (this.bulkAction === 'archive') {
        for (const id of this.bulkCheck) {
          const item = this.projectAssets.data.find((item) => item.id === id)
          const request = axios.post(`/asset/${item.id}?_method=PUT`, {
            status: 'disabled',
            business_impact: item.business_impact,
            name: item.name,
            priority: item.priority,
          })
          requests.push(request)
        }
      } else if (this.bulkAction === 'activate') {
        for (const id of this.bulkCheck) {
          const item = this.projectAssets.data.find((item) => item.id === id)
          const request = axios.post(`/asset/${item.id}?_method=PUT`, {
            status: 'active',
            name: item.name,
            business_impact: item.business_impact,
            priority: item.priority,
          })
          requests.push(request)
        }
      }

      try {
        await Promise.all(requests)
        this.bulkAction = undefined
        this.bulkCheck = []
        this.bulkChecked = false
        this.bulkActionLoading = false

        await this.getAssets()
      } catch (error) {
        this.bulkAction = undefined
        this.bulkCheck = []
        this.bulkChecked = false
        this.bulkActionLoading = false

        await this.getAssets()

        alert('An error occurred while performing the bulk action')
      }
    },
    openLink(url) {
      window.open('http://' + url, '_blank')
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('assets-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    asyncFind(query) {
      this.isLoading = true
      axios
        .get('/collection', {
          params: {
            id: this.project.id,
            q: query,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item.id] = item.name
          })
          this.countries = groups
          this.isLoading = false
        })
        .catch(() => {})
    },
    clearAll() {
      this.selectedCountries = []
    },
    getAssets(page = 1) {
      let url = `/asset`

      let params = {
        workspace_collection_id: this.workspace?.id,
        q: this.search,
        priority: this.searchPriority,
        type: this.searchType,
        filter: this.searchStatus,
        tags: this.searchTags,
        sort: this.sort,
        page: page,
        limit: this.limit,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addProjectAssets', res.data)
        })
        .catch(() => {})
    },
    goToAsset(item) {
      this.$router.push(this.getAssetViewURL(item))
    },
    getTags() {
      return axios
        .get('/tag/assets', {
          params: {
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
          },
        })
        .then((res) => {
          const tags = {}
          res.data.data.forEach((item) => {
            tags[item.id] = item.name
          })
          this.tags = tags
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.showImportModal = false
      this.editable = null
      this.getAssets()
      if (this.project) {
        this.getTags()
      }
    },
    editAsset(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    filterData(filter) {
      this.filter = filter
      this.getAssets()
    },
    filterStatus(status) {
      if (this.searchStatus === status) {
        status = ''
      }
      this.searchStatus = status
      this.getAssets()
    },
    filterTag(tag) {
      const index = this.searchTags.indexOf(tag)

      if (index !== -1) {
        this.searchTags.splice(index, 1)
      } else {
        this.searchTags.push(tag)
      }
      this.getAssets()
    },
    filterType(type) {
      if (this.searchType === type) {
        type = ''
      }
      this.searchType = type
      this.getAssets()
    },
    scanNow(item) {
      this.showScanNowModal = true
      this.scanNowItem = item
    },

    onCloseScanModal() {
      this.showScanNowModal = false
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
        axios
          .post(`/asset/${item.id}?_method=PUT`, {
            business_impact: item.business_impact,
            status: item.status === 'disabled' ? 'active' : 'disabled',
            name: item.name,
            priority: item.priority,
          })
          .then(() => {
            this.getAssets()
          })
          .catch(() => {})
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}
.asset-filters {
  display: flex;
  align-self: center;
  min-width: 85%;
}
.tile-grid-toolbar .control {
  margin-inline-end: 0px;
}
@media (width <= 767px) {
  .asset-filters {
    min-width: 70%;
  }
}
</style>