<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div v-if="workspace" class="columns">
      <div class="column is-12 col-xl-12">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="save" @keydown="form.onKeydown($event)">
              <div class="modal-body">
                <div class="field">
                  <label class="label">Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="input v-input"
                    placeholder="Enter workspace name"
                  />
                  <HasError :form="form" field="name" />
                </div>
                <hr />
                <div class="field">
                  <label class="label">Company name</label>
                  <input
                    v-model="form.setting.name"
                    type="text"
                    class="input v-input"
                    placeholder="Enter company name"
                  />
                  <HasError :form="form" field="setting.name" />
                </div>
                <div class="columns">
                  <div class="column is-6">
                    <div class="field">
                      <label class="label">Country</label>
                      <div class="select">
                        <select v-model="form.setting.country" class="form-select">
                          <option :value="null">Select country</option>
                          <option
                            v-for="(value, index) in general.countries"
                            :key="index"
                            :value="index"
                          >
                            {{ value }}
                          </option>
                        </select>
                      </div>
                      <HasError :form="form" field="setting.country" />
                    </div>
                  </div>
                  <div class="column is-6">
                    <div class="field">
                      <label class="label">City</label>
                      <input
                        v-model="form.setting.city"
                        type="text"
                        class="input v-input"
                        placeholder="Enter city"
                      />
                      <HasError :form="form" field="setting.city" />
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-6">
                    <div class="field">
                      <label class="label">Registration number</label>
                      <input
                        v-model="form.setting.registration_number"
                        type="text"
                        class="input v-input"
                        placeholder="Enter registration number"
                      />
                      <HasError :form="form" field="setting.registration_number" />
                    </div>
                  </div>
                  <div class="column is-6">
                    <div class="field">
                      <label class="label">Tax number</label>
                      <input
                        v-model="form.setting.tax_number"
                        type="text"
                        class="input v-input"
                        placeholder="Enter tax number"
                      />
                      <HasError :form="form" field="setting.tax_number" />
                    </div>
                  </div>
                </div>
                <div class="columns">
                  <div class="column is-3">
                    <div class="field">
                      <label class="label">Logo</label>
                      <div class="control">
                        <div class="file has-name">
                          <label class="file-label">
                            <input
                              ref="file"
                              class="file-input"
                              type="file"
                              @change="handleFileUpload()"
                            />
                            <span class="file-cta">
                              <span class="file-icon"
                                ><i class="fas fa-cloud-upload-alt"
                              /></span>
                              <span class="file-label"> Choose a file… </span>
                            </span>
                            <span class="file-name light-text">
                              {{ form.file?.name ?? 'Select a file' }}
                            </span>
                          </label>
                          <HasError :form="form" field="file" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="field mt-3">
                <FormButton :form="form" class="button v-button is-primary btn-sm">
                  Save changes
                </FormButton>
              </div>
            </form>
          </div>
          <!--end card-body-->
        </div>
        <!--end card-->
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/components/bootstrap5'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VBreadcrumb,
    VLoader,
    FormButton,
    HasError,
  },
  props: ['workspace'],
  emits: ['closeModal'],
  setup() {
    useMeta({
      title: `Settings`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    links: [],
    form: new Form({
      setting: {},
      user: {},
    }),
  }),
  computed: {
    ...mapGetters(['loading', 'general', 'isMobile']),
  },
  async mounted() {
    this.$store.dispatch('showLoading')

    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
        active: false,
      },
      {
        label: 'Workspaces',
        to: {
          name: 'Workspaces',
        },
        active: false,
      },
      {
        label: this.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
        active: false,
      },
      {
        label: 'Settings',
        to: {},
        active: true,
      },
    ]

    this.form.name = this.workspace.name
    this.form.status = this.workspace.status
    this.form.setting = this.workspace.setting
    this.form.file = null

    this.$store.dispatch('hideLoading')
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
      const form = this.form.post('/workspace/' + this.workspace.id + '?_method=PUT')

      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            const { data } = res.data
            this.$store.dispatch('addAlert', {
              text: 'Information updated successfully.',
              type: 'success',
            })
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
