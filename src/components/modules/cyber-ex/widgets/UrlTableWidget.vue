<template>
  <div>
    <h4 class="title is-5">URL's</h4>

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
      <div class="list-info">
        <span>{{ data.meta.total }} records found</span>
      </div>
      <div class="buttons">
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

    <AssetUrlsModal v-if="showImportModal" :asset="asset" @close="closeModal" />

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
import AssetUrlsModal from '/@src/components/assets/AssetUrlsModal.vue'

export default {
  components: {
    AssetUrlsModal,
    Pagination,
    TableComponent,
  },
  props: [
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
    form: new Form({}),
    showImportModal: false,
    calendarData: [],
    selectedDate: null,
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
    sorting: '',
    loading: true,
  }),
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    closeModal() {
      this.showImportModal = false
      this.getData()
    },
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
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
        .get('/urls', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.portItems = this.data.data.map((item) => {
          return {
            new: item.is_new ? '<span class="tag is-warning">NEW</span>' : '-',
            changed: item.is_changed
              ? '<span class="tag is-warning">CHANGED</span>'
              : '-',
            asset: item.asset.value,
            link: {
              name: 'ProjectAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            },
            url: item.url,
            type: item.type,
            status: item.status ?? '-',
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
        .get('/urls/export', {
          params: {
            q: this.search,
            sort: this.sorting,

            task_id: this.task?.id,
            date: this.selectedDate,
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
