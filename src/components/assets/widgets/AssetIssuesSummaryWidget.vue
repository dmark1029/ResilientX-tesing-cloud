<template>
  <div class="dashboard-card">
    <div v-if="loaded">
      <div class="items">
        <div
          :class="activeItem === 'issues' ? 'item active' : 'item'"
          @click="activeItem = 'issues'"
        >
          <div class="numbers">
            <h3>Title</h3>
            <div class="value">Value</div>
          </div>
          <div class="trend">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#22b783">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32H544c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32s-32 14.3-32 32v82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352H384z"
              />
            </svg>
          </div>
        </div>
        <div
          :class="activeItem === 'cve' ? 'item active' : 'item'"
          @click="activeItem = 'cve'"
        >
          <div class="numbers">
            <h3>Title</h3>
            <div class="value">Value</div>
          </div>
          <div class="trend">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#ff2833">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"
              />
            </svg>
          </div>
        </div>
        <div
          :class="activeItem === 'events' ? 'item active' : 'item'"
          @click="activeItem = 'events'"
        >
          <div class="numbers">
            <h3>Title</h3>
            <div class="value">Value</div>
          </div>
          <div class="trend">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#ff2833">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"
              />
            </svg>
          </div>
        </div>
        <div
          :class="activeItem === 'assets' ? 'item active' : 'item'"
          @click="activeItem = 'assets'"
        >
          <div class="numbers">
            <h3>Title</h3>
            <div class="value">Value</div>
          </div>
          <div class="trend">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#ff2833">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path
                d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32H544c17.7 0 32 14.3 32 32V288c0 17.7-14.3 32-32 32s-32-14.3-32-32V205.3L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160H384z"
              />
            </svg>
          </div>
        </div>
      </div>

      <h2>Lorem ipsum dolor sit amet</h2>

      <div>
        <v-chart
          ref="echartRef"
          :option="chartOption"
          style="width: 100%; height: 230px"
        ></v-chart>
      </div>
    </div>
    <div v-else>
      <VLoader :active="true">
        <div style="height: 200px" />
      </VLoader>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { BarChart } from 'echarts/charts'
import { PolarComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import ECharts from 'vue-echarts'
import * as echarts from 'echarts'

use([BarChart, PolarComponent, LegendComponent, TooltipComponent, CanvasRenderer])

export default {
  components: { 'v-chart': ECharts, VLoader },
  props: ['project', 'workspace', 'collection', 'asset'],
  data: () => ({
    items: [],
    activeItem: 'issues',
    loaded: false,
    chartOption: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: (params) => {
          const title = params[0].axisValue
          const value = params[0].value

          return `
      <div>
        <span style="margin-left: 0px;font-weight: 500;color: #c3c5d9"> ${title}</span>
      </div><div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; align-items: center; margin-bottom: 2px;">
          <div style="background: #df0c0c; width: 6px; height: 12px; margin-right: 6px;"></div>
          <div style="font-weight: bold;width: 28px;color: #e1e1ef">${value}</div>
           <div style="color: #c3c5d9">Critical</div>
        </div>
      </div>
    </div>`
        },
        padding: 12,
        borderWidth: 0,
        textStyle: {
          color: '#C3C5D9',
          fontWeight: 400,
          fontFamily: 'Poppins',
          fontSize: 11.5,
        },
        extraCssText:
          'min-width: 155px;\n' +
          '  height: 65px;\n' +
          '  display: flex;\n' +
          '  flex-direction: column;\n' +
          '  justify-content: flex-start;\n' +
          '  align-items: flex-start;\n' +
          '  gap: 8px;\n' +
          '  padding: 12px;\n' +
          '  border-radius: 4px;\n' +
          '  background-color: #32343f;',
      },
      legend: {
        show: false,
        data: ['Email'],
      },
      toolbox: {
        feature: {},
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '10%', // Adjust this to reduce top spacing
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'June',
            'July',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          axisLine: {
            show: true, // Hide the x-axis line
            lineStyle: {
              color: 'rgba(40, 41, 52, 0.4)', // Customize the color of the grid lines
            },
          },
          axisLabel: {
            show: true, // Hide the x-axis labels
            fontFamily: 'Poppins', // Customize font
            fontSize: 10, // Customize font size
            color: '#e1e1ef', // Customize font color
          },
          splitLine: {
            show: true, // Enable grid lines from left to right
            lineStyle: {
              color: 'rgba(40, 41, 52, 0.4)', // Customize the color of the grid lines
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true, // Enable grid lines from left to right
            lineStyle: {
              color: 'rgba(40, 41, 52, 0.4)', // Customize the color of the grid lines
            },
          },
          axisLabel: {
            fontFamily: 'Poppins', // Customize font
            fontSize: 10, // Customize font size
            color: '#e1e1ef', // Customize font color
          },
        },
      ],
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(
              0.5,
              1,
              0.5,
              0, // Gradient from center-bottom to the top
              [
                { offset: 0, color: '#02000099' }, // Start color (bottom center)
                { offset: 1, color: '#DB000099' }, // End color (top)
              ]
            ),
          },
          itemStyle: {
            color: '#c3c5d9', // Set the line color here
          },
          emphasis: {
            focus: 'series',
          },
          data: [120, 132, 101, 134, 90, 230, 210, 0, 0, 0, 0],
        },
        // Add more series as needed
      ],
    },
  }),
  computed: {
    ...mapGetters(['module']),
  },
  async mounted() {
    await axios
      .get('/widget/assets-items', {
        params: {
          workspace_id: this.workspace?.id,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        // this.spark1.series[0].data = res.data.dates.map((item) => item.count)
        // this.spark1.labels = res.data.dates.map((item) => item.date)
        this.items = res.data.data
      })
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.items {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-grow: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  background-color: #11131c;

  .item {
    flex: 1 0 21%;
    display: flex;
    padding: 12px 12px 12px 20px;
    justify-content: space-between;
    align-items: center;
    position: relative;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      padding 0.3s ease; /* Transition effect for background color and padding */

    &:first-child:after {
      display: none;
    }

    &:after {
      content: '';
      display: block;
      height: 84%;
      width: 0.6px;
      align-self: stretch;
      flex-grow: 0;
      background-color: #b8c4ff;
      position: absolute;
      left: 0;
      top: 8%;
      bottom: 0;
      transition:
        background-color 0.3s ease,
        width 0.3s ease; /* Transition effect for color and width */
    }

    &.active {
      flex-grow: 0;
      border-radius: 8px;
      background-color: #282934;
      padding: 12px 12px 12px 12px; /* Adjust padding when active */
    }

    &.active:after {
      display: none; /* Hide the vertical line when active */
      transition: none; /* Disable transition when active if you don't want it to fade out */
    }

    &.active {
      & + .item:after {
        display: none;
      }
    }

    .numbers {
      h3 {
        align-self: stretch;
        flex-grow: 0;
        font-family: Poppins;
        font-size: 12px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #e1e1ef;
        margin-bottom: 14.2px;
        transition: color 0.3s ease; /* Transition effect for text color */
      }

      .value {
        height: 24px;
        align-self: stretch;
        flex-grow: 0;
        font-family: Poppins;
        font-size: 20px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: normal;
        text-align: left;
        color: #b8c4ff;
        transition: color 0.3s ease; /* Transition effect for text color */
      }
    }

    .trend {
      svg {
        width: 32px;
        flex-grow: 0;
        margin: 4.1px 8px 4.1px 22px;
        transition: fill 0.3s ease; /* Transition effect for the SVG fill color */
      }
    }
  }
}

h2 {
  margin-top: 28px;
  margin-bottom: 20px;
  height: 24px;
  flex-grow: 0;
  font-family: Poppins;
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #e1e1ef;
}
</style>
