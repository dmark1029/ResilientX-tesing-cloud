<template>
  <div>
    <div v-if="!asset.scanned_date" class="p-5 m-5">
      <div v-if="pending" class="not-scanned">
        <h2 class="title is-2 is-bold mt-5">Scans queued</h2>
        <p>
          The asset is currently being scanned.<br />Please come back later to check
          results and view the report.
        </p>
        <div class="currently-planned mb-2">
          <div>
            <span>We are gathering information..</span>
          </div>
        </div>
        <a
          :class="
            canPerformAction('scans', 'create')
              ? 'button v-button is-raised is-primary mt-5'
              : 'button v-button is-raised is-primary mt-5 is-disabled'
          "
          @click="$router.go(-1)"
        >
          Go back
        </a>
      </div>
      <div v-else class="not-scanned">
        <h2 class="title is-2 is-bold mt-5">Not scanned</h2>
        <p>
          The asset is currently pending its initial scan.<br />To unveil comprehensive
          insights and ensure operational transparency, we kindly request the initiation
          of the first scan.
        </p>
        <div class="currently-planned mb-2">
          <div>
            <span>Launch your first scan by clicking "Scan now"</span>
          </div>
        </div>
        <a
          v-if="button"
          :class="
            canPerformAction('scans', 'create')
              ? 'button v-button is-raised is-primary mt-5'
              : 'button v-button is-raised is-primary mt-5 is-disabled'
          "
          @click="showScanNowModal = true"
        >
          Scan now
        </a>
      </div>
    </div>

    <TasksModal
      v-if="showScanNowModal"
      :asset="asset"
      :project="project"
      @close="onCloseScanModal"
    />
  </div>
</template>

<script>
import permissionsMixin from '../../mixins/permissionsMixin.js'
import { axios } from '/@src/axios'
import TasksModal from '/@src/components/tasks/TasksModal.vue'

export default {
  components: { TasksModal },
  mixins: [permissionsMixin],
  props: ['asset', 'project', 'button'],
  data: () => ({
    showScanNowModal: false,
    pending: false,
  }),
  mounted() {
    this.getTasks()
  },
  methods: {
    onCloseScanModal() {
      this.showScanNowModal = false
    },
    getTasks() {
      let params = {}
      if (this.asset.taskable_type === 'asset') {
        params = {
          asset_id: this.asset.id,
        }
      }
      if (this.asset.taskable_type === 'collection') {
        params = {
          collection_id: this.asset.id,
        }
      }
      axios
        .get('/task', {
          params: params,
        })
        .then((res) => {
          this.pending = !!res.data.meta.total
        })
        .catch(() => {})
    },
  },
}
</script>
