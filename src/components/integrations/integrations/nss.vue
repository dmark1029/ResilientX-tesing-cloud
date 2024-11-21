<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else class="pt-2 pb-2">
    <div v-if="vms.length" class="datatable-container">
      <table class="table datatable-table is-fullwidth mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Seen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vm in vms" :key="vm.id">
            <td class="">
              <i
                v-if="vm.external.is_online"
                class="fa fa-power-off has-text-success font-16 mr-2"
              />
              <i v-else class="fa fa-power-off text-muted font-16 mr-2" />
              {{ vm.external.vm_name }}
            </td>
            <td>
              {{ vm.data.vm_id }}
            </td>
            <td>
              {{ vm.external.last_seen ?? 'Never' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="has-text-centered">No virtual machines found</p>
  </div>

  <div v-if="created">
    <h6 class="has-text-centered title is-6 mt-5">Created VM</h6>

    <p class="has-text-centered mb-3">
      Copy access token & secret, won't be visible after closing dialog.
    </p>

    <div class="mb-3 row">
      <label for="example-text-input" class="col-sm-2 col-label text-end">VM ID</label>
      <div class="col-sm-10">
        <input
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Click to copy to clipboard"
          data-bs-trigger="hover"
          class="input v-input is-clickable input v-input-sm"
          readonly
          :value="created.values.vm_id"
          @click="copyLink(created.values.vm_id, $event)"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="example-text-input" class="col-sm-2 col-label text-end"
        >Access key</label
      >
      <div class="col-sm-10">
        <input
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Click to copy to clipboard"
          data-bs-trigger="hover"
          class="input v-input is-clickable input v-input-sm"
          readonly
          :value="created.values.access_key"
          @click="copyLink(created.values.access_key, $event)"
        />
      </div>
    </div>
    <div class="mb-3 row">
      <label for="example-text-input" class="col-sm-2 col-label text-end"
        >Access secret</label
      >
      <div class="col-sm-10">
        <input
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title="Click to copy to clipboard"
          data-bs-trigger="hover"
          class="input v-input is-clickable input v-input-sm"
          readonly
          :value="created.values.access_secret"
          @click="copyLink(created.values.access_secret, $event)"
        />
      </div>
    </div>
  </div>

  <div v-if="!loading" class="has-text-centered mt-5">
    <form @submit.prevent="save" @keydown="form.onKeydown($event)">
      <div class="field">
        <label class="label">Create virtual machine</label>
        <input
          v-model="form.name"
          type="text"
          :disabled="!canPerformAction('integrations', 'create')"
          class="input v-input w-50 m-auto"
          placeholder="Enter virtual machine name"
        />
        <HasError :form="form" field="name" />
      </div>
      <FormButton
        :form="form"
        :class="
          canPerformAction('integrations', 'create')
            ? 'button v-button is-bold is-big is-raised is-primary'
            : 'button v-button is-bold is-big is-raised is-primary is-disabled'
        "
      >
        {{ $t('Create new VM') }}
      </FormButton>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    FormButton,
    HasError,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['integration', 'project'],
  data: () => ({
    vms: [],
    form: new Form({}),
    created: null,
    loading: true,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    this.getIntegrations()
  },
  unmounted() {
    this.created = null
  },
  methods: {
    copyLink(value, event) {
      event.target.setAttribute('disabled', 'disabled')

      setTimeout(() => {
        event.target.removeAttribute('disabled')
      }, 500)

      const el = document.createElement('textarea')
      el.value = value
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
    getIntegrations() {
      return axios
        .get(`/integration/nss/${this.project.id}`)
        .then((res) => {
          this.vms = res.data.data
          this.loading = false
        })
        .catch(() => {})
    },
    save() {
      return this.form
        .post(`/integration/nss/${this.project.id}`)
        .then((res) => {
          this.created = res.data
          this.form.name = ''
          this.getIntegrations()
        })
        .catch(() => {})
    },
  },
}
</script>
