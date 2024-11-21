<template>
  <VLoader v-if="loading" :active="true" class="loading p-5">
    <div role="status" style="height: 300px"></div>
  </VLoader>
  <div v-else>
    <div class="card">
      <div class="card-body">
        <h4 class="title is-5">Public registration links</h4>
        <div
          v-if="registrationLinks.meta && registrationLinks.meta.total"
          class="datatable-container"
        >
          <table class="table datatable-table is-fullwidth mb-0">
            <thead>
              <tr>
                <th>Company</th>
                <th>License</th>
                <th>Expires</th>
                <th>Max registrations</th>
                <th>Registrations</th>
                <th>Status</th>
                <th>Link</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in registrationLinks.data" :key="item.id">
                <td>
                  {{ item.company ? item.company.name : 'No company specified' }}
                </td>
                <td>
                  {{ item.product ? item.product.name : 'No license specified' }}
                </td>
                <td>{{ item.expires ? item.expires : 'Never' }}</td>
                <td>
                  {{ item.max_registrations ? item.max_registrations : 'Unlimited' }}
                </td>
                <td>{{ item.registrations_count }}</td>
                <td>{{ item.active ? 'Active' : 'Out of limits' }}</td>
                <td>
                  <input
                    v-tooltip="'Click to copy to clipboard'"
                    class="input v-input is-clickable input v-input-sm"
                    readonly
                    :value="item.link"
                    @click="copyLink(item, $event)"
                  />
                </td>
                <td class="text-end">
                  <a class="is-clickable"
                    ><i
                      class="fa fa-trash has-text-danger font-16"
                      @click="deleteLink(item)"
                  /></a>
                </td>
              </tr>
            </tbody>
          </table>
          <!--end /table-->
        </div>
        <div v-else>
          <p class="mb-0 mt-3">No registration links found</p>
        </div>

        <div class="mt-3">
          <Pagination :data="registrationLinks" @pagination-change-page="getData" />
        </div>

        <button
          class="button v-button is-bold is-big is-raised is-primary btn-sm"
          style="flex: initial"
          @click="showModal = true"
        >
          Add new
        </button>
      </div>
    </div>

    <AreYouSureModal ref="confirmDialogue" />

    <VModal
      is="div"
      :open="showModal"
      title="Create public registration link"
      size="big"
      @close="showModal = false"
    >
      <template #content>
        <form @submit.prevent="save" @keydown="form.onKeydown($event)">
          <div class="modal-body">
            <div class="field">
              <label class="label">Company</label>
              <div class="select">
                <select v-model="form.company_id" class="form-select">
                  <option :value="undefined">Select company</option>
                  <option
                    v-for="company in user.companies"
                    :key="company.id"
                    :value="company.id"
                  >
                    {{ company.name }}
                  </option>
                </select>
              </div>
              <HasError :form="form" field="company_id" />
            </div>

            <hr />

            <div>
              <div>
                <h5 class="mt-0 mb-1">License</h5>

                <p class="mb-3 is-size-7">
                  Leaving value empty will give unlimited count.
                </p>

                <div class="columns is-multiline mt-3">
                  <div class="column is-3">
                    <div class="field">
                      <label class="label">Max. Scans</label>
                      <input
                        v-model="form.scan_limit"
                        type="number"
                        min="1"
                        class="input v-input"
                        placeholder="Enter scans limit"
                      />
                      <HasError :form="form" field="scan_limit" />
                    </div>
                  </div>
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
                </div>

                <hr />
              </div>

              <div v-if="general.modules" class="datatable-container">
                <table class="table datatable-table is-fullwidth mb-0">
                  <thead>
                    <tr>
                      <th>Select modules</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(value, index) in general.modules" :key="index">
                      <td>{{ value.name }}</td>
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
                <HasError :form="form" field="modules" />
              </div>
              <div v-else>
                <p>No licenses found</p>
              </div>
            </div>

            <hr />

            <div class="columns">
              <div class="column is-6">
                <div class="field">
                  <label class="label">Link expiry date</label>
                  <Datepicker
                    v-model="date"
                    class="input v-input"
                    :input-format="'yyyy.MM.dd'"
                    :clearable="true"
                    placeholder="Select expiry date"
                  />
                  <HasError :form="form" field="expires_at" />
                </div>
              </div>
              <div class="column is-6">
                <div class="field">
                  <label class="label">Max registrations</label>
                  <input
                    v-model="form.max_registrations"
                    type="number"
                    class="input v-input"
                    placeholder="Enter max registration allowed on this link"
                  />
                  <HasError :form="form" field="max_registrations" />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-card-foot mt-3">
            <button
              type="button"
              class="button v-button is-white btn-sm"
              @click="closeModal"
            >
              Close
            </button>
            <FormButton :form="form" class="button v-button is-primary btn-sm">
              Create
            </FormButton>
          </div>
        </form>
      </template>
    </VModal>
  </div>
</template>

<script>
import Form from '/@src/form'
import { HasError, Button as FormButton } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import Datepicker from 'vue3-datepicker'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import Pagination from '/@src/components/Pagination.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VModal,
    Pagination,
    HasError,
    VLoader,
    FormButton,
    Datepicker,
    AreYouSureModal,
  },
  data: () => ({
    date: null,
    form: new Form({
      modules: [],
      expires: 30,
      trial: false,
    }),
    showModal: false,
    loading: false,
    selected: null,
    filled: null,
    q: '',
    assets: [],
  }),
  computed: {
    ...mapGetters(['general', 'registrationLinks', 'user']),
  },
  watch: {
    date: function (val) {
      if (val) {
        this.form.expires_at = new Date(this.date)
          .toISOString()
          .slice(0, 10)
          .replaceAll('-', '.')
      } else {
        this.form.expires_at = null
      }
    },
  },
  mounted() {
    this.loading = true

    this.getData()
  },
  methods: {
    getData(page = 1) {
      const url = `/invite/registration?page=${page}`

      axios
        .get(url)
        .then((res) => {
          this.$store.dispatch('addRegistrationLinks', res.data)
          this.loading = false
        })
        .catch(() => {})
    },
    save() {
      this.send()
        .then(() => {
          this.showModal = false
          this.getData()
        })
        .catch(() => {})
    },
    send() {
      const form = this.form.post('/invite/registration')

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
    toggleModule(id) {
      const index = this.form.modules.indexOf(id)

      if (index !== -1) {
        this.form.modules.splice(index, 1)
      } else {
        this.form.modules.push(id)
      }
    },
    async deleteLink(item) {
      let ok = false
      if (item.status === 'disabled') {
        ok = true
      } else {
        ok = await this.$refs.confirmDialogue.show({
          title: 'Confirmation',
          message: 'Are you sure you want to delete this item?',
          okButton: 'Yes',
          cancelButton: 'No',
        })
      }
      if (ok) {
        this.form.delete('/invite/registration/' + item.id).then(() => {
          this.getData()
        })
      }
    },
    closeModal() {
      this.showModal = false
    },
    openModal() {
      this.showModal = true
    },
    copyLink(item, event) {
      event.target.setAttribute('disabled', 'disabled')

      setTimeout(() => {
        event.target.removeAttribute('disabled')
      }, 500)

      const el = document.createElement('textarea')
      el.value = item.link
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
  },
}
</script>
