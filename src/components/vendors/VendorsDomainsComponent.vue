<template>
  <div>
    <div class="columns is-hidden-mobile">
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          :project="project"
          :collection="collection"
          url="/widget/assets-count"
          title="Assets"
          color="#77d2f3"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          :project="project"
          :collection="collection"
          url="/widget/assets-count?type=domain"
          title="Domains"
          color="#8168b1"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          :project="project"
          :collection="collection"
          url="/widget/assets-count?type=subdomain"
          title="Subdomains"
          color="#ffa880"
          class="spark-component"
        />
      </div>
      <div class="column is-3 is-clickable">
        <SparkStatsComponent
          :workspace="workspace"
          :project="project"
          :collection="collection"
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
            <div class="column pt-0 pb-0">
              <VField>
                <VControl>
                  <VInput v-model="search" type="text" placeholder="Search..." />
                </VControl>
              </VField>
            </div>
            <div v-if="!collection" class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{}" class="is-curved-select w-100">
                <VControl>
                  <Multiselect
                    id="ajax"
                    v-model="searchGroup"
                    placeholder="Group"
                    :internal-search="false"
                    :clear-on-select="false"
                    :close-on-select="false"
                    :options-limit="300"
                    :limit="3"
                    :max-height="600"
                    :show-no-results="false"
                    :hide-selected="true"
                    open-direction="bottom"
                    :searchable="true"
                    :options="countries"
                    @open="asyncFind('')"
                    @search-change="asyncFind"
                  >
                  </Multiselect>
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchStatus"
                    :attrs="{ id }"
                    :options="{
                      active: 'Active',
                      disabled: 'Archive',
                      favorite: 'Favorite',
                    }"
                    placeholder="Status"
                  />
                </VControl>
              </VField>
            </div>
            <div v-if="!type" class="column pt-0 pb-0 is-hidden-mobile">
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
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchPriority"
                    :attrs="{ id }"
                    :options="{ high: 'High', normal: 'Normal', low: 'Low' }"
                    placeholder="Priority"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchTags"
                    :attrs="{ id }"
                    mode="multiple"
                    :options="tags"
                    placeholder="Tags"
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
                    v-if="columns['Exposure score']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Exposure score"
                    slug="exposure_score"
                    @changeSort="changeSort"
                  />
                  <th
                    v-if="columns['Groups'] && !collection"
                    style="vertical-align: middle"
                  >
                    Groups
                  </th>
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
                  <th v-if="columns['Tags']" style="vertical-align: middle">Tags</th>
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
                  <td v-if="columns['Exposure score']">
                    <AssetExposureScoreBadge
                      v-if="item.exposure_score !== null"
                      :previous-score="item.previous_exposure_score"
                      :score="item.exposure_score"
                      class="mr-2"
                    />
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Groups'] && !collection">
                    <span v-if="item.collections.length">
                      <router-link
                        v-for="collection in item.collections"
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
                  <td v-if="columns['Tags']">
                    <span v-if="item.tags.length">
                      <span
                        v-for="tag in item.tags"
                        :key="tag"
                        class="tag is-primary mr-2"
                        >{{ tag }}</span
                      >
                    </span>
                    <span v-else> - </span>
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
import Favorite from '../../components/favorites/FavoriteComponent.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import TasksModal from '../../components/tasks/TasksModal.vue'
import ImportAssetsModal from '../../components/assets/ImportAssetsModal.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
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
      Project: true,
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
            name: item.name,
            business_impact: item.business_impact,
            priority: item.priority,
          })
          requests.push(request)
        }
      } else if (this.bulkAction === 'activate') {
        for (const id of this.bulkCheck) {
          const item = this.projectAssets.data.find((item) => item.id === id)
          const request = axios.post(`/asset/${item.id}?_method=PUT`, {
            status: 'active',
            business_impact: item.business_impact,
            name: item.name,
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
        id: this.project?.id,
        workspace_id: this.workspace?.id,
        q: this.search,
        collection_id: this.searchGroup,
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
    hideModal() {
      this.showModal = false
      this.showImportModal = false
      this.editable = null
      this.getAssets()
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