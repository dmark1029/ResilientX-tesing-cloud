<template>
  <VModal
    is="div"
    :open="true"
    title="Import questionnaires"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div class="p-2">
        <form @submit.prevent="save" @keydown="form.onKeydown($event)">
          <div class="field">
            <label class="label">Title</label>
            <input
              v-model="form.title"
              class="input v-input"
              type="text"
              placeholder="Questionnaire title"
            />
            <HasError :form="form" field="title" />
          </div>

          <div class="field">
            <label class="label">File</label>
            <input
              ref="file"
              class="input v-input"
              type="file"
              @change="handleFileUpload()"
            />
            <HasError :form="form" field="file" />
            <div v-if="!form.errors.has('file')">
              <div v-for="errors in form.errors.all()" :key="errors">
                <div v-for="error in errors" :key="error">
                  <div class="invalid-feedback d-block" v-text="error" />
                </div>
              </div>
            </div>
          </div>

          <FormButton
            :form="form"
            class="button v-button is-bold is-big is-raised is-primary btn-sm"
          >
            Import
          </FormButton>
        </form>

        <div class="has-text-centered">
          <div class="p-3">
            <span class="button v-button is-raised is-primary" @click="downloadSample"
              >Download sample file</span
            >
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    FormButton,
    HasError,
  },
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    selectedType: null,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  methods: {
    handleFileUpload() {
      this.form.file = this.$refs.file.files[0]
    },
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    send() {
      this.form.workspace_id = this.workspace.id
      var form = this.form.post('/questionnaire/import')
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
    downloadSample() {
      axios
        .get('/questionnaire/import', {
          responseType: 'blob',
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          const href = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = href
          link.setAttribute('download', 'questionnaire-sample-import-file.xlsx')
          document.body.appendChild(link)
          link.click()

          document.body.removeChild(link)
          URL.revokeObjectURL(href)
        })
        .catch(() => {})
    },
  },
}
</script>
