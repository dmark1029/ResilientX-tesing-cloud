<template>
  <div v-if="!loading">
    <div class="tile-grid-toolbar">
      <VControl icon="fa fa-search">
        <input
          v-model="search"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>
    </div>

    <NoData :meta="assetTasks?.meta" :search="search" />

    <TransitionGroup name="list" tag="div">
      <div v-if="assetTasks.meta && assetTasks.meta.total" class="datatable-container">
        <table class="table datatable-table is-fullwidth mb-0">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Status</th>
              <th>Started</th>
              <th>Finished in</th>
              <th>Security app</th>
              <th>Tool</th>
              <th>Batch</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in assetTasks.data" :key="item.id">
              <td>{{ item.asset?.name }}</td>
              <td>
                <TaskStatusBadge :status="getStatus(item)" :glow="true" />
                <span v-if="item.status === 'success'" class="ml-2">
                  <span v-if="item.is_parsed">
                    <i class="fa fa-check-circle has-text-success" />
                  </span>
                  <span v-else>
                    <i class="fa fa-spinner fa-spin has-text-info" />
                  </span>
                </span>
              </td>
              <td>{{ item.started ?? '-' }}</td>
              <td>
                <span
                  v-if="
                    item.status === 'started' ||
                    item.status === 'queued' ||
                    item.status === 'pending'
                  "
                  >{{ item.approx }}</span
                >
                <span v-else>{{ item.finished_in ?? '-' }}</span>
              </td>
              <td>
                {{ getModule(item.module_id)?.name }}
              </td>
              <td>
                {{ item.tool }}
              </td>
              <td>
                {{ item.batch }}
              </td>
              <td>
                <button
                  v-tooltip="'Relaunch'"
                  class="button is-dark-outlined mr-2"
                  @click="relaunch(item)"
                >
                  <span class="icon is-small fa fa-rocket"></span>
                </button>
                <router-link
                  :to="{
                    name: 'ProjectAssetView',
                    params: { id: item.project_id, asset: item.asset.id },
                  }"
                  @click.stop.prevent=""
                >
                  <button v-tooltip="'View asset'" class="button is-dark-outlined mr-2">
                    <span class="icon is-small fa fa-eye"></span>
                  </button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <!--end /table-->
      </div>
    </TransitionGroup>

    <div class="mt-3">
      <Pagination
        :data="assetTasks"
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
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import TaskStatusBadge from './TaskStatusBadge.vue'
import _ from 'lodash'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VControl from '/@src/components/base/form/VControl.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import { onBeforeRouteLeave } from 'vue-router'

export default {
  components: {
    Pagination,
    NoData,
    VControl,
    TaskStatusBadge,
  },
  mixins: [permissionsMixin],

  props: ['project', 'module', 'asset', 'type', 'workspace'],
  data: () => ({
    form: new Form({}),
    assets: [],
    showModal: false,
    editable: null,
    selected: null,
    q: '',
    page: 1,
    watchTaskDelay: 4000,
    interval: null,
    search: '',
  }),
  computed: {
    ...mapGetters(['general', 'assetTasks', 'loading', 'limit', 'taskPageInterval']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    $route: {
      immediate: true,
      handler() {
        if (this.taskPageInterval) {
          this.clearInterval()
        }
      },
    },
  },
  mounted() {
    this.$store.dispatch('showLoading')

    this.clearInterval()

    this.getData()

    if (this.module) {
      this.form.module_id = this.module.id
    }

    if (this.$route.query.open) {
      this.openModal()
    }

    onBeforeRouteLeave((to, from, next) => {
      if (this.taskPageInterval) {
        this.clearInterval()
      }
      next()
    })
  },
  beforeUnmount() {
    this.$store.commit('setAssetTasks', {})

    if (this.taskPageInterval) {
      this.clearInterval()
    }
  },
  methods: {
    getStatus(item) {
      let found
      let status = item.status

      this.general.modules.forEach((m) => {
        if (m.id === item.module_id) {
          found = m
        }
      })

      if (found?.slug === 'dast-scanner' && status === 'failed') {
        status = 'Blocked by End Target'
      }

      return status
    },
    getModule(item) {
      let found
      this.general.modules.forEach((m) => {
        if (m.id === item) {
          found = m
        }
      })
      return found
    },
    getData(page = 1) {
      this.page = page

      const params = {
        page: this.page,
        q: this.search,
        limit: this.limit,
      }

      if (this.module) {
        params.module_id = this.module.id
        params.asset_id = this.asset ? this.asset.id : ''
      }

      if (this.project) {
        params.project_id = this.project.id
      } else {
        params.workspace_id = this.workspace.id
      }

      axios
        .get('/task', { params })
        .then((res) => {
          this.$store.dispatch('addAssetTasks', res.data)
          this.$store.dispatch('hideLoading')

          this.watchTasks()
        })
        .catch(() => {})
    },
    async onSuccess() {
      this.closeModal()
      await this.getData()
    },
    closeModal() {
      this.showModal = false
    },
    openModal() {
      this.showModal = true
    },
    relaunch(task) {
      let form = this.form.post('/task/' + task.id + '/relaunch')

      form
        .then(() => {
          this.onSuccess()
        })
        .catch(() => {
          if (!this.showModal) {
            alert('Error while relaunching task')
          }
        })
    },
    clearInterval() {
      clearInterval(this.taskPageInterval)
      this.$store.dispatch('addTaskPageInterval', null)
      this.interval = null
    },
    watchTasks() {
      let needWatch = false
      this.assetTasks.data.forEach((task) => {
        if (
          task.status === 'started' ||
          task.status === 'pending' ||
          task.status === 'queued'
        ) {
          needWatch = true
        }
      })

      if (needWatch && !this.taskPageInterval) {
        this.$store.dispatch(
          'addTaskPageInterval',
          setInterval(async () => {
            await this.getData(this.page)
          }, this.watchTaskDelay)
        )
      }

      if (!needWatch && this.taskPageInterval) {
        this.clearInterval()
      }
    },
  },
}
</script>
