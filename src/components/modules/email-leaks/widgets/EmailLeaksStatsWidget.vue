<template>
  <div v-if="loaded">
    <GroupedStatWidget
      title="Leaks by severity"
      :values="[
        summary.leaks_critical,
        summary.leaks_high,
        summary.leaks_med,
        summary.leaks_low,
      ]"
      :labels="['Critical', 'High', 'Medium', 'Low']"
    >
      <template #chart1>
        <div
          class="is-clickable"
          @click="$router.push(getLeaksIndex(project, { severity: 'critical' }))"
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
          @click="$router.push(getLeaksIndex(project, { severity: 'high' }))"
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
          @click="$router.push(getLeaksIndex(project, { severity: 'medium' }))"
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
          @click="$router.push(getLeaksIndex(project, { severity: 'low' }))"
        >
          <ApexChart
            :height="low.chart.height"
            :type="low.chart.type"
            :series="low.series"
            :options="low"
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
      .get('/widget/asset-email-leak-summary', {
        params: {
          workspace_id: this.workspace?.id,
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

          if (item === 'leaks_critical') {
            this.critical = template
            this.critical.series = [
              (this.summary.leaks_critical / this.summary.leaks) * 100,
            ]
            this.critical.colors = ['#ff2833']
          }
          if (item === 'leaks_high') {
            this.high = template
            this.high.series = [(this.summary.leaks_high / this.summary.leaks) * 100]
            this.high.colors = ['#CD1619']
          }
          if (item === 'leaks_med') {
            this.medium = template
            this.medium.series = [(this.summary.leaks_med / this.summary.leaks) * 100]
            this.medium.colors = ['#FFB622']
          }
          if (item === 'leaks_low') {
            this.low = template
            this.low.series = [(this.summary.leaks_low / this.summary.leaks) * 100]
            this.low.colors = ['#057BC1']
          }
        })

        this.loaded = true
      })
  },
}
</script>
