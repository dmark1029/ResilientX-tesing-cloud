<template>
  <div v-if="loaded" class="stat-widget is-straight">
    <div class="widget-header">
      <p class="v-label">Lorem ipsum dolor sit amet</p>
    </div>
    <div class="widget-body">
      <div class="widget-detail is-flex is-align-items-center is-justify-content-start">
        <span
          class="warning-logo is-flex is-align-items-center is-justify-content-center"
        >
          <img src="/images/icons/navbar/vuesax-linear-danger.svg" alt="danger" />
        </span>
        <span class="warning-title v-label">Lorem ipsum dolor sit amet</span>
        <span class="warning-content v-label has-slimscroll">
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
        </span>
      </div>
      <div class="widget-detail is-flex is-align-items-center is-justify-content-start">
        <span
          class="warning-logo is-flex is-align-items-center is-justify-content-center"
        >
          <img src="/images/icons/navbar/vuesax-linear-danger.svg" alt="danger" />
        </span>
        <span class="warning-title v-label">Lorem ipsum dolor sit amet</span>
        <span class="warning-content v-label has-slimscroll">
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
        </span>
      </div>
      <div class="widget-detail is-flex is-align-items-center is-justify-content-start">
        <span
          class="warning-logo is-flex is-align-items-center is-justify-content-center"
        >
          <img src="/images/icons/navbar/vuesax-linear-danger.svg" alt="danger" />
        </span>
        <span class="warning-title v-label">Lorem ipsum dolor sit amet</span>
        <span class="warning-content v-label has-slimscroll">
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
        </span>
      </div>
      <div class="widget-detail is-flex is-align-items-center is-justify-content-start">
        <span
          class="warning-logo is-flex is-align-items-center is-justify-content-center"
        >
          <img src="/images/icons/navbar/vuesax-linear-danger.svg" alt="danger" />
        </span>
        <span class="warning-title v-label">Lorem ipsum dolor sit amet</span>
        <span class="warning-content v-label has-slimscroll">
          Lorem ipsum dolor sit amet consectetr. Consequat semper et rhancus eu mauris
          ore..
        </span>
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
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { mapGetters } from 'vuex'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: {
    VLoader,
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
<style lang="scss" scoped>
.stat-widget {
  padding: 20px 32px 24px;

  .widget-header {
    p {
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
    }
  }

  .widget-body {
    margin-top: 20px;
    max-height: 180px;
    overflow-y: auto;

    .widget-detail {
      padding: 8px 12px;
      margin-bottom: 14px;

      .warning-logo {
        background-color: var(--dark-navbar-color);
        width: 32px;
        height: 32px;
        padding: 6.4px;
        margin-right: 20px;
      }

      .warning-title {
        font-weight: 600;
        line-height: 1.2;
        margin-right: 32px;
      }

      .warning-content {
        max-width: 300px;
        font-size: 12px;
        font-weight: normal;
        line-height: 1.5;
        white-space: normal;

        &.has-slimscroll {
          max-height: 40px;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        &.has-slimscroll::-webkit-scrollbar {
          width: 6px;
        }
        
        &.has-slimscroll::-webkit-scrollbar-thumb {
          background-color: darkgrey;
          border-radius: 10px;
        }
      }
    }
  }
}
</style>