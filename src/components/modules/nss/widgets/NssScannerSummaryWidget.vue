<template>
  <div class="columns">
    <div class="column is-8 d-flex align-items-stretch">
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
          <div class="column is-3">
            <CountComponent
              title="High alerts"
              :loading="loading"
              :count="data.alert_groups_high"
              status="high"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Medium alerts"
              :loading="loading"
              :count="data.alert_groups_med"
              status="medium"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Low alerts"
              :loading="loading"
              :count="data.alert_groups_low"
              status="low"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Informational alerts"
              :loading="loading"
              :count="data.alert_groups_info"
              status="info"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-12">
            <CountComponent
              title="Impacted targets"
              :loading="loading"
              :count="data.alerts"
            />
          </div>
        </div>
        <div class="columns">
          <div class="column is-3">
            <CountComponent
              title="High impact"
              :loading="loading"
              :count="data.alerts_high"
              status="high"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Medium impact"
              :loading="loading"
              :count="data.alerts_med"
              status="medium"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Low impact"
              :loading="loading"
              :count="data.alerts_low"
              status="low"
            />
          </div>
          <div class="column is-3">
            <CountComponent
              title="Informational impact"
              :loading="loading"
              :count="data.alerts_info"
              status="info"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="column is-4 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body">
          <!-- Nav tabs -->
          <ul class="nav nav-pills nav-justified" role="tablist">
            <li class="nav-item" role="presentation" @click="setGroupAlerts">
              <a
                class="nav-link active"
                data-bs-toggle="tab"
                href="#home"
                role="tab"
                aria-selected="true"
                >Alerts</a
              >
            </li>
            <li class="nav-item" role="presentation" @click="setTargetsAlerts">
              <a
                class="nav-link"
                data-bs-toggle="tab"
                href="#profile"
                role="tab"
                aria-selected="false"
                tabindex="-1"
                >Targets</a
              >
            </li>
          </ul>

          <div v-if="!loading" id="chart">
            <Apexchart
              v-if="data.alerts"
              type="bar"
              height="280"
              :options="chartOptions"
              :series="series"
            />
            <p v-else class="mt-3">No data available</p>
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

export default {
  components: {
    CountComponent,
    Apexchart: VueApexCharts,
  },
  props: ['workspace', 'project', 'module', 'task'],
  data: () => ({
    data: {},
    loading: true,
    series: null,
    chartOptions: {
      chart: {
        type: 'bar',
        height: 215,
      },
      plotOptions: {
        bar: {
          barHeight: '100%',
          distributed: true,
          horizontal: true,
          dataLabels: {
            enabled: false,
          },
        },
      },

      colors: ['#ef4d56', '#ff9f43', '#41cbd8', '#eaf0f9'],
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['High', 'Medium', 'Low', 'Info'],
        labels: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return ''
            },
          },
        },
      },
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
        this.setGroupAlerts()
        this.loading = false
      })
  },
  methods: {
    setGroupAlerts() {
      this.series = [
        {
          data: [
            this.data.alert_groups_high,
            this.data.alert_groups_med,
            this.data.alert_groups_low,
            this.data.alert_groups_info,
          ],
        },
      ]
    },
    setTargetsAlerts() {
      this.series = [
        {
          data: [
            this.data.alerts_high,
            this.data.alerts_med,
            this.data.alerts_low,
            this.data.alerts_info,
          ],
        },
      ]
    },
  },
}
</script>
