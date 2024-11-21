<template>
  <div class="card">
    <div class="card-body">
      <h5 class="title is-5">
        {{ title }}
      </h5>
      <div id="chart" style="height: 170px">
        <v-chart
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
  props: ['title', 'total', 'count', 'color'],
  data() {
    return {
      series: [this.total ? ((this.count / this.total) * 100).toFixed(2) : 0],
      chartOptions: {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{c}%',
        },
        legend: {
          top: '5%',
          left: 'center',
          // doesn't perfectly work with our tricks, disable it
          selectedMode: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '80%'],
            center: ['50%', '50%'],
            // adjust the start angle
            startAngle: 180,
            label: {
              show: true,
              formatter: '' + this.count + '',
            },
            data: [
              {
                value: this.total ? ((this.count / this.total) * 100).toFixed(2) : 0,
                itemStyle: {
                  color: this.color,
                },
              },
              {
                value:
                  100 - (this.total ? ((this.count / this.total) * 100).toFixed(2) : 0),
                itemStyle: {
                  color: 'gray',
                },
                label: {
                  show: false,
                },
                tooltip: {
                  show: false,
                },
              },
              {
                value: 100,
                itemStyle: {
                  color: 'transparent',
                },
                label: {
                  show: false,
                },
                tooltip: {
                  show: false,
                },
              },
            ],
          },
        ],
      },
    }
  },
}
</script>
