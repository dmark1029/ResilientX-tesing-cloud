<template>
  <div>
    <h4 class="title is-5">SBOM</h4>

    <div v-if="asset && selectedDate && !loading" class="columns">
      <div class="column is-12">
        <SBOMStatsWidget
          :workspace="workspace"
          :workspace-collection-id="workspaceCollectionId"
          :project="project"
          :asset="asset"
          :collection="collection"
          :date="selectedDate"
          :detailed="true"
        />
      </div>
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
      <div v-if="asset" class="buttons">
        <button
          type="button"
          aria-hidden="false"
          class="button v-button is-primary"
          @click="showImportModal = true"
        >
          <span class="icon rtl-reflect">
            <i aria-hidden="true" class="fa fa-file-import" />
          </span>
          <span> {{ $t('Import') }} </span>
        </button>
      </div>
    </div>

    <AssetSbomModal v-if="showImportModal" :asset="asset" @close="closeModal" />

    <TableComponent
      id="ports"
      :loading="loading"
      :header="portHeaders"
      :items="portItems"
      :trial="trial"
      :clickable="link"
      @sorting="sortingEvent"
    />

    <div v-if="data" class="mt-3">
      <Pagination :limit="1" :data="data" @pagination-change-page="getData" />
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import TableComponent from './../../widgets/TableComponent.vue'
import slugify from 'slugify'
import _ from 'lodash'
import Pagination from '/@src/components/Pagination.vue'
import Form from '/@src/form'
import AssetSbomModal from '/@src/components/assets/AssetSbomModal.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import SBOMStatsWidget from '/@src/components/modules/cyber-ex/widgets/SBOMStatsWidget.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'

export default {
  components: {
    SBOMStatsWidget,
    AssetsDetailCalendarFilter,
    AssetSbomModal,
    Pagination,
    TableComponent,
    VInput,
    VControl,
    VField,
  },
  props: [
    'workspace',
    'project',
    'task',
    'collection',
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
    type: 'libraries',
    form: new Form({}),
    showImportModal: false,
    search: '',
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    portHeaders: [
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'URL', value: 'url', sortable: 'url' },
      { text: 'STATUS', value: 'status', sortable: 'status' },
      { text: 'TYPE', value: 'type', sortable: 'type' },
      { text: 'New', value: 'new', sortable: 'is_new', html: true },
      { text: 'Changed', value: 'changed', sortable: 'is_changed', html: true },
    ],
    data: null,
    portItems: [
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
      { name: '', version: '', categories: '', description: '' },
    ],
    sorting: '-vulnerabilities',
    loading: true,
  }),
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
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
        .get('/sbom/calendar', {
          params: {
            task_id: this.task?.id,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
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
    async closeModal() {
      this.showImportModal = false
      this.loading = true
      if (this.calendar) {
        await this.getCalendarData()
      }
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
        .get('/sbom/libraries', {
          params: {
            q: this.search,
            sort: this.sorting,
            grouped: this.grouped,
            page: page,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      this.portHeaders = [
        { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
        { text: 'PURL', value: 'purl', sortable: 'purl' },
        { text: 'Component', value: 'component', sortable: 'component' },
        { text: 'Version', value: 'version', sortable: 'version' },
        { text: 'Outdated', value: 'outdated', sortable: 'outdated', html: true },
        {
          text: 'Latest Version',
          value: 'version_latest',
          sortable: 'version_latest',
        },
        { text: 'Group', value: 'group', sortable: 'group' },
        { text: 'Internal', value: 'internal', sortable: 'internal', html: true },
        { text: 'License', value: 'license', sortable: 'license', html: true },
        {
          text: 'Vulnerabilities',
          value: 'vulnerabilities',
          sortable: 'vulnerabilities',
          html: true,
        },
      ]

      if (this.data.data) {
        this.portItems = this.data.data.map((item) => {
          return {
            asset: item.asset.value,
            link: {
              name: 'ProjectAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            },
            component: item.name,
            version: item.version,
            version_latest: item.version_latest,
            purl: item.purl,
            group: item.group ?? '-',
            license: item.license ?? '-',
            internal: item.is_internal ? 'Yes' : '-',
            outdated: item.is_outdated
              ? '<a><i class="fa fa-exclamation-triangle"></i></a> Yes'
              : '-',
            vulnerabilities: item.is_vulnerable
              ? "<span class='tag is-danger'>Vulnerabilities found</span>"
              : '-',
          }
        })
      }
    },
    getBadge(severity) {
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

<style >
.list-view-toolbar .tabs-inner .tabs {
  margin-bottom: 0px !important;
}
</style>