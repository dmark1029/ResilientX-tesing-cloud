<template>
  <div class="">
    <h4 class="title is-5">Subdomain's</h4>

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
      <div class="buttons item-buttons">
        <button
          type="button"
          aria-hidden="false"
          :class="downloading ? 'button v-button is-disabled' : 'button v-button'"
          @click="exportData"
        >
          <span class="icon rtl-reflect">
            <i aria-hidden="true" class="fa fa-file-export" />
          </span>
          <span class="is-hidden-mobile">
            {{ downloading ? $t('Downloading..') : $t('Export') }}
          </span>
        </button>
      </div>
    </div>

    <TableComponent
      id="subdomains"
      :loading="loading"
      :header="subdomainHeaders"
      :items="subdomainItems"
      :trial="trial"
      clickable="true"
      @sorting="sortingEvent"
    />

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
import _ from 'lodash'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination,
    AssetsDetailCalendarFilter,
    TableComponent,
  },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'specificDate'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    addToAssetsModal: false,
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    subdomainHeaders: [
      { text: 'Subdomain', value: 'subdomain', sortable: 'name' },
      { text: "IP's", value: 'ips', sortable: 'ips' },
      {
        text: 'Technologies',
        value: 'technologies',
        sortable: 'technologies',
        html: true,
      },
    ],
    data: null,
    subdomainItems: [
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
      { subdomain: '', ips: '', technologies: '' },
    ],
    loading: true,
    subdomain: null,
    sorting: '',
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
        .get('/subdomains/calendar', {
          params: {
            task_id: this.task?.id,
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
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/subdomains', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,

            task_id: this.task?.id,
            date: this.selectedDate,
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
        this.subdomainItems = this.data.data.map((item) => {
          return {
            subdomain: item.asset.value,
            ips: item.ips
              ? item.ips
                  .map((tech) => {
                    return tech.value
                  })
                  .join(', ')
              : '',
            technologies: item.technologies
              .map((tech) => {
                return (
                  '<img src="' +
                  this.imageHost +
                  '/' +
                  tech.icon +
                  '" style="height: 15px;margin-right:3px"> ' +
                  tech.name
                )
              })
              .join(', '),
            data: item,
            link: this.subdomainLink(item),
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
        .get('/subdomains/export', {
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
    hideModal() {
      this.subdomain = null

      if (this.$route.query.subdomain) {
        this.$router.go(-1)
      }
    },
    subdomainLink(item) {
      return {
        name: 'ProjectAssetView',
        params: { id: item.asset.project_id, asset: item.asset.id },
      }
    },
  },
}
</script>
