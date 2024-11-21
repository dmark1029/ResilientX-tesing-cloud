<template>
  <div v-if="loaded">
    <AssignmentWidget title="Total Assignment"> </AssignmentWidget>
  </div>
  <div v-else>
    <VLoader :active="true">
      <div style="height: 160px" />
    </VLoader>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import AssignmentWidget from '/@src/components/base/widget/AssignmentWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: {
    VLoader,
    AssignmentWidget,
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
    'user',
    'detailed',
  ],
  data: () => ({
    widgetRadialGroup1Options: null,
    loaded: false,
    summary: null,
    userStats: null,
    critical: null,
    high: null,
    medium: null,
    low: null,
    opened: null,
    unassigned: null,
  }),
  async mounted() {
    await axios
      .get('/widget/issues-summary', {
        params: {
          workspace_id: this.workspace?.id,
          workspace_collection_id: this.workspaceCollectionId,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
          user_id: this.user?.id,
        },
      })
      .then((res) => {
        this.summary = res.data.data
        console.log('summary', this.summary)
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

          if (item === 'opened') {
            this.opened = template
            this.opened.series = [(this.summary.opened / this.summary.total) * 100]
            this.opened.colors = ['#e62864']
          }
          if (item === 'user') {
            this.userStats = template
            this.userStats.series = [(this.summary.user / this.summary.total) * 100]
            this.userStats.colors = ['#e62864']
          }
          if (item === 'in_progress') {
            this.in_progress = template
            this.in_progress.series = [
              (this.summary.in_progress / this.summary.total) * 100,
            ]
            this.in_progress.colors = ['#faad42']
          }
          if (item === 'closed') {
            this.closed = template
            this.closed.colors = ['#05d69e']
            this.closed.series = [(this.summary.closed / this.summary.total) * 100]
          }
        })

        this.loaded = true
      })
  },
}
</script>
