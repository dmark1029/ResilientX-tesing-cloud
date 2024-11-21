<template>
  <div v-if="asset && asset.taskable_type === 'asset'" class="mb-3">
    <p class="v-label sub-1">Configuration</p>

    <div class="columns">
      <div class="column is-2"></div>
      <div class="column is-8">
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="field">
              <label class="label">{{ $t('Base URL') }}</label>
              <!-- eslint-disable vue/no-mutating-props -->
              <input
                v-model="values['base_url']"
                type="text"
                class="input v-input"
                placeholder="Enter base URL"
              />
              <p class="help">
                Ensure that protocol is accurate (http/https) and the URL is correct.
              </p>
              <!-- eslint-enable vue/no-mutating-props -->
              <HasError :form="form" :field="values.base_url" />
            </div>
          </div>
          <div class="column is-8">
            <div class="field">
              <label class="label p-0"> Select authentication </label>
              <div class="select">
                <!-- eslint-disable-next-line vue/no-mutating-props -->
                <select v-model="values['authentication_id']" class="form-select">
                  <option :value="undefined">None</option>
                  <option v-for="auth in authentications" :key="auth.id" :value="auth.id">
                    {{ auth.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="column is-4 pt-0">
            <button
              v-if="!showAdd"
              style="margin-top: 33px"
              type="button"
              class="button v-button is-small"
              @click="showAdd = !showAdd"
            >
              Add new authentication
            </button>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-3">
            <div class="field">
              <label class="label p-0"> Select type </label>
              <!-- eslint-disable vue/no-mutating-props -->
              <Multiselect
                v-model="values['included_urls_type']"
                :options="urlType"
                placeholder="Type"
                @deselect="
                  (value) => {
                    values['url_id'] = ''
                  }
                "
                @select="
                  (value) => {
                    getUrls(value)
                    if (value === 'url') {
                      values['url_id'] = []
                    } else {
                      values['url_id'] = ''
                    }
                  }
                "
              />
              <!-- eslint-enable vue/no-mutating-props -->
            </div>
          </div>
          <div class="column is-6">
            <div class="field">
              <label class="label p-0">
                {{
                  values['included_urls_type'] !== 'url'
                    ? 'Select Collection'
                    : "Select URL's"
                }}
              </label>
              <!-- eslint-disable vue/no-mutating-props -->
              <Multiselect
                :key="values['included_urls_type']"
                v-model="values['url_id']"
                :disabled="
                  values['included_urls_type'] === 'url-all' ||
                  values['included_urls_type'] === 'default'
                "
                :mode="values['included_urls_type'] !== 'url' ? 'single' : 'multiple'"
                label="label"
                :searchable="true"
                value-prop="id"
                :options="urls"
                :placeholder="
                  values['included_urls_type'] !== 'url'
                    ? 'Select collection'
                    : 'Select URL\'s'
                "
              />
              <HasError :form="form" field="values.url_id" />
              <!-- eslint-enable vue/no-mutating-props -->
            </div>
          </div>
          <div class="column is-3 pt-0">
            <button
              type="button"
              class="button v-button is-small"
              style="margin-top: 33px"
              @click="showUrlsModal = true"
            >
              Add URL's
            </button>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="field">
              <label class="label p-0"> Out of scope </label>
              <div class="field">
                <div class="control">
                  <!-- eslint-disable vue/no-mutating-props -->
                  <textarea
                    v-model="values['outofscope']"
                    type="text"
                    class="textarea"
                    placeholder="Enter out of scope URL's (One per line)"
                  />
                  <!-- eslint-enable vue/no-mutating-props -->
                  <HasError :form="form" field="values.outofscope" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-2"></div>
    </div>

    <button class="button v-button" type="button" @click="saveConfiguration">
      Save as default configuration
    </button>

    <AssetUrlsModal v-if="showUrlsModal" :asset="asset" @close="closeUrlModal" />

    <VModal
      is="form"
      :open="showAdd"
      title="Add authentication"
      size="big"
      actions="right"
      @close="showAdd = false"
    >
      <template #content>
        <div v-if="showAdd">
          <div class="columns">
            <div class="column is-4">
              <div class="field has-text-left">
                <label class="label">{{ $t('Authentication type') }}</label>
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
                    v-model="authForm.type"
                    type="radio"
                    class="is-hidden"
                    :value="index"
                    autocomplete="off"
                  />
                  <label
                    :class="[
                      authForm.type === index
                        ? 'button v-button is-bold is-big is-raised is-primary d-block mb-2'
                        : 'button v-button d-block mb-2',
                    ]"
                    style="width: 100%"
                    :for="`asset-type-form-` + index"
                    >{{ value }}</label
                  >
                </div>
              </div>
              <HasError :form="authForm" field="type" />
            </div>
            <div class="column is-8 has-text-left">
              <form @submit.prevent="save" @keydown="authForm.onKeydown($event)">
                <div v-if="authForm.type === 'har'">
                  <div class="field">
                    <label class="label mt-3">{{ $t('Name') }}</label>
                    <div class="control">
                      <input
                        v-model="authForm.name"
                        type="text"
                        class="v-input input"
                        placeholder="Enter name of the authentication"
                      />
                      <HasError :form="authForm" field="name" />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label mt-3">{{ $t('Logged in pattern') }}</label>
                    <div class="control">
                      <input
                        v-model="authForm.regex"
                        type="text"
                        class="v-input input"
                        placeholder="Enter pattern"
                      />
                      <p class="help">
                        A text pattern or regular expression occurring in the application
                        which indicates that the user is logged in.
                      </p>
                      <HasError :form="authForm" field="regex" />
                    </div>
                  </div>
                  <hr class="mt-2 mb-2" />

                  <div class="field">
                    <label class="label">.HAR File</label>
                    <div class="control">
                      <div class="file has-name">
                        <label class="file-label">
                          <input
                            ref="file"
                            class="file-input"
                            accept=".har"
                            type="file"
                            @change="handleHarFile()"
                          />
                          <span class="file-cta">
                            <span class="file-icon"
                              ><i class="fas fa-cloud-upload-alt"
                            /></span>
                            <span class="file-label"> Choose a file… </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <FormButton :form="authForm" class="button v-button is-primary btn-sm">
                    {{ $t('Create') }}
                  </FormButton>
                </div>
                <div v-if="authForm.type === 'headers'">
                  <div class="field">
                    <label class="label mt-3">{{ $t('Name') }}</label>
                    <div class="control">
                      <input
                        v-model="authForm.name"
                        type="text"
                        class="v-input input"
                        placeholder="Enter name of the authentication"
                      />
                      <HasError :form="authForm" field="name" />
                    </div>
                  </div>
                  <div class="field">
                    <label class="label mt-3">{{ $t('Logged in pattern') }}</label>
                    <div class="control">
                      <input
                        v-model="authForm.regex"
                        type="text"
                        class="v-input input"
                        placeholder="Enter pattern"
                      />
                      <p class="help">
                        A text pattern or regular expression occurring in the application
                        which indicates that the user is logged in.
                      </p>
                      <HasError :form="authForm" field="regex" />
                    </div>
                  </div>
                  <hr class="mt-2 mb-2" />
                  <div
                    v-for="(header, index) in authForm.headers"
                    :key="index"
                    class="columns"
                  >
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">{{ $t('Key') }}</label>
                        <input
                          v-model="header.key"
                          type="text"
                          class="input v-input"
                          placeholder="Enter key"
                        />
                        <HasError :form="authForm" :field="`headers[${index}].key`" />
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">{{ $t('Value') }}</label>
                        <input
                          v-model="header.value"
                          type="text"
                          class="input v-input"
                          placeholder="Enter value"
                        />
                        <HasError :form="authForm" :field="`headers[${index}].value`" />
                      </div>
                    </div>
                    <div class="column is-2">
                      <div class="field">
                        <label class="label">&nbsp;</label>
                        <button
                          type="button"
                          class="button v-button is-danger"
                          @click="removeHeader(index)"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    class="button v-button is-primary"
                    type="button"
                    @click="addHeader"
                  >
                    {{ $t('Add Header') }}
                  </button>
                  <hr />
                  <FormButton :form="authForm" class="button v-button is-primary btn-sm">
                    {{ $t('Create') }}
                  </FormButton>
                </div>
                <div v-if="authForm.type === 'cookies'">
                  <div class="field">
                    <label class="label mt-3">{{ $t('Name') }}</label>
                    <div class="control">
                      <input
                        v-model="authForm.name"
                        type="text"
                        class="v-input input"
                        placeholder="Name of the authentication"
                      />
                      <HasError :form="authForm" field="name" />
                    </div>
                  </div>
                  <hr class="mt-2 mb-2" />
                  <div
                    v-for="(cookie, index) in authForm.cookies"
                    :key="index"
                    class="columns"
                  >
                    <div class="column is-4">
                      <div class="field">
                        <label class="label">{{ $t('Name') }}</label>
                        <input
                          v-model="cookie.key"
                          type="text"
                          class="input v-input"
                          placeholder="Enter key"
                        />
                        <HasError :form="authForm" :field="`cookies[${index}].key`" />
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">{{ $t('Value') }}</label>
                        <input
                          v-model="cookie.value"
                          type="text"
                          class="input v-input"
                          placeholder="Enter value"
                        />
                        <HasError :form="authForm" :field="`cookies[${index}].value`" />
                      </div>
                    </div>
                    <div class="column is-2">
                      <div class="field">
                        <label class="label">&nbsp;</label>
                        <button
                          type="button"
                          class="button v-button is-danger"
                          @click="removeCookie(index)"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    class="button v-button is-primary"
                    type="button"
                    @click="addCookie"
                  >
                    {{ $t('Add Cookie') }}
                  </button>
                  <hr />
                  <FormButton :form="authForm" class="button v-button is-primary btn-sm">
                    {{ $t('Create') }}
                  </FormButton>
                </div>
                <div
                  v-if="
                    authForm.type === 'recorded' ||
                    authForm.type === 'http' ||
                    authForm.type === 'form'
                  "
                >
                  <div class="field">
                    <h1>&nbsp;</h1>
                    <label class="label">{{
                      $t('This authentication method coming soon.')
                    }}</label>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import VModal from '/@src/components/base/modal/VModal.vue'
import AssetUrlsModal from '/@src/components/assets/AssetUrlsModal.vue'
import { axios } from '/@src/axios'
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    AssetUrlsModal,
    VModal,
    FormButton,
    Multiselect,
    HasError,
  },
  props: ['values', 'asset', 'form'],
  data: () => ({
    showUrlsModal: false,
    authForm: new Form({
      type: 'headers',
      cookies: [{ key: '', value: '' }],
      headers: [{ key: '', value: '' }],
    }),
    showAdd: false,
    type: null,
    authentications: [],
    urls: [],
    types: {
      headers: 'Header based',
      cookies: 'Cookie based',
      form: 'Form based',
      http: 'HTTP basic',
      har: '.HAR File',
      recorded: 'Recorded',
    },
    urlType: {
      default: 'Default scope',
      'url-all': 'All URLs',
      url: 'URLs',
      openapi: 'OpenAPI / Swagger',
      postman: 'Postman collection',
    },
  }),
  async mounted() {
    if (this.asset) {
      if (this.asset.taskable_type === 'asset') {
        // eslint-disable-next-line vue/no-mutating-props
        this.values['included_urls_type'] = 'default'

        if (this.asset.authentication_configuration) {
          // eslint-disable-next-line vue/no-mutating-props

          if (this.asset.authentication_configuration['included_urls_type'] === 'url') {
            await this.getUrls()
          }

          Object.entries(this.asset.authentication_configuration).forEach(
            ([key, value]) => {
              // eslint-disable-next-line vue/no-mutating-props
              this.values[key] = value
            }
          )
        }

        if (!this.values['base_url']) {
          // eslint-disable-next-line vue/no-mutating-props
          this.values['base_url'] = `https://` + this.asset.value + '/'
        }

        this.getAuthentications()
      }
    }
  },
  methods: {
    handleHarFile() {
      const file = this.$refs.file.files[0]

      const reader = new FileReader()

      reader.readAsText(file, 'UTF-8')

      reader.onload = (evt) => {
        try {
          const harContent = JSON.parse(evt.target.result)
          const entries = harContent.log.entries

          const headers = entries.flatMap((entry) => {
            return entry.request.headers.map((header) => ({
              key: header.name,
              value: header.value,
            }))
          })

          this.authForm.headers = Array.from(
            new Map(headers.map((header) => [header.key + header.value, header])).values()
          )

          this.authForm.type = 'headers'
        } catch (e) {
          alert('Error parsing .har file.')
        }
      }
      reader.onerror = function (evt) {
        alert('Error reading file.')
      }
    },
    saveConfiguration() {
      axios
        .put('/asset/' + this.asset.id + '/configuration', {
          authentication_configuration: this.values,
        })
        .then(() => {
          this.$store.dispatch('addAlert', {
            text: 'Configuration saved',
            type: 'success',
          })
        })
        .catch((e) => {
          this.$store.dispatch('addAlert', {
            text: e.response.data.message,
            type: 'danger',
          })
        })
    },
    save() {
      this.authForm.asset_id = this.asset.id
      this.authForm.post('/asset-authentications').then((res) => {
        this.showAdd = false
        this.authForm.headers = [{ key: '', value: '' }]
        this.authForm.cookies = [{ key: '', value: '' }]
        this.authForm.type = 'headers'
        // eslint-disable-next-line vue/no-mutating-props
        this.values['authentication_id'] = res.data.data.id
        this.getAuthentications()
      })
    },
    getAuthentications() {
      axios
        .get('/asset-authentications', {
          params: {
            asset_id: this.asset.id,
          },
        })
        .then((response) => {
          this.authentications = response.data.data
        })
    },
    getUrls(type) {
      return axios
        .get('/urls', {
          params: {
            asset_id: this.asset.id,
            type: type,
          },
        })
        .then((response) => {
          this.urls = response.data.data.map((url) => ({
            id: url.id,
            label: url.url,
            type: url.type,
          }))
        })
    },
    async closeUrlModal() {
      this.showUrlsModal = false
      await this.getUrls().then(() => {
        if (
          this.values['included_urls_type'] === 'url' ||
          this.values['included_urls_type'] === 'postman' ||
          this.values['included_urls_type'] === 'openapi'
        ) {
          if (this.urls[0] && !this.values['url_id']) {
            // eslint-disable-next-line vue/no-mutating-props
            this.values['url_id'] = this.urls[0].id
          }
        }
      })
    },
    addHeader() {
      this.authForm.headers.push({ key: '', value: '' })
    },
    removeHeader(index) {
      this.authForm.headers.splice(index, 1)
    },
    addCookie() {
      this.authForm.cookies.push({ key: '', value: '' })
    },
    removeCookie(index) {
      this.authForm.cookies.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.sub-1 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: normal;
  margin-bottom: 10px;
}
</style>
