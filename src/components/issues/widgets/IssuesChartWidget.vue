<template>
  <div>
    <v-chart
      ref="echartRef"
      :option="chartOption"
      style="width: 100%; height: 500px"
    ></v-chart>
  </div>
</template>

<script>
import { BarChart } from 'echarts/charts'
import { PolarComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { use } from 'echarts/core'
import ECharts from 'vue-echarts'
import { axios } from '/@src/axios'
import * as echarts from 'echarts'

use([BarChart, PolarComponent, LegendComponent, TooltipComponent, CanvasRenderer])

export default {
  name: 'IssuesChartWidget',

  components: {
    'v-chart': ECharts,
  },
  props: [
    'project',
    'workspace',
    'workspaceCollectionId',
    'collection',
    'asset',
    'url',
    'title',
    'color',
    'detailed',
  ],
  data() {
    return {
      chartOption: {
        angleAxis: {
          type: 'category',
          data: [
            'Threat Intelligence',
            'Technology Risk',
            'Application Security',
            'Network Security',
            'Cloud Security',
            'OSINT',
          ],
          axisLabel: {
            show: true,
            color: '#C3C5D9',
            fontWeight: 500,
            fontFamily: 'Poppins',
            fontSize: 11,
            margin: 20,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#8D90A2',
              width: 0.44,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#8D90A2',
              width: 1,
              type: 'solid',
            },
          },
        },
        radiusAxis: {
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#434656',
              width: 0.44,
              type: 'solid',
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '',
              width: 0.44,
              type: 'solid',
            },
          },
        },
        polar: {
          center: ['50%', '55%'], // Adjust the second value to move the chart down
        },
        series: [
          {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: 'Low',
            stack: 'severity',
            emphasis: {
              itemStyle: {
                // Disable hover effect
              },
            },
            itemStyle: {
              color: '#0C93DFB2',
            },
            barGap: '0%',
            barCategoryGap: '0%',
          },
          {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: 'Medium',
            stack: 'severity',
            emphasis: {
              itemStyle: {
                // Disable hover effect
              },
            },
            itemStyle: {
              color: '#FFF509B2',
            },
            barGap: '0%',
            barCategoryGap: '0%',
          },
          {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: 'High',
            stack: 'severity',
            emphasis: {
              itemStyle: {
                // Disable hover effect
              },
            },
            itemStyle: {
              color: '#E9840CB2',
            },
            barGap: '0%',
            barCategoryGap: '0%',
          },
          {
            type: 'bar',
            data: [],
            coordinateSystem: 'polar',
            name: 'Critical',
            stack: 'severity',
            emphasis: {
              itemStyle: {
                // Disable hover effect
              },
            },
            itemStyle: {
              color: '#AE1E1EB2',
            },
            barGap: '0%',
            barCategoryGap: '0%',
          },
        ],
        legend: {
          show: true,
          data: ['Low', 'Medium', 'High', 'Critical'],
          textStyle: {
            color: '#C3C5D9',
            fontWeight: 400,
            fontFamily: 'Poppins',
            fontSize: 11.5,
          },
          itemGap: 20,
          itemWidth: 18,
          itemHeight: 18,
          top: 0,
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const category = params.name
            const critical = this.originalData['Critical'][params.dataIndex] || 0
            const high = this.originalData['High'][params.dataIndex] || 0
            const medium = this.originalData['Medium'][params.dataIndex] || 0
            const low = this.originalData['Low'][params.dataIndex] || 0

            return `
      <div>
        <b style="color: #e1e1ef">${critical + high + medium + low}</b> <span style="margin-left: 8px;font-weight: 500;color: #c3c5d9"> ${category}</span>
      </div><div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; align-items: center; margin-bottom: 2px;">
          <div style="background: #df0c0c; width: 6px; height: 12px; margin-right: 6px;"></div>
          <div style="font-weight: bold;width: 28px;color: #e1e1ef">${critical}</div>
           <div style="color: #c3c5d9">Critical</div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 2px;">
          <div style="background: #E9840C; width: 6px; height: 12px; margin-right: 6px;"></div>
          <div style="font-weight: bold;width: 28px;color: #e1e1ef">${high}</div>
          <div style="color: #c3c5d9">High</div>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 2px;">
          <div style="background: #FFF509; width: 6px; height: 12px; margin-right: 6px;"></div>
          <div style="font-weight: bold;width: 28px;color: #e1e1ef">${medium}</div>
          <div style="color: #c3c5d9">Medium</div>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="background: #0C93DF; width: 6px; height: 12px; margin-right: 6px;"></div>
          <div style="font-weight: bold;width: 28px;color: #e1e1ef">${low}</div>
          <div style="color: #c3c5d9">Low</div>
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
            '  height: 130px;\n' +
            '  display: flex;\n' +
            '  flex-direction: column;\n' +
            '  justify-content: flex-start;\n' +
            '  align-items: flex-start;\n' +
            '  gap: 8px;\n' +
            '  padding: 12px;\n' +
            '  border-radius: 4px;\n' +
            '  background-color: #32343f;',
        },
      },
      originalData: {
        Low: [],
        Medium: [],
        High: [],
        Critical: [],
      },
      maxSum: 0, // To store the maximum sum of severities
    }
  },
  async mounted() {
    try {
      const response = await axios.get('/widget/issues-per-module', {
        params: {
          workspace_id: this.workspace?.id,
          workspace_collection_id: this.workspaceCollectionId,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })

      const { original, normalized } = response.data.data

      // Update originalData
      this.originalData.Low = original.low
      this.originalData.Medium = original.medium
      this.originalData.High = original.high
      this.originalData.Critical = original.critical

      // Calculate the sum of severities by index
      const low = normalized.low
      const medium = normalized.medium
      const high = normalized.high
      const critical = normalized.critical

      const maxValues = low.map((_, i) => {
        return (low[i] || 0) + (medium[i] || 0) + (high[i] || 0) + (critical[i] || 0)
      })

      this.maxSum = Math.max(...maxValues)

      // Update chartOption with normalized data and maximum radiusAxis value

      this.chartOption.series[0].data = normalized.low
      this.chartOption.series[1].data = normalized.medium
      this.chartOption.series[2].data = normalized.high
      this.chartOption.series[3].data = normalized.critical

      this.chartOption.radiusAxis.max = this.maxSum

      window.addEventListener('resize', this.handleResize)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize() {
      if (this.$refs.echartRef) {
        // Resize the ECharts instance when window resizes
        this.$refs.echartRef.resize()
      }
    },
  },
}
</script>

<style scoped>
/* Optionally add some style to your chart container */
</style>
