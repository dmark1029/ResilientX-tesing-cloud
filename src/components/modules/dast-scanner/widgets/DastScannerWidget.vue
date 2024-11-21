<template>
  <h4 class="title is-5">Risks</h4>

  <div v-if="!loading" class="list-view-toolbar">
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
      <span>{{ groups.data.length }} records found</span>
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

  <div class="columns">
    <div class="column is-12">
      <div v-if="loading" class="card w-100">
        <div class="card-body">
          <div style="height: 600px">
            <VLoader :active="true" class="loading p-5">
              <div role="status" style="height: 300px"></div>
            </VLoader>
          </div>
        </div>
      </div>
      <div v-else class="card w-100">
        <div class="card-body">
          <div v-if="groups.data.length">
            <VCollapse :items="groups.data" with-chevron>
              <template #collapse-item="group">
                <summary
                  class="collapse-header"
                  tabindex="0"
                  role="button"
                  @click="loadGroup(group.item.ref)"
                >
                  <h3>
                    {{ group.item.cwe_title }}
                    <small class="ms-2"
                      >(Found in {{ group.item.alerts_count }} locations)</small
                    >
                  </h3>
                  <div class="collapse-head-info">
                    <div class="head-info">
                      <!-- eslint-disable vue/no-v-html -->
                      <span
                        v-dompurify-html="getRisk(group.item.risk)"
                        data-bs-toggle="tooltip"
                        title="Vulnerability risk"
                        data-bs-trigger="hover"
                        class="mr-2"
                      />
                      <!-- eslint-enable -->
                      <span v-tooltip="group.item.cwe" class="tag is-info">{{
                        group.item.cwe
                      }}</span>
                    </div>
                    <div class="collapse-icon">
                      <VIcon icon="fa fa-chevron-down" />
                    </div>
                  </div>
                </summary>
                <div class="collapse-content">
                  <div class="body-inner-content">
                    <div class="accordion-body">
                      <div v-if="isGroupLoaded(group.item.ref)">
                        <div v-if="zapsLoaded[group.item.ref]" class="mb-3">
                          <p class="mb-2">
                            <b>{{ zapsLoaded[group.item.ref].title }}</b>
                          </p>
                          <p class="mb-2">
                            {{ zapsLoaded[group.item.ref].description ?? '-' }}
                          </p>
                          <p class="mb-2">
                            <b>Other information: </b>
                            {{ zapsLoaded[group.item.ref].other ?? '-' }}
                          </p>
                          <p class="mb-2">
                            <b>Solution: </b>
                            {{ zapsLoaded[group.item.ref].solution ?? '-' }}
                          </p>

                          <div
                            v-if="zapsLoaded[group.item.ref].references?.length"
                            class="mb-2"
                          >
                            <p class="mb-2"><b>References</b></p>
                            <ul>
                              <li
                                v-for="reference in zapsLoaded[group.item.ref].references"
                                :key="reference"
                              >
                                <p>
                                  <a :href="reference" target="_blank">{{ reference }}</a>
                                </p>
                              </li>
                            </ul>
                          </div>

                          <div
                            v-if="zapsLoaded[group.item.ref].alerttags?.length"
                            class="mb-2"
                          >
                            <p class="mb-2"><b>Tags</b></p>
                            <span
                              v-for="tag in zapsLoaded[group.item.ref].alerttags"
                              :key="tag"
                            >
                              <span class="tag is-capitalized mr-2">{{ tag }}</span>
                            </span>
                          </div>
                        </div>

                        <h4 class="title is-5">Effected URL's</h4>

                        <div
                          v-if="
                            groupsLoaded[group.item.ref].meta &&
                            groupsLoaded[group.item.ref].meta.total
                          "
                          class="datatable-container"
                          style="max-height: 600px; overflow-y: scroll"
                        >
                          <table
                            class="table datatable-table is-fullwidth table-hover mb-0"
                          >
                            <thead>
                              <tr>
                                <th v-if="link">Asset</th>
                                <th>Risk</th>
                                <th>Confidence</th>
                                <th>URL</th>
                                <th>Method</th>
                                <th>Parameters</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in groupsLoaded[group.item.ref].data"
                                :key="item.id"
                                v-table-click="
                                  () => {
                                    showModal = true
                                    showItem = item
                                  }
                                "
                                class="is-clickable"
                              >
                                <td v-if="link">
                                  <router-link
                                    :to="{
                                      name: 'ProjectAssetView',
                                      params: {
                                        id: item.asset.project_id,
                                        asset: item.asset.id,
                                      },
                                    }"
                                    >{{ item.asset.value }}</router-link
                                  >
                                </td>
                                <!-- eslint-disable vue/no-v-html -->
                                <td v-dompurify-html="getRisk(item.risk)" />
                                <!-- eslint-enable -->
                                <td>{{ item.confidence }}</td>
                                <td>{{ item.url }}</td>
                                <td>{{ item.method }}</td>
                                <td>
                                  {{ item.parameters ? item.parameters : '-' }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--end /table-->
                        </div>
                        <div v-else>
                          <p class="mt-3">No scans found</p>
                        </div>

                        <div class="mt-3">
                          <Pagination
                            :data="groupsLoaded[group.item.ref]"
                            @click="setPaginationGroup(group.item.ref)"
                            @pagination-change-page="setPaginationPage"
                          />
                        </div>
                      </div>
                      <div v-else-if="!trial">
                        <VLoader :active="true" class="loading p-5">
                          <div role="status" style="height: 300px"></div>
                        </VLoader>
                      </div>
                      <div v-else class="h-100 p-2">
                        <div>
                          <VMessage color="danger" class="mb-0">
                            <strong>Trial task.</strong> This report is generated in trial
                            mode, for detailed information upgrade required
                          </VMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </VCollapse>
          </div>
          <p v-else class="mb-0">No data found</p>
        </div>
      </div>
    </div>

    <DastScannerModal
      v-if="showModal"
      :item="showItem"
      @closeModal="
        () => {
          showModal = false
          showItem = null
        }
      "
    />
  </div>
</template>

<script>
import { axios } from '/@src/axios'

import DastScannerModal from './DastScannerModal.vue'
import _ from 'lodash'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import VCollapse from '/@src/components/base/accordion/VCollapse.vue'
import Pagination from '/@src/components/Pagination.vue'
import VMessage from '/@src/components/base/message/VMessage.vue'
import VIcon from '/@src/components/base/icon/VIcon.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VIcon,
    VMessage,
    VLoader,
    Pagination,
    VCollapse,
    AssetsDetailCalendarFilter,
    DastScannerModal,
  },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'link'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    downloading: false,
    search: '',
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    data: null,
    groups: [],
    pagination: {
      group: null,
      page: null,
    },
    groupsLoaded: [],
    zapsLoaded: [],
    loading: true,
    showModal: false,
    showItem: null,
  }),
  watch: {
    pagination: {
      deep: true,
      handler() {
        if (this.pagination.group && this.pagination.page) {
          this.loadGroup(this.pagination.group, this.pagination.page)
        }
      },
    },
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    if (this.calendar) {
      await this.getCalendarData()
    }
    await this.getData()
  },
  methods: {
    async getCalendarData() {
      await axios
        .get('/alerts/calendar', {
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
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/alerts/grouped', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,
            grouped: true,
            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.groups = res.data
          this.loading = false
        })
    },
    async exportData() {
      if (this.trial) {
        return
      }

      this.downloading = true

      await axios
        .get('/alerts/export', {
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

    setPaginationGroup(group) {
      this.pagination.group = group
    },
    setPaginationPage(page) {
      this.pagination.page = page
    },

    async loadGroup(group, page) {
      if (this.trial) {
        return
      }
      await axios
        .get('/alerts', {
          params: {
            ref: group,
            sort: 'risk',
            page: page,
            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then(async (res) => {
          await axios
            .get(`/zap/${group}`)
            .then((res) => {
              this.zapsLoaded[group] = res.data
            })
            .catch(() => {})

          this.groupsLoaded[group] = res.data
          if (page) {
            this.setPaginationPage(null)
            this.setPaginationGroup(null)
          }
        })
    },
    isGroupLoaded(group) {
      if (this.groupsLoaded[group]) {
        return true
      }

      return false
    },
    getRisk(risk) {
      if (risk === 'High') {
        return "<span class='tag is-danger'>High</span>"
      } else if (risk === 'Medium') {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (risk === 'Low') {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return ''
      }
    },
  },
}
</script>
