
<template>
  <v-tooltip text="View scans" location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        density="compact"
        size="large"
        class="project-button"
        @click="active = true"
      >
        <img src="/images/icons/navbar/vuesax_linear_scan.svg" alt="people" />
      </v-btn>
    </template>
  </v-tooltip>

  <div
    id="activity-panel"
    :class="[active ? 'is-active' : '']"
    class="right-panel-wrapper is-activity"
  >
    <div
      class="panel-overlay"
      tabindex="0"
      role="button"
      @keydown.space.prevent="closePanel"
      @click="closePanel"
    />

    <div class="right-panel">
      <div class="right-panel-head">
        <h3>Scans</h3>
        <a
          class="close-panel"
          tabindex="0"
          role="button"
          @keydown.space.prevent="closePanel"
          @click="closePanel"
        >
          <i class="fa fa-times" />
        </a>
      </div>

      <div v-if="loading">
        <VLoader :active="true" size="small" :translucent="true">
          <div style="height: 50px; margin: 50px" />
        </VLoader>
      </div>
      <div v-else>
        <div v-if="project || workspace" class="tile-grid tile-grid-v2 pl-5 pr-5">
          <router-link
            v-if="project"
            :to="{ name: 'ProjectTasksView', params: { id: project.id } }"
            class="button is-secondary is-fullwidth mb-3"
            @click.capture="closePanel"
          >
            All scans
          </router-link>
          <router-link
            v-if="workspace && !project"
            :to="{ name: 'WorkspaceTasksView', params: { id: workspace.id } }"
            class="button is-secondary is-fullwidth mb-3"
            @click.capture="closePanel"
          >
            All scans
          </router-link>
          <TransitionGroup name="list" tag="div" class="columns is-multiline">
            <!--Grid item-->
            <div v-for="item in tasks" :key="item.id" class="column is-12">
              <div
                class="tile-grid-item is-relative"
                @click="
                  () => {
                    goToAsset(item)
                    closePanel()
                  }
                "
              >
                <div class="tile-grid-item-inner">
                  <div class="v-avatar">
                    <img v-if="item.asset.logo" class="avatar" :src="item.asset.logo" />
                  </div>

                  <div class="meta">
                    <span class="dark-inverted mb-1">{{ item.asset.name }}</span>
                    <span>
                      <span class="text-muted fw-semibold mb-1">{{ getText(item) }}</span>
                    </span>
                  </div>
                </div>

                <span
                  v-if="!item.is_parsed && item.status !== 'failed'"
                  class="new-indicator pulsate"
                  style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    display: block;
                    width: 8px;
                    height: 8px;
                    border-radius: var(--radius-rounded);
                    background: var(--danger);
                  "
                />
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import permissionsMixin from '/@src/mixins/permissionsMixin'

export default {
  components: {
    VLoader,
  },
  mixins: [permissionsMixin],
  data: () => ({
    active: false,
    loading: false,
    tasks: [],
    hasPendingTasks: false,
    interval: null,
  }),
  computed: {
    ...mapGetters(['project', 'workspace']),
  },
  watch: {
    active(val) {
      if (val) {
        this.loading = true
        this.getTasks().then(() => {
          this.loading = false
        })
      }
    },
  },
  mounted() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.ping()
      }, 15000)

      this.ping()
    }
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    ping() {
      if (this.canPerformAction('scans', 'view')) {
        if (!this.project && !this.workspace) {
          return
        }

        return axios
          .get(`/task/ping`, {
            params: {
              workspace_id: this.workspace?.id,
              project_id: this.project?.id,
            },
          })
          .then((res) => {
            this.$store.dispatch('addProcessing', {
              processing: res.data.processing_tasks,
              count: res.data.count,
            })
          })
          .catch(() => {})
      }
    },
    closePanel() {
      this.active = false
    },
    getTasks() {
      if (!this.project) {
        return axios
          .get(`/task?workspace_id=${this.workspace.id}`)
          .then((res) => {
            this.tasks = res.data.data
          })
          .catch(() => {})
      }

      return axios
        .get(`/task?project_id=${this.project.id}`)
        .then((res) => {
          this.tasks = res.data.data
        })
        .catch(() => {})
    },
    goToAsset(item) {
      this.$router.push({
        name: 'ProjectAssetView',
        params: { id: item.project_id, asset: item.asset.id },
      })
    },
    getText(item) {
      if (item.status === 'success') {
        if (item.is_parsed) {
          return 'Scan completed'
        }
        return 'Parsing scan results'
      }
      if (item.status === 'started') {
        return 'Started scan'
      }
      if (item.status === 'pending') {
        return 'Scan queued'
      }
      if (item.status === 'failed') {
        return 'Scan failed'
      }
      return '-'
    },
  },
}
</script>
