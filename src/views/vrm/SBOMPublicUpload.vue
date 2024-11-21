<template>
  <div class="modern-login">
    <div class="container">
      <h1 class="title">File upload request</h1>
      <p style="white-space: pre" class="mb-5">
        Company has requested you to upload SBOM file.
      </p>

      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="field">
          <label class="label">File</label>
          <input
            ref="file"
            class="input v-input"
            type="file"
            multiple="multiple"
            @change="handleFileUpload()"
          />
          <HasError :form="form" field="file" />
          <div v-if="!form.errors.has('files')">
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
          Upload
        </FormButton>
      </form>
    </div>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'

export default {
  components: {
    FormButton,
    HasError,
  },
  setup() {
    useMeta({
      title: 'File upload request',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['theme', 'general']),
  },
  methods: {
    handleFileUpload() {
      this.form.files = this.$refs.file.files
    },
    save() {
      this.send()
        .then(() => {
          this.$store.dispatch('addAlert', {
            text: 'File uploaded successfully',
            type: 'success',
          })

          setTimeout(() => {
            this.$router.push('/')
          }, 5000)
        })
        .catch(() => {})
    },
    send() {
      const form = this.form.post('/vendor/file-request/' + this.$route.params.hash)
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

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.questionnaire {
  margin-top: 20px;
}
</style>
