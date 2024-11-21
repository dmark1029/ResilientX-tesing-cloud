<template>
  <VModal
    is="div"
    :open="true"
    :title="`Create workflow`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="field">
          <label class="label">{{ public_vendor_name ? 'Company' : 'Search' }}</label>

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
          <HasError :form="form" field="vendor_id" />
        </div>

        <hr />

        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">{{ $t('Trigger') }} <small>(New issue)</small></label>
              <div class="select">
                <select v-model="form.issue_type" class="form-select">
                  <option :value="undefined">Select issue type</option>
                  <option
                    v-for="(name, id) in general.issues.categories"
                    :key="id"
                    :value="id"
                  >
                    {{ name }}
                  </option>
                </select>
              </div>
              <HasError :form="form" field="issue_type" />
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label">{{ $t('Action') }}</label>
              <div class="select">
                <select class="form-select" disabled>
                  <option :value="undefined">Create remediation request</option>
                </select>
              </div>
              <HasError :form="form" field="issue_type" />
            </div>
          </div>
        </div>

        <div class="columns">
          <div class="column is-6">
            <VField v-slot="{}" class="is-curved-select w-100">
              <label class="label">{{ $t('Contact') }}</label>
              <VControl>
                <Multiselect
                  id="ajax-contacts"
                  v-model="form.vendor_contact_id"
                  :disabled="!public_vendor_id"
                  placeholder="Select contact person"
                  :internal-search="false"
                  :clear-on-select="false"
                  :close-on-select="false"
                  :options-limit="300"
                  :limit="3"
                  :max-height="600"
                  :show-no-results="false"
                  :hide-selected="true"
                  open-direction="bottom"
                  :searchable="true"
                  :options="contacts"
                  @open="asyncFindContact('')"
                  @search-change="asyncFindContact"
                >
                </Multiselect>
              </VControl>
              <HasError :form="form" field="vendor_contact_id" />
            </VField>
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
            {{ $t('Create workflow') }}
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
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'

export default {
  components: {
    VField,
    VControl,
    VModal,
    FormButton,
    Multiselect,
    HasError,
  },
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    contacts: {},
    publicVendors: {},
    public_vendor_id: null,
    public_vendor_name: null,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  mounted() {},
  methods: {
    asyncFind(query) {
      this.isLoading = true
      this.public_vendor_id = null
      this.form.vendor_contact_id = null
      axios
        .get('/vendor?public=0', {
          params: {
            workspace_id: this.workspace?.id,
            status: 'active',
            q: query,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item.id] = item.name
          })
          this.publicVendors = groups
          this.isLoading = false
        })
        .catch(() => {})
    },
    asyncFindContact(query) {
      this.isLoading = true
      axios
        .get('/vendor-contact', {
          params: {
            workspace_id: this.workspace?.id,
            vendor_id: this.public_vendor_id,
            q: query,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item.id] = item.name + ' ' + item.surname + ' (' + item.email + ')'
          })
          this.contacts = groups
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
      return new Promise((resolve, reject) => {
        this.form.workspace_id = this.workspace.id
        this.form.vendor_id = this.public_vendor_id
        this.form
          .post('/vendor-workflow')
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
