<template>
  <VModal
    is="div"
    :open="true"
    :title="editable ? `Edit workspace` : `Create workspace`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div v-if="!editable" class="field">
          <label class="label">License management company</label>
          <div class="select">
            <select v-model="form.company_id" class="form-select">
              <option :value="undefined">Select license management company</option>
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

        <div class="field">
          <label class="label">Workspace name</label>
          <input
            v-model="form.name"
            type="text"
            class="input v-input"
            placeholder="Enter workspace name"
          />
          <HasError :form="form" field="name" />
        </div>
        <!--        <div v-if="!editable" class="field">-->
        <!--          <label class="label">License</label>-->
        <!--          <div class="select">-->
        <!--            <select v-model="form.product_id" class="form-select">-->
        <!--              <option :value="undefined">Select license</option>-->
        <!--              <option-->
        <!--                v-for="(value, index) in general.products"-->
        <!--                :key="index"-->
        <!--                :value="index"-->
        <!--              >-->
        <!--                {{ value }}-->
        <!--              </option>-->
        <!--            </select>-->
        <!--          </div>-->
        <!--          <HasError :form="form" field="product_id" />-->
        <!--        </div>-->

        <div v-if="!editable">
          <hr />
          <h5 class="mt-0 mb-3">User information</h5>
          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">Email</label>
                <input
                  v-model="form.user.email"
                  type="email"
                  class="input v-input"
                  placeholder="Enter user email"
                />
                <HasError :form="form" field="user.email" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!shownCompany" class="mt-3 mb-3">
          <a
            role="button"
            class="is-clickable"
            aria-controls="companyInformation"
            @click="shownCompany = true"
            >Enter company information</a
          >
        </div>
        <div v-if="shownCompany" id="companyInformation" class="collapse">
          <hr />
          <h5 class="mt-0 mb-3">Company information</h5>
          <div class="field">
            <label class="label">Name</label>
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
          <div class="columns mb-1">
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
            {{ editable ? $t('Edit workspace') : $t('Create workspace') }}
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
  props: ['editable'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({
      setting: {},
      user: {},
    }),
    shownCompany: false,
  }),
  computed: {
    ...mapGetters(['general', 'user']),
  },
  mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.users_limit = this.editable.users_limit
      this.form.projects_limit = this.editable.projects_limit
      this.form.assets_limit = this.editable.assets_limit
      this.form.status = this.editable.status
      this.form.setting = this.editable.setting
      this.form.setting.logo = null
    } else {
      this.form.status = 'active'
      this.form.users_limit = 5
      this.form.projects_limit = 5
      this.form.assets_limit = null
      this.form.setting.country = null
      this.form.company_id = this.user.companies.length ? this.user.companies[0].id : null
    }
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          window.location.reload()
        })
        .catch(() => {})
    },
    send() {
      let form

      if (this.editable) {
        form = this.form.post('/workspace/' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/workspace')
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
