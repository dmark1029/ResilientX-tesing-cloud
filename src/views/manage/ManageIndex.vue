<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="business-dashboard company-dashboard">
      <div class="company-header is-dark-card-bordered is-dark-bg-6">
        <div class="header-item is-dark-bordered-12">
          <div class="item-inner">
            <i aria-hidden="true" class="lnil fa fa-user is-dark-primary" />
            <span class="dark-inverted">{{ overview.workspaces_count }}</span>
            <p>Workspaces</p>
          </div>
        </div>
        <div class="header-item is-dark-bordered-12">
          <div class="item-inner">
            <i aria-hidden="true" class="lnil fa fa-users is-dark-primary" />
            <span class="dark-inverted">{{ overview.projects_count }}</span>
            <p>Projects</p>
          </div>
        </div>
        <div class="header-item is-dark-bordered-12">
          <div class="item-inner">
            <i aria-hidden="true" class="lnil fa fa-network-wired is-dark-primary" />
            <span class="dark-inverted">{{ overview.assets_count }}</span>
            <p>Assets</p>
          </div>
        </div>
        <!--        <div class="header-item is-dark-bordered-12">-->
        <!--          <div class="item-inner">-->
        <!--            <i aria-hidden="true" class="lnil fa fa-users is-dark-primary" />-->
        <!--            <span class="dark-inverted">{{ overview.scans_count }}</span>-->
        <!--            <p>Scans</p>-->
        <!--          </div>-->
        <!--        </div>-->
        <!--        <div class="header-item is-dark-bordered-12">-->
        <!--          <div class="item-inner">-->
        <!--            <i aria-hidden="true" class="lnil fa fa-users is-dark-primary" />-->
        <!--            <span class="dark-inverted">{{ overview.scans_issued_count }}</span>-->
        <!--            <p>Scans issued</p>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>

    <div class="columns">
      <div class="column is-12 col-xl-12">
        <div class="card">
          <div class="card-body">
            <div class="tile-grid-toolbar">
              <VControl icon="fa fa-search">
                <input
                  v-model="search"
                  class="input custom-text-filter"
                  placeholder="Search..."
                />
              </VControl>
            </div>

            <VTabs
              slider
              type="rounded"
              selected="all"
              :tabs="[
                { label: 'All workspaces', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Expiring soon', value: 'expiring' },
                { label: 'Without license', value: 'non-active' },
              ]"
              @update:selected="
                (value) => {
                  filter = value
                }
              "
            >
              <template #tab="">
                <div>
                  <div
                    v-if="licenses.meta && licenses.meta.total"
                    class="datatable-container"
                  >
                    <table class="table datatable-table is-fullwidth mb-0">
                      <thead>
                        <tr>
                          <th>Company</th>
                          <th>Workspace</th>
                          <th>Status</th>
                          <th>Type</th>
                          <th>Security app</th>
                          <th>Created</th>
                          <th>Expires</th>
                          <th style="min-width: 120px"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in licenses.data" :key="item.id">
                          <td>{{ item.setting?.name }}</td>
                          <td>
                            <router-link
                              :to="{
                                name: 'WorkspacesView',
                                params: { id: item.id },
                              }"
                            >
                              {{ item ? item.name : '-' }}
                            </router-link>
                          </td>
                          <td>
                            <span
                              v-if="item.activeLicense?.status === 'active'"
                              class="tag is-success"
                              >Active</span
                            >
                            <span v-else class="tag is-danger">Inactive</span>
                          </td>
                          <td>
                            <span v-if="item.trial" class="tag is-info">Trial</span>
                            <span v-else class="tag is-success">Standard</span>
                          </td>
                          <td>
                            {{
                              item.activeLicense?.modules
                                .map((item) => item.name)
                                .join(', ')
                            }}
                          </td>
                          <td>
                            <span v-tooltip="item.created">{{
                              item.activeLicense?.created_date
                            }}</span>
                          </td>
                          <td>
                            <span v-tooltip="item.expires">{{
                              item.activeLicense?.expires_date
                            }}</span>
                          </td>
                          <td>
                            <router-link
                              :to="{
                                name: 'WorkspaceLicensesView',
                                params: { id: item.id },
                              }"
                              @click.stop.prevent=""
                            >
                              <button
                                v-tooltip="'View licenses'"
                                class="button is-dark-outlined mr-2"
                              >
                                <span class="icon is-small fa fa-eye"></span>
                              </button>
                            </router-link>
                            <router-link
                              :to="{
                                name: 'WorkspaceLicensesView',
                                params: { id: item.id },
                              }"
                              @click.stop.prevent=""
                            >
                              <button
                                v-tooltip="'Add license'"
                                class="button is-dark-outlined"
                              >
                                <span class="icon is-small fa fa-plus"></span>
                              </button>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--end /table-->
                  </div>
                  <div v-else>
                    <p>No licenses</p>
                  </div>

                  <div class="mt-3">
                    <Pagination :data="licenses" @pagination-change-page="getLicenses" />
                  </div>
                </div>
              </template>
            </VTabs>
          </div>
        </div>
      </div>
    </div>

    <div class="columns">
      <div class="column is-12">
        <RegistrationLinksComponent />
      </div>
    </div>

    <div class="columns">
      <div class="column is-6">
        <StatisticsComponent title="License statistics" :types="['license']" />
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import { useMeta } from 'vue-meta'
import _ from 'lodash'
import StatisticsComponent from '../../components/statistics/StatisticsComponent.vue'
import RegistrationLinksComponent from '../../components/invites/RegistrationLinksComponent.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import Pagination from '/@src/components/Pagination.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VControl from '/@src/components/base/form/VControl.vue'

export default {
  components: {
    VControl,
    VTabs,
    Pagination,
    VBreadcrumb,
    StatisticsComponent,
    RegistrationLinksComponent,
    VLoader,
  },
  setup() {
    useMeta({
      title: `License manager dashboard`,
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    filter: 'all',
    overview: null,
    date: null,
    links: [],
    licenses: null,
    search: '',
  }),
  computed: {
    ...mapGetters(['loading', 'general']),
  },
  watch: {
    filter() {
      this.getLicenses()
    },
    search: _.debounce(function () {
      this.getLicenses()
    }, 500),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
  },
  async mounted() {
    this.date = new Date()

    await Promise.all([this.getLicenses(), this.getOverview()])
      .then(() => {
        this.links = [
          {
            label: 'Home',
            to: {
              name: 'Home',
            },
            active: false,
          },
          {
            label: 'Workspace licenses',
            to: {},
            active: true,
          },
        ]
      })
      .finally(() => {
        this.$store.dispatch('hideLoading')
      })
  },
  methods: {
    getOverview() {
      return axios
        .get('/overview/manage')
        .then((res) => {
          this.overview = res.data
        })
        .catch(() => {})
    },
    getLicenses(page = 1) {
      return axios
        .get(`/workspace?license=${this.filter}&page=${page}&q=${this.search}`)
        .then((res) => {
          this.licenses = res.data
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getAssets()
    },
  },
  metaInfo() {
    return {
      title: 'License manager dashboard',
    }
  },
}
</script>


<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.company-dashboard {
  .company-header {
    display: flex;
    padding: 20px;
    background: var(--white);
    border: 1px solid var(--fade-grey-dark-3);
    border-radius: var(--radius-large);
    margin-bottom: 1.5rem;

    .header-item {
      width: 33.33%;
      border-inline-end: 1px solid var(--fade-grey-dark-3);

      &:last-child {
        border-inline-end: none;
      }

      .item-inner {
        text-align: center;

        .lnil,
        .lnir {
          font-size: 1.8rem;
          margin-bottom: 6px;
          color: var(--primary);
        }

        span {
          display: block;
          font-family: var(--font);
          font-weight: 600;
          font-size: 1.6rem;
          color: var(--dark-text);
        }

        p {
          font-family: var(--font-alt);
          font-size: 0.95rem;
        }
      }
    }
  }

  .widget {
    height: 100%;
  }

  .dashboard-card {
    @include vuero-s-card;

    height: 100%;

    &.is-company {
      text-align: center;
      padding: 30px;

      .v-avatar {
        display: block;
        margin: 0 auto 10px;

        .button {
          position: absolute;
          bottom: 0;
          inset-inline-end: 0;
          max-width: 35px;
        }
      }

      > h3 {
        color: var(--dark-text);
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
      }

      > p {
        font-size: 0.9rem;
      }

      .description {
        padding: 10px 0 0;
      }

      .company-stats {
        display: flex;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid var(--fade-grey-dark-3);

        .company-stat {
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              text-transform: uppercase;
              font-family: var(--font-alt);
              font-size: 0.75rem;
              color: var(--light-text);
            }

            &:nth-child(2) {
              color: var(--dark-text);
              font-size: 1.4rem;
              font-weight: 600;
            }
          }
        }
      }
    }

    &.is-base-chart {
      padding: 0;
      display: flex;
      flex-direction: column;

      .content-box {
        padding: 30px;

        .revenue-stats {
          display: flex;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .revenue-stat {
            margin-inline-end: 30px;
            font-family: var(--font);

            span {
              display: block;

              &:first-child {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
              }

              &.current {
                color: var(--primary);
              }
            }
          }
        }
      }

      .chart-container {
        margin-top: auto;
      }
    }

    &.is-tickets {
      padding: 30px;

      .ticket-list {
        padding: 10px 0;

        .media-flex {
          + .media-flex {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--fade-grey-dark-3);
          }

          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 1rem;
                margin: 4px 0;
                color: var(--light-text-dark-20);
                max-width: 430px;
              }

              &:nth-child(3) {
                font-size: 0.9rem;
                color: var(--light-text);
              }
            }
          }
        }
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }
  }

  .table-wrapper {
    min-height: 0;
  }

  .dataTable-wrapper {
    .dataTable-top {
      padding: 0 !important;
      margin: 0 !important;
    }
  }
}

.is-dark {
  .company-dashboard {
    .dashboard-card {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .company-dashboard {
    .company-header {
      flex-wrap: wrap;

      .header-item {
        width: 50%;
        border-inline-end: none;
        border: none;
        padding: 16px 0;
      }
    }

    .dashboard-card {
      &.is-tickets {
        padding: 30px;

        .ticket-list {
          .media-flex {
            .flex-meta {
              margin-bottom: 1rem;
            }
          }
        }
      }
    }
  }
}

.apexcharts-toolbar {
  display: none !important;
}

.v3dp__popout[data-v-65eb861b] {
  z-index: 10;
  position: absolute;
  text-align: center;
  width: 17.5em;
  background-color: var(--popout-bg-color);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  padding: 8px 0 1em;
  color: var(--text-color);
}
.v3dp__popout *[data-v-65eb861b] {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}
.v3dp__popout[data-v-65eb861b] button {
  background: none;
  border: none;
  outline: none;
}
.v3dp__popout[data-v-65eb861b] button:not(:disabled) {
  cursor: pointer;
}
.v3dp__heading[data-v-65eb861b] {
  width: 100%;
  display: flex;
  height: var(--heading-size);
  line-height: var(--heading-size);
  font-weight: var(--heading-weight);
}
.v3dp__heading__button[data-v-65eb861b] {
  background: none;
  border: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--heading-size);
}
button.v3dp__heading__center[data-v-65eb861b]:hover,
.v3dp__heading__button[data-v-65eb861b]:not(:disabled):hover {
  background-color: var(--heading-hover-color);
}
.v3dp__heading__center[data-v-65eb861b] {
  flex: 1;
}
.v3dp__heading__icon[data-v-65eb861b] {
  height: 12px;
  stroke: var(--arrow-color);
}
.v3dp__heading__button:disabled .v3dp__heading__icon[data-v-65eb861b] {
  stroke: var(--elem-disabled-color);
}
.v3dp__subheading[data-v-65eb861b],
.v3dp__elements[data-v-65eb861b] {
  display: grid;
  grid-template-columns: var(--popout-column-definition);
  font-size: var(--elem-font-size);
}
.v3dp__subheading[data-v-65eb861b] {
  margin-top: 1em;
}
.v3dp__divider[data-v-65eb861b] {
  border: 1px solid var(--divider-color);
  border-radius: 3px;
}
.v3dp__elements[data-v-65eb861b] button:disabled {
  color: var(--elem-disabled-color);
}
.v3dp__elements[data-v-65eb861b] button {
  padding: 0.3em 0.6em;
}
.v3dp__elements[data-v-65eb861b] button span {
  display: block;
  line-height: 1.9em;
  height: 1.8em;
  border-radius: var(--elem-border-radius);
}
.v3dp__elements[data-v-65eb861b] button:not(:disabled):hover span {
  background-color: var(--elem-hover-bg-color);
  color: var(--elem-hover-color);
}
.v3dp__elements[data-v-65eb861b] button.selected span {
  background-color: var(--elem-selected-bg-color);
  color: var(--elem-selected-color);
}
.v3dp__elements[data-v-65eb861b] button.current span {
  font-weight: var(--elem-current-font-weight);
  outline: 1px solid var(--elem-current-outline-color);
}
.v3dp__column[data-v-81ac698d] {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 190px;
}
.v3dp__datepicker {
  --popout-bg-color: var(--vdp-bg-color, #fff);
  --box-shadow: var(
    --vdp-box-shadow,
    0 4px 10px 0 rgba(128, 144, 160, 0.1),
    0 0 1px 0 rgba(128, 144, 160, 0.81)
  );
  --text-color: var(--vdp-text-color, #000000);
  --border-radius: var(--vdp-border-radius, 3px);
  --heading-size: var(--vdp-heading-size, 2.5em);
  --heading-weight: var(--vdp-heading-weight, bold);
  --heading-hover-color: var(--vdp-heading-hover-color, #eeeeee);
  --arrow-color: var(--vdp-arrow-color, currentColor);
  --elem-color: var(--vdp-elem-color, currentColor);
  --elem-disabled-color: var(--vdp-disabled-color, #d5d9e0);
  --elem-hover-color: var(--vdp-hover-color, #fff);
  --elem-hover-bg-color: var(--vdp-hover-bg-color, #0baf74);
  --elem-selected-color: var(--vdp-selected-color, #fff);
  --elem-selected-bg-color: var(--vdp-selected-bg-color, #0baf74);
  --elem-current-outline-color: var(--vdp-current-date-outline-color, #888);
  --elem-current-font-weight: var(--vdp-current-date-font-weight, bold);
  --elem-font-size: var(--vdp-elem-font-size, 0.8em);
  --elem-border-radius: var(--vdp-elem-border-radius, 3px);
  --divider-color: var(--vdp-divider-color, var(--elem-disabled-color));
  position: relative;
}
.v3dp__clearable {
  display: inline;
  position: absolute;
  right: 15px;
  cursor: pointer;
  top: 5px;
}
</style>
