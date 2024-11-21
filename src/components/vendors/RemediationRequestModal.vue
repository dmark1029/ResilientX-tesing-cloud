<template>
  <VModal is="div" :open="true" :title="issue.title" size="big" @close="$emit('close')">
    <template #content>
      <div v-if="loading">
        <VLoader :active="true">
          <div style="height: 100px" />
        </VLoader>
      </div>
      <div v-else>
        <div v-if="!contacts.length" class="p-5">
          <p>You haven't added any contacts to this company.</p>
          <p>To be able to send remedation request, please add your point of contacts.</p>
          <router-link
            class="button v-button is-primary mt-3"
            :to="{
              name: 'VendorView',
              params: { asset: issue.collection.id },
            }"
          >
            Add contact
          </router-link>
        </div>
        <form v-else @submit.prevent="save" @keydown="form.onKeydown($event)">
          <div class="columns">
            <div class="column is-8">
              <div class="field">
                <label class="label">Title</label>
                <div class="control">
                  <input
                    v-model="form.title"
                    type="text"
                    class="input v-input"
                    placeholder="Enter request title"
                  />
                </div>
                <HasError :form="form" field="title" />
              </div>
            </div>
            <div class="column is-4">
              <div class="field">
                <label class="label">Due date</label>
                <Datepicker
                  v-model="form.due_date"
                  :lower-limit="new Date()"
                  class="input v-input"
                  :input-format="'yyyy.MM.dd'"
                  :clearable="true"
                  placeholder="Select due date"
                />
                <HasError :form="form" field="due_date" />
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Comment</label>
            <div class="control">
              <textarea
                v-model="form.comment"
                type="text"
                class="textarea"
                placeholder="Enter comment"
              />
            </div>
            <HasError :form="form" field="comment" />
          </div>

          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">Priority</label>
                <div class="select">
                  <select v-model="form.priority" class="form-select">
                    <option :value="undefined">Select priority</option>
                    <option
                      v-for="(name, id) in general.vrm.priorities"
                      :key="id"
                      :value="id"
                    >
                      {{ name }}
                    </option>
                  </select>
                </div>
                <HasError :form="form" field="priority" />
              </div>
            </div>
          </div>

          <div class="columns">
            <div class="column is-6">
              <div class="field">
                <label class="label">Contact</label>
                <div class="select">
                  <select v-model="form.vendor_contact_id" class="form-select">
                    <option :value="undefined">All contacts</option>
                    <option
                      v-for="contact in contacts"
                      :key="contact.id"
                      :value="contact.id"
                    >
                      {{
                        contact.name + ' ' + contact.surname + ' (' + contact.email + ')'
                      }}
                    </option>
                  </select>
                </div>
                <HasError :form="form" field="vendor_contact_id" />
              </div>
            </div>
          </div>

          <FormButton :form="form" class="button v-button is-primary btn-sm">
            {{ $t('Send request') }}
          </FormButton>
        </form>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import Datepicker from 'vue3-datepicker'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VLoader,
    Datepicker,
    VModal,
    FormButton,
    HasError,
  },
  props: ['issue', 'companies'],
  emits: ['close'],
  data: () => ({
    form: new Form({}),
    contacts: [],
    loading: false,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  async mounted() {
    this.loading = true

    this.form.priority = 'medium'

    this.form.title = this.issue.title + ' remediation request'

    this.form.comment =
      'Hello. Please look into this issue and provide a solution if necessary.'

    await this.getVendorContacts()

    this.loading = false
  },
  methods: {
    getVendorContacts() {
      return axios
        .get(`/vendor-contact`, {
          params: {
            workspace_id: this.workspace?.id,
            vendor_id: this.companies[0].id,
          },
        })
        .then((res) => {
          this.contacts = res.data.data
        })
        .catch(() => {})
    },
    save() {
      this.send()
        .then(() => {
          this.$emit('close')
        })
        .catch(() => {})
    },
    send() {
      this.form.workspace_id = this.workspace.id
      this.form.issue_id = this.issue.id

      let form = this.form.post('/remediation-request')

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
