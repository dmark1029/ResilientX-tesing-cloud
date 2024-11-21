<template>
  <SparkStatWidget straight>
    <ApexChart
      v-if="loaded"
      :height="spark1.chart.height"
      :type="spark1.chart.type"
      :series="spark1.series"
      :options="spark1"
    />
    <div v-else class="placeholder-glow">
      <span class="placeholder w-100" style="height: 130px" />
    </div>
  </SparkStatWidget>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import SparkStatWidget from '/@src/components/base/widget/SparkStatWidget.vue'
import { axios } from '/@src/axios'

export default {
  components: {
    SparkStatWidget,
    ApexChart: VueApexCharts,
  },
  props: [
    'workspace',
    'project',
    'collection',
    'asset',
    'url',
    'title',
    'color',
    'workspaceCollectionId',
  ],
  data: () => ({
    spark1: null,
    loaded: false,
  }),
  beforeMount() {
    this.spark1 = {
      chart: {
        group: 'sparklines',
        type: 'area',
        height: 130,
        sparkline: {
          enabled: true,
        },
      },
      colors: [this.color],
      stroke: {
        width: [2],
        curve: 'straight',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: this.title === 'Domains' ? 'horizontal' : 'vertical',
          shadeIntensity: 1,
          gradientToColors: ['black'],
          inverseColors: this.title === 'Domains' ? true : false,
          opacityFrom: 1,
        },
      },
      series: [
        {
          name: this.title,
          data: [],
        },
      ],
      labels: [],
      yaxis: {
        min: 0,
        labels: {
          minWidth: 100,
        },
      },
      xaxis: {
        type: 'datetime',
      },
      title: {
        text: this.title,
        offsetX: 5,
        style: {
          fontSize: '24px',
          cssClass: 'apexcharts-yaxis-title',
          color: this.color,
        },
      },
      subtitle: {
        text: 0,
        offsetX: 5,
        style: {
          fontSize: '24px',
          fontWeight: '600',
          cssClass: 'apexcharts-yaxis-title',
          color: this.color,
        },
      },
      tooltip: {
        x: {
          formatter: function (timestamp) {
            const date = new Date(timestamp)

            const day = date.getDate().toString().padStart(2, '0')
            const month = (date.getMonth() + 1).toString().padStart(2, '0') // Note: Months are zero-based
            const year = date.getFullYear()

            return `${day}.${month}.${year}`
          },
        },
        y: {
          formatter: function (value) {
            return parseInt(value)
          },
        },
      },
    }
  },
  async mounted() {
    await axios
      .get(this.url, {
        params: {
          workspace_collection_id: this.workspaceCollectionId,
          workspace_id: this.workspace?.id,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.spark1.series[0].data = res.data.dates.map((item) => item.count)
        this.spark1.labels = res.data.dates.map((item) => item.date)
        this.spark1.subtitle.text = res.data.total
      })
  },
}
</script>
