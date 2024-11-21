<template>
  <VModal
    is="div"
    :open="true"
    :title="editable ? `Edit contact` : `Create contact`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="field">
          <label class="label">Type</label>
          <div class="select">
            <select v-model="form.contact_type_id" class="form-select">
              <option :value="undefined">Select contact type</option>
              <option
                v-for="(name, id) in general.vrm.contactTypes"
                :key="id"
                :value="id"
              >
                {{ name }}
              </option>
            </select>
          </div>
          <HasError :form="form" field="contact_type_id" />
        </div>

        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">Name</label>
              <input
                v-model="form.name"
                type="text"
                class="input v-input"
                placeholder="Enter name"
              />
              <HasError :form="form" field="name" />
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label">Surname</label>
              <input
                v-model="form.surname"
                type="text"
                class="input v-input"
                placeholder="Enter surname"
              />
              <HasError :form="form" field="surname" />
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label">Job title</label>
          <input
            v-model="form.job_title"
            type="text"
            class="input v-input"
            placeholder="Enter job title"
          />
          <HasError :form="form" field="job_title" />
        </div>

        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">Email</label>
              <input
                v-model="form.email"
                type="text"
                class="input v-input"
                placeholder="Enter email"
              />
              <HasError :form="form" field="email" />
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label">Phone</label>
              <input
                v-model="form.phone"
                type="text"
                class="input v-input"
                placeholder="Enter phone"
              />
              <HasError :form="form" field="phone" />
            </div>
          </div>
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
            {{ editable ? $t('Edit contact') : $t('Create contact') }}
          </FormButton>
        </div>
      </form>
    </template>
  </VModal>

  <AreYouSureModal ref="confirmDialogue" />
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'

export default {
  components: {
    AreYouSureModal,
    VModal,
    FormButton,
    HasError,
  },
  props: ['vendor', 'editable'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    confirmed: false,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.surname = this.editable.surname
      this.form.email = this.editable.email
      this.form.phone = this.editable.phone
      this.form.job_title = this.editable.job_title
      this.form.contact_type_id = this.editable.contact_type_id
      this.form.vendor_id = this.editable.vendor_id
    } else {
      this.form.vendor_id = this.vendor.id
      this.form.workspace_id = this.workspace.id
    }
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    async send() {
      let form
      if (this.editable) {
        form = this.form.post('/vendor-contact/' + this.editable.id + '?_method=PUT')
      } else {
        if (!this.confirmed) {
          const ok = await this.$refs.confirmDialogue.show({
            title: 'Confirmation',
            message:
              'By creating this contact, you acknowledge that you will take responsibility for granting access to supplier issues, questionnaires, and remediation requests. Are you sure you want to proceed?',
            okButton: 'Yes',
            cancelButton: 'No',
          })

          if (!ok) {
            return
          }
        }

        this.confirmed = true

        form = this.form.post('/vendor-contact')
      }
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
