<template>
  <div>
    <h4 class="title is-5">Cloud findings</h4>

    <div v-if="data" class="list-view-toolbar is-block">
      <div class="columns w-100">
        <div class="column is-3">
          <div class="field">
            <div class="control has-icon">
              <input
                v-model="search"
                class="input custom-text-filter"
                placeholder="Search..."
              />
              <label class="label form-icon" for="v-field-2">
                <i aria-hidden="true" class="fa fa-search" />
              </label>
            </div>
          </div>
        </div>
        <div class="column is-2">
          <div v-if="calendar" class="field">
            <AssetsDetailCalendarFilter
              :selected-date="selectedDate"
              :data="calendarData"
              @taskDateChanged="taskDateChanged"
            />
          </div>
        </div>
        <div
          class="column is-7 is-flex is-justify-content-space-between is-align-items-center"
        >
          <div class="list-info">
            <span>{{ data.meta.total }} records found</span>
          </div>
          <div class="buttons">
            <button
              type="button"
              aria-hidden="false"
              :class="downloading ? 'button v-button is-disabled' : 'button v-button'"
              @click="exportData"
            >
              <span class="icon rtl-reflect">
                <i aria-hidden="true" class="fa fa-file-export" />
              </span>
              <span> {{ downloading ? $t('Downloading..') : $t('Export') }} </span>
            </button>
          </div>
        </div>
      </div>

      <div class="columns is-multiline">
        <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
          <VField v-slot="{ id }" class="is-curved-select">
            <VControl>
              <Multiselect
                v-model="searchStatus"
                :attrs="{ id }"
                :options="{
                  pass: 'Passed',
                  fail: 'Failed',
                  info: 'Informational',
                }"
                placeholder="Status"
              />
            </VControl>
          </VField>
        </div>
        <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
          <VField v-slot="{ id }" class="is-curved-select">
            <VControl>
              <Multiselect
                v-model="searchSeverity"
                :attrs="{ id }"
                :options="{
                  critical: 'Critical',
                  high: 'High',
                  medium: 'Medium',
                  low: 'Low',
                }"
                placeholder="Severity"
              />
            </VControl>
          </VField>
        </div>

        <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-resource"
                v-model="searchResource"
                placeholder="Resource"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="groups"
                @open="
                  () => {
                    groups = []
                    asyncFind('', 'resource_id')
                  }
                "
                @close="groups = []"
                @search-change="
                  (query) => {
                    asyncFind(query, 'resource_id')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-service"
                v-model="searchService"
                placeholder="Service"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="groups"
                @open="
                  () => {
                    groups = []
                    asyncFind('', 'service_name')
                  }
                "
                @close="groups = []"
                @search-change="
                  (query) => {
                    asyncFind(query, 'service_name')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
          <VField v-slot="{ id }" class="is-curved-select">
            <VControl>
              <Multiselect
                v-model="searchProvider"
                :attrs="{ id }"
                :options="{
                  aws: 'AWS',
                  azure: 'Azure',
                  gcp: 'Google cloud',
                }"
                placeholder="Provider"
                @change="
                  (value) => {
                    searchAccount = null
                    searchRegion = null
                    searchSubscription = null
                    searchCloudProject = null
                  }
                "
              />
            </VControl>
          </VField>
        </div>

        <div
          v-if="searchProvider === 'azure'"
          class="column is-2 pt-0 pb-0 is-hidden-mobile"
        >
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-subscription"
                v-model="searchSubscription"
                placeholder="Subscription"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="groups"
                @open="
                  () => {
                    groups = []
                    asyncFind('', 'subscription')
                  }
                "
                @close="groups = []"
                @search-change="
                  (query) => {
                    asyncFind(query, 'subscription')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div
          v-if="searchProvider === 'aws'"
          class="column is-2 pt-0 pb-0 is-hidden-mobile"
        ></div>

        <div
          v-if="searchProvider === 'gcp'"
          class="column is-2 pt-0 pb-0 is-hidden-mobile"
        >
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-project"
                v-model="searchCloudProject"
                placeholder="Project"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="groups"
                @close="groups = []"
                @open="
                  () => {
                    groups = []
                    asyncFind('', 'cloud_project')
                  }
                "
                @search-change="
                  (query) => {
                    asyncFind(query, 'cloud_project')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div
          v-if="searchProvider === 'aws'"
          class="column is-2 pt-0 pb-0 is-hidden-mobile mt-3"
        >
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-account"
                v-model="searchAccount"
                placeholder="Account"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="groups"
                @open="
                  () => {
                    groups = []
                    asyncFind('', 'account_id')
                  }
                "
                @close="groups = []"
                @search-change="
                  (query) => {
                    asyncFind(query, 'account_id')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>

        <div
          v-if="searchProvider === 'aws'"
          class="column is-2 pt-0 pb-0 is-hidden-mobile mt-3"
        >
          <VField v-slot="{}" class="is-curved-select w-100">
            <VControl>
              <Multiselect
                id="ajax-region"
                v-model="searchRegion"
                placeholder="Region"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="10"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="regions"
                @open="
                  () => {
                    regions = []
                    asyncFind('', 'region')
                  }
                "
                @close="regions = []"
                @search-change="
                  (query) => {
                    asyncFind(query, 'region')
                  }
                "
              >
              </Multiselect>
            </VControl>
          </VField>
        </div>
      </div>
    </div>

    <div v-if="loading || !data" class="app-init-wrapper">
      <VLoader :active="true">
        <div />
      </VLoader>
    </div>
    <div v-else class="tile-grid tile-grid-v2">
      <NoData :meta="data?.meta" :search="search" />

      <TransitionGroup name="list" tag="div">
        <div v-if="data?.meta?.total" class="datatable-container">
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
                  v-if="columns['Project'] && !project"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Project"
                  slug="project_id"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Provider']"
                  style="vertical-align: middle; min-width: 150px"
                  :sort="sort"
                  title="Provider"
                  slug="provider"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Identifier']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Identifier"
                  slug="account_id"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Resource']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Resource"
                  slug="resource_id"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Service']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Service"
                  slug="service_name"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Check']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Check"
                  slug="check_title"
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
                  v-if="columns['Severity']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Severity"
                  slug="severity"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['New']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="New"
                  slug="is_new"
                  @changeSort="changeSort"
                />
                <TableSortableHeader
                  v-if="columns['Region']"
                  style="vertical-align: middle"
                  :sort="sort"
                  title="Region"
                  slug="region"
                  @changeSort="changeSort"
                />
                <th style="min-width: 199px; vertical-align: middle">
                  <div class="is-inline-block" style="margin-top: 5px">
                    <TableCustomizationDropdown
                      id="cloud-details-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in data.data" :key="item.id">
                <tr
                  v-table-click="() => toggle(item.id)"
                  class="is-clickable"
                  :class="{ opened: opened.includes(item.id) }"
                >
                  <td>
                    {{ item.asset.value }}
                  </td>
                  <td v-if="columns['Project'] && !project">
                    {{ resolveProject(item.project_id)?.name }}
                  </td>
                  <td v-if="columns['Provider']">
                    <VAvatar
                      class="cloud-avatar"
                      :picture="`/assets/integrations/` + item.provider + `.svg`"
                      size="small"
                    />
                    {{ item.provider.toUpperCase() }}
                  </td>
                  <td v-if="columns['Identifier']">
                    {{ item.account_id ?? item.subscription ?? item.cloud_project }}
                  </td>
                  <td v-if="columns['Resource']">
                    {{ item.resource_id }}
                  </td>
                  <td v-if="columns['Service']">
                    {{ item.service_name }}
                  </td>
                  <td v-if="columns['Check']" style="min-width: 300px">
                    {{ item.check_title }}
                  </td>
                  <td v-if="columns['Status']">
                    <CloudScannerStatusBadge :status="item.status" />
                  </td>
                  <td v-if="columns['Severity']">
                    <CloudScannerSeverityBadge :severity="item.severity" />
                  </td>
                  <td v-if="columns['New']">
                    <span v-if="item.is_new" class="tag is-warning">NEW</span>
                    <span v-else>-</span>
                  </td>
                  <td v-if="columns['Region']">
                    {{ item.region ?? '-' }}
                  </td>
                  <td>
                    <div class="collapse-icon">
                      <VIcon v-if="opened.includes(item.id)" icon="fa fa-chevron-up" />
                      <VIcon v-else icon="fa fa-chevron-down" />
                    </div>
                  </td>
                </tr>
                <tr v-if="opened.includes(item.id)">
                  <td
                    :colspan="Object.values(columns).filter(Boolean).length + 1"
                    class="has-text-left p-5"
                  >
                    <div class="mb-3">
                      <div v-if="item.status_extended">
                        <p>{{ item.status_extended }}</p>
                      </div>

                      <div v-if="item.description">
                        <p>{{ item.description }}</p>
                      </div>

                      <div v-if="item.risk">
                        <p>{{ item.risk }}</p>
                      </div>
                    </div>

                    <hr />

                    <div class="columns">
                      <div class="column is-6">
                        <div class="title-wrap mb-3">
                          <p class="mb-2"><b>Resource</b></p>

                          <p v-if="item.resource_id">
                            <b>Resource:</b> {{ item.resource_id }}
                          </p>
                          <p v-if="item.resource_name">
                            <b>Resource name:</b> {{ item.resource_name }}
                          </p>
                          <p v-if="item.resource_arn">
                            <b>Resource ARN:</b> {{ item.resource_arn }}
                          </p>
                          <p v-if="item.resource_details">
                            <b>Resource details:</b> {{ item.resource_details }}
                          </p>
                          <p v-if="item.tenant_domain">
                            <b>Tenant:</b> {{ item.tenant_domain }}
                          </p>
                          <p v-if="item.subscription">
                            <b>Subscription:</b> {{ item.subscription }}
                          </p>
                          <p v-if="item.account_id">
                            <b>Account:</b> {{ item.account_id }}
                          </p>
                          <p v-if="item.region"><b>Region:</b> {{ item.region }}</p>
                          <p v-if="item.location"><b>Location:</b> {{ item.location }}</p>
                          <p v-if="item.cloud_project">
                            <b>Project:</b> {{ item.cloud_project }}
                          </p>
                        </div>
                        <div v-if="item.service_name" class="title-wrap mb-3">
                          <p class="mb-2"><b>Service</b></p>
                          <p>
                            <span>{{ item.service_name }}</span>
                            <span v-if="item.sub_service_name">{{
                              item.sub_service_name
                            }}</span>
                          </p>
                        </div>
                        <div class="title-wrap mb-3">
                          <p class="mb-2"><b>Tags</b></p>
                          <span v-if="item.resource_type" class="tag mr-2">{{
                            item.resource_type
                          }}</span>
                          <span
                            v-for="(tag, index) in getTags(item)"
                            :key="index"
                            class="tag mr-2"
                            >{{ tag }}</span
                          >
                          <span v-if="item.notes" class="tag">{{ item.notes }}</span>
                        </div>
                      </div>

                      <div class="column is-6">
                        <div v-if="item.remediation" class="title-wrap mb-3">
                          <p class="mb-2"><b>Remediation</b></p>
                          <p v-if="item.remediation">
                            {{ item.remediation.desc }}
                          </p>
                          <p class="mt-2 mb-2">
                            <b>References</b>
                            <a
                              v-for="(ref, index) in item.remediation.references"
                              :key="index"
                              class="is-block"
                              :href="ref"
                              target="_blank"
                              >{{ ref }}</a
                            >
                          </p>
                        </div>
                        <div v-if="item.related_url" class="title-wrap mb-3">
                          <p class="mb-2"><b>References</b></p>
                          <p>
                            <a :href="item.related_url" target="_blank">{{
                              item.related_url
                            }}</a>
                          </p>
                        </div>
                        <!--                      <div class="title-wrap mb-3" v-if="item.compliance">-->
                        <!--                        <p class="mb-2"><b>Compliance</b></p>-->
                        <!--                        <div class="columns is-multiline">-->
                        <!--                          <div class="column is-half" style="padding-bottom: 0px !important;" v-for="(value, key) in item.compliance">-->
                        <!--                            <p>-->
                        <!--                              <b>{{ key }}:</b>-->
                        <!--                              <span v-if="Array.isArray(value)">-->
                        <!--          <span v-for="(item, index) in value">-->
                        <!--            {{ item }}<span v-if="index !== value.length - 1">, </span>-->
                        <!--          </span>-->
                        <!--        </span>-->
                        <!--                              <span v-else>{{ value }}</span>-->
                        <!--                            </p>-->
                        <!--                          </div>-->
                        <!--                        </div>-->
                        <!--                      </div>-->
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </TransitionGroup>

      <Pagination
        :limit="5"
        :data="data"
        :per-page="limit"
        @pagination-change-page="getData"
        @per-page-change="
          (perPage) => {
            $store.dispatch('addLimit', perPage)
            getData()
          }
        "
      />
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import _ from 'lodash'
import Pagination from '/@src/components/Pagination.vue'
import projectMixin from '/@src/mixins/projectMixin'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import NoData from '/@src/components/NoData.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import CloudScannerSeverityBadge from '/@src/components/modules/cloud-scanner/widgets/CloudScannerSeverityBadge.vue'
import CloudScannerStatusBadge from '/@src/components/modules/cloud-scanner/widgets/CloudScannerStatusBadge.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import { mapGetters } from 'vuex'
import VIcon from '/@src/components/base/icon/VIcon.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'

export default {
  components: {
    AssetsDetailCalendarFilter,
    VIcon,
    VField,
    VControl,
    VAvatar,
    CloudScannerStatusBadge,
    Multiselect,
    CloudScannerSeverityBadge,
    TableCustomizationDropdown,
    VLoader,
    NoData,
    TableSortableHeader,
    Pagination,
  },
  mixins: [projectMixin],
  props: [
    'project',
    'task',
    'collection',
    'asset',
    'trial',
    'link',
    'calendar',
    'specificDate',
    'workspace',
  ],
  data: () => ({
    columns: {
      Name: true,
      Project: true,
      Provider: true,
      Identifier: true,
      Resource: true,
      Service: true,
      Check: true,
      Status: true,
      Severity: true,
      New: true,
      Region: true,
    },
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    data: null,
    sort: '',
    loading: true,
    opened: [],
    searchProvider: null,
    searchAccount: null,
    searchRegion: null,
    searchSubscription: null,
    searchSeverity: null,
    searchStatus: null,
    searchService: null,
    searchResource: null,
    searchCloudProject: null,
    groups: {},
    regions: {},
    initializeWatchers: false,
  }),
  computed: {
    ...mapGetters(['limit']),
  },
  watch: {
    search: _.debounce(function () {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    }, 500),
    specificDate() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchProvider() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchAccount() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchRegion() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    subscription() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchSubscription() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchStatus() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchSeverity() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchResource() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    searchService() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
    sort() {
      if (!this.initializeWatchers) {
        return
      }
      this.getData()
    },
  },
  async mounted() {
    if (this.$route.query.status) {
      this.searchStatus = this.$route.query.status
    }
    if (this.$route.query.account_id) {
      this.searchAccount = this.$route.query.account_id
      this.groups[this.searchAccount] = this.searchAccount
    }
    if (this.$route.query.region) {
      this.searchRegion = this.$route.query.region
      this.groups[this.searchRegion] = this.searchRegion
    }
    if (this.$route.query.subscription) {
      this.searchSubscription = this.$route.query.subscription
      this.groups[this.searchSubscription] = this.searchSubscription
    }
    if (this.$route.query.cloud_project) {
      this.searchCloudProject = this.$route.query.cloud_project
      this.groups[this.searchCloudProject] = this.searchCloudProject
    }
    if (this.$route.query.provider) {
      this.searchProvider = this.$route.query.provider
    }
    if (this.$route.query.severity) {
      this.searchSeverity = this.$route.query.severity
    }
    if (this.$route.query.service) {
      this.searchService = this.$route.query.service
      this.groups[this.searchService] = this.searchService
    }
    if (this.$route.query.q) {
      this.search = this.$route.query.q
    }

    if (this.calendar) {
      await this.getCalendarData()
    }
    if (this.specificDate) {
      this.selectedDate = this.specificDate
    }

    if (this.$route.query.date) {
      this.selectedDate = this.$route.query.date
    }

    this.initializeWatchers = true

    await this.getData()
  },
  methods: {
    loadColumns() {
      const existing = localStorage.getItem('cloud-details-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    changeSort(sort) {
      this.sort = sort
    },
    asyncFind(query, groupedBy) {
      this.isLoading = true

      axios
        .get('/cloud-details', {
          params: {
            q: query,
            provider: this.searchProvider,
            group: groupedBy,
            task_id: this.task?.id,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item[groupedBy]] = item[groupedBy]
          })
          if (groupedBy === 'region') {
            this.regions = groups
          } else {
            this.groups = groups
          }
          this.isLoading = false
        })
        .catch(() => {})
    },
    getTags(item) {
      let tags = []
      if (item.resource_tags) {
        tags = tags.concat(item.resource_tags)
      }
      if (item.check_type) {
        tags = tags.concat(item.check_type)
      }
      if (item.categories) {
        tags = tags.concat(item.categories)
      }
      return tags
    },
    toggle(id) {
      const index = this.opened.indexOf(id)
      if (index > -1) {
        this.opened.splice(index, 1)
      } else {
        this.opened.push(id)
      }
    },
    taskDateChanged(item) {
      this.selectedDate = item
      this.getData()
    },
    async getCalendarData() {
      await axios
        .get('/cloud-details/calendar', {
          params: {
            task_id: this.task?.id,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.calendarData = res.data.data
          if (res.data.data[0]) {
            this.selectedDate = res.data.data[0].date
          }
        })
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/cloud-details', {
          params: {
            q: this.search,
            sort: this.sort,
            page: page,
            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            provider: this.searchProvider,
            account_id: this.searchAccount,
            region: this.searchRegion,
            subscription: this.searchSubscription,
            cloud_project: this.searchCloudProject,
            status: this.searchStatus,
            severity: this.searchSeverity,
            service_name: this.searchService,
            resource_id: this.searchResource,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })
    },
    async exportData() {
      if (this.trial) {
        return
      }

      this.downloading = true

      await axios
        .get('/cloud-details/export', {
          params: {
            q: this.search,
            sort: this.sorting,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.downloading = false

          if (res.data.data) {
            const blob = new Blob([res.data.data], { type: 'text/csv;charset=utf-8,' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'data.csv' // You can set the filename here
            a.click()
            window.URL.revokeObjectURL(url)
          }
        })
    },
  },
}
</script>

<style>
.cloud-avatar.v-avatar.is-small .avatar {
  width: 25px;
  min-width: 25px;
  height: 25px;
}
</style>