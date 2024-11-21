<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else class="pt-2 pb-2">
    <div v-if="items.length" class="datatable-container">
      <table class="table datatable-table is-fullwidth mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vm in items" :key="vm.id">
            <td class="">
              {{ vm.data.name }}
            </td>
            <td>
              {{ vm.data.id }}
            </td>
            <td class="text-end">
              <a
                :class="
                  canPerformAction('integrations', 'delete')
                    ? 'btn btn-sm btn-outline-danger is-clickable'
                    : 'btn btn-sm btn-outline-danger is-disabled'
                "
                @click="deleteIntegration(vm)"
                ><i class="fa fa-trash has-text-danger"
              /></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="has-text-centered">No integrations found</p>
  </div>

  <AreYouSureModal ref="confirmDialogue" />

  <div v-if="openCollectionModal">
    <CollectionsModal :project="project" @closeModal="closeCollectionModal" />
  </div>

  <div v-if="!loading" class="mt-5">
    <form @submit.prevent="save" @keydown="form.onKeydown($event)">
      <div class="field">
        <label class="label mt-3"
          >{{ $t('Asset group') }}
          <small class="has-text-primary is-clickable" @click="openCollectionModal = true"
            >Add new</small
          ></label
        >
        <div class="select">
          <select v-model="form.collection_id" class="form-select">
            <option
              v-for="collection in collections"
              :key="collection.id"
              :value="collection.id"
            >
              {{ collection.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">Create new integration</label>
        <input
          v-model="form.name"
          type="text"
          :disabled="!canPerformAction('integrations', 'create')"
          class="input v-input w-50 m-auto"
          placeholder="Enter name"
        />
        <HasError :form="form" field="name" />
      </div>
      <div class="columns">
        <div class="column is-4">
          <div class="field">
            <input
              v-model="form.azure_client_id"
              type="text"
              :disabled="!canPerformAction('integrations', 'create')"
              class="input v-input w-50 m-auto"
              placeholder="Enter client id"
            />
            <HasError :form="form" field="azure_client_id" />
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <input
              v-model="form.azure_client_secret"
              type="text"
              :disabled="!canPerformAction('integrations', 'create')"
              class="input v-input w-50 m-auto"
              placeholder="Enter client secret"
            />
            <HasError :form="form" field="azure_client_secret" />
          </div>
        </div>
        <div class="column is-4">
          <div class="field">
            <input
              v-model="form.azure_tenant_id"
              type="text"
              :disabled="!canPerformAction('integrations', 'create')"
              class="input v-input w-50 m-auto"
              placeholder="Enter tenant id"
            />
            <HasError :form="form" field="azure_tenant_id" />
          </div>
        </div>
      </div>

      <FormButton
        :form="form"
        :class="
          canPerformAction('integrations', 'create')
            ? 'button v-button is-bold is-big is-raised is-primary'
            : 'button v-button is-bold is-big is-raised is-primary is-disabled'
        "
      >
        {{ $t('Create') }}
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
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import CollectionsModal from '/@src/components/collections/CollectionsModal.vue'

export default {
  components: {
    CollectionsModal,
    AreYouSureModal,
    FormButton,
    HasError,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['integration', 'project'],
  data: () => ({
    items: [],
    form: new Form({}),
    formDelete: new Form({}),
    created: null,
    loading: true,
    openCollectionModal: false,
    collections: [],
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    this.getIntegrations()

    this.getCollections()
  },
  unmounted() {
    this.created = null
  },
  methods: {
    closeCollectionModal() {
      this.openCollectionModal = false
      this.getCollections()
    },
    getCollections() {
      axios
        .get(`/collection`, {
          params: {
            id: this.project.id,
            status: 'active',
          },
        })
        .then((res) => {
          this.collections = res.data.data
          this.form.collection_id = this.collections[0].id
        })
        .catch(() => {})
    },
    getIntegrations() {
      return axios
        .get(`/integration/azure/${this.project.id}`)
        .then((res) => {
          this.items = res.data.data
          this.loading = false
        })
        .catch(() => {})
    },
    save() {
      return this.form
        .post(`/integration/azure/${this.project.id}`)
        .then(() => {
          this.form.reset()
          this.getIntegrations()
          this.getCollections()
        })
        .catch(() => {})
    },
    async deleteIntegration(item) {
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
        this.formDelete
          .delete(`/integration/azure/${this.project.id}/${item.id}`)
          .then(() => {
            this.getIntegrations()
          })
      }
    },
  },
}
</script>
