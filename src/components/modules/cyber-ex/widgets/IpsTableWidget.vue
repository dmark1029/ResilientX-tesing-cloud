<template>
  <div>
    <h4 class="title is-5">IP addresses</h4>

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

    <div class="datatable-container-full">
      <TableComponent
        :header="ipHeaders"
        :height="height"
        :loading="loading"
        :items="ipItems"
        :trial="trial"
        :clickable="!!task"
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
    ipHeaders: [
      { text: 'IP', value: 'ip', sortable: 'name' },
      {
        text: 'Hosts',
        value: 'hosts_count',
        sortable: false,
      },
      {
        text: 'Ports',
        value: 'ports',
        sortable: false,
        html: true,
      },
      {
        text: 'Vulnerabilities',
        value: 'has_vulnerabilities',
        sortable: 'vulnerabilities_count',
        html: true,
      },
    ],
    data: null,
    ipItems: [
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
      {
        ip: '',
        hosts_count: '',
        vulnerabilities_count: '',
        has_vulnerabilities: '',
      },
    ],
    loading: true,
    ip: null,
    sorting: '-vulnerabilities_count',
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
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getCalendarData() {
      await axios
        .get('/ips/calendar', {
          params: {
            task_id: this.task?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.calendarData = res.data.data
          // eslint-disable-next-line vue/no-mutating-props
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
        .get('/ips', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            grouped: true,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.ipItems = this.data.data.map((item) => {
          return {
            ip: item.asset.value,
            ports: item.ports
              ? item.ports
                  .map((port) => {
                    return "<span class='tag is-primary mr-2'>" + port + '</span>'
                  })
                  .join()
                  .replaceAll(',', '')
              : '-',
            hosts_count: item.hosts_count,
            vulnerabilities_count: item.vulnerabilities_count,
            data: item,
            link: this.ipLink(item),
            has_vulnerabilities:
              item.vulnerabilities_count > 0
                ? "<span class='tag is-danger'>" +
                  item.vulnerabilities_count +
                  ' Potential vulnerabilities found</span>'
                : "<span class='tag is-success'>No vulnerabilities found</span>",
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
        .get('/ips/export', {
          params: {
            q: this.search,
            sort: this.sorting,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            grouped: true,
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
    ipLink(item) {
      return {
        name: 'ProjectAssetView',
        params: { id: item.asset.project_id, asset: item.asset.id },
      }
    },
  },
}
</script>
