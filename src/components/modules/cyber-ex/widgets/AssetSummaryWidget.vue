<template>
  <div v-if="loaded" class="dashboard-card is-base-chart">
    <div class="content-box">
      <div
        class="revenue-stats is-dark-bordered-12 has-slimscroll"
        style="overflow-x: scroll"
      >
        <div
          v-for="(title, index) in types"
          :key="index"
          class="revenue-stat is-clickable"
          @click="getAssetSummaryDetails(index)"
        >
          <span>{{ title }}</span>
          <span :class="active === index ? 'current' : 'dark-inverted'">{{
            details[index]
          }}</span>
        </div>
      </div>
    </div>
    <div class="chart-container">
      <ApexChart
        id="users-chart"
        :height="usersOptions.chart.height"
        :type="usersOptions.chart.type"
        :series="usersOptions.series"
        :options="usersOptions"
      />
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { axios } from '/@src/axios'

export default {
  components: {
    ApexChart: VueApexCharts,
  },
  props: ['asset', 'collection'],
  data: () => ({
    details: null,
    loaded: false,
    active: null,
    types: {
      issues: 'Issues',
      events: 'Events',
      vulnerabilities: 'CVE',
      alerts: 'Risks',
      technologies: 'Technologies',
      certificates: 'Certificates',
      ports: 'Ports',
      typosquatting: 'Typosquatting',
    },
    chart: null,
    usersOptions: {
      series: [
        {
          name: '',
          data: [],
        },
      ],
      chart: {
        height: 180,
        type: 'area',
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#057BC1'],
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [2],
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        lines: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      yaxis: [
        {
          y: 0,
          offsetX: 0,
          offsetY: 0,
          labels: {
            show: false,
          },
          padding: {
            left: 0,
            right: 0,
          },
        },
      ],
      tooltip: {
        x: {
          show: true,
          format: 'dd/MM/yy',
        },
      },
    },
  }),
  async mounted() {
    await axios
      .get('/widget/asset-summary', {
        params: {
          asset_id: this.asset?.id,
          collection_id: this.collection?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.details = res.data.data

        if (this.details['issues']) {
          this.getAssetSummaryDetails('issues')
        } else {
          Object.keys(this.types).forEach((type) => {
            if (this.details[type] && !this.active) {
              this.active = type
              this.getAssetSummaryDetails(type)
            }
          })
        }
      })
  },
  methods: {
    getAssetSummaryDetails(type) {
      this.active = type
      axios
        .get('/widget/asset-summary-details', {
          params: {
            asset_id: this.asset?.id,
            collection_id: this.collection?.id,
            type: type,
          },
        })
        .then((res) => {
          this.loaded = true

          this.usersOptions.series[0].data = res.data.data.map((item) => {
            return { x: new Date(item.date), y: item.count }
          })

          this.usersOptions.series[0].name = this.types[type]
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.dashboard-card {
  @include vuero-v-card--dark;

  &.is-base-chart {
    padding: 0;
    display: flex;
    flex-direction: column;

    .content-box {
      padding: 30px;

      .revenue-stats {
        display: flex;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--fade-grey-dark-3);

        .revenue-stat {
          margin-inline-end: 30px;
          font-family: var(--font);

          span {
            display: block;

            &:first-child {
              text-transform: uppercase;
              font-family: var(--font-alt);
              font-size: 0.75rem;
              color: var(--light-text);
            }

            &:nth-child(2) {
              color: var(--dark-text);
              font-size: 1.6rem;
              font-weight: 600;
            }

            &.current {
              color: var(--primary);
            }
          }
        }
      }
    }

    .chart-container {
      margin-top: auto;
    }
  }
}
</style>