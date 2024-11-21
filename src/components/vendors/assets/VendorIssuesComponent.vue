<template>
  <IssuesStatsWidget
    :workspace="workspace"
    :workspace-collection-id="workspaceCollectionId"
    :project="project"
    :asset="asset"
    :collection="collection"
    :detailed="true"
  />

  <div v-if="!loading">
    <div v-if="hideFilter" class="mt-5"></div>
    <div v-else class="tile-grid-toolbar assets mt-5">
      <div class="asset-filters">
        <div class="columns w-100">
          <div class="column is-one-fifth pt-0 pb-0">
            <VField>
              <VControl>
                <VInput v-model="search" type="text" placeholder="Search..." />
              </VControl>
            </VField>
          </div>
          <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="issue_type_id"
                  :attrs="{ id }"
                  :options="general.issues.categories"
                  placeholder="Select category"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="severity"
                  mode="multiple"
                  :attrs="{ id }"
                  :options="general.issues.severities"
                  placeholder="Select severity"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="status"
                  :attrs="{ id }"
                  :options="general.issues.statuses"
                  placeholder="Select status"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>

    <div v-if="issues && issues.meta && issues.meta.total" class="datatable-container">
      <table class="table datatable-table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <TableSortableHeader
              v-if="detailed"
              :sort="sort"
              title="Company"
              slug="vendor"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Asset"
              slug="asset"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Title"
              slug="title"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Category"
              slug="issue_type_id"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Severity"
              slug="severity"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Status"
              slug="status"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Created"
              slug="created_at"
              @changeSort="changeSort"
            />
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in issues.data"
            :key="item.id"
            v-table-click="() => goToIssue(item)"
            class="is-clickable"
          >
            <td v-if="detailed">
              {{
                item.asset.collections
                  .filter((collection) => {
                    return collection.status === 'active'
                  })
                  .map((collection) => collection.name)
                  .join(', ')
              }}
            </td>
            <td>{{ item.asset.value }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.type.title }}</td>
            <td><IssueSeverityBadge :severity="item.severity" /></td>
            <td><IssueStatusBadge :status="item.status_text" /></td>
            <td>{{ item.created }}</td>
            <td>
              <router-link :to="getIssueURL(item)" @click.stop.prevent="">
                <button v-tooltip="'View issue'" class="button is-dark-outlined mr-2">
                  <span class="icon is-small fa fa-eye"></span>
                </button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <NoData :meta="issues.meta" />
    </div>

    <div class="mt-3">
      <Pagination
        :data="issues"
        :limit="5"
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
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import Pagination from '/@src/components/Pagination.vue'
import NoData from '/@src/components/NoData.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import IssueStatusBadge from '/@src/components/issues/IssueStatusBadge.vue'
import IssueSeverityBadge from '/@src/components/issues/IssueSeverityBadge.vue'
import _ from 'lodash'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import projectMixin from '/@src/mixins/projectMixin'
import permissionsMixin from '/@src/mixins/permissionsMixin'

export default {
  components: {
    TableSortableHeader,
    VField,
    VControl,
    VInput,
    IssueSeverityBadge,
    IssueStatusBadge,
    IssuesStatsWidget,
    NoData,
    Pagination,
    Multiselect,
  },
  mixins: [permissionsMixin, urlMixin, projectMixin],
  props: [
    'project',
    'collection',
    'asset',
    'hideFilter',
    'defaultSort',
    'vrm',
    'workspace',
    'workspaceCollectionId',
    'detailed',
  ],
  data() {
    return {
      search: '',
      severity: ['critical', 'high', 'medium', 'low'],
      status: '',
      module_id: '',
      issue_type_id: '',
      sort: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['issues', 'general', 'module', 'limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    severity: _.debounce(function () {
      this.getData()
    }, 500),
    status: _.debounce(function () {
      this.getData()
    }, 500),
    module_id: _.debounce(function () {
      this.getData()
    }, 500),
    issue_type_id: _.debounce(function () {
      this.getData()
    }, 500),
    sort: _.debounce(function () {
      this.getData()
    }, 500),
  },
  mounted() {
    this.loading = true
    this.$store.dispatch('addIssues', {})

    if (this.$route.query.severity) {
      this.severity = [this.$route.query.severity]
    }

    if (this.$route.query.status) {
      this.status = this.$route.query.status
    }

    if (this.$route.query.module_id) {
      this.module_id = this.$route.query.module_id
    }

    if (this.defaultSort) {
      this.sort = this.defaultSort
    }

    this.getData()
  },
  methods: {
    changeSort(sort) {
      this.sort = sort
    },
    getData(page = 1) {
      axios
        .get('/issue', {
          params: {
            workspace_collection_id: this.workspaceCollectionId,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            page: page,
            q: this.search || '',
            severity: this.severity || '',
            status: this.status || '',
            module_id: this.module_id || '',
            issue_type_id: this.issue_type_id || '',
            sort: this.sort || '',
            limit: this.limit,
          },
        })
        .then((res) => {
          this.loading = false
          this.$store.dispatch('addIssues', res.data)
        })
        .catch(() => {})
    },
    goToIssue(item) {
      this.$router.push(this.getIssueURL(item))
    },
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
