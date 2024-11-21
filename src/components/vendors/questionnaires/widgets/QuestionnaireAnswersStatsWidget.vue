<template>
  <div v-if="loaded">
    <div class="columns mb-2">
      <div class="column is-3">
        <div class="stat-widget grouped-stat-widget is-straight">
          <div>
            <div class="columns">
              <div class="column is-6">
                <div class="widget-head">
                  <h3 class="dark-inverted">Risk rating</h3>
                </div>
                <p>
                  By answering total of {{ summary.total }} questionnaires we have
                  calculated risk rating:
                </p>
                <BusinessImpactRiskBadge
                  class="mt-2"
                  :impact="summary.business_impact_questionnaires_risk"
                />
              </div>
              <div class="column is-6">
                <QuestionnaireGradeWidget
                  v-if="summary.questionnaires_score !== null"
                  class="mt-1 mb-1"
                  :score="summary.questionnaires_score"
                />
                <QuestionnaireGradeWidget v-else score="0" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-9">
        <GroupedStatWidget
          title="Questionnaires by risk rating"
          :values="[
            summary.total,
            summary.excellent,
            summary.good,
            summary.fair,
            summary.poor,
            summary.bad,
          ]"
          :labels="['Total', 'Excellent', 'Good', 'Fair', 'Poor', 'Bad']"
        >
          <template #chart1>
            <div class="is-clickable">
              <ApexChart
                :height="total.chart.height"
                :type="total.chart.type"
                :series="total.series"
                :options="total"
              />
            </div>
          </template>
          <template #chart2>
            <div class="is-clickable">
              <ApexChart
                :height="excellent.chart.height"
                :type="excellent.chart.type"
                :series="excellent.series"
                :options="excellent"
              />
            </div>
          </template>
          <template #chart3>
            <div class="is-clickable">
              <ApexChart
                :height="good.chart.height"
                :type="good.chart.type"
                :series="good.series"
                :options="good"
              />
            </div>
          </template>
          <template #chart4>
            <div class="is-clickable">
              <ApexChart
                :height="fair.chart.height"
                :type="fair.chart.type"
                :series="fair.series"
                :options="fair"
              />
            </div>
          </template>
          <template #chart5>
            <div class="is-clickable">
              <ApexChart
                :height="poor.chart.height"
                :type="poor.chart.type"
                :series="poor.series"
                :options="poor"
              />
            </div>
          </template>
          <template #chart6>
            <div class="is-clickable">
              <ApexChart
                :height="bad.chart.height"
                :type="bad.chart.type"
                :series="bad.series"
                :options="bad"
              />
            </div>
          </template>
        </GroupedStatWidget>
      </div>
    </div>
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
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import QuestionnaireGradeWidget from '/@src/components/modules/vrm/widgets/QuestionnaireGradeWidget.vue'

export default {
  components: {
    QuestionnaireGradeWidget,
    BusinessImpactRiskBadge,
    VLoader,
    GroupedStatWidget,
    ApexChart: VueApexCharts,
  },
  mixins: [urlMixin],
  props: ['vendorId'],
  data: () => ({
    widgetRadialGroup1Options: null,
    loaded: false,
    summary: null,
    total: null,
    excellent: null,
    good: null,
    fair: null,
    poor: null,
    bad: null,
  }),
  computed: {
    ...mapGetters(['module', 'workspace']),
  },
  async mounted() {
    await axios
      .get('/widget/questionnaires-summary', {
        params: {
          workspace_id: this.workspace?.id,
          vendor_id: this.vendorId,
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

          if (item === 'total') {
            this.total = template
            this.total.series = [(this.summary.total / this.summary.total) * 100]
            this.total.colors = ['#ff2833']
          }
          if (item === 'bad') {
            this.bad = template
            this.bad.series = [(this.summary.bad / this.summary.total) * 100]
            this.bad.colors = ['#ff2833']
          }
          if (item === 'poor') {
            this.poor = template
            this.poor.series = [(this.summary.poor / this.summary.total) * 100]
            this.poor.colors = ['#CD1619']
          }
          if (item === 'fair') {
            this.fair = template
            this.fair.series = [(this.summary.fair / this.summary.total) * 100]
            this.fair.colors = ['#FFB622']
          }
          if (item === 'good') {
            this.good = template
            this.good.series = [(this.summary.good / this.summary.total) * 100]
            this.good.colors = ['#057BC1']
          }
          if (item === 'excellent') {
            this.excellent = template
            this.excellent.series = [(this.summary.excellent / this.summary.total) * 100]
            this.excellent.colors = ['#2f6cf9']
          }
        })

        this.loaded = true
      })
  },
}
</script>

<style scoped>
.stat-widget {
  height: 100%;
}
</style>