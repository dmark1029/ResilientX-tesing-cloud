<template>
  <div id="overview-tab" class="tab-content is-active">
    <div v-for="module in general.modules" :key="module.id">
      <div
        v-if="
          (module.assets.includes(asset.type) && type === 'asset') ||
          type === 'collection'
        "
      >
        <div class="body-title">
          <h3>{{ module.name }} overview</h3>
          <router-link
            v-if="reports[module.id]"
            :to="{
              name: 'ReportsView',
              params: { id: reports[module.id].id },
            }"
            class="button v-button is-raised is-primary"
          >
            View report
          </router-link>
        </div>
        <div>
          <VLoader v-if="!reportsLoaded" :active="!reportsLoaded">
            <div style="height: 400px"></div>
          </VLoader>
          <div v-else class="mb-5">
            <div v-if="reports[module.id]">
              <div v-if="module.slug === 'cyber-ex'">
                <SummaryWidget
                  class="w-100"
                  :workspace="reports[module.id].task.taskable.project.workspace"
                  :project="reports[module.id].task.taskable.project"
                  :module="reports[module.id].task.module"
                  :task="reports[module.id].task"
                  :trial="false"
                  :report="reports[module.id]"
                />
              </div>
              <div v-else-if="module.slug === 'dast-scanner'">
                <DastScannerSummaryWidget
                  :workspace="reports[module.id].task.taskable.project.workspace"
                  :project="reports[module.id].task.taskable.project"
                  :module="reports[module.id].task.module"
                  :task="reports[module.id].task"
                  :trial="false"
                />
              </div>
              <div v-else-if="module.slug === 'nss'">
                <NssScannerSummaryWidget
                  class="w-100"
                  :workspace="reports[module.id].task.taskable.project.workspace"
                  :project="reports[module.id].task.taskable.project"
                  :module="reports[module.id].task.module"
                  :task="reports[module.id].task"
                  :trial="false"
                />
              </div>
              <div v-else>
                <p>Not implemented</p>
              </div>
            </div>
            <div v-else>
              <p>No reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import SummaryWidget from '/@src/components/modules/cyber-ex/widgets/SummaryWidget.vue'
import DastScannerSummaryWidget from '/@src/components/modules/dast-scanner/widgets/DastScannerSummaryWidget.vue'
import NssScannerSummaryWidget from '/@src/components/modules/nss/widgets/NssScannerSummaryWidget.vue'

export default {
  components: { NssScannerSummaryWidget, DastScannerSummaryWidget, SummaryWidget },
  props: ['project', 'asset', 'type'],
  data: () => ({
    reportsLoaded: false,
    reports: [],
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await this.getReports()
  },
  methods: {
    async getReports() {
      for (const module of this.general.modules) {
        await axios
          .get(
            `/report?project_id=${this.project.id}&module_id=${module.id}&taskable_id=${this.asset.id}&taskable_type=${this.type}`
          )
          .then((res) => {
            this.reports[module.id] = res.data.data.length ? res.data.data[0] : null
          })
          .catch(() => {})
      }

      this.reportsLoaded = true
    },
  },
}
</script>
