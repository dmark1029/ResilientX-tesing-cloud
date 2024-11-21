<template>
  <div>
    <div class="columns">
      <div class="column is-6">
        <div class="card mb-5">
          <div class="card-body">
            <IssuesChartWidget :project="project" :workspace="workspace" />
          </div>
        </div>
        <div class="columns">
          <div class="column is-6">
            <!-- Issues by stats -->
            <IssuesStatusWidgetNew
              :project="project"
              :workspace="workspace"
              :detailed="true"
            />
          </div>
          <div class="column is-6">
            <!-- Total Assignment -->
            <IssuesAssignmentWidget
              :project="project"
              :workspace="workspace"
              :detailed="true"
            />
          </div>
        </div>
      </div>
      <div class="column is-6">
        <div class="mb-5">
          <AssetIssuesSummaryWidget :project="project" :workspace="workspace" />
        </div>
        <div class="columns">
          <div class="column is-6">
            <!-- Risks by Severity -->
            <IssuesStatsWidgetNew
              :project="project"
              :workspace="workspace"
              :detailed="true"
            />
          </div>
          <div class="column is-6">
            <!-- Assets by Exposure Score -->
            <IssuesStatsWidgetNew
              :project="project"
              :workspace="workspace"
              :detailed="true"
            />
          </div>
        </div>
        <div>
          <!-- Lorem ipsum dolor -->
          <IssuesDocWidget :project="project" :workspace="workspace" :detailed="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IssuesStatsWidgetNew from '/@src/components/issues/widgets/IssuesStatsWidgetNew.vue'
import IssuesDocWidget from '/@src/components/issues/widgets/IssuesDocWidget.vue'
import IssuesStatusWidgetNew from '/@src/components/issues/widgets/IssuesStatusWidgetNew.vue'
import IssuesChartWidget from '/@src/components/issues/widgets/IssuesChartWidget.vue'
import IssuesAssignmentWidget from '/@src/components/issues/widgets/IssuesAssignmentWidget.vue'
import AssetIssuesSummaryWidget from '/@src/components/assets/widgets/AssetIssuesSummaryWidget.vue'

export default {
  components: {
    AssetIssuesSummaryWidget,
    IssuesChartWidget,
    IssuesStatusWidgetNew,
    IssuesDocWidget,
    IssuesAssignmentWidget,
    IssuesStatsWidgetNew,
  },
  props: ['project'],
  data: () => ({
    spark1: null,
  }),
  computed: {
    ...mapGetters(['module', 'workspace', 'user']),
  },
  async beforeMount() {},
  metaInfo() {
    if (this.project) {
      return {
        title: this.project.name + ' overview',
      }
    }

    return {
      title: this.workspace?.name + ' overview',
    }
  },
}
</script>

<style scoped>
.project-overview {
  .dashboard-card {
    height: 100%;
  }

  .sub-column {
    height: 100%;
  }
}
</style>
