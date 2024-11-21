<template>
  <div class="project-overview">
    <div class="columns is-multiline">
      <div
        class="column is-3 is-clickable"
        @click="
          $router.push({
            name: 'VRMIssues',
            params: { id: workspace.id },
          })
        "
      >
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/issues-count"
          title="Issues"
          color="#8168b1"
          class="spark-component"
        />
      </div>
      <div
        class="column is-3 is-clickable"
        @click="
          $router.push({
            name: 'VRMVulnerabilities',
            params: { id: workspace.id },
          })
        "
      >
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/vulnerabilities-count"
          title="CVE"
          color="#e62864"
          class="spark-component"
        />
      </div>
      <div
        class="column is-3 is-clickable"
        @click="
          $router.push({
            name: 'VRMEvents',
            params: { id: workspace.id },
          })
        "
      >
        <SparkStatsComponent
          :workspace-collection-id="workspace.id"
          url="/widget/events-count"
          title="Events"
          color="#336aeb"
          class="spark-component"
        />
      </div>
      <div
        class="column is-3 is-clickable"
        @click="
          $router.push({
            name: 'VendorsView',
            params: { id: workspace.id },
          })
        "
      >
        <SparkStatsComponent
          :workspace="workspace"
          url="/widget/vendors-count"
          title="Companies"
          color="#77d2f3"
          class="spark-component"
        />
      </div>

      <div class="column is-3">
        <ExposureStatsWidget :workspace-collection-id="workspace.id" />
      </div>

      <div class="column is-4">
        <VendorsByScoreWidget :workspace="workspace" />
      </div>

      <div class="column is-5">
        <VendorsByIssuesWidget :workspace-collection-id="workspace.id" />
      </div>

      <div class="column is-7">
        <IssuesStatsWidget :workspace-collection-id="workspace.id" :detailed="true" />
      </div>
      <div class="column is-5">
        <IssuesStatusWidget :workspace-collection-id="workspace.id" :detailed="true" />
      </div>

      <div class="column is-9">
        <LatestIssuesWidget :workspace-collection-id="workspace.id" />
      </div>
      <div class="column is-3">
        <LatestEventsWidget :workspace-collection-id="workspace.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SparkStatsComponent from '/@src/components/modules/widgets/SparkStatsComponent.vue'
import ExposureStatsWidget from '/@src/components/modules/vrm/widgets/ExposureStatsWidget.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import LatestIssuesWidget from '/@src/components/issues/widgets/LatestIssuesWidget.vue'
import LatestEventsWidget from '/@src/components/events/widgets/LatestEventsWidget.vue'
import IssuesStatusWidget from '/@src/components/issues/widgets/IssuesStatusWidget.vue'
import VendorsByScoreWidget from '/@src/components/modules/vrm/widgets/VendorsByScoreWidget.vue'
import VendorsByIssuesWidget from '/@src/components/modules/vrm/widgets/VendorsByIssuesWidget.vue'

export default {
  components: {
    VendorsByScoreWidget,
    VendorsByIssuesWidget,
    IssuesStatusWidget,
    LatestEventsWidget,
    LatestIssuesWidget,
    IssuesStatsWidget,
    ExposureStatsWidget,
    SparkStatsComponent,
  },
  props: ['workspace'],
  data: () => ({
    spark1: null,
  }),
  computed: {
    ...mapGetters(['module']),
  },
  async beforeMount() {},
  metaInfo() {
    return {
      title: 'Companies overview',
    }
  },
}
</script>

<style scoped>
.project-overview {
  .dashboard-card {
    height: 100%;
  }
}
</style>
