<template>
  <VModal
    is="form"
    :open="!openCollectionModal"
    :title="editable ? `Edit asset` : `Create asset`"
    size="big"
    actions="right"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <VTabs
          slider
          type="rounded"
          :selected="editable ? 'advanced' : 'basic'"
          :tabs="
            editable
              ? [{ label: 'Advanced', value: 'advanced' }]
              : [
                  { label: 'Basic', value: 'basic' },
                  { label: 'Advanced', value: 'advanced' },
                ]
          "
          @update:selected="(value) => (form.multiple = value === 'basic')"
        >
          <template #tab="{ activeValue }">
            <div v-if="activeValue === 'basic'" class="mb-3">
              <div v-if="!collection" class="field">
                <div v-if="!editable" class="field">
                  <label class="label mt-3"
                    >{{ $t('Asset group') }}
                    <small
                      class="has-text-primary is-clickable"
                      @click="openCollectionModal = true"
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
              </div>
              <div class="field">
                <div class="control">
                  <textarea
                    v-model="form.value"
                    type="text"
                    class="textarea"
                    placeholder="Enter assets (one per line)"
                  />
                  <HasError :form="form" field="value" />
                  <HasError :form="form" field="assets_limit" />
                </div>
              </div>
            </div>
            <div v-else-if="activeValue === 'advanced'" class="mb-3">
              <div class="columns">
                <div class="column is-3">
                  <label class="label">{{ $t('Type') }}</label>
                  <div
                    id="v-pills-tab"
                    class="nav flex-column nav-pills has-text-centered"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <div v-for="(value, index) in general.assets.types" :key="index">
                      <template
                        v-if="index !== 'gcp' && index !== 'aws' && index !== 'azure'"
                      >
                        <input
                          :id="`asset-type-form-` + index"
                          v-model="form.type"
                          type="radio"
                          class="is-hidden"
                          :value="index"
                          autocomplete="off"
                          :disabled="editable"
                        />
                        <label
                          :class="[
                            form.type === index
                              ? 'button v-button is-bold is-big is-raised is-primary d-block mb-2'
                              : 'button v-button d-block mb-2',
                            editable ? 'is-disabled' : '',
                          ]"
                          style="width: 100%"
                          :for="`asset-type-form-` + index"
                          >{{ value }}</label
                        >
                      </template>
                    </div>
                  </div>
                  <HasError :form="form" field="type" />
                </div>
                <div class="column is-9">
                  <div v-if="!collection" class="field">
                    <div v-if="!editable" class="field">
                      <label class="label mt-3"
                        >{{ $t('Asset group') }}
                        <small
                          class="has-text-primary is-clickable"
                          @click="openCollectionModal = true"
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
                  </div>

                  <div v-if="form.type" class="field">
                    <div v-if="!editable">
                      <div>
                        <div v-if="form.type === 'url'" class="field">
                          <label class="label is-uppercase"
                            >{{ form.type }}
                            <small>{{ $t('Asset value is not editable.') }}</small></label
                          >
                          <div class="columns">
                            <div class="column is-3">
                              <div class="select">
                                <select
                                  v-model="urlPrefix"
                                  class="input v-input"
                                  @change="urlChange"
                                >
                                  <option value="https://">https://</option>
                                  <option value="http://">http://</option>
                                </select>
                              </div>
                            </div>
                            <div class="column is-9">
                              <input
                                v-model="url"
                                type="text"
                                class="input v-input"
                                :placeholder="'Enter value for ' + form.type"
                                :disabled="editable"
                                @input="urlChange"
                              />
                            </div>
                          </div>
                        </div>
                        <div v-else class="field">
                          <label class="label is-uppercase"
                            >{{ form.type }}
                            <small>{{ $t('Asset value is not editable.') }}</small></label
                          >
                          <input
                            v-model="form.value"
                            type="text"
                            class="input v-input"
                            :placeholder="'Enter value for ' + form.type"
                            :disabled="editable"
                          />
                        </div>
                        <HasError :form="form" field="value" />
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="form.type === 'ipv4' || form.type === 'ipv4-range'"
                    class="mb-4"
                  >
                    <div class="field">
                      <label class="label">{{ $t('Private network IP') }}</label>

                      <div>
                        <label class="checkbox pt-0 pb-0 pl-0">
                          <input
                            id="`asset-private-network-field`"
                            v-model="form.private_network"
                            :value="true"
                            class="form-check-input"
                            type="checkbox"
                            autocomplete="off"
                          />
                          <span />
                          <span>{{ $t('Private network IP') }}</span>
                        </label>
                      </div>

                      <HasError :form="form" field="private_network" />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">{{ $t('Name') }} <small>Optional</small></label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="input v-input"
                      placeholder="Enter asset name"
                    />
                    <HasError :form="form" field="name" />
                    <HasError :form="form" field="assets_limit" />
                  </div>
                  <!--                  <div class="columns">-->
                  <!--                    <div class="column is-6">-->
                  <!--                      <div class="field">-->
                  <!--                        <label class="label">{{ $t('Priority') }}</label>-->

                  <!--                        <div>-->
                  <!--                          <label-->
                  <!--                            v-for="(value, index) in general.assets.priorities"-->
                  <!--                            :key="index"-->
                  <!--                            class="checkbox pt-0 pb-0 pl-0"-->
                  <!--                          >-->
                  <!--                            <input-->
                  <!--                              :id="`asset-priority-form-` + index"-->
                  <!--                              v-model="form.priority"-->
                  <!--                              :value="index"-->
                  <!--                              class="form-check-input"-->
                  <!--                              type="radio"-->
                  <!--                              autocomplete="off"-->
                  <!--                            />-->
                  <!--                            <span />-->
                  <!--                            <span>{{ value }}</span>-->
                  <!--                          </label>-->
                  <!--                        </div>-->

                  <!--                        <HasError :form="form" field="priority" />-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->

                  <div class="columns mb-2">
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
                  <div class="columns mb-2">
                    <div class="column is-6">
                      <div class="field">
                        <label class="label">{{ $t('Tags') }}</label>
                        <Vue3TagsInput
                          :tags="form.tags"
                          placeholder="Enter tags"
                          @on-tags-changed="handleChangeTag"
                        />
                        <HasError :form="form" field="tags" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VTabs>
        <div class="modal-card-foot">
          <button type="button" class="button v-button" @click="$emit('closeModal')">
            {{ $t('Close') }}
          </button>
          <FormButton :form="form" class="button v-button is-primary btn-sm">
            {{ editable ? $t('Edit asset') : $t('Create asset') }}
          </FormButton>
        </div>
      </form>
    </template>
  </VModal>

  <div v-if="openCollectionModal">
    <CollectionsModal :project="project" @closeModal="closeCollectionModal" />
  </div>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import Vue3TagsInput from 'vue3-tags-input'
import { axios } from '/@src/axios'
import VModal from '/@src/components/base/modal/VModal.vue'
import { defineAsyncComponent } from 'vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'

export default {
  components: {
    VTabs,
    VModal,
    CollectionsModal: defineAsyncComponent(
      () => import('/@src/components/collections/CollectionsModal.vue')
    ),
    FormButton,
    HasError,
    Vue3TagsInput,
  },
  props: ['editable', 'project', 'collection'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    urlPrefix: 'https://',
    url: null,
    openCollectionModal: false,
    collections: [],
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.status = this.editable.status
      this.form.type = this.editable.type
      this.form.priority = this.editable.priority
      this.form.business_impact = this.editable.business_impact
      this.form.tags = this.editable.tags
      this.form.value = this.editable.value
      this.form.private_network = this.editable.private_network
    } else {
      this.form.project_id = this.project.id
      this.form.tags = []
      this.form.value = ''
      this.form.multiple = true
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'
      this.form.priority = 'normal'
      this.form.type = Object.keys(this.general.assets.types)[0]
    }

    if (!this.collection) {
      this.getCollections()
    } else {
      this.form.collection_id = this.collection.id
    }
  },
  methods: {
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
        form = this.form.post('/asset/' + this.editable.id + '?_method=PUT')
      } else {
        if (this.form.multiple) {
          form = this.form.post('/asset/multiple')
        } else {
          form = this.form.post('/asset')
        }
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
    closeCollectionModal() {
      this.openCollectionModal = false
      this.getCollections()
    },
    getCollections() {
      if (!this.project) {
        return
      }

      axios
        .get(`/collection`, {
          params: {
            id: this.project.id,
            status: 'active',
          },
        })
        .then((res) => {
          this.collections = res.data.data
          if (!this.editable) {
            this.form.collection_id = this.collections[0].id
          }
        })
        .catch(() => {})
    },
    handleChangeTag(tags) {
      this.form.tags = tags
    },
    classSelected(value) {
      if (value === 'low') {
        value = 'info'
      }
      if (value === 'normal') {
        value = 'warning'
      }
      if (value === 'high') {
        value = 'danger'
      }

      return 'btn btn-' + value + ' d-block mb-2'
    },
    classUnselected(value) {
      if (value === 'low') {
        value = 'info'
      }
      if (value === 'normal') {
        value = 'warning'
      }
      if (value === 'high') {
        value = 'danger'
      }

      return 'btn btn-outline-' + value + ' d-block mb-2'
    },
    urlChange() {
      if (this.url) {
        this.form.value = this.urlPrefix + this.url
      } else {
        this.form.value = ''
      }
    },
  },
}
</script>
