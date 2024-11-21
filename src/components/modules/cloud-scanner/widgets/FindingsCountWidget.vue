<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Findings over time</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded">
        <ApexChart
          :height="sharingOptions.chart.height"
          :type="sharingOptions.chart.type"
          :series="sharingOptions.series"
          :options="sharingOptions"
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
      series: [],
      chart: {
        height: 295,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      colors: ['#10b981', '#ff2833', '#ef4d56', '#ff9f43', '#41cbd8'],
      legend: {
        position: 'top',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [2, 2, 2],
        curve: 'smooth',
      },
      xaxis: {
        type: 'date',
        categories: [],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
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
    this.loaded = false
    await this.getData()
    this.loaded = true
  },
  methods: {
    formatDate(inputDate) {
      var parts = inputDate.split('-')
      return parts[2] + '.' + parts[1] + '.' + parts[0]
    },
    async getData() {
      await axios
        .get('/widget/asset-cloud-details/count', {
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
          this.data = res.data.dates

          let passedData = []
          let criticalData = []
          let highData = []
          let mediumData = []
          let lowData = []
          let categories = []

          for (let i = this.data.length - 1; i >= 0; i--) {
            const dateObj = this.data[i]
            categories.push(this.formatDate(dateObj.date)) // Add date to categorize array
            passedData.push(dateObj.pass) // Add passed count to passedData array
            criticalData.push(dateObj.critical) // Add critical count to criticalData array
            highData.push(dateObj.high) // Add high count to highData array
            mediumData.push(dateObj.medium) // Add medium count to mediumData array
            lowData.push(dateObj.low) // Add low count to lowData array
          }

          this.sharingOptions.series = [
            { name: 'Passed', data: passedData },
            { name: 'Critical', data: criticalData },
            { name: 'High', data: highData },
            { name: 'Medium', data: mediumData },
            { name: 'Low', data: lowData },
          ]

          this.sharingOptions.xaxis.categories = categories

          this.loading = false
        })
    },
  },
}
</script>
