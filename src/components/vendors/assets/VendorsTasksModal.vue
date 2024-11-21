<template>
  <VModal
    is="div"
    :open="true"
    title="Start new scan on selected company"
    size="big"
    @close="closeModal"
  >
    <template #content>
      <div class="modal-content">
        <div class="modal-body has-text-centered">
          <h5 class="mt-5 mb-4">
            {{ asset.name }}
          </h5>

          <button
            :class="
              form.busy
                ? 'button v-button is-bold is-big is-raised is-primary is-disabled'
                : 'button v-button is-bold is-big is-raised is-primary'
            "
            @click="save"
          >
            Start scan now
          </button>

          <div v-if="form.errors.any()" class="mt-3">
            <HasError :form="form" field="asset_id" />
            <HasError :form="form" field="license" />
            <HasError :form="form" field="tasks_limit" />
          </div>
          <div class="mt-4 mb-5">
            <a class="d-inline-block is-clickable" @click="goBack">Back</a>
          </div>
          <div class="terms-wrapper mb-5">
            <p>
              I accept responsibility and declare that I'm authorized for running the
              chosen scan on this target and accept
              {{ general.settings.title }}
              <a
                href="https://resilientx.com/terms-and-conditions"
                target="_blank"
                class=""
                >Terms and Conditions</a
              >.
            </p>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    HasError,
  },
  props: ['asset'],
  emits: ['success', 'close'],
  data: () => ({
    form: new Form({
      values: {},
    }),
    assets: [],
    editable: null,
    loading: false,
    selected: null,
    selectedModule: null,
    q: '',
    watchTaskDelay: 4000,
  }),
  computed: {
    ...mapGetters(['general', 'assetTasks', 'workspace']),
  },
  mounted() {
    this.loading = false
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    async save() {
      return await this.send()
        .then(() => {
          this.closeModal()
        })
        .catch(() => {})
    },
    goBack() {
      this.$emit('close')
    },
    closeModal() {
      this.$emit('close')
    },
    openModal() {},
    send() {
      let form = this.form.post(
        '/vendor/' + this.asset.id + '/scan?workspace_id=' + this.workspace.id
      )

      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            const { data } = res.data
            resolve(data)
          })
          .catch(() => {
            reject()
          })
      })
    },
  },
}
</script>
