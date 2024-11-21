<template>
  <VModal
    is="div"
    :open="true"
    :title="`Send questionnaire`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div>
        <VLoader v-if="!loaded" :active="true">
          <div style="height: 100px" />
        </VLoader>
        <div v-else>
          <div class="app-search mb-3">
            <form role="search" @submit.prevent="searchQuestionnaires">
              <div class="columns">
                <div class="column is-4">
                  <input
                    v-model="q"
                    type="search"
                    name="search"
                    class="input v-input top-search mb-0"
                    placeholder="Search for questionnaires.."
                    @paste="searchQuestionnaires"
                    @input="searchQuestionnaires"
                  />
                </div>
                <div class="column align-content-center">
                  <div class="is-inline-block mt-2">
                    <label class="checkbox pt-0 pb-0 pl-0">
                      <input
                        id="`asset-private-network-field`"
                        v-model="hasBeenSent"
                        :value="true"
                        class="form-check-input"
                        type="checkbox"
                        autocomplete="off"
                        @change="searchQuestionnaires"
                      />
                      <span />
                      <span>{{ $t("Haven't been sent") }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <TransitionGroup name="list" tag="div">
            <div class="datatable-container">
              <div class="datatable-container">
                <table class="table datatable-table is-fullwidth">
                  <thead>
                    <tr>
                      <th style="vertical-align: middle"></th>
                      <th style="vertical-align: middle">
                        <span>Questionnaire</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="items?.meta?.total">
                      <tr v-for="itemAsset in items.data" :key="itemAsset.id">
                        <td>
                          <div class="is-pulled-left">
                            <VControl>
                              <VSwitchSegment
                                color="success"
                                :disabled="itemAsset.contacts_count === 0"
                                :model-value="false"
                                @update:modelValue="
                                  (value) => {
                                    if (value) {
                                      selectedQuestionnaires.push(itemAsset)
                                    } else {
                                      selectedQuestionnaires =
                                        selectedQuestionnaires.filter(
                                          (asset) => asset.id !== itemAsset.id
                                        )
                                    }
                                  }
                                "
                              />
                            </VControl>
                          </div>
                          <span v-if="itemAsset.contacts_count === 0" class="tag v-tag"
                            >No contacts</span
                          >
                          <span
                            v-if="itemAsset.has_answers"
                            :class="
                              itemAsset.contacts_count === 0
                                ? 'v-tag tag ml-2'
                                : 'v-tag tag is-success'
                            "
                            >Already shared</span
                          >
                        </td>
                        <td>
                          {{ itemAsset.title }}
                        </td>
                      </tr>
                    </template>
                    <template v-else>
                      <tr>
                        <td colspan="7" class="has-text-left">
                          No questionnaires found.
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-5">
              <div class="columns">
                <div class="column is-6">
                  <div class="field">
                    <label class="label">Link expiry date</label>
                    <Datepicker
                      v-model="date"
                      :lower-limit="new Date()"
                      class="input v-input"
                      :input-format="'yyyy.MM.dd'"
                      :clearable="true"
                      placeholder="Select expiry date"
                    />
                  </div>
                </div>
              </div>
              <button class="button is-primary" :disabled="sending" @click="send">
                Send
              </button>
            </div>
          </TransitionGroup>

          <Pagination :limit="5" :data="items" @pagination-change-page="getAssets" />
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { axios } from '/@src/axios'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { debounce } from 'vue-debounce'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VSwitchSegment from '/@src/components/base/form/VSwitchSegment.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import Datepicker from 'vue3-datepicker'
import { mapGetters } from 'vuex'

export default {
  components: { Datepicker, VModal, VSwitchSegment, VControl, Pagination, VLoader },
  mixins: [permissionsMixin],
  props: ['vendorId'],
  emits: ['closeModal'],
  data: () => ({
    items: [],
    found: [],
    selectedQuestionnaires: [],
    page: 1,
    q: '',
    hasContacts: false,
    hasBeenSent: false,
    loaded: false,
    savingBulk: false,
    isAllCheckedValue: false,
    forceUnchecked: false,
    forceChecked: false,
    sending: false,
    date: null,
  }),
  computed: {
    ...mapGetters(['workspace']),
  },
  async mounted() {
    this.searchQuestionnaires = debounce(() => {
      this.getAssets()
    }, '500ms')

    await this.getAssets()
  },
  methods: {
    async send() {
      if (this.selectedQuestionnaires.length === 0) {
        this.$store.dispatch('addAlert', {
          text: 'Please select at least one questionnaire.',
          type: 'danger',
        })
        return
      }

      this.sending = true

      let hasErrors = false
      const promises = []
      for (const questionnaire of this.selectedQuestionnaires) {
        promises.push(
          axios
            .post(`/questionnaire-link`, {
              questionnaire_id: questionnaire.id,
              workspace_id: this.workspace.id,
              vendor_id: this.vendorId,
              expires_at: this.date,
            })
            .then(() => {})
            .catch(() => {
              hasErrors = true
              this.$store.dispatch('addAlert', {
                text: 'Failed to send questionnaire ' + questionnaire.title,
                type: 'danger',
              })
            })
        )
      }
      await Promise.all(promises)

      if (!hasErrors) {
        this.$store.dispatch('addAlert', {
          text: 'Questionnaire sent.',
          type: 'success',
        })
      }

      await this.getAssets(this.page, true)

      this.$emit('closeModal')

      this.sending = false
    },
    async getAssets(page = 1) {
      this.page = page

      return axios
        .get(`/questionnaire`, {
          params: {
            workspace_id: this.workspace?.id,
            has_vendor_id: this.hasBeenSent ? 1 : null,
            filled_vendor_id: this.vendorId,
            q: this.q,
            sort: this.sort,
            page: page,
          },
        })
        .then((res) => {
          this.items = res.data
          this.loaded = true
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}
.asset-filters {
  display: flex;
  align-self: center;
}
@media only screen and (width <= 767px) {
  .tile-grid-toolbar.assets {
    position: relative;
    margin-bottom: 60px;
  }
  .asset-filters {
    position: absolute;
    top: 52px;
    width: 100%;
  }
}
</style>