<template>
  <div v-if="loaded">
    <GroupedSeverityWidget  
      title="Issues by severity"
      :values="[summary.critical, summary.high, summary.medium, summary.low]"
      :labels="['Critical', 'High', 'Medium', 'Low']"
    >
      <template #chart1>
        <div
          class="is-clickable"
          @click="$router.push(getIssueIndexURL(project, { severity: 'critical' }))"
        >
          <ApexChart
            :height="critical.chart.height"
            :type="critical.chart.type"
            :series="critical.series"
            :options="critical"
          />
        </div>
      </template>
      <template #chart2>
        <div
          class="is-clickable"
          @click="$router.push(getIssueIndexURL(project, { severity: 'high' }))"
        >
          <ApexChart
            :height="high.chart.height"
            :type="high.chart.type"
            :series="high.series"
            :options="high"
          />
        </div>
      </template>
      <template #chart3>
        <div
          class="is-clickable"
          @click="$router.push(getIssueIndexURL(project, { severity: 'medium' }))"
        >
          <ApexChart
            :height="medium.chart.height"
            :type="medium.chart.type"
            :series="medium.series"
            :options="medium"
          />
        </div>
      </template>
      <template #chart4>
        <div
          class="is-clickable"
          @click="$router.push(getIssueIndexURL(project, { severity: 'low' }))"
        >
          <ApexChart
            :height="low.chart.height"
            :type="low.chart.type"
            :series="low.series"
            :options="low"
          />
        </div>
      </template>
    </GroupedSeverityWidget>
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
import GroupedSeverityWidget from '/@src/components/base/widget/GroupedSeverityWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { mapGetters } from 'vuex'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: {
    VLoader,
    GroupedSeverityWidget,
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
    opened: null,
    unassigned: null,
  }),
  computed: {
    ...mapGetters(['module']),
  },
  async mounted() {
    await axios
      .get('/widget/issues-summary', {
        params: {
          workspace_id: this.workspace?.id,
          workspace_collection_id: this.workspaceCollectionId,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
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
