<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Findings by status</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded">
        <div class="columns">
          <div class="column is-6">
            <div class="cloud-by-status">
              <ApexChart v-bind="chart" @click="handleClick" />
            </div>
          </div>
          <div class="column is-6">
            <div class="columns">
              <div class="column is-6">
                <div
                  class="dashboard-tile mb-5 is-clickable"
                  @click="
                    () => {
                      if (project) {
                        $router.push({
                          name: 'CyberExCloudDetailsView',
                          params: { id: project.id },
                          query: {
                            status: 'pass',
                            provider: provider,
                            account_id: account,
                            region: region,
                            subscription: subscription,
                            cloud_project: cloudProject,
                            date: specificDate,
                          },
                        })
                      } else {
                        $router.push({
                          name: 'WorkspaceCyberExCloudDetailsView',
                          params: { id: workspace.id },
                          query: {
                            status: 'pass',
                            provider: provider,
                            account_id: account,
                            region: region,
                            subscription: subscription,
                            cloud_project: cloudProject,
                            date: specificDate,
                          },
                        })
                      }
                    }
                  "
                >
                  <div class="tile-head">
                    <h3 class="dark-inverted" style="color: #10b981 !important">
                      Passed checks
                    </h3>
                  </div>
                  <div class="tile-body">
                    <span class="dark-inverted">{{ data.passed }}</span>
                  </div>
                  <div class="tile-foot">
                    <span class="dark-inverted">{{ data.passed_percentage }} % </span>
                  </div>
                </div>

                <div
                  class="dashboard-tile is-clickable"
                  @click="
                    () => {
                      if (project) {
                        $router.push({
                          name: 'CyberExCloudDetailsView',
                          params: { id: project.id },
                          query: {
                            status: 'fail',
                            provider: provider,
                            account_id: account,
                            region: region,
                            subscription: subscription,
                            cloud_project: cloudProject,
                            date: specificDate,
                          },
                        })
                      } else {
                        $router.push({
                          name: 'WorkspaceCyberExCloudDetailsView',
                          params: { id: workspace.id },
                          query: {
                            status: 'fail',
                            provider: provider,
                            account_id: account,
                            region: region,
                            subscription: subscription,
                            cloud_project: cloudProject,
                            date: specificDate,
                          },
                        })
                      }
                    }
                  "
                >
                  <div class="tile-head">
                    <h3 class="dark-inverted" style="color: #ff2833 !important">
                      Failed checks
                    </h3>
                  </div>
                  <div class="tile-body">
                    <span class="dark-inverted">{{ data.failed }}</span>
                  </div>
                  <div class="tile-foot">
                    <span class="dark-inverted">{{ data.failed_percentage }} % </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <VLoader :active="true">
          <div style="height: 200px" />
        </VLoader>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { axios } from '/@src/axios'

export default {
  components: {
    VLoader,
    ApexChart: VueApexCharts,
  },
  props: [
    'project',
    'workspace',
    'asset',
    'collection',
    'specificDate',
    'provider',
    'account',
    'region',
    'subscription',
    'cloudProject',
  ],
  data: () => ({
    data: null,
    loaded: false,
    chart: {
      height: 240,
      type: 'donut',
      series: [44, 55],
      options: {
        chart: {},
        labels: ['Pass', 'Fail'],
        colors: ['#10b981', '#ff2833'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 280,
                toolbar: {
                  show: false,
                },
              },
              legend: {
                position: 'top',
              },
            },
          },
        ],
        legend: {
          show: false,
          position: 'right',
          horizontalAlign: 'center',
        },
      },
    },
  }),
  watch: {
    specificDate() {
      this.getData()
    },
    provider() {
      this.getData()
    },
    account() {
      this.getData()
    },
    region() {
      this.getData()
    },
    subscription() {
      this.getData()
    },
    cloudProject() {
      this.getData()
    },
  },
  async mounted() {
    await this.getData()
    this.loaded = true
  },
  methods: {
    handleClick(event) {
      let status = false
      if (event.target.classList.contains('apexcharts-donut-slice-0')) {
        status = 'pass'
      }
      if (event.target.classList.contains('apexcharts-donut-slice-1')) {
        status = 'fail'
      }

      if (status) {
        if (this.project) {
          this.$router.push({
            name: 'CyberExCloudDetailsView',
            params: { id: this.project.id },
            query: {
              status: status,
              provider: this.provider,
              account_id: this.account,
              region: this.region,
              subscription: this.subscription,
              cloud_project: this.cloudProject,
              date: this.specificDate,
            },
          })
        } else {
          this.$router.push({
            name: 'WorkspaceCyberExCloudDetailsView',
            params: { id: this.workspace.id },
            query: {
              status: status,
              provider: this.provider,
              account_id: this.account,
              region: this.region,
              subscription: this.subscription,
              cloud_project: this.cloudProject,
              date: this.specificDate,
            },
          })
        }
      }
    },
    async getData() {
      await axios
        .get('/widget/asset-cloud-details/by-status', {
          params: {
            provider: this.provider,
            account_id: this.account,
            region: this.region,
            subscription: this.subscription,
            cloud_project: this.cloudProject,
            task_id: this.task?.id,
            date: this.specificDate,
            project_id: this.project?.id,
            workspace_id: this.workspace?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.data = res.data.data
          this.chart.series = [this.data.passed, this.data.failed]
          this.loading = false

          this.$forceUpdate()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.dashboard-tile {
  font-family: var(--font);
  animation: fadeIn 0.3s ease-in-out;
  transition: all 0.3s;

  .tile-head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-family: var(--font-alt);
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-body {
    font-size: 2rem;
    padding: 4px 0 0 0;

    span {
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-foot {
    span {
      &:first-child {
        font-weight: 500;

        svg {
          height: 16px;
          width: 16px;
          margin-inline-end: 6px;
          stroke-width: 3px;
        }
      }

      &:nth-child(2) {
        color: var(--light-text);
        font-size: 0.9rem;
      }
    }
  }

  &:hover {
    transform: scale(1.02);
  }
}
</style>

<style lang="scss">
.cloud-by-status {
  .apexcharts-series {
    path {
      cursor: pointer !important;
    }
  }
}
</style>