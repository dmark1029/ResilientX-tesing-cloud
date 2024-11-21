<template>
  <VModal
    is="div"
    :open="showModal"
    title="Launch your first scan"
    size="big"
    @close="closeModal"
  >
    <template #content>
      <div class="columns">
        <div class="column is-4 has-text-centered">
          <img src="/assets/report-sample.png" alt="" class="img-fluid" />
        </div>
        <!--end col-->
        <div class="is-8 has-text-centered p-3">
          <div class="mt-5" />
          <h5 v-if="module" class="title is-5">
            Launch your first scan on "{{ module?.name }}"
          </h5>
          <h5 v-else class="title is-5">Launch your first scan</h5>
          <p class="mb-5">
            Launch scan now & receive your first report, and gain insights into the
            vulnerabilities and attack vectors that may be compromising your online
            security.
          </p>
          <button
            class="button v-button is-bold is-big is-raised is-primary mb-3"
            @click="launch"
          >
            Launch scan
          </button>

          <div>
            <a class="mt-0 mb-5 d-inline-block is-clickable" @click="closeModal">Skip</a>
          </div>
        </div>
        <!--end col-->
      </div>
      <div />
    </template>
  </VModal>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: { VModal },
  data: () => ({
    showModal: true,
  }),
  computed: {
    ...mapGetters(['module']),
  },
  methods: {
    closeModal() {
      this.showModal = false
    },
    launch() {
      this.showModal = false

      this.$store.dispatch('addShowWizard', true)
    },
  },
}
</script>
