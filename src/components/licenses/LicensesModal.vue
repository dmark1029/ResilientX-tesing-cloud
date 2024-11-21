<template>
  <VModal
    is="div"
    :open="true"
    :title="`Add license to ` + workspace.name"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="modal-body">
          <div class="field">
            <label class="label">Workspace</label>
            <input
              :value="workspace.name"
              type="text"
              class="input v-input"
              placeholder="Enter workspace name"
              disabled
            />
            <HasError :form="form" field="name" />
          </div>

          <div>
            <div>
              <h5 class="mt-0 mb-1">Configuration</h5>

              <p class="mb-3 is-size-7">Leaving value empty will give unlimited count.</p>

              <div class="columns is-multiline mt-3">
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Max. Users</label>
                    <input
                      v-model="form.user_limit"
                      type="number"
                      min="1"
                      class="input v-input"
                      placeholder="Enter users limit"
                    />
                    <HasError :form="form" field="user_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Max. Projects</label>
                    <input
                      v-model="form.project_limit"
                      type="number"
                      min="1"
                      class="input v-input"
                      placeholder="Enter projects limit"
                    />
                    <HasError :form="form" field="project_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Max. Assets</label>
                    <input
                      v-model="form.asset_limit"
                      type="number"
                      min="1"
                      class="input v-input"
                      placeholder="Enter assets limit"
                    />
                    <HasError :form="form" field="asset_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Max. Vendors</label>
                    <input
                      v-model="form.vendor_limit"
                      type="number"
                      min="1"
                      class="input v-input"
                      placeholder="Enter vendors limit"
                    />
                    <HasError :form="form" field="vendor_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Vendor manage enabled</label>
                    <div class="select">
                      <select v-model="form.vendor_manage_enabled" class="form-select">
                        <option :value="false">No</option>
                        <option :value="true">Yes</option>
                      </select>
                    </div>
                    <HasError :form="form" field="vendor_manage_enabled" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Expires</label>
                    <div class="select">
                      <select v-model="form.expires" class="form-select">
                        <option value="7">7 days</option>
                        <option value="30">1 Month</option>
                        <option value="90">3 Months</option>
                        <option value="180">6 Months</option>
                        <option value="365">1 Year</option>
                      </select>
                    </div>
                    <HasError :form="form" field="scan_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Trial</label>
                    <div class="select">
                      <select v-model="form.trial" class="form-select">
                        <option :value="false">No</option>
                        <option :value="true">Yes</option>
                      </select>
                    </div>
                    <HasError :form="form" field="scan_limit" />
                  </div>
                </div>
                <div class="column is-3">
                  <div class="field">
                    <label class="label">Show unlicensed modules</label>
                    <div class="select">
                      <select v-model="form.show_unlicensed" class="form-select">
                        <option :value="false">No</option>
                        <option :value="true">Yes</option>
                      </select>
                    </div>
                    <HasError :form="form" field="show_unlicensed" />
                  </div>
                </div>
              </div>

              <hr />
            </div>

            <div v-if="general.modules" class="datatable-container">
              <table class="table datatable-table is-fullwidth mb-0">
                <thead>
                  <tr>
                    <th>Select modules</th>
                    <th>Available scans</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(value, index) in general.modules" :key="index">
                    <td>{{ value.name }}</td>
                    <td>
                      <div class="field">
                        <input
                          v-model="form.limits[value.id]"
                          type="number"
                          min="0"
                          class="input v-input"
                          placeholder="Enter scans limit"
                          :disabled="!form.modules.includes(value.id)"
                        />
                        <HasError :form="form" field="scan_limit" />
                      </div>
                    </td>
                    <td class="text-end">
                      <button
                        type="button"
                        class="button v-button is-bold is-big is-raised is-primary btn-sm"
                        @click="toggleModule(value.id)"
                      >
                        {{
                          form.modules.includes(value.id)
                            ? 'Remove license'
                            : 'Select license'
                        }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p class="mb-2 mt-2">
                <small>* 0 scan limit will give unlimited scans per module</small>
              </p>
              <HasError :form="form" field="modules" />
              <HasError :form="form" field="limits" />
            </div>
            <div v-else>
              <p>No licenses found</p>
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
            Add license
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
import { axios } from '/@src/axios'

export default {
  components: {
    VModal,
    FormButton,
    HasError,
  },
  props: ['workspace'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({
      modules: [],
      limits: {},
      workspace_id: '',
      expires: 30,
      trial: false,
      show_unlicensed: false,
      vendor_manage_enabled: false,
    }),
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    this.form.workspace_id = this.workspace.id

    this.general.modules.forEach((module) => {
      this.form.limits[module.id] = 0
    })
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    toggleModule(id) {
      const index = this.form.modules.indexOf(id)

      if (index !== -1) {
        this.form.modules.splice(index, 1)
        this.form.limits[id] = 0
      } else {
        this.form.modules.push(id)
        this.form.limits[id] = 50
      }
    },
    send() {
      const form = this.form.post('/license')

      return new Promise((resolve, reject) => {
        form
          .then(async (res) => {
            const { data } = res.data

            await axios.get('/workspace/' + this.workspace.id).then((res) => {
              this.$store.dispatch('addWorkspace', res.data.data)
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
