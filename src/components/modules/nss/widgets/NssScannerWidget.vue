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
      <span>{{ groups.length }} records found</span>
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
          <div v-if="groups.length">
            <VCollapse :items="groups" with-chevron>
              <template #collapse-item="group">
                <summary
                  class="collapse-header"
                  tabindex="0"
                  role="button"
                  @click="loadGroup(group.item.name)"
                >
                  <h3>
                    {{ group.item.name }}
                    <small class="ms-2"
                      >(Found in {{ group.item.alerts_count }} locations)</small
                    >
                  </h3>

                  <div class="collapse-head-info">
                    <div class="head-info">
                      <!-- eslint-disable vue/no-v-html -->
                      <span
                        v-dompurify-html="getImpact(group.item.severity)"
                        data-bs-toggle="tooltip"
                        title="Risk"
                        data-bs-trigger="hover"
                        class="me-2"
                      />
                      <!-- eslint-enable -->
                      <span class="tag is-info">{{ group.item.nvt_family }}</span>
                    </div>

                    <div class="collapse-icon">
                      <VIcon icon="fa fa-chevron-down" />
                    </div>
                  </div>
                </summary>
                <div class="collapse-content">
                  <div class="body-inner-content">
                    <div class="accordion-body">
                      <div v-if="isGroupLoaded(group.item.name)">
                        <h4 class="title is-5">Details</h4>

                        <div v-if="groupsLoaded[group.item.name].meta.total">
                          <p>
                            {{ groupsLoaded[group.item.name].data[0].nvt_tags.summary }}
                          </p>

                          <p>
                            {{ groupsLoaded[group.item.name].data[0].nvt_tags.solution }}
                          </p>

                          <p class="mb-2">
                            <b>Impact: </b>
                          </p>

                          <p class="mb-2">
                            {{
                              groupsLoaded[group.item.name].data[0].nvt_tags.impact ?? '-'
                            }}
                          </p>

                          <p class="mb-2">
                            <b>Insight: </b>
                          </p>

                          <p class="mb-2">
                            {{
                              groupsLoaded[group.item.name].data[0].nvt_tags.insight ??
                              '-'
                            }}
                          </p>

                          <p class="mb-2">
                            <b>Affected: </b>
                          </p>

                          <p class="mb-2">
                            {{
                              groupsLoaded[group.item.name].data[0].nvt_tags.affected ??
                              '-'
                            }}
                          </p>

                          <p class="mb-2">
                            <b>Vulnerability detection: </b>
                          </p>

                          <p class="mb-2">
                            {{
                              groupsLoaded[group.item.name].data[0].nvt_tags.vuldetect ??
                              '-'
                            }}
                          </p>

                          <p class="mb-2">
                            <b>References: </b>
                          </p>

                          <ul class="mb-2 ps-3">
                            <li
                              v-for="reference in groupsLoaded[group.item.name].data[0]
                                .references"
                              :key="reference"
                            >
                              <a
                                v-if="reference.type === 'url'"
                                :href="reference.id"
                                target="_blank"
                                >{{ reference.id }}</a
                              >
                              <span v-else>{{ reference.id }}</span>
                            </li>
                          </ul>

                          <p
                            v-if="groupsLoaded[group.item.name].showCvss"
                            class="mb-2 is-clickable"
                            @click="
                              () => {
                                groupsLoaded[group.item.name].showCvss =
                                  !groupsLoaded[group.item.name].showCvss
                              }
                            "
                          >
                            <b>Hide CVSS details</b>
                          </p>
                          <p
                            v-else
                            class="mb-2 is-clickable"
                            @click="
                              () => {
                                groupsLoaded[group.item.name].showCvss =
                                  !groupsLoaded[group.item.name].showCvss
                              }
                            "
                          >
                            <b>Show CVSS details</b>
                          </p>

                          <div
                            v-if="groupsLoaded[group.item.name].showCvss"
                            class="columns mb-0 is-multiline"
                          >
                            <div class="column is-2 has-text-light">
                              <b>CVSS base vector</b>
                            </div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].nvt_tags
                                  .cvss_base_vector
                              }}
                            </div>
                            <div class="column is-2 has-text-light"><b>Integrity</b></div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].cvss_base_vector
                                  .Integrity
                              }}
                            </div>
                            <div class="column is-2 has-text-light">
                              <b>Complexity</b>
                            </div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].cvss_base_vector
                                  .Complexity
                              }}
                            </div>
                            <div class="column is-2 has-text-light">
                              <b>Availability</b>
                            </div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].cvss_base_vector
                                  .Availability
                              }}
                            </div>
                            <div class="column is-2 has-text-light">
                              <b>Authentication</b>
                            </div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].cvss_base_vector
                                  .Authentication
                              }}
                            </div>
                            <div class="column is-2 has-text-light">
                              <b>Confidentiality</b>
                            </div>
                            <div class="column is-8 has-text-light">
                              {{
                                groupsLoaded[group.item.name].data[0].cvss_base_vector
                                  .Confidentiality
                              }}
                            </div>
                          </div>
                        </div>

                        <h4 class="font-54 fw-bold mt-4 mb-4 text-capitalize">
                          Effected targets
                        </h4>

                        <div
                          v-if="
                            groupsLoaded[group.item.name].meta &&
                            groupsLoaded[group.item.name].meta.total
                          "
                          class="datatable-container"
                          style="max-height: 600px; overflow-y: scroll"
                        >
                          <table
                            class="table datatable-table is-fullwidth table-hover mb-0"
                          >
                            <thead>
                              <tr>
                                <th>Risk</th>
                                <th>Hostname</th>
                                <th>IP</th>
                                <th>Port</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="item in groupsLoaded[group.item.name].data"
                                :key="item.id"
                                v-table-click="
                                  () => {
                                    showModal = true
                                    showItem = item
                                  }
                                "
                                class="is-clickable"
                              >
                                <!-- eslint-disable vue/no-v-html -->
                                <td v-dompurify-html="getImpact(item.severity)" />
                                <!-- eslint-enable -->
                                <td>{{ item.host_hostname ?? '-' }}</td>
                                <td>{{ item.host_text ?? '-' }}</td>
                                <td>{{ item.port }}</td>
                                <td>{{ item.description }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div v-else>
                          <p class="mt-3">No information found</p>
                        </div>

                        <div class="mt-3">
                          <Pagination
                            :data="groupsLoaded[group.item.name]"
                            @click="setPaginationGroup(group.item.name)"
                            @pagination-change-page="setPaginationPage"
                          />
                        </div>
                      </div>
                      <div v-else>
                        <!--                          <VLoader :active="true" class="loading p-5">-->
                        <!--                            <div role="status" style="height: 300px"></div>-->
                        <!--                          </VLoader>-->
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
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import Pagination from '/@src/components/Pagination.vue'
import VCollapse from '/@src/components/base/accordion/VCollapse.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VIcon from '/@src/components/base/icon/VIcon.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'

export default {
  components: { AssetsDetailCalendarFilter, VIcon, VLoader, VCollapse, Pagination },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'link'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    downloading: false,
    search: '',
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    certificatesHeaders: [
      { text: 'Name', value: 'name_value', sortable: false },
      { text: 'Issuer', value: 'issuer_name', sortable: false },
      { text: 'Serial number', value: 'serial_number', sortable: false },
      { text: 'Created', value: 'not_before', sortable: false },
      { text: 'Expires', value: 'not_after', sortable: false, html: true },
    ],
    data: null,
    groups: [],
    pagination: {
      group: null,
      page: null,
    },
    groupsLoaded: [],
    loading: true,
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
        .get('/network-details/calendar', {
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
      await axios
        .get('/network-details/grouped', {
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
          this.groups = res.data.data
          if (this.groups.length) {
            this.loadGroup(this.groups[0].name)
          }
          this.loading = false
        })
    },

    setPaginationGroup(group) {
      this.pagination.group = group
    },
    setPaginationPage(page) {
      this.pagination.page = page
    },

    async loadGroup(group, page) {
      await axios
        .get('/network-details', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,
            name: group,
            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.groupsLoaded[group] = res.data
          if (page) {
            this.setPaginationPage(null)
            this.setPaginationGroup(null)
          }
        })
    },
    async exportData() {
      if (this.trial) {
        return
      }

      this.downloading = true

      await axios
        .get('/network-details/export', {
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
    isGroupLoaded(group) {
      if (this.groupsLoaded[group]) {
        return true
      }

      return false
    },
    getImpact(cvss) {
      if (cvss >= 7) {
        return "<span class='tag is-danger mr-2'>High</span>"
      } else if (cvss >= 4) {
        return "<span class='tag is-warning mr-2'>Medium</span>"
      } else if (cvss && cvss >= 0) {
        if (cvss === '0.0') {
          return "<span class='tag is-info mr-2'>Info</span>"
        }
        return "<span class='tag is-info mr-2'>Low</span>"
      } else {
        return ''
      }
    },
  },
}
</script>
