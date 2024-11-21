<template>
  <VModal
    is="form"
    :open="true"
    title="Request SBOM from Company"
    size="big"
    actions="right"
    @close="$emit('close')"
  >
    <template #content>
      <div>
        <p>Send a request to Company to upload a SBOM file.</p>
        <p>
          This will provide an overview of the libraries used and facilitate a better
          understanding of the components and dependencies within the software supply
          chain.
        </p>
        <p>
          A software supply chain is composed of the components, libraries, tools, and
          processes used to develop, build, and publish a software artifact.
        </p>
        <p class="mb-5">
          <a href="https://cyclonedx.org/specification/overview/" target="_blank"
            >Learn more</a
          >
        </p>

        <form @submit.prevent="sendRequest" @keydown="form.onKeydown($event)">
          <div class="modal-card-foot">
            <button type="button" class="button v-button" @click="$emit('close')">
              {{ $t('Close') }}
            </button>
            <FormButton :form="form" class="button v-button is-primary btn-sm">
              {{ $t('Send request') }}
            </FormButton>
          </div>
        </form>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    FormButton,
    VModal,
  },
  props: ['asset', 'collection'],
  emits: ['closeModal', 'close'],
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  methods: {
    sendRequest() {
      this.form.workspace_id = this.workspace.id
      this.form.vendor_id = this.collection?.id
      this.form.type = 'sbom'

      this.form
        .post('/vendor/file-request')
        .then((data) => {
          this.$store.dispatch('addAlert', {
            text: 'Request sent.',
            type: 'success',
          })

          this.$emit('close')
        })
        .catch((e) => {
          this.$store.dispatch('addAlert', {
            text: e.response.data.message,
            type: 'danger',
          })
        })
    },
  },
}
</script>
