<template>
  <VModal
    is="form"
    :open="true"
    title="Import URL's"
    size="big"
    actions="right"
    @close="$emit('close')"
  >
    <template #content>
      <form @submit.prevent="importData" @keydown="form.onKeydown($event)">
        <VTabs
          slider
          type="rounded"
          selected="basic"
          :tabs="[
            { label: 'Basic', value: 'basic' },
            { label: 'Advanced', value: 'advanced' },
          ]"
          @update:selected="
            (value) => {
              if (value === 'basic') {
                form.type = 'basic'
                form.baseurl = null
                form.urls = null
              } else {
                form.type = 'openapi'
                form.urls = null
                form.baseurl = 'https://' + asset.value
              }
            }
          "
        >
          <template #tab="{ activeValue }">
            <div v-if="activeValue === 'basic'" class="mb-3">
              <div class="field">
                <label class="label mt-3">{{ $t('URL list') }}</label>
                <div class="control">
                  <textarea
                    v-model="form.urls"
                    type="text"
                    class="textarea"
                    placeholder="Enter URL's (one per line)"
                  />
                  <HasError :form="form" field="urls" />
                </div>
              </div>
            </div>
            <div v-else-if="activeValue === 'advanced'" class="mb-3">
              <div class="columns">
                <div class="column is-3">
                  <div class="field">
                    <label class="label">{{ $t('Type') }}</label>
                  </div>
                  <div
                    id="v-pills-tab"
                    class="nav flex-column nav-pills has-text-centered"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <div v-for="(value, index) in types" :key="index">
                      <input
                        :id="`asset-type-form-` + index"
                        v-model="form.type"
                        type="radio"
                        class="is-hidden"
                        :value="index"
                        autocomplete="off"
                      />
                      <label
                        :class="[
                          form.type === index
                            ? 'button v-button is-bold is-big is-raised is-primary d-block mb-2'
                            : 'button v-button d-block mb-2',
                        ]"
                        style="width: 100%"
                        :for="`asset-type-form-` + index"
                        >{{ value }}</label
                      >
                    </div>
                  </div>
                  <HasError :form="form" field="type" />
                </div>
                <div class="column is-9">
                  <div v-if="form.type === 'openapi'">
                    <div class="field">
                      <label class="label">{{ $t('Title') }}</label>
                      <input
                        v-model="form.title"
                        type="text"
                        class="input v-input"
                        placeholder="Enter title for identification"
                      />
                      <HasError :form="form" field="title" />
                    </div>

                    <div class="field">
                      <label class="label">.JSON or .YAML File</label>
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
                  <div v-if="form.type === 'postman'">
                    <div class="field">
                      <label class="label">{{ $t('Title') }}</label>
                      <input
                        v-model="form.title"
                        type="text"
                        class="input v-input"
                        placeholder="Enter title for identification"
                      />
                      <HasError :form="form" field="title" />
                    </div>

                    <div class="field">
                      <label class="label">Postman Collection File</label>
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
            </div>
          </template>
        </VTabs>
        <div class="modal-card-foot">
          <button type="button" class="button v-button" @click="$emit('close')">
            {{ $t('Close') }}
          </button>
          <FormButton :form="form" class="button v-button is-primary btn-sm">
            {{ $t('Import') }}
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
import VTabs from '/@src/components/base/tabs/VTabs.vue'

export default {
  components: {
    FormButton,
    HasError,
    VModal,
    VTabs,
  },
  props: ['asset'],
  emits: ['closeModal', 'close'],
  data: () => ({
    form: new Form({}),
    types: {
      // basic: 'Basic',
      openapi: 'OpenAPI / Swagger',
      postman: 'Postman collection',
    },
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    this.form.type = 'basic'
  },
  methods: {
    handleFileUpload() {
      this.form.file = this.$refs.file.files[0]
    },
    importData() {
      this.form.asset_id = this.asset.id

      this.form
        .post('/urls/import')
        .then(() => {
          this.form.type = 'basic'
          this.form.file = null
          this.form.urls = null
          this.form.title = null
          this.$emit('close')
        })
        .catch(() => {})
    },
  },
}
</script>
