<template>
  <div v-if="loaded">
    <GroupedStatWidget
      title="SBOM Issues"
      :values="[
        summary.critical,
        summary.high,
        summary.medium,
        summary.low,
        summary.outdated,
      ]"
      :labels="['Critical', 'High', 'Medium', 'Low', 'Outdated']"
    >
      <template #chart1>
        <div>
          <ApexChart
            :height="critical.chart.height"
            :type="critical.chart.type"
            :series="critical.series"
            :options="critical"
          />
        </div>
      </template>
      <template #chart2>
        <div>
          <ApexChart
            :height="high.chart.height"
            :type="high.chart.type"
            :series="high.series"
            :options="high"
          />
        </div>
      </template>
      <template #chart3>
        <div>
          <ApexChart
            :height="medium.chart.height"
            :type="medium.chart.type"
            :series="medium.series"
            :options="medium"
          />
        </div>
      </template>
      <template #chart4>
        <div>
          <ApexChart
            :height="low.chart.height"
            :type="low.chart.type"
            :series="low.series"
            :options="low"
          />
        </div>
      </template>
      <template #chart5>
        <div>
          <ApexChart
            :height="outdated.chart.height"
            :type="outdated.chart.type"
            :series="outdated.series"
            :options="outdated"
          />
        </div>
      </template>
    </GroupedStatWidget>
  </div>
  <div v-else>
    <VLoader :active="true">
      <div style="height: 160px" />
    </VLoader>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { axios } from '/@src/axios'
import GroupedStatWidget from '/@src/components/base/widget/GroupedStatWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { mapGetters } from 'vuex'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: {
    VLoader,
    GroupedStatWidget,
    ApexChart: VueApexCharts,
  },
  mixins: [urlMixin],
  props: [
    'project',
    'workspace',
    'workspaceCollectionId',
    'collection',
    'asset',
    'url',
    'title',
    'color',
    'date',
    'detailed',
  ],
  data: () => ({
    widgetRadialGroup1Options: null,
    loaded: false,
    summary: null,
    critical: null,
    high: null,
    medium: null,
    low: null,
    outdated: null,
    opened: null,
    unassigned: null,
  }),
  computed: {
    ...mapGetters(['module']),
  },
  async mounted() {
    await axios
      .get('/widget/sbom-summary', {
        params: {
          workspace_id: this.workspace?.id,
          workspace_collection_id: this.workspaceCollectionId,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
          date: this.date,
        },
      })
      .then((res) => {
        this.summary = res.data.data

        Object.keys(this.summary).forEach((item) => {
          let template = {
            series: [35],
            chart: {
              height: 102,
              type: 'radialBar',
              offsetY: -10,
              toolbar: {
                show: false,
              },
            },
            colors: ['#b4e4ce'],
            plotOptions: {
              radialBar: {
                hollow: {
                  size: '35%',
                },
                dataLabels: {
                  show: false,
                },
              },
            },
            labels: [''],
          }

          if (item === 'critical') {
            this.critical = template
            this.critical.series = [(this.summary.critical / this.summary.total) * 100]
            this.critical.colors = ['#ff2833']
          }
          if (item === 'high') {
            this.high = template
            this.high.series = [(this.summary.high / this.summary.total) * 100]
            this.high.colors = ['#CD1619']
          }
          if (item === 'outdated') {
            this.outdated = template
            this.outdated.series = [(this.summary.outdated / this.summary.outdated) * 100]
            this.outdated.colors = ['#CD1619']
          }
          if (item === 'medium') {
            this.medium = template
            this.medium.series = [(this.summary.medium / this.summary.total) * 100]
            this.medium.colors = ['#FFB622']
          }
          if (item === 'low') {
            this.low = template
            this.low.series = [(this.summary.low / this.summary.total) * 100]
            this.low.colors = ['#057BC1']
          }
          if (item === 'opened') {
            this.opened = template
            this.opened.series = [(this.summary.opened / this.summary.total) * 100]
            this.opened.colors = ['#2f6cf9']
          }
          if (item === 'unassigned') {
            this.unassigned = template
            this.unassigned.colors = ['#8168B1']
            this.unassigned.series = [
              (this.summary.unassigned / this.summary.total) * 100,
            ]
          }
        })

        this.loaded = true
      })
  },
}
</script>
