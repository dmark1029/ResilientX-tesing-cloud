<template>
  <div>
    <div>
      <div class="tile-grid-toolbar assets">
        <div v-if="!loading" class="asset-filters">
          <div class="columns w-100">
            <div class="column is-one-fifth pt-0 pb-0">
              <VField>
                <VControl>
                  <VInput v-model="search" type="text" placeholder="Search..." />
                </VControl>
              </VField>
            </div>
            <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="filter"
                    :attrs="{ id }"
                    :options="{
                      active: 'Active',
                      disabled: 'Archive',
                      favorite: 'Favorite',
                    }"
                    placeholder="Select status"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="business_impact"
                    mode="multiple"
                    :attrs="{ id }"
                    :options="general.assets.impacts"
                    placeholder="Business impact"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="risk_rating"
                    mode="multiple"
                    :attrs="{ id }"
                    :options="general.assets.impact_risks"
                    placeholder="Risk rating"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <div aria-haspopup="true" aria-controls="dropdown-menu" @click="showFilter">
                <VButton
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                  style="border: none"
                >
                  More &nbsp;
                  <i :class="chevronClass"></i>
                </VButton>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canPerformAction('assets', 'create')" class="buttons">
          <VButton v-if="project" color="primary" raised @click="showModal = true">
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add</span>
          </VButton>
          <span v-else v-tooltip="`Select project to add group`">
            <VButton color="primary" raised disabled>
              <span class="icon">
                <i aria-hidden="true" class="fas fa-plus" />
              </span>
              <span>Add</span>
            </VButton>
          </span>
        </div>
      </div>

      <div v-if="toggleCaret" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column pt-0 pb-0">
              <div class="field">
                <label class="label is-flex">
                  <span>
                    <span>Exposure Score</span>&nbsp;
                    <span>[{{ exposureScoreValue[0] }},</span>
                    <span>{{ exposureScoreValue[1] }}]</span>
                  </span>
                </label>
                <div
                  class="is-flex is-justify-content-center is-align-items-center columns mx-0 mt-1"
                >
                  <VField class="has-rounded-tooltip w-100">
                    <VControl>
                      <Slider
                        v-model="exposureScoreValue"
                        :min="0"
                        :max="100"
                        :step="1"
                        :tooltips="false"
                      />
                    </VControl>
                  </VField>
                </div>
              </div>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="isScanned"
                    :attrs="{ id }"
                    :options="{
                      1: 'Yes',
                      0: 'No',
                    }"
                    placeholder="Has been scanned"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
            <div class="column pt-0 pb-0"></div>
          </div>
        </div>
      </div>

      <div v-if="loading || !projectCollections" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="projectCollections?.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="projectCollections?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    :sort="sort"
                    title="Name"
                    slug="name"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="!project"
                    :sort="sort"
                    title="Project"
                    slug="project"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    :sort="sort"
                    title="Exposure score"
                    slug="exposure_score"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Business impact"
                    slug="business_impact"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Risk rating"
                    slug="business_impact_risk"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    :sort="sort"
                    title="Total assets"
                    slug="assets_count"
                    @changeSort="changeSort"
                  />
                  <th>Monitors</th>
                  <TableSortableHeader
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    :sort="sort"
                    title="Scanned"
                    slug="scanned_date"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 275px"></th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in projectCollections.data" :key="item.id">
                  <tr v-table-click="() => goToCollection(item)" class="is-clickable">
                    <td>
                      {{ item.name }}
                    </td>
                    <td v-if="!project">
                      {{ resolveProject(item.project_id)?.name }}
                    </td>
                    <td>
                      <AssetExposureScoreBadge
                        v-if="item.exposure_score !== null"
                        :score="item.exposure_score"
                        :previous-score="item.previous_exposure_score"
                        class="mr-2"
                      />
                      <span v-else>-</span>
                    </td>
                    <td>
                      <BusinessImpactBadge :impact="item.business_impact" />
                    </td>
                    <td>
                      <BusinessImpactRiskBadge :impact="item.business_impact_risk" />
                    </td>
                    <td class="text-capitalize">
                      {{ item.assets_count }}
                    </td>
                    <td class="text-capitalize">
                      <span v-if="item.schedules.length">
                        <template v-for="schedule in item.schedules" :key="schedule.id">
                          <span class="tag is-info mr-2 mb-1">
                            {{ schedule.monitor_text }}
                          </span>
                          <span
                            v-if="
                              schedule.monitor === 'exposure' &&
                              schedule.values?.discovery
                            "
                            class="tag is-info mr-2 mb-1"
                          >
                            Asset discovery
                          </span>
                        </template>
                      </span>
                      <span v-else> - </span>
                    </td>
                    <td>
                      <a
                        :class="
                          canPerformAction('assets', 'update')
                            ? 'is-clickable'
                            : 'is-disabled'
                        "
                        @click.stop.prevent="toggleArchive(item)"
                      >
                        <span v-if="item.status === 'active'" class="tag is-success"
                          >Active</span
                        >
                        <span v-else class="tag is-danger">Archived</span>
                      </a>
                    </td>
                    <td>
                      {{ item.scanned_date_text }}
                    </td>
                    <td
                      class="text-end is-flex is-justify-content-end is-align-items-flex-start"
                    >
                      <Favorite
                        :id="item.id"
                        class="mt-2"
                        type="collection"
                        :value="item.favorite"
                        @saved="getCollections"
                      />

                      <router-link
                        :to="{
                          name: 'ProjectCollectionView',
                          params: { id: item.project_id, collection: item.id },
                        }"
                        @click.stop.prevent=""
                      >
                        <button
                          v-tooltip="'View collection'"
                          class="button is-dark-outlined mr-2"
                        >
                          <span class="icon is-small fa fa-eye"></span>
                        </button>
                      </router-link>

                      <a
                        v-tooltip="'Launch scans'"
                        :class="
                          canPerformAction('scans', 'create')
                            ? 'button is-dark-outlined mr-2'
                            : 'button is-dark-outlined is-disabled mr-2'
                        "
                        @click.stop.prevent="scanNow(item)"
                      >
                        <span class="icon is-small fa fa-rocket"></span>
                      </a>

                      <router-link
                        :to="{
                          name: 'ProjectCollectionReportView',
                          params: { id: item.project_id, collection: item.id },
                        }"
                        :class="item.scanned_date ? '' : 'is-disabled'"
                        @click.stop.prevent=""
                      >
                        <button
                          v-tooltip="'View report'"
                          :class="
                            canPerformAction('scans', 'view')
                              ? 'button is-dark-outlined mr-2'
                              : 'button is-dark-outlined is-disabled mr-2'
                          "
                        >
                          <span class="icon is-small fa fa-book"></span>
                        </button>
                      </router-link>

                      <a
                        v-tooltip="'Edit collection'"
                        :class="
                          canPerformAction('collections', 'update')
                            ? 'button is-dark-outlined mr-2'
                            : 'button is-dark-outlined is-disabled'
                        "
                        @click.stop.prevent="editCollection(item)"
                      >
                        <span class="icon is-small fa fa-pencil-alt"></span>
                      </a>
                      <a
                        v-tooltip="'Manage assets'"
                        :class="
                          canPerformAction('collections', 'update')
                            ? 'button is-dark-outlined'
                            : 'button is-dark-outlined is-disabled'
                        "
                        @click.stop.prevent="manageAssets(item)"
                      >
                        <span class="icon is-small fa fa-network-wired"></span>
                      </a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="projectCollections"
          :per-page="limit"
          @pagination-change-page="getCollections"
          @per-page-change="
            (perPage) => {
              $store.dispatch('addLimit', perPage)
              getCollections()
            }
          "
        />

        <div>
          <AreYouSureModal ref="confirmDialogue" />
          <AreYouSureModal ref="issueConfirmDialogue" />
          <VModal is="div" :open="issueCloseLoading" title="Loading..." size="small">
            <template #content>
              <div class="app-init-wrapper">
                <VLoader :active="true">
                  <div />
                </VLoader>
              </div>
            </template>
          </VModal>
          <Modal
            v-if="showModal"
            :editable="editable"
            :project="project"
            @closeModal="hideModal"
          />
          <CollectionsAssetsModal
            v-if="showAssetsModal"
            :editable="editable"
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

// import Modal from '/@src/components/collections/CollectionsModal.vue'
import Modal from '/@src/components/collections/NewCollectionsModal.vue'
import Favorite from '../../components/favorites/FavoriteComponent.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import TasksModal from '../../components/tasks/TasksModal.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import CollectionsAssetsModal from '/@src/components/collections/CollectionsAssetsModal.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import VInput from '/@src/components/base/form/VInput.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import projectMixin from '/@src/mixins/projectMixin'
import BusinessImpactBadge from '/@src/components/assets/BusinessImpactBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import { IssueStatus } from '/@src/models/enums'
import VModal from '/@src/components/base/modal/VModal.vue'
import Slider from '@vueform/slider'

export default {
  components: {
    BusinessImpactRiskBadge,
    BusinessImpactBadge,
    AssetExposureScoreBadge,
    TableSortableHeader,
    VInput,
    VField,
    Multiselect,
    Slider,
    Pagination,
    NoData,
    VLoader,
    VButton,
    VControl,
    CollectionsAssetsModal,
    TasksModal,
    Favorite,
    AreYouSureModal,
    Modal,
    VModal,
  },
  mixins: [permissionsMixin, projectMixin],
  props: ['project', 'module'],
  data: () => ({
    showModal: false,
    showAssetsModal: false,
    filter: 'active',
    sort: '',
    searchStatus: '',
    searchType: '',
    business_impact: [],
    risk_rating: [],
    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    search: '',
    searchTags: [],
    tags: [],
    tagsLoaded: null,
    loading: false,
    issueCloseLoading: false,
    toggleCaret: false,
    isScanned: null,
    exposureScoreValue: [0, 100],
  }),
  computed: {
    ...mapGetters(['projectCollections', 'isMobile', 'general', 'workspace', 'limit']),
    chevronClass() {
      return this.toggleCaret ? 'fa fa-chevron-up' : 'fa fa-chevron-down'
    },
  },
  watch: {
    search: _.debounce(function () {
      this.getCollections()
    }, 500),
    filter: _.debounce(function () {
      this.getCollections()
    }, 500),
    business_impact: _.debounce(function () {
      this.getCollections()
    }, 500),
    risk_rating: _.debounce(function () {
      this.getCollections()
    }, 500),
    sort: _.debounce(function () {
      this.getCollections()
    }, 500),
    isScanned: _.debounce(function () {
      this.getCollections()
    }, 500),
    exposureScoreValue: _.debounce(function () {
      this.getCollections()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addProjectCollections', null)

    await Promise.all([this.getCollections()]).then(() => {
      this.loading = false
    })

    if (this.$route.query.open) {
      this.showModal = true
    }
  },
  methods: {
    showFilter() {
      this.toggleCaret = !this.toggleCaret
    },
    changeSort(sort) {
      this.sort = sort
    },
    goToCollection(item) {
      this.$router.push({
        name: 'ProjectCollectionView',
        params: { id: item.project_id, collection: item.id },
      })
    },
    getCollections(page = 1) {
      let url = `/collection`
      let params = {
        id: this.project?.id,
        workspace_id: this.workspace?.id,
        business_impact: this.business_impact,
        business_impact_risk: this.risk_rating,
        q: this.search,
        sort: this.sort,
        status: this.filter,
        page: page,
        limit: this.limit,
        is_scanned: this.isScanned,
        exposure_score_min: this.exposureScoreValue[0],
        exposure_score_max: this.exposureScoreValue[1],
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addProjectCollections', res.data)
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.showAssetsModal = false
      this.showImportModal = false
      this.editable = null
      this.getCollections()
    },
    editCollection(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    manageAssets(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showAssetsModal = true
    },
    filterData(filter) {
      this.filter = filter
      this.getCollections()
    },
    filterStatus(status) {
      if (this.searchStatus === status) {
        status = ''
      }
      this.searchStatus = status
      this.getCollections()
    },
    filterTag(tag) {
      const index = this.searchTags.indexOf(tag)

      if (index !== -1) {
        this.searchTags.splice(index, 1)
      } else {
        this.searchTags.push(tag)
      }
      this.getCollections()
    },
    filterType(type) {
      if (this.searchType === type) {
        type = ''
      }
      this.searchType = type
      this.getCollections()
    },
    scanNow(item) {
      this.showScanNowModal = true
      this.scanNowItem = item
    },
    onCloseScanModal() {
      this.showScanNowModal = false
    },
    getIssues(collection_id) {
      return axios
        .get('/issue', {
          params: {
            collection_id: collection_id,
            page: 1,
            q: this.search,
            status: IssueStatus.OPENED,
            module_id: '',
            issue_type_id: '',
            sort: this.sort,
            limit: this.limit,
          },
        })
        .then(async (res) => {
          const openedCount = res.data.data.filter(
            (element) => element.status !== IssueStatus.CLOSED
          ).length
          let ok = false
          if (openedCount !== 0) {
            ok = await this.$refs.issueConfirmDialogue.show({
              title: 'Confirmation',
              message: `There are ${openedCount} active issues. Do you want to close the issues?`,
              okButton: 'Confirm',
              cancelButton: 'Deny',
            })
          }
          if (ok) {
            this.issueCloseLoading = true
            res.data.data.map(async (element) => {
              if (element.status !== 'closed') {
                await this.closeStatus(element.id)
              }
              this.issueCloseLoading = false
            })
          }
        })
        .catch(() => {})
    },
    closeStatus(id) {
      return axios
        .put(`/issue/${id}`, {
          status: 'closed',
        })
        .then((res) => {})
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
        this.issueCloseLoading = true
        axios
          .post(`/collection/${item.id}?_method=PUT`, {
            business_impact: item.business_impact,
            status: item.status === 'disabled' ? 'active' : 'disabled',
            name: item.name,
          })
          .then(() => {
            this.issueCloseLoading = false
            this.getCollections()
            item.status === 'active' ? this.getIssues(item.id) : ''
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

.multi-range-slider-bar-only {
  width: 85% !important;
  padding: 0px !important;
}
</style>