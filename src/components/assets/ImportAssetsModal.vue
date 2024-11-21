<template>
  <VModal
    is="div"
    :open="true"
    title="Import assets"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div v-if="!selectedType">
        <div class="datatable-container">
          <table class="table datatable-table is-fullwidth mb-0">
            <thead>
              <tr>
                <th>Asset type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(name, value) in general.assets.types" :key="value">
                <td>{{ name }}</td>
                <td class="text-end">
                  <button
                    type="button"
                    class="button v-button is-bold is-big is-raised is-primary btn-sm"
                    @click="selectedType = value"
                  >
                    Select
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <div class="p-2">
          <form @submit.prevent="save" @keydown="form.onKeydown($event)">
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
              Import assets
            </FormButton>
          </form>

          <div class="has-text-centered">
            <div class="p-3">
              <button
                class="button v-button v-modal-close mr-3"
                @click="selectedType = null"
              >
                Back
              </button>
              <span class="button v-button is-raised is-primary" @click="downloadSample"
                >Download sample file</span
              >
            </div>
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
  props: ['editable', 'project'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    selectedType: null,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    this.form.project_id = this.project.id
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
      this.form.type = this.selectedType
      var form = this.form.post('/asset/import')
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
        .get('/asset/import/' + this.selectedType, {
          responseType: 'blob',
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
          const href = URL.createObjectURL(blob)

          const link = document.createElement('a')
          link.href = href
          link.setAttribute(
            'download',
            this.selectedType + '-asset-sample-import-file.xlsx'
          )
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
