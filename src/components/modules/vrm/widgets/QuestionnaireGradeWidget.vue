<template>
  <ApexChart
    :height="flexRadialChartStripesOptions.chart.height"
    :type="flexRadialChartStripesOptions.chart.type"
    :series="flexRadialChartStripesOptions.series"
    :options="flexRadialChartStripesOptions"
  />
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
  components: {
    ApexChart: VueApexCharts,
  },
  props: ['score'],
  data: () => ({
    flexRadialChartStripesOptions: {
      series: [],
      chart: {
        width: '100%',
        height: 170,
        type: 'radialBar',
        offsetY: 0,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#b4e4ce', '#b4e4ce'],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              offsetY: 10,
              fontSize: '36px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: '600',
              show: true,
            },
            value: {
              offsetY: 65,
              fontSize: '16px',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: '600',
              formatter: function (val) {
                if (typeof val === 'string' || val instanceof String) {
                  return val
                } else {
                  return val + '%'
                }
              },
            },
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      labels: [],
    },
    issues: [],
    loaded: false,
  }),
  async mounted() {
    this.flexRadialChartStripesOptions.labels = ['']
    this.flexRadialChartStripesOptions.series = [this.score]

    this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.name.show = false
    this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.value.offsetY = 5
    this.flexRadialChartStripesOptions.chart.offsetY = -10

    if (this.score > 0 && this.score < 20) {
      this.flexRadialChartStripesOptions.colors = ['#057BC1', '#057BC1']
      this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.name.color =
        '#057BC1'
    } else if (this.score >= 20 && this.score < 50) {
      this.flexRadialChartStripesOptions.colors = ['#FFB622', '#FFB622']
      this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.name.color =
        '#FFB622'
    } else if (this.score >= 50 && this.score < 80) {
      this.flexRadialChartStripesOptions.colors = ['#CD1619', '#CD1619']
      this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.name.color =
        '#CD1619'
    } else if (this.score >= 80 && this.score <= 100) {
      this.flexRadialChartStripesOptions.colors = ['#ff2833', '#ff2833']
      this.flexRadialChartStripesOptions.plotOptions.radialBar.dataLabels.name.color =
        '#ff2833'
    }
  },
}
</script>
