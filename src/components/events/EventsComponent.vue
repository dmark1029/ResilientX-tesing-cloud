<template>
  <div>
    <div v-if="!loading" class="tile-grid-toolbar assets mt-5">
      <div class="asset-filters">
        <div class="columns w-100">
          <div class="column is-one-fifth pt-0 pb-0">
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
          <div class="column is-one-fifth pt-0 pb-0 is-hidden-mobile">
            <VField v-slot="{ id }" class="is-curved-select">
              <VControl>
                <Multiselect
                  v-model="type"
                  :attrs="{ id }"
                  :options="general.events.categories"
                  placeholder="Select type"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>

    <VLoader v-if="loading && !events?.meta" :active="loading">
      <div style="height: 160px" />
    </VLoader>

    <div v-if="events && events.meta && events.meta.total" class="datatable-container">
      <table class="table datatable-table is-fullwidth is-hoverable">
        <thead>
          <tr>
            <TableSortableHeader
              :sort="sort"
              title="Item"
              slug="asset"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              v-if="!project"
              :sort="sort"
              title="Project"
              slug="project"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Type"
              slug="type"
              @changeSort="changeSort"
            />
            <TableSortableHeader
              :sort="sort"
              title="Description"
              slug="type"
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
            v-for="item in events.data"
            :key="item.id"
            v-table-click="() => goToAsset(item)"
            class="is-clickable"
          >
            <td>
              <span v-if="item.asset">
                {{ item.asset.value }}
              </span>
              <span v-else-if="item.collection">
                {{ item.collection.name }}
              </span>
            </td>
            <td v-if="!project">
              {{ resolveProject(item.project_id)?.name }}
            </td>
            <td>{{ item.type_text }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.created }}</td>
            <td>
              <router-link :to="getUrl(item)" @click.stop.prevent="">
                <button v-tooltip="'View asset'" class="button is-dark-outlined mr-2">
                  <span class="icon is-small fa fa-eye"></span>
                </button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <NoData :meta="events.meta" />
    </div>

    <div class="mt-3">
      <Pagination
        :data="events"
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

import permissionsMixin from '../../mixins/permissionsMixin.js'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import _ from 'lodash'
import VInput from '/@src/components/base/form/VInput.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import projectMixin from '/@src/mixins/projectMixin'

export default {
  components: {
    VLoader,
    TableSortableHeader,
    VField,
    VControl,
    VInput,
    Pagination,
    NoData,
    Multiselect,
  },
  mixins: [permissionsMixin, urlMixin, projectMixin],
  props: ['project', 'collection', 'asset', 'workspace', 'workspaceCollectionId'],
  data() {
    return {
      search: '',
      type: '',
      sort: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['events', 'general', 'module', 'limit']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    type: _.debounce(function () {
      this.getData()
    }, 500),
    sort: _.debounce(function () {
      this.getData()
    }, 500),
  },
  mounted() {
    this.loading = true
    this.$store.dispatch('addEvents', {})

    this.getData()
  },
  methods: {
    changeSort(sort) {
      this.sort = sort
    },
    getData(page = 1) {
      axios
        .get('/event', {
          params: {
            workspace_id: this.workspace?.id,
            workspace_collection_id: this.workspaceCollectionId,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            page: page,
            q: this.search || '',
            sort: this.sort || '',
            type: this.type || '',
            limit: this.limit,
          },
        })
        .then((res) => {
          this.loading = false
          this.$store.dispatch('addEvents', res.data)
        })
        .catch(() => {})
    },
    getUrl(item) {
      if (item.asset) {
        return this.getAssetViewURL({
          id: item.asset.id,
          project_id: item.project_id,
        })
      } else {
        return this.getCollectionViewURL({
          id: item.collection_id,
          project_id: item.project_id,
        })
      }
    },
    goToAsset(item) {
      this.$router.push(this.getUrl(item))
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
