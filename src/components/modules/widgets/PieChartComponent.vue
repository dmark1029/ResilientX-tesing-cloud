<template>
  <div class="card h-100">
    <div class="card-body h-100">
      <h5 class="title is-5">
        {{ title }}
      </h5>
      <div id="chart">
        <v-chart
          ref="chart"
          class="chart"
          :option="chartOptions"
          style="height: 300px; width: 100%; margin: 0 !important"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

export default {
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'dark',
  },
  props: ['labels', 'values', 'title'],
  computed: {
    chartOptions() {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        backgroundColor: 'transparent',
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: '70%',
            center: ['50%', '50%'],
            data: this.generateChartData(),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    },
  },
  mounted() {
    window.addEventListener(
      'resize',
      function () {
        this.$refs.chart.resize()
      }.bind(this)
    )
  },
  methods: {
    generateChartData() {
      return this.labels.map((label, index) => ({
        name: label,
        value: this.values[index],
      }))
    },
  },
}
</script>
