<template>
  <div>
    <h4 class="title is-5">Technologies</h4>

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

    <div id="technologies">
      <TableComponent
        :loading="loading"
        :header="techHeaders"
        :items="techItems"
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
import _ from 'lodash'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'
import projectMixin from '/@src/mixins/projectMixin'
import TableComponent from '/@src/components/modules/widgets/TableComponent.vue'

export default {
  components: {
    TableComponent,
    Pagination,
    AssetsDetailCalendarFilter,
  },
  mixins: [projectMixin],
  props: [
    'workspaceCollectionId',
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
    'detailed',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    techHeaders: [
      { text: 'Company', value: 'company', sortable: false },
      { text: 'Asset', value: 'asset', sortable: 'asset', html: true },
      { text: 'Name', value: 'name', sortable: 'name' },
      { text: 'Version', value: 'version', sortable: 'version' },
      { text: 'Categories', value: 'categories', sortable: 'categories' },
      {
        text: 'Description',
        value: 'description',
        sortable: 'description',
      },
      { text: 'New', value: 'new', sortable: 'is_new', html: true },
      { text: 'Changed', value: 'changed', sortable: 'is_changed', html: true },
    ],
    data: null,
    techItems: [
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
    sorting: 'latest',
    loading: true,
  }),
  computed: {
    ...mapGetters(['module', 'limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    if (!this.detailed) {
      this.techHeaders.splice(0, 1)
    }
    if (!this.link) {
      this.techHeaders = this.techHeaders.slice(1)
    }
    if (!this.calendar) {
      this.techHeaders = this.techHeaders.slice(0, -2)
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
        .get('/technologies/calendar', {
          params: {
            task_id: this.task?.id,
            workspace_collection_id: this.workspaceCollectionId,
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
        .get('/technologies', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,
            grouped: this.grouped,
            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            workspace_collection_id: this.workspaceCollectionId,
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
        this.techItems = this.data.data.map((item) => {
          let link = {
            name: this.$route.name.startsWith('VrmManage')
              ? 'VrmManageAssetView'
              : 'VRMAssetView',
            params: { id: item.asset.project_id, asset: item.asset.id },
          }

          return {
            new: item.is_new ? '<span class="tag is-warning">NEW</span>' : '-',
            changed: item.is_changed
              ? '<span class="tag is-warning">CHANGED</span>'
              : '-',
            asset: item.asset.value,
            company: item.asset.collections
              .filter((collection) => {
                return collection.status === 'active'
              })
              .map((collection) => collection.name)
              .join(', '),
            link: link,
            image: item.icon,
            name: item.name,
            website: item.website,
            version: item.version,
            description: item.description,
            categories: item.categories.join(', '),
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
        .get('/technologies/export', {
          params: {
            q: this.search,
            sort: this.sorting,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            workspace_collection_id: this.workspaceCollectionId,
            workspace_id: this.workspace?.id,
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
