<template>
  <div class="card">
    <div class="card-body has-text-centered">
      <div class="is-flex is-justify-content-space-between is-align-items-center">
        <h4 class="title is-5">
          {{ title }}
        </h4>

        <div>
          <Datepicker
            v-model="date"
            class="input v-input input v-input-sm"
            :starting-view="'year'"
            :minimum-view="'year'"
            :input-format="'yyyy'"
            :clearable="false"
          />
        </div>
      </div>
      <div id="chart">
        <Apexchart
          v-if="statistics?.data"
          type="bar"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import Datepicker from 'vue3-datepicker'
import { mapGetters } from 'vuex'

export default {
  components: {
    Datepicker,
    Apexchart: VueApexCharts,
  },
  props: ['title', 'types'],
  data: () => ({
    date: null,
    type: '',
    series: [
      {
        name: '',
        data: [],
      },
    ],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
    },
  }),
  computed: {
    ...mapGetters(['statistics']),
  },
  watch: {
    date(date) {
      this.getStatistics(date)
    },
  },
  async mounted() {
    this.date = new Date()
    if (this.types.length > 0) {
      this.type = this.types[0]
    }
  },
  methods: {
    async getStatistics(date) {
      let year = new Date(date).getFullYear()

      this.chartOptions.xaxis.categories = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      await this.$store.dispatch('addStatistics', {
        year: year,
        type: this.type,
      })

      this.series[0].data = this.statistics.data
    },
  },
}
</script>
