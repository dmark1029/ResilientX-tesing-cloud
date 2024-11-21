<template>
  <div>
    <div v-if="!loading" class="tile-grid-toolbar assets">
      <div class="asset-filters">
        <div class="columns w-100">
          <div class="column is-3 pt-0 pb-0">
            <VField>
              <VControl>
                <VInput v-model="search" type="text" placeholder="Search..." />
              </VControl>
            </VField>
          </div>
          <div class="column pt-0 is-3 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="searchStatus"
                  :attrs="{ id }"
                  :options="{
                    opened: 'Opened',
                    closed: 'Closed',
                  }"
                  placeholder="Status"
                />
              </VControl>
            </VField>
          </div>
          <div class="column pt-0 is-3 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="searchPriority"
                  :attrs="{ id }"
                  :options="general.vrm.priorities"
                  placeholder="Priority"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="loading || !items" class="app-init-wrapper">
        <VLoader class="is-grey" :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="items?.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="items?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    v-if="columns['Title']"
                    :sort="sort"
                    title="Title"
                    slug="title"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Company']"
                    :sort="sort"
                    title="Company"
                    slug="company"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Status']"
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Priority']"
                    :sort="sort"
                    title="Priority"
                    slug="priority"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Due date']"
                    :sort="sort"
                    title="Due date"
                    slug="due_date"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Created']"
                    :sort="sort"
                    title="Created"
                    slug="created"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="vendor-requests-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items.data"
                  :key="item.id"
                  v-table-click="
                    () =>
                      $router.push({
                        name: 'VRMIssueView',
                        params: { issue: item.issue_id },
                        query: { id: item.id },
                      })
                  "
                  class="is-clickable"
                >
                  <td v-if="columns['Title']">{{ item.title }}</td>
                  <td v-if="columns['Company']">{{ item.vendor.name }}</td>
                  <td v-if="columns['Status']">
                    <RemediationRequestBadge :status="item.status" />
                  </td>
                  <td v-if="columns['Priority']">
                    <RemediationRequestPriorityBadge :priority="item.priority" />
                  </td>
                  <td v-if="columns['Due date']">
                    {{ item.due ?? '-' }}
                  </td>
                  <td v-if="columns['Created']">
                    {{ item.created }}
                  </td>
                  <td
                    :class="
                      !item.isMessageSeen
                        ? 'is-flex is-justify-content-space-between is-align-items-center'
                        : ''
                    "
                  >
                    <div v-if="!item.isMessageSeen" class="tag is-success">
                      New Message
                    </div>
                    <router-link
                      :to="{
                        name: 'VRMIssueView',
                        params: { issue: item.issue_id },
                        query: { id: item.id },
                      }"
                      class="button is-dark-outlined mr-2"
                    >
                      <span class="icon is-small fa fa-eye"></span>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination :limit="5" :data="items" @pagination-change-page="getData" />
      </div>
    </div>
  </div>

  <div class="breadcrumb-wrapper">
    <VBreadcrumb :items="links" :center="true" />
  </div>
</template>

<script>
import { axios } from '/src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import RemediationRequestBadge from '/@src/components/vendors/RemediationRequestBadge.vue'
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import Multiselect from '@vueform/multiselect'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import RemediationRequestPriorityBadge from '/@src/components/vendors/RemediationRequestPriorityBadge.vue'
import _ from 'lodash'

export default {
  components: {
    RemediationRequestPriorityBadge,
    TableCustomizationDropdown,
    TableSortableHeader,
    VInput,
    VControl,
    VField,
    Multiselect,
    RemediationRequestBadge,
    VBreadcrumb,
    Pagination,
    NoData,
    VLoader,
  },
  props: ['vendorIds', 'vendorId'],
  data: () => ({
    loading: false,
    items: [],

    search: '',
    searchStatus: '',
    searchPriority: '',
    sort: '',

    columns: {
      Title: true,
      Company: true,
      Status: true,
      Priority: true,
      'Due date': true,
      Created: true,
    },
  }),
  computed: {
    ...mapGetters(['workspace', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getData()
    }, 500),
    searchPriority: _.debounce(function () {
      this.getData()
    }, 500),
    sort: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    this.loadColumns()

    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
      },
      {
        label: 'Remediation Requests',
        to: {},
      },
    ]

    this.loading = true

    await Promise.all([this.getData()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendor-requests-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getData(page = 1) {
      return axios
        .get(`/remediation-request`, {
          params: {
            workspace_id: this.workspace.id,
            q: this.search,
            sort: this.sort,
            status: this.searchStatus,
            priority: this.searchPriority,
            page: page,
          },
        })
        .then((res) => {
          this.items = res.data
          this.items.data = this.items.data.map((item) => {
            const isMessageSeen =
              item.comments.length === 0 ||
              item.comments.every((comment) => {
                if (comment.vendor_id) {
                  return comment.is_seen
                }
                return true
              })
            return {
              ...item,
              isMessageSeen,
            }
          })
        })
        .catch(() => {})
    },
  },
  metaInfo() {
    return {
      title: 'Remediation requests',
    }
  },
}
</script>


<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}
.asset-filters {
  display: flex;
  align-self: center;
  min-width: 85%;
}
.tile-grid-toolbar .control {
  margin-inline-end: 0px;
}
@media (width <= 767px) {
  .asset-filters {
    min-width: 70%;
  }
}
</style>