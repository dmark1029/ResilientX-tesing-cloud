<template>
  <div>
    <div v-if="!asset.scanned_date" class="p-5 m-5">
      <div v-if="pending" class="not-scanned">
        <h2 class="title is-2 is-bold mt-5">Scans queued</h2>
        <p>
          The company is currently being scanned.<br />Please come back later to check
          results.
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
          The company is currently pending its initial scan.<br />To unveil comprehensive
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
    <div v-else>
      <div v-if="pending">
        <VMessage class="mb-5 mt-0">
          <p>
            <i class="fa fa-sync rotating mr-2"></i>
            We are in the process of gathering asset information. Kindly await as we
            conduct our scans.
          </p>
        </VMessage>
      </div>
    </div>

    <VendorsTasksModal v-if="showScanNowModal" :asset="asset" @close="onCloseScanModal" />
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VendorsTasksModal from '/@src/components/vendors/assets/VendorsTasksModal.vue'
import VMessage from '/@src/components/base/message/VMessage.vue'

export default {
  components: { VMessage, VendorsTasksModal },
  mixins: [permissionsMixin],
  props: ['asset', 'button'],
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

      this.getTasks()
    },
    getTasks() {
      let params = {
        collection_id: this.asset.id,
      }

      axios
        .get('/task', {
          params: params,
        })
        .then((res) => {
          const pendingScans = res.data.data.filter((task) => {
            return (
              task.status === 'pending' ||
              task.status === 'started' ||
              task.status === 'queued'
            )
          })

          this.pending = pendingScans.length > 0
        })
        .catch(() => {})
    },
  },
}
</script>
