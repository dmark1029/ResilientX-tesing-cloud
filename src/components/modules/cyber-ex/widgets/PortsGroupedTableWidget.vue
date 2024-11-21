<template>
  <div>
    <h4 class="title is-5">Ports</h4>

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
          <span> {{ downloading ? $t('Downloading..') : $t('Export') }} </span>
        </button>
      </div>
    </div>

    <div id="ports">
      <TableComponent
        :loading="loading"
        :header="portHeaders"
        :items="portItems"
        :trial="trial"
        :clickable="link"
        @sorting="sortingEvent"
      />
    </div>

    <div v-if="data" class="mt-3">
      <Pagination
        :limit="1"
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
import TableComponent from './../../widgets/TableComponent.vue'
import slugify from 'slugify'
import _ from 'lodash'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import Pagination from '/@src/components/Pagination.vue'
import projectMixin from '/@src/mixins/projectMixin'
import { mapGetters } from 'vuex'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'

export default {
  components: {
    Pagination,
    AssetsDetailCalendarFilter,
    TableComponent,
    VInput,
    VControl,
    VField,
  },
  mixins: [projectMixin],
  props: [
    'workspace',
    'project',
    'task',
    'collection',
    'asset',
    'trial',
    'calendar',
    'link',
    'specificDate',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    portHeaders: [
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'Project', value: 'project', sortable: 'project_id' },
      { text: 'Ports', value: 'ports', sortable: 'port', html: true },
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
    sorting: '',
    loading: true,
  }),
  computed: {
    ...mapGetters(['limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    if (this.project) {
      this.portHeaders.splice(1, 1)
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
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getCalendarData() {
      await axios
        .get('/ports/calendar', {
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
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/ports/grouped', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,

            task_id: this.task?.id,
            date: this.selectedDate,
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
        this.portItems = this.data.data.map((item) => {
          return {
            asset: item.asset.value,
            project: this.resolveProject(item.asset.project_id)?.name,
            link: {
              name: 'ProjectAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            },
            ports: item.ports
              ? item.ports
                  .map((port) => {
                    return "<span class='tag is-primary mr-2 mb-1'>" + port + '</span>'
                  })
                  .join()
                  .replaceAll(',', '')
              : '-',
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
        .get('/ports/export', {
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
    subdomainLink(item) {
      return {
        name: 'ReportsView',
        params: { id: this.task.id },
        query: { subdomain: slugify(item.subdomain) },
      }
    },
  },
}
</script>
