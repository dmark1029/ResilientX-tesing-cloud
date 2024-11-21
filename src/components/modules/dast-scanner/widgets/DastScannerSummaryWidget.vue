<template>
  <div class="columns">
    <div class="column is-6 d-flex align-items-stretch">
      <div class="w-100">
        <div class="columns">
          <div class="column is-12">
            <CountComponent
              title="Alerts"
              :loading="loading"
              :count="data.alert_groups"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <CountComponent
              title="High alerts"
              :loading="loading"
              :count="data.alert_groups_high"
              status="high"
            />
          </div>
          <div class="column is-4">
            <CountComponent
              title="Medium alerts"
              :loading="loading"
              :count="data.alert_groups_med"
              status="medium"
            />
          </div>
          <div class="column is-4">
            <CountComponent
              title="Low alerts"
              :loading="loading"
              :count="data.alert_groups_low"
              status="low"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-12">
            <CountComponent
              title="Impacted URL's"
              :loading="loading"
              :count="data.alerts"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-4">
            <CountComponent
              title="High impact"
              :loading="loading"
              :count="data.alerts_high"
              status="high"
            />
          </div>
          <div class="column is-4">
            <CountComponent
              title="Medium impact"
              :loading="loading"
              :count="data.alerts_med"
              status="medium"
            />
          </div>
          <div class="column is-4">
            <CountComponent
              title="Low impact"
              :loading="loading"
              :count="data.alerts_low"
              status="low"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="column is-6 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body">
          <h5 class="title is-5">CWE Overview</h5>
          <div v-if="!loading" id="chart">
            <Apexchart
              v-if="data.cwe_counts"
              type="pie"
              height="300"
              :options="chartOptions"
              :series="series"
            />
            <p v-else>No data available</p>
          </div>
          <VLoader v-else :active="true" class="loading p-5">
            <div role="status" style="height: 300px"></div>
          </VLoader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import CountComponent from '../../widgets/CountComponent.vue'
import VueApexCharts from 'vue3-apexcharts'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    CountComponent,
    Apexchart: VueApexCharts,
    VLoader,
  },
  props: ['workspace', 'project', 'module', 'task'],
  data: () => ({
    data: {
      reports: [],
      ip_list: 0,
      ip_list_details: 0,
      ip_list_details_with_vuln: 0,
      subdomain_ips_list: 0,
      certificates: 0,
      typosquatting: 0,
      typosquatting_high: 0,
      typosquatting_med: 0,
      typosquatting_low: 0,
      list_ip_ports: 0,
      subdomains_list: 0,
      list_high_vulnerabilities: 0,
      list_med_vulnerabilities: 0,
      list_low_vulnerabilities: 0,
      list_vulnerabilities: 0,
      list_all_technologies: 0,
    },
    loading: true,
    series: null,
    chartOptions: {
      chart: { height: 220, type: 'donut' },
      stroke: { show: !0, width: 2, colors: ['transparent'] },
      dataLabels: {
        enabled: true,
        textAnchor: 'end',
        style: {
          fontSize: '11px',
        },
        formatter(val, opts) {
          const name = opts.w.globals.labels[opts.seriesIndex]
          return [name, opts.w.globals.series[opts.seriesIndex]]
        },
      },
      tooltip: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'right',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: 6,
        formatter: function (val, opts) {
          return val + ': ' + opts.w.globals.series[opts.seriesIndex]
        },
      },
      labels: null,
    },
  }),
  async mounted() {
    await axios
      .get(
        '/module/' +
          this.module.id +
          '/v1/summary/' +
          this.workspace.id +
          '/' +
          this.project.id +
          '/' +
          (this.task ? this.task?.id : '*')
      )
      .then((res) => {
        this.data = res.data
        this.chartOptions.labels = Object.keys(this.data.cwe_counts)
        this.series = Object.values(this.data.cwe_counts)
        this.loading = false
      })
  },
  methods: {},
}
</script>
