<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Exposure score over time</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded">
        <div v-if="data && data.length">
          <ApexChart
            :height="sharingOptions.chart.height"
            :type="sharingOptions.chart.type"
            :series="sharingOptions.series"
            :options="sharingOptions"
          />
        </div>
        <p v-else class="mb-0">No data available</p>
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
  props: ['asset', 'collection'],
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
      colors: [],
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
      yaxis: {
        max: 100, // Set the maximum value
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
      let url = '/widget/collection-exposure-overtime'

      if (this.asset) {
        url = '/widget/asset-exposure-overtime'
      }

      await axios
        .get(url, {
          params: {
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.data = res.data.dates

          let passedData = []
          let categories = []

          let score = 0
          for (let i = this.data.length - 1; i >= 0; i--) {
            const dateObj = this.data[i]
            score = dateObj.score
            categories.push(this.formatDate(dateObj.date)) // Add date to categorize array
            passedData.push(dateObj.score) // Add passed count to passedData array
          }

          this.sharingOptions.series = [{ name: 'Exposure score', data: passedData }]

          if (score > 0 && score < 20) {
            this.sharingOptions.colors = ['#057BC1']
          } else if (score >= 20 && score < 50) {
            this.sharingOptions.colors = ['#FFB622']
          } else if (score >= 50 && score < 80) {
            this.sharingOptions.colors = ['#CD1619']
          } else if (score >= 80 && score <= 100) {
            this.sharingOptions.colors = ['#ff2833']
          }

          this.sharingOptions.xaxis.categories = categories

          this.loading = false
        })
    },
  },
}
</script>
