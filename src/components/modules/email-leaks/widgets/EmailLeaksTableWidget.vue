<template>
  <div>
    <h4 class="title is-5">Credential leaks</h4>

    <div v-if="data" class="list-view-toolbar">
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
      <VField
        v-slot="{ id }"
        class="is-curved-select is-hidden-mobile"
        style="min-width: 180px"
      >
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
            placeholder="Select type"
          />
        </VControl>
      </VField>
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
import _ from 'lodash'
import Pagination from '/@src/components/Pagination.vue'
import projectMixin from '/@src/mixins/projectMixin'
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    VControl,
    VField,
    Pagination,
    Multiselect,
    TableComponent,
  },
  mixins: [projectMixin],
  props: [
    'project',
    'task',
    'collection',
    'asset',
    'trial',
    'link',
    'workspaceCollectionId',
    'specificDate',
    'workspace',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    portHeaders: [
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'Project', value: 'project', sortable: false },
      { text: 'Email', value: 'email', sortable: 'email' },
      { text: 'Password', value: 'password', sortable: 'password' },
      { text: 'Password type', value: 'password_type', sortable: 'password_type' },
      { text: 'Leak', value: 'leak', sortable: 'leak' },
      { text: 'Leak date', value: 'leak_date', sortable: 'leak_date' },
      { text: 'Severity', value: 'severity', sortable: 'severity', html: true },
    ],
    data: null,
    searchSeverity: null,
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
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    searchSeverity: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    if (this.project) {
      this.portHeaders.splice(1, 1)
    }
    if (!this.link) {
      this.portHeaders = this.portHeaders.slice(1)
    }
    if (this.$route.query.severity) {
      this.searchSeverity = this.$route.query.severity
    }
    this.sorting = 'severity'
    await this.getData()
  },
  methods: {
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    getSeverity(severity) {
      if (severity === 'critical') {
        return "<span class='tag is-critical'>Critical</span>"
      } else if (severity === 'high') {
        return "<span class='tag is-danger'>High</span>"
      } else if (severity === 'medium') {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (severity === 'low') {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return '-'
      }
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/email-leaks', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,
            task_id: this.task?.id,
            workspace_collection_id: this.workspaceCollectionId,
            date: this.selectedDate,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            severity: this.searchSeverity,
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
            email: item.email,
            password: item.password,
            password_type: item.password_type,
            leak: item.leak,
            leak_date: item.leak_date,
            severity: this.getSeverity(item.severity),
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
        .get('/email-leaks/export', {
          params: {
            q: this.search,
            sort: this.sorting,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_collection_id: this.workspaceCollectionId,
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
