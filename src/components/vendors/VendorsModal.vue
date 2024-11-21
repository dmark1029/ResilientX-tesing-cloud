<template>
  <VModal
    is="div"
    :open="true"
    :title="editable ? `Edit company` : `Create company`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div v-if="!editable" class="field">
          <label class="label">{{ public_vendor_name ? 'Name' : 'Search' }}</label>

          <Multiselect
            v-if="!public_vendor_name"
            id="aja12x"
            ref="multiselect"
            v-model="public_vendor_id"
            placeholder="Search for company.."
            aria-autocomplete="none"
            :internal-search="false"
            :clear-on-blur="false"
            :clear-on-select="false"
            :close-on-select="false"
            :options-limit="300"
            :limit="3"
            :max-height="600"
            :show-no-results="false"
            :hide-selected="true"
            open-direction="bottom"
            :searchable="true"
            :options="publicVendors"
            @open="asyncFind('')"
            @search-change="asyncFind"
            @select="
              (value, label) => {
                public_vendor_name = label.label
              }
            "
          />
          <input
            v-else
            :value="public_vendor_name"
            type="text"
            class="input v-input"
            placeholder="Enter company name"
            readonly
            @click="
              (e) => {
                e.preventDefault()
                public_vendor_name = null
                public_vendor_id = null
                $nextTick(() => {
                  $refs.multiselect.focus()
                })
              }
            "
          />
          <hr v-if="!public_vendor_id" />
          <HasError :form="form" field="name" />
        </div>
        <div v-else class="field">
          <label class="label">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="input v-input"
            placeholder="Enter company name"
            disabled
          />
          <HasError :form="form" field="name" />
        </div>

        <div v-if="!public_vendor_id && !editable">
          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">Industry</label>
                <div class="select">
                  <select v-model="form.industry_id" class="form-select">
                    <option :value="undefined">Select industry</option>
                    <option
                      v-for="(name, id) in general.vrm.industries"
                      :key="id"
                      :value="id"
                    >
                      {{ name }}
                    </option>
                  </select>
                </div>
                <HasError :form="form" field="industry_id" />
              </div>
            </div>
            <div class="column is-6">
              <div v-if="!editable" class="field">
                <label class="label">Address</label>
                <input
                  v-model="form.address"
                  type="text"
                  class="input v-input"
                  placeholder="Enter address"
                />
                <HasError :form="form" field="address" />
              </div>
            </div>
          </div>

          <div v-if="!editable" class="columns">
            <div class="column is-4">
              <div class="field">
                <label class="label">Employees</label>
                <div class="select">
                  <select v-model="form.employees" class="form-select">
                    <option :value="undefined">Select number of employees</option>
                    <option
                      v-for="(name, id) in general.vrm.employees"
                      :key="id"
                      :value="id"
                    >
                      {{ name }}
                    </option>
                  </select>
                </div>
                <HasError :form="form" field="employees" />
              </div>
            </div>
          </div>

          <div v-if="!editable" class="field">
            <label class="label">Assets</label>
            <div class="control">
              <textarea
                v-model="form.assets"
                type="text"
                class="textarea"
                placeholder="Enter assets (one per line)"
              />
              <HasError :form="form" field="assets" />
            </div>
          </div>
        </div>

        <hr />

        <div v-if="editable" class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">Default score card</label>
              <div class="select">
                <select v-model="form.vendor_scorecard_id" class="form-select">
                  <option :value="undefined">Select score card</option>
                  <option
                    v-for="card in editable.scorecards"
                    :key="card.id"
                    :value="card.id"
                  >
                    {{ card.name }}
                  </option>
                </select>
              </div>
              <HasError :form="form" field="vendor_scorecard_id" />
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">{{ $t('Business impact') }}</label>
              <div class="select">
                <select v-model="form.business_impact" class="form-select">
                  <option :value="undefined">Select business impact</option>
                  <option
                    v-for="(name, id) in general.assets.impacts"
                    :key="id"
                    :value="name"
                  >
                    {{ name }}
                  </option>
                </select>
              </div>
              <HasError :form="form" field="business_impact" />
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-4">
            <div class="field">
              <label class="label">Scan assets</label>
              <div class="select">
                <select v-model="form.schedule" class="form-select">
                  <option value="one-time">One time</option>
                  <option value="dailyAt">Daily</option>
                  <option value="weeklyOn">Weekly</option>
                  <option value="monthlyOn">Monthly</option>
                </select>
                <HasError :form="form" field="schedule" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="!editable || !editable.is_public" class="columns">
          <div class="column is-4">
            <div class="field">
              <div class="control is-agree">
                <label class="checkbox is-outlined p-0">
                  <!-- eslint-disable-next-line vue/no-mutating-props -->
                  <input v-model="form.discovery" type="checkbox" />
                  <span />
                  <span>With asset discovery</span>
                </label>
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
            {{ editable ? $t('Edit company') : $t('Create company') }}
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
import Multiselect from '@vueform/multiselect'
import { axios } from '/@src/axios'

export default {
  components: {
    VModal,
    FormButton,
    Multiselect,
    HasError,
  },
  props: ['editable', 'workspace'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    publicVendors: {},
    public_vendor_id: null,
    public_vendor_name: null,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.business_impact = this.editable.fields.business_impact
      this.form.vendor_scorecard_id = this.editable.fields.vendor_scorecard_id
      this.form.workspace_id = this.editable.fields.workspace_id
      this.form.status = this.editable.fields.status
      this.form.permissions = this.editable.fields.permissions ?? ''
      this.form.schedule = this.editable.fields.schedule
      this.form.discovery = this.editable.discovery
    } else {
      this.form.workspace_id = this.workspace.id
      this.form.status = 'active'
      this.form.schedule = 'weeklyOn'
      this.form.business_impact = 'Moderate'
      this.form.permissions = ''
      this.form.discovery = true
    }
  },
  methods: {
    asyncFind(query) {
      this.isLoading = true
      this.public_vendor_id = null
      axios
        .get('/vendor?public=1', {
          params: {
            workspace_id: this.workspace?.id,
            q: query,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            let website = item.website
            if (website) {
              website = website.replace(/(^\w+:|^)\/\//, '')
              website = website.replace(/\/$/, '')
            }
            groups[item.id] = item.name + (website ? ` (${website})` : '')
          })
          this.publicVendors = groups
          this.isLoading = false
        })
        .catch(() => {})
    },
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/vendor/' + this.editable.id + '?_method=PUT')
      } else {
        if (this.public_vendor_id) {
          this.form.vendor_id = this.public_vendor_id
        } else {
          this.form.vendor_id = null
          this.form.name = this.$refs.multiselect.search
        }

        form = this.form.post('/vendor')
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
