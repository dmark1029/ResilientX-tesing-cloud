<template>
  <VModal is="div" :open="showModal" :title="title" size="small" @close="_cancel">
    <template #content>
      <div class="has-text-centered">
        <h5 class="mt-0">
          {{ message }}
        </h5>
        <div class="p-3">
          <button class="button v-button v-modal-close mr-3" @click="_cancel">
            {{ cancelButton }}
          </button>
          <span class="button v-button is-raised is-primary" @click="_confirm">{{
            okButton
          }}</span>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  name: 'ConfirmDialogue',
  components: { VModal },
  data: () => ({
    title: '',
    message: undefined, // Main text content
    okButton: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
    cancelButton: 'Go Back', // text for cancel button
    resolvePromise: undefined,
    rejectPromise: undefined,
    showModal: false,
  }),
  methods: {
    show(opts = {}) {
      this.title = opts.title
      this.message = opts.message
      this.okButton = opts.okButton
      if (opts.cancelButton) {
        this.cancelButton = opts.cancelButton
      }
      // Once we set our config, we tell the popup modal to open
      this.open()
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },
    _confirm() {
      this.close()
      this.resolvePromise(true)
    },
    _cancel() {
      this.close()
      this.resolvePromise(false)
    },
    open() {
      this.showModal = true
    },
    close() {
      this.showModal = false
    },
  },
}
</script>
