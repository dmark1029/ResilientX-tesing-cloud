<template>
  <div>
    <h4 class="title is-5">CVE</h4>

    <div class="mb-5">
      <VulnerabilitiesSummaryWidget
        :workspace="workspace"
        :project="project"
        :task="task"
        :collection="collection"
        :workspace-collection-id="workspaceCollectionId"
        :asset="asset"
        :grouped="grouped"
        :calendar="false"
        :specific-date="specificDate"
      />
    </div>

    <div v-if="data" class="list-view-toolbar">
      <div class="field">
        <div class="control has-icon">
          <VField>
            <VControl>
              <div
                class="is-flex is-justify-content-space-between is-align-items-center search-input mr-2"
              >
                <img src="/images/icons/navbar/search-normal.png" alt="search" />
                <VInput v-model="search" placeholder="Search..."> </VInput>
              </div>
            </VControl>
          </VField>
        </div>
      </div>

      <div v-if="calendar" class="field">
        <AssetsDetailCalendarFilter
          :selected-date="selectedDate"
          :data="calendarData"
          @taskDateChanged="taskDateChanged"
        />
      </div>
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
          <span class=""> {{ downloading ? $t('Downloading..') : $t('Export') }} </span>
        </button>
      </div>
    </div>

    <TableComponent
      :header="vulnerabilitiesHeaders"
      :items="vulnerabilitiesItems"
      :loading="loading"
      :clickable="link"
      :trial="trial"
      height="500"
      class="w-100"
      @sorting="sortingEvent"
    />
    <div v-if="data" class="mt-3">
      <Pagination
        :data="data"
        :limit="1"
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
    <div
      v-if="trial"
      v-tooltip="`This report was generated in trial mode, upgrade required`"
      class="trial-overlay"
    />
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import TableComponent from './../../widgets/TableComponent.vue'
import _ from 'lodash'
import VulnerabilitiesSummaryWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesSummaryWidget.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'
import projectMixin from '/@src/mixins/projectMixin'
import { VRM_PRODUCT } from '/@src/models/constants'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'

export default {
  components: {
    Pagination,
    AssetsDetailCalendarFilter,
    VulnerabilitiesSummaryWidget,
    TableComponent,
    VField,
    VControl,
    VInput,
  },
  mixins: [projectMixin],
  props: [
    'workspace',
    'project',
    'task',
    'collection',
    'workspaceCollectionId',
    'asset',
    'trial',
    'calendar',
    'link',
    'grouped',
    'specificDate',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    vulnerabilitiesHeaders: [
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'Project', value: 'project', sortable: 'project' },
      { text: 'CPE', value: 'cpe', sortable: 'cpe', html: true },
      { text: 'CVE', value: 'cve_id', sortable: 'cve', html: true },
      { text: 'CVSS', value: 'cvss', sortable: 'cvss' },
      {
        text: 'Severity',
        value: 'severity',
        sortable: 'severity',
        html: true,
      },
      {
        text: 'Impact score',
        value: 'impact_score',
        sortable: 'impact_score',
      },
      {
        text: 'Exploitability score',
        value: 'exploit_ability_score',
        sortable: 'exploit_ability_score',
      },
      {
        text: 'Attack prediction score',
        value: 'attack_prediction_score',
        sortable: 'attack_prediction_score',
        html: true,
      },

      { text: 'New', value: 'new', sortable: 'is_new', html: true },
      { text: 'Changed', value: 'changed', sortable: 'is_changed', html: true },
    ],
    sorting: '-cvss',
    data: null,
    page: 1,
    vulnerabilitiesItems: [
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
      { cve_id: '', cvss: '', severity: '', ip: '' },
    ],
    loading: true,
  }),
  computed: {
    ...mapGetters(['product', 'limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    if (this.project) {
      this.vulnerabilitiesHeaders.splice(1, 1)
    }
    if (!this.link) {
      this.vulnerabilitiesHeaders = this.vulnerabilitiesHeaders.slice(1)
    }
    if (!this.calendar) {
      this.vulnerabilitiesHeaders = this.vulnerabilitiesHeaders.slice(0, -2)
    }
    if (this.calendar) {
      await this.getCalendarData()
    }
    if (this.specificDate) {
      this.selectedDate = this.specificDate
    }
    await this.getData()
  },
  methods: {
    async getCalendarData() {
      await axios
        .get('/vulnerabilities/calendar', {
          params: {
            task_id: this.task?.id,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            workspace_collection_id: this.workspaceCollectionId,
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
    taskDateChanged(item) {
      this.selectedDate = item
      this.getData()
    },
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }

      await axios
        .get('/vulnerabilities', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,
            grouped: this.grouped,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_collection_id: this.workspaceCollectionId,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.vulnerabilitiesItems = this.data.data.map((item) => {
          let link
          if (this.product === VRM_PRODUCT) {
            link = {
              name: this.$route.name.startsWith('VrmManage')
                ? 'VrmManageAssetView'
                : 'VRMAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            }
          } else {
            link = {
              name: 'ProjectAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            }
          }

          return {
            new: item.is_new ? '<span class="tag is-warning">NEW</span>' : '-',
            changed: item.is_changed
              ? '<span class="tag is-warning">CHANGED</span>'
              : '-',
            asset: item.asset.value,
            project: this.resolveProject(item.asset.project_id)?.name,
            link: link,
            cve_id: item.cve + ' <a><i class="fa fa-external-link-alt"></i></a>',
            cpe: item.cpe,
            cvss: item.cvss,
            severity: this.getImpact(item.severity),
            attack_prediction_score: item.attack_prediction_score
              ? this.getAttackPredictionScore(item.attack_prediction_score)
              : 'N/A',
            exploit_ability_score: item.exploit_ability_score ?? 'N/A',
            impact_score: item.impact_score ?? 'N/A',
          }
        })
      }
    },
    async exportData() {
      if (this.trial) {
        return
      }

      this.downloading = true

      await axios
        .get('/vulnerabilities/export', {
          params: {
            q: this.search,
            sort: this.sorting,

            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            workspace_collection_id: this.workspaceCollectionId,
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
    getAttackPredictionScore(score) {
      if (score >= 66) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-danger" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score >= 33) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-warning" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score && score >= 0) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-info" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else {
        return 'N/A'
      }
    },
    getImpact(severity) {
      if (severity === 'Critical') {
        return "<span class='tag is-critical'>Critical</span>"
      } else if (severity === 'High') {
        return "<span class='tag is-danger'>High</span>"
      } else if (severity === 'Medium') {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (severity === 'Low') {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return '-'
      }
    },
  },
}
</script>
