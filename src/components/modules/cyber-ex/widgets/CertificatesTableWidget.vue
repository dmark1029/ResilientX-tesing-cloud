<template>
  <div class="columns">
    <div class="column is-12">
      <div v-if="loading && !trial" class="card w-100">
        <div class="card-body">
          <h4 class="title is-5">Certificates</h4>
          <VLoader :active="true">
            <div style="height: 600px" />
          </VLoader>
        </div>
      </div>
      <div v-else-if="trial" class="card w-100">
        <div class="card-body">
          <h4 class="title is-5">Certificates</h4>
          <div style="height: 200px; cursor: auto" class="placeholder is-12 p-0 blur" />
        </div>
      </div>
      <div v-else class="card w-100">
        <div id="certificates" class="card-body">
          <h4 class="title is-5">Certificates</h4>

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

          <hr />

          <div v-if="certificatesItems.length" class="timeline-wrapper">
            <div class="timeline-header" />
            <div
              class="timeline-wrapper-inner has-slimscroll"
              style="max-height: 700px; overflow-y: scroll; overflow-x: hidden"
            >
              <div class="timeline-container">
                <div
                  v-for="certificatesItem in certificatesItems"
                  :key="certificatesItem.id"
                  class="timeline-item"
                >
                  <div class="date">
                    <span v-tooltip="`Certificate expiration date`">{{
                      certificatesItem.not_after
                    }}</span>
                  </div>
                  <div
                    :class="certificatesItem.expired ? 'dot is-danger' : 'dot is-success'"
                  />
                  <div class="content-wrap">
                    <div class="content-box">
                      <div class="box-text">
                        <div class="meta-text">
                          <p>
                            <span>{{ certificatesItem.common_name }}</span> ({{
                              certificatesItem.name_value
                            }})
                          </p>
                          <span v-tooltip="`Certificate creation date`">{{
                            certificatesItem.not_before
                          }}</span>
                        </div>
                      </div>
                      <div class="box-end">
                        <p class="description">
                          <span v-tooltip="`Certificate ID`">{{
                            certificatesItem.id
                          }}</span>
                          /
                          <span v-tooltip="`Certificate issuer`">{{
                            certificatesItem.issuer_name
                          }}</span>
                          /
                          <span v-tooltip="`Certificate issuer ID`">{{
                            certificatesItem.issuer_ca_id
                          }}</span>
                          /
                          <span v-tooltip="`Certificate serial number`">{{
                            certificatesItem.serial_number
                          }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="mb-0">No data found</p>

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
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import _ from 'lodash'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { mapGetters } from 'vuex'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'

export default {
  components: {
    Pagination,
    VLoader,
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
    'grouped',
    'specificDate',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    downloading: false,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    certificatesHeaders: [
      { text: 'Name', value: 'name_value', sortable: false },
      { text: 'Issuer', value: 'issuer_name', sortable: false },
      { text: 'Serial number', value: 'serial_number', sortable: false },
      { text: 'Created', value: 'not_before', sortable: false },
      { text: 'Expires', value: 'not_after', sortable: false, html: true },
    ],
    data: null,
    certificatesItems: [],
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
        .get('/certificates/calendar', {
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
        .get('/certificates', {
          params: {
            q: this.search,
            grouped: this.grouped,
            page: page,
            task_id: this.task?.id,
            workspace_id: this.workspace?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            sort: '-not_after',
            limit: this.limit,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.certificatesItems = this.data.data.map((item) => {
          let expired = false
          if (new Date(item.not_after).getTime() - new Date().getTime() < 0) {
            expired = true
          }

          return {
            common_name: item.common_name,
            entry_timestamp: item.entry_timestamp,
            id: item.identifier,
            issuer_ca_id: item.issuer_ca_id,
            issuer_name: item.issuer,
            name_value: item.name,
            serial_number: item.serial_number,
            not_after: this.formatDate(item.not_after),
            expired: expired,
            not_before: this.formatDate(item.not_before),
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
        .get('/certificates/export', {
          params: {
            q: this.search,

            task_id: this.task?.id,
            date: this.selectedDate,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            sort: '-not_after',
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
      const mydate = new Date(date)

      const year = mydate.getFullYear()
      const month = (mydate.getMonth() + 1).toString().padStart(2, '0') // Adding 1 to the month to make it one-based.
      const day = mydate.getDate().toString().padStart(2, '0')

      return `${year}.${month}.${day}`
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

/*
  1. Timeline
  2. Timeline Dark mode
  3. Media Queries
*/

/* ==========================================================================
1. Timeline
========================================================================== */
.timeline-wrapper {
  max-width: 940px;
  margin: 0 auto;

  .timeline-wrapper-inner {
    padding-top: 30px;

    .timeline-container {
      .timeline-item {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        &::before {
          content: '';
          position: absolute;
          top: 46px;
          inset-inline-start: 111px;
          height: 100%;
          width: 2px;
          background: var(--placeholder);
          z-index: 0;
        }

        &:last-child {
          &::before {
            display: none;
          }
        }

        &.is-unread {
          .content-wrap {
            .content-box {
              .status {
                background: var(--red) !important;
              }
            }
          }
        }

        .date {
          width: 80px;
          font-family: var(--font);
          text-align: inset-inline-end;

          span {
            font-size: 0.9rem;
            color: var(--light-text);
          }
        }

        .dot {
          position: relative;
          height: 14px;
          width: 14px;
          border-radius: var(--radius-rounded);
          border: 2.6px solid var(--primary);
          margin: 0 25px;
          z-index: 1;

          &.is-info {
            border-color: var(--info);
          }

          &.is-success {
            border-color: var(--success);
          }

          &.is-warning {
            border-color: var(--warning);
          }

          &.is-danger {
            border-color: var(--danger);
          }

          &.is-purple {
            border-color: var(--purple);
          }
        }

        .content-wrap {
          @include vuero-s-card;

          flex-grow: 2;

          .content-box {
            display: flex;
            align-items: center;

            .status {
              height: 8px;
              width: 8px;
              min-width: 8px;
              border-radius: var(--radius-rounded);
              background: var(--light-text-light-15);
              margin: 0 16px 0 0;
            }

            .box-text {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-inline-start: 12px;
              flex-grow: 2;

              .meta-text {
                line-height: 1.2;

                p {
                  color: var(--light-text-dark-10);

                  span {
                    font-family: var(--font-alt);
                    color: var(--dark-text);
                    font-weight: 600;
                  }

                  a {
                    color: var(--primary);
                  }

                  .tag {
                    position: relative;
                    top: -1px;
                    font-weight: 500;
                    line-height: 1.8;
                    height: 1.8em;
                    margin: 0 2px;
                  }
                }

                > span {
                  color: var(--light-text);
                  font-size: 0.9rem;
                }
              }
            }

            .box-end {
              margin-inline-start: auto;

              .v-avatar {
                margin: 0 2px;
              }
            }
          }

          .meta-content {
            padding-inline-start: 78px;
          }
        }
      }
    }

    .load-more-wrap {
      padding: 40px 0;

      .button {
        min-width: 240px;
        min-height: 50px;
        text-transform: uppercase;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--light-text);
      }
    }
  }
}

/* ==========================================================================
2. Timeline Dark mode
========================================================================== */

.is-dark {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      .timeline-container {
        .timeline-item {
          &::before {
            background: var(--dark-sidebar-light-20);
          }

          .content-wrap {
            @include vuero-card--dark;

            .content-box {
              .status {
                background: var(--dark-sidebar-light-20);
              }

              .box-text {
                .meta-text {
                  p {
                    span {
                      color: var(--dark-dark-text);
                    }

                    a {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }

      .load-more-wrap {
        .button {
          background: var(--dark-sidebar-light-2) !important;
        }
      }
    }
  }
}

/* ==========================================================================
3. Media Queries
========================================================================== */

@media only screen and (width <= 767px) {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .timeline-wrapper {
    .timeline-wrapper-inner {
      padding-top: 0;

      .timeline-container {
        .timeline-item {
          flex-direction: column;

          &::before {
            display: none;
          }

          .dot {
            display: none;
          }

          .date {
            align-self: end;
            margin-bottom: 4px;
          }

          .content-wrap {
            .content-box {
              .box-end {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
