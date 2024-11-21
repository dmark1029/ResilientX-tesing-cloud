<template>
  <div>
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
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchIndustry"
                    :attrs="{ id }"
                    :options="general.vrm.industries"
                    placeholder="Industry"
                  />
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
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchImpact"
                    :attrs="{ id }"
                    :options="general.assets.impacts"
                    placeholder="Business impact"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchImpactRisk"
                    :attrs="{ id }"
                    :options="general.assets.impact_risks"
                    placeholder="Risk rating"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchContact"
                    :attrs="{ id }"
                    :options="{
                      1: 'Yes',
                      0: 'No',
                    }"
                    placeholder="Has contacts"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>

        <div v-if="canPerformAction('vendors', 'create')" class="buttons">
          <VButton color="light" outlined raised @click="showImportModal = true">
            <span class="icon">
              <i aria-hidden="true" class="fas fa-file-import" />
            </span>
          </VButton>
          <VButton color="primary" raised @click="showModal = true">
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add</span>
          </VButton>
        </div>
      </div>

      <div v-if="loading || !vendors" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="vendors?.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="vendors?.meta?.total" class="datatable-container">
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
                    v-if="columns['Industry']"
                    :sort="sort"
                    title="Industry"
                    slug="industry"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Exposure score']"
                    :sort="sort"
                    title="Exposure score"
                    slug="exposure_score"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Business impact']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Business impact"
                    slug="business_impact"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Risk rating']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Risk rating"
                    slug="business_impact_risk"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Questionnaires score']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Questionnaires score"
                    slug="questionnaires_score"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Risk rating questionnaires']"
                    style="vertical-align: middle"
                    :sort="sort"
                    title="Risk rating questionnaires"
                    slug="business_impact_questionnaires_risk"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Status']"
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Address']"
                    :sort="sort"
                    title="Address"
                    slug="address"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Employees']"
                    :sort="sort"
                    title="Employees"
                    slug="employees"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Assets count']"
                    :sort="sort"
                    title="Assets count"
                    slug="assets_count"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Scanned']"
                    :sort="sort"
                    title="Scanned"
                    slug="scanned"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Contacts']"
                    :sort="sort"
                    title="Contacts"
                    slug="contacts"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="vendors-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in vendors.data"
                  :key="item.id"
                  v-table-click="() => goToVendor(item)"
                  class="is-clickable"
                >
                  <td v-if="columns['Name']">
                    {{ item.name }}
                  </td>
                  <td v-if="columns['Industry']">
                    {{
                      item.industries.length
                        ? item.industries.map((i) => i.name).join(', ')
                        : '-'
                    }}
                  </td>
                  <td v-if="columns['Exposure score']">
                    <AssetExposureScoreBadge
                      v-if="item.exposure_score !== null"
                      :previous-score="getPreviousExposureScore(item)"
                      :score="getExposureScore(item)"
                      class="mr-2"
                    />
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Business impact']">
                    <BusinessImpactBadge :impact="item.fields.business_impact" />
                  </td>
                  <td v-if="columns['Risk rating']">
                    <BusinessImpactRiskBadge :impact="item.fields.business_impact_risk" />
                  </td>
                  <td v-if="columns['Questionnaires score']">
                    <QuestionnairesScoreBadge
                      v-if="item.fields.questionnaires_score !== null"
                      :previous-score="item.fields.previous_questionnaires_score"
                      :score="item.fields.questionnaires_score"
                      class="mr-2"
                    />
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Risk rating questionnaires']">
                    <BusinessImpactRiskBadge
                      :impact="item.fields.business_impact_questionnaires_risk"
                    />
                  </td>
                  <td v-if="columns['Status']">
                    <a
                      :class="
                        canPerformAction('vendors', 'update')
                          ? 'is-clickable'
                          : 'is-disabled'
                      "
                      @click.stop.prevent="toggleArchive(item)"
                    >
                      <span
                        v-if="item.fields.status === 'active'"
                        class="tag is-success mr-2"
                        >Active</span
                      >
                      <span v-else class="tag is-danger mr-2">Archived</span>
                    </a>
                  </td>
                  <td v-if="columns['Address']">
                    {{ item.address ?? '-' }}
                  </td>
                  <td v-if="columns['Employees']">
                    {{ item.employees ?? '-' }}
                  </td>
                  <td v-if="columns['Assets count']">
                    {{ getAssetsCount(item) }}
                  </td>
                  <td v-if="columns['Scanned']">
                    {{ item.scanned_date_text }}
                  </td>
                  <td v-if="columns['Contacts']">
                    <span v-if="item.contacts_count === 0"> - </span>
                    <span
                      v-else-if="item.contacts_count === 1"
                      v-tooltip="`You have one contact added.`"
                    >
                      <i class="fa fa-user"></i>
                    </span>
                    <span
                      v-else
                      v-tooltip="`You have ${item.contacts_count} contacts added.`"
                    >
                      <i class="fa fa-users"></i>
                    </span>
                  </td>
                  <td class="text-end">
                    <Favorite
                      :id="item.id"
                      class="mt-2 is-inline-block"
                      type="vendor"
                      :value="item.favorite"
                      @saved="getVendors"
                    />

                    <router-link
                      :to="{
                        name: 'VendorView',
                        params: { asset: item.id },
                      }"
                      @click.stop.prevent=""
                    >
                      <button
                        v-tooltip="'View company'"
                        :class="
                          canPerformAction('vendors', 'view')
                            ? 'button is-dark-outlined mr-2'
                            : 'button is-dark-outlined is-disabled mr-2'
                        "
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

                    <button
                      v-tooltip="'Edit company'"
                      :class="
                        canPerformAction('vendors', 'update')
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="editVendor(item)"
                    >
                      <span class="icon is-small fa fa-pencil-alt"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination :limit="5" :data="vendors" @pagination-change-page="getVendors" />

        <div>
          <AreYouSureModal ref="confirmDialogue" />

          <VendorsTasksModal
            v-if="showScanNowModal"
            :asset="scanNowItem"
            @close="onCloseScanModal"
          />

          <VendorsModal
            v-if="showModal"
            :editable="editable"
            :workspace="workspace"
            @closeModal="hideModal"
          />

          <ImportVendorsModal
            v-if="showImportModal"
            @closeModal="
              () => {
                showImportModal = false
                getVendors()
              }
            "
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

import Favorite from '../../components/favorites/FavoriteComponent.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VControl from '/@src/components/base/form/VControl.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import VInput from '/@src/components/base/form/VInput.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import VendorsModal from '/@src/components/vendors/VendorsModal.vue'
import VendorsTasksModal from '/@src/components/vendors/assets/VendorsTasksModal.vue'
import BusinessImpactBadge from '/@src/components/assets/BusinessImpactBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import QuestionnairesScoreBadge from '/@src/components/vendors/questionnaires/QuestionnairesScoreBadge.vue'
import ImportVendorsModal from '/@src/components/vendors/ImportVendorsModal.vue'

export default {
  components: {
    ImportVendorsModal,
    QuestionnairesScoreBadge,
    BusinessImpactRiskBadge,
    BusinessImpactBadge,
    VendorsTasksModal,
    VendorsModal,
    TableSortableHeader,
    TableCustomizationDropdown,
    VInput,
    Multiselect,
    VField,
    AssetExposureScoreBadge,
    Pagination,
    VLoader,
    NoData,
    VButton,
    VControl,
    Favorite,
    AreYouSureModal,
  },
  mixins: [permissionsMixin],
  props: ['module', 'type', 'workspace'],
  data: () => ({
    showModal: false,
    showImportModal: false,
    loading: false,

    search: '',
    searchStatus: 'active',
    searchIndustry: '',
    searchImpact: '',
    searchImpactRisk: '',
    searchContact: '',
    sort: '',

    editable: null,

    showScanNowModal: false,
    scanNowItem: null,

    tags: [],
    tagsLoaded: null,
    countries: [],
    columns: {
      Name: true,
      Industry: true,
      'Exposure score': true,
      'Business impact': true,
      'Risk rating': true,
      'Questionnaires score': true,
      'Risk rating questionnaires': true,
      Employees: true,
      Permissions: true,
      Address: true,
      Status: true,
      'Assets count': true,
      Contacts: true,
      Scanned: true,
    },
  }),
  computed: {
    ...mapGetters(['vendors', 'isMobile', 'general', 'project']),
  },
  watch: {
    search: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchIndustry: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchImpact: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchImpactRisk: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchContact: _.debounce(function () {
      this.getVendors()
    }, 500),
    sort: _.debounce(function () {
      this.getVendors()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addVendors', null)

    this.loadColumns()

    await Promise.all([this.getVendors()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    getExposureScore(asset) {
      if (asset.fields.vendor_scorecard_id) {
        return asset.scorecards.find(
          (card) => card.id === asset.fields.vendor_scorecard_id
        ).exposure_score
      } else {
        return asset.exposure_score
      }
    },
    getPreviousExposureScore(asset) {
      if (asset.fields.vendor_scorecard_id) {
        return asset.scorecards.find(
          (card) => card.id === asset.fields.vendor_scorecard_id
        ).previous_exposure_score
      } else {
        return asset.previous_exposure_score
      }
    },
    getAssetsCount(asset) {
      if (asset.fields.vendor_scorecard_id) {
        return asset.scorecards.find(
          (card) => card.id === asset.fields.vendor_scorecard_id
        ).assets_count
      } else {
        return asset.scorecards.find((card) => card.id === asset.id).assets_count
      }
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendors-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getVendors(page = 1) {
      let url = `/vendor`
      let params = {
        workspace_id: this.$route.params.id,
        q: this.search,
        sort: this.sort,
        status: this.searchStatus,
        business_impact: this.searchImpact,
        business_impact_risk: this.searchImpactRisk,
        industry: this.searchIndustry,
        contacts: this.searchContact,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addVendors', res.data)
        })
        .catch(() => {})
    },
    goToVendor(item) {
      this.$router.push({
        name: 'VendorView',
        params: { asset: item.id },
      })
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getVendors()
    },
    editVendor(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
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
          .post(`/vendor/${item.id}?_method=PUT`, {
            business_impact: item.fields.business_impact,
            status: item.fields.status === 'disabled' ? 'active' : 'disabled',
            workspace_id: this.workspace.id,
            vendor_scorecard_id: item.fields.vendor_scorecard_id,
            schedule: item.fields.schedule,
          })
          .then(() => {
            this.getVendors()
          })
          .catch(() => {})
      }
    },
    scanNow(item) {
      this.showScanNowModal = true
      this.scanNowItem = item
    },
    onCloseScanModal() {
      this.showScanNowModal = false
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