<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else class="pt-2 pb-2">
    <p v-if="hasIntegration" class="mb-3">
      You have already integrated GitLab with this project. If you want to change the
      integration, please update the existing one.
    </p>
    <p v-else class="mb-3">You don't have active GitLab integration with this project.</p>

    <p class="mb-3">Required permissions: read_api, read_repository</p>

    <form @submit.prevent="save" @keydown="form.onKeydown($event)">
      <div class="field">
        <label class="label">GitLab URL (https://gitlab.com)</label>
        <input
          v-model="form.baseurl"
          type="text"
          :disabled="!canPerformAction('integrations', 'create')"
          class="input v-input w-50 m-auto"
          placeholder="Enter baseurl"
        />
        <HasError :form="form" field="baseurl" />
      </div>

      <div v-if="hasIntegration && hideToken" class="field">
        <label class="label">Token</label>
        <input
          type="password"
          :disabled="!canPerformAction('integrations', 'create')"
          class="input v-input w-50 m-auto"
          placeholder="Enter token"
          value="********"
          @click="hideToken = !hideToken"
        />
        <HasError :form="form" field="token" />
      </div>
      <div v-if="!hideToken" class="field">
        <label class="label">Token</label>
        <input
          v-model="form.token"
          type="password"
          :disabled="!canPerformAction('integrations', 'create')"
          class="input v-input w-50 m-auto"
          placeholder="Enter token"
        />
        <HasError :form="form" field="token" />
      </div>

      <FormButton
        :form="form"
        :class="
          canPerformAction('integrations', 'create')
            ? 'button v-button is-bold is-big is-raised is-primary'
            : 'button v-button is-bold is-big is-raised is-primary is-disabled'
        "
      >
        {{ $t('Save configuration') }}
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
    form: new Form({}),
    created: null,
    loading: true,
    hasIntegration: false,
    hideToken: false,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await this.getIntegrations()
  },
  unmounted() {
    this.created = null
  },
  methods: {
    getIntegrations() {
      return axios
        .get(`/integration/gitlab/${this.project.id}`)
        .then((res) => {
          this.form.baseurl = res?.data?.data?.baseurl
          this.hasIntegration = res?.data?.data?.baseurl ? true : false
          this.hideToken = res?.data?.data?.baseurl ? true : false

          if (!this.form.baseurl) {
            this.form.baseurl = 'https://gitlab.com'
          }

          this.loading = false
        })
        .catch(() => {})
    },
    save() {
      return this.form
        .post(`/integration/gitlab/${this.project.id}`)
        .then(() => {
          this.getIntegrations()

          this.$store.dispatch('addAlert', {
            text: 'Configuration saved successfully',
            type: 'success',
          })
        })
        .catch(() => {})
    },
  },
}
</script>
