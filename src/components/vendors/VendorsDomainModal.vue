<template>
  <VModal
    is="div"
    :open="true"
    :title="editable ? `Edit asset` : `Create asset`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="field">
          <label class="label">Value</label>
          <input
            v-model="form.value"
            type="text"
            class="input v-input"
            placeholder="Enter asset value"
          />
          <HasError :form="form" field="value" />
        </div>

        <div class="modal-card-foot">
          <button
            type="button"
            class="button v-button is-white btn-sm"
            @click="$emit('closeModal')"
          >
            Close
          </button>
          <FormButton :form="form" class="button v-button is-primary btn-sm">
            {{ editable ? $t('Edit asset') : $t('Create asset') }}
          </FormButton>
        </div>
      </form>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    FormButton,
    HasError,
  },
  props: ['vendor'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    this.form.vendor_id = this.vendor.id
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          window.location.reload()
          //this.$emit("closeModal");
        })
        .catch(() => {})
    },
    send() {
      let form = this.form.post('/vendor-asset')

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
