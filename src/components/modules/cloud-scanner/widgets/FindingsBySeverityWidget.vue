<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Findings by severity</h3>
    </div>
    <div class="active-team cloud-by-severity">
      <div v-if="loaded">
        <ApexChart
          :height="sharingOptions.chart.height"
          :type="sharingOptions.chart.type"
          :series="sharingOptions.series"
          :options="sharingOptions"
          @click="handleClick"
        />
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
    loaded: true,
    sharingOptions: {
      series: [
        {
          name: 'Fails',
          data: [2.3, 3.1, 4.0, 10.1],
        },
      ],
      chart: {
        height: 240,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          distributed: true,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: false,
        formatter: function (val) {
          return val
        },
        offsetY: -25,
        style: {
          fontSize: '15px',
          colors: ['#304758'],
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ['Critical', 'High', 'Medium', 'Low'],
        position: 'top',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          formatter: function (val) {
            return val
          },
        },
      },
      colors: ['#ff2833', '#ef4d56', '#ff9f43', '#41cbd8'],
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
    this.loaded = false
    await this.getData()
    this.loaded = true
  },
  methods: {
    handleClick(event, chartContext, config) {
      let severity = false
      if (config.dataPointIndex === 0) {
        severity = 'critical'
      }
      if (config.dataPointIndex === 1) {
        severity = 'high'
      }
      if (config.dataPointIndex === 2) {
        severity = 'medium'
      }
      if (config.dataPointIndex === 3) {
        severity = 'low'
      }

      if (severity) {
        if (this.project) {
          this.$router.push({
            name: 'CyberExCloudDetailsView',
            params: { id: this.project.id },
            query: {
              severity: severity,
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
              severity: severity,
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
        .get('/widget/asset-cloud-details/by-severity', {
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
          this.sharingOptions.series = [
            {
              name: 'Findings',
              data: [this.data.critical, this.data.high, this.data.medium, this.data.low],
            },
          ]

          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
.cloud-by-severity {
  .apexcharts-series {
    path {
      cursor: pointer !important;
    }
  }
}
</style>