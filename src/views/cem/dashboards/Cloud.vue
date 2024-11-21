<template>
  <div>
    <div v-if="loaded" class="tile-grid-toolbar assets">
      <div class="asset-filters w-100">
        <div class="columns">
          <div class="column is-2 pt-0 pb-0">
            <div class="field">
              <AssetsDetailCalendarFilter
                :selected-date="selectedDate"
                :data="calendarData"
                @taskDateChanged="taskDateChanged"
              />
            </div>
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

          <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
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
                  :limit="3"
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
            class="column is-2 pt-0 pb-0 is-hidden-mobile"
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
                  :limit="3"
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
    </div>
  </div>

  <div v-if="loaded" class="project-overview">
    <div class="columns is-multiline">
      <div class="column is-6">
        <FindingsByStatusWidget
          :specific-date="selectedDate"
          :provider="searchProvider"
          :account="searchAccount"
          :region="searchRegion"
          :subscription="searchSubscription"
          :cloud-project="searchCloudProject"
          :workspace="workspace"
          :project="project"
        />
      </div>
      <div class="column is-6">
        <FindingsBySeverityWidget
          :specific-date="selectedDate"
          :provider="searchProvider"
          :account="searchAccount"
          :region="searchRegion"
          :subscription="searchSubscription"
          :cloud-project="searchCloudProject"
          :workspace="workspace"
          :project="project"
        />
      </div>
      <div class="column is-7">
        <div class="mb-5">
          <FindingsCountWidget
            :specific-date="selectedDate"
            :provider="searchProvider"
            :account="searchAccount"
            :region="searchRegion"
            :subscription="searchSubscription"
            :cloud-project="searchCloudProject"
            :workspace="workspace"
            :project="project"
          />
        </div>

        <div>
          <FindingsLatestWidget
            :specific-date="selectedDate"
            :provider="searchProvider"
            :account="searchAccount"
            :region="searchRegion"
            :subscription="searchSubscription"
            :cloud-project="searchCloudProject"
            :workspace="workspace"
            :project="project"
          />
        </div>
      </div>
      <div class="column is-5">
        <div class="stat-widget table-widget-v1 is-straight">
          <div class="widget-head">
            <h3 class="dark-inverted">Failed checks by</h3>
          </div>
          <VTabs
            slider
            type="rounded"
            selected="account"
            :tabs="[
              { label: 'Account', value: 'account' },
              { label: 'Service', value: 'service' },
            ]"
          >
            <template #tab="{ activeValue }">
              <div v-if="activeValue === 'account'">
                <FindingsByAccountWidget
                  :specific-date="selectedDate"
                  :provider="searchProvider"
                  :account="searchAccount"
                  :region="searchRegion"
                  :subscription="searchSubscription"
                  :cloud-project="searchCloudProject"
                  :workspace="workspace"
                  :project="project"
                />
              </div>
              <div v-else-if="activeValue === 'service'">
                <FindingsByServiceWidget
                  :specific-date="selectedDate"
                  :provider="searchProvider"
                  :account="searchAccount"
                  :region="searchRegion"
                  :subscription="searchSubscription"
                  :cloud-project="searchCloudProject"
                  :workspace="workspace"
                  :project="project"
                />
              </div>
            </template>
          </VTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FindingsByStatusWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsByStatusWidget.vue'
import FindingsBySeverityWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsBySeverityWidget.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import { axios } from '/@src/axios'
import FindingsLatestWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsLatestWidget.vue'
import FindingsByAccountWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsByAccountWidget.vue'
import FindingsByServiceWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsByServiceWidget.vue'
import FindingsCountWidget from '/@src/components/modules/cloud-scanner/widgets/FindingsCountWidget.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'

export default {
  components: {
    VTabs,
    FindingsCountWidget,
    FindingsByServiceWidget,
    FindingsByAccountWidget,
    FindingsLatestWidget,
    AssetsDetailCalendarFilter,
    Multiselect,
    VField,
    VControl,
    FindingsBySeverityWidget,
    FindingsByStatusWidget,
  },
  props: ['project'],
  data: () => ({
    loaded: false,
    searchProvider: null,
    searchAccount: null,
    searchRegion: null,
    searchSubscription: null,
    searchCloudProject: null,
    groups: [],
    regions: [],
    calendarData: [],
    selectedDate: null,
  }),
  computed: {
    ...mapGetters(['module', 'workspace', 'general']),
  },
  async mounted() {
    await this.getCalendarData()

    this.loaded = true
  },
  methods: {
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
    async taskDateChanged(date) {
      this.selectedDate = date
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
  },
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' cloud overview',
      }
    }

    return {
      title: this.workspace?.name + ' cloud overview',
    }
  },
}
</script>

<style scoped>
.project-overview {
  .dashboard-card,
  .stat-widget {
    height: 100%;
  }
}
</style>
