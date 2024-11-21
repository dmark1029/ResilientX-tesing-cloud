<template>
  <div class="">
    <h4 class="title is-5">Typosquatting's</h4>

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

    <div id="typosquattings">
      <TableComponent
        :header="typosquattingHeaders"
        :loading="loading"
        :trial="trial"
        :clickable="link"
        :items="typosquattingItems"
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
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    typosquattingHeaders: [
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'Project', value: 'project', sortable: false },
      { text: 'Domain', value: 'domain', sortable: 'name' },
      {
        text: 'Risk',
        value: 'risk',
        sortable: 'risk',
        sortable_value: 'risk',
        html: true,
      },
      {
        text: 'Registrar',
        value: 'registrar',
        sortable: 'register',
      },
      { text: 'DNS', value: 'dns', sortable: 'dns' },
      {
        text: 'Created',
        value: 'creation_date',
        sortable: 'registered_at',
      },
      {
        text: 'Expires',
        value: 'expiration_date',
        sortable: 'expires_at',
      },
      { text: 'New', value: 'new', sortable: 'is_new', html: true },
      { text: 'Changed', value: 'changed', sortable: 'is_changed', html: true },
    ],
    data: null,
    page: 1,
    sorting: 'risk',
    typosquattingItems: [
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
      {
        domain: '',
        risk: '',
        registrar: '',
        dns: '',
        creation_date: '',
        expiration_date: '',
      },
    ],
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
      this.typosquattingHeaders.splice(1, 1)
    }
    if (!this.link) {
      this.typosquattingHeaders = this.typosquattingHeaders.slice(1)
    }
    if (!this.calendar) {
      this.typosquattingHeaders = this.typosquattingHeaders.slice(0, -2)
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
        .get('/typosquattings/calendar', {
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
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/typosquattings', {
          params: {
            q: this.search,
            page: page,
            grouped: this.grouped,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            sort: this.sorting,
            limit: this.limit,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.typosquattingItems = this.data.data.map((item) => {
          let dns = ''
          if (item.dns?.a !== 'N/A' && item.dns?.a) {
            dns = dns + 'A records: ' + item.dns.a.join(', ')
          } else {
            dns = dns + 'A records: -'
          }
          if (item.dns?.mx !== 'N/A' && item.dns?.mx) {
            dns = dns + ' | MX records: ' + item.dns.mx.join(', ')
          } else {
            dns = dns + ' | MX records: -'
          }
          if (item.dns?.ns !== 'N/A' && item.dns?.ns) {
            dns = dns + ' | NS records: ' + item.dns.ns.join(', ')
          } else {
            dns = dns + ' | NS records: -'
          }

          let risk_value = 0
          if (item.risk === 'High') {
            risk_value = 3
          }
          if (item.risk === 'Medium') {
            risk_value = 2
          }
          if (item.risk === 'Low') {
            risk_value = 1
          }

          return {
            new: item.is_new ? '<span class="tag is-warning">NEW</span>' : '-',
            changed: item.is_changed
              ? '<span class="tag is-warning">CHANGED</span>'
              : '-',
            asset: item.asset.value,
            project: this.resolveProject(item.asset.project_id)?.name,
            link: {
              name: 'ProjectAssetView',
              params: { id: item.asset.project_id, asset: item.asset.id },
            },
            domain: item.name,
            risk: this.getBadge(item.risk),
            risk_value: risk_value,
            registrar: item.register,
            dns: dns,
            creation_date: this.formatDate(item.registered_at),
            expiration_date: this.formatDate(item.expires_at),
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
        .get('/typosquattings/export', {
          params: {
            q: this.search,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            sort: this.sorting,
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
    formatDate(date) {
      if (!date) {
        return null
      }
      const mydate = new Date(date)
      return (
        mydate.getFullYear() +
        '.' +
        (mydate.getMonth() > 9 ? mydate.getMonth() : '0' + mydate.getMonth()) +
        '.' +
        (mydate.getDay() > 9 ? mydate.getDay() : '0' + mydate.getDay())
      )
    },

    getBadge(text) {
      if (text === 'High') {
        return "<span class='tag is-danger'>High</span>"
      } else if (text === 'Medium') {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (text === 'Low') {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return '-'
      }
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
