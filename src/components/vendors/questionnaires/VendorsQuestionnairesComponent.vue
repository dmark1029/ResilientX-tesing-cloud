<template>
  <div>
    <div>
      <div v-if="!loading" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column is-3 pt-0 pb-0">
              <VField>
                <VControl>
                  <VInput v-model="search" type="text" placeholder="Search..." />
                </VControl>
              </VField>
            </div>
            <div class="column is-2 pt-0 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchStatus"
                    :attrs="{ id }"
                    :options="{
                      Active: 'Active',
                      Archive: 'Inactive',
                    }"
                    placeholder="Status"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div v-if="canCreate()" class="buttons">
          <VButton color="light" outlined raised @click="showImportModal = true">
            <span class="icon">
              <i aria-hidden="true" class="fas fa-file-import" />
            </span>
          </VButton>
          <router-link
            :to="{
              name: 'VendorsQuestionnairesCreate',
            }"
            class="button v-button is-primary is-raised"
            tabindex="0"
          >
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add</span>
          </router-link>
        </div>
      </div>

      <div v-if="loading || !questionnaires" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <NoData :meta="questionnaires?.meta" :search="search" />

        <TransitionGroup name="list" tag="div">
          <div v-if="questionnaires?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    :sort="sort"
                    title="Title"
                    slug="title"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Status']"
                    :sort="sort"
                    title="Status"
                    slug="status"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Acceptable score']"
                    :sort="sort"
                    title="Acceptable score"
                    slug="acceptable_score"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="questionnaires-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in questionnaires.data"
                  :key="item.id"
                  class="is-clickable"
                >
                  <td v-if="columns['Title']">{{ item.title }}</td>
                  <td v-if="columns['Status']">
                    <QuestionnaireStatusBadge :status="item.status_text" />
                  </td>
                  <td v-if="columns['Acceptable score']">
                    {{ item.acceptable_score ?? '-' }}
                  </td>
                  <td v-if="item.workspace_id" class="text-end">
                    <button
                      v-if="!vendor"
                      v-tooltip="'View questionnaire answers'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="viewAnswers(item)"
                    >
                      <span class="icon is-small fa fa-eye"></span>
                    </button>
                    <button
                      v-tooltip="'Preview questionnaire'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="previewQuestionnaire(item)"
                    >
                      <span class="icon is-small fa fa-window-maximize"></span>
                    </button>
                    <button
                      v-tooltip="'Send questionnaire'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="sendQuestionnaire(item)"
                    >
                      <span class="icon is-small fa fa-envelope-open"></span>
                    </button>
                    <router-link
                      v-tooltip="'Edit questionnaire'"
                      :to="{
                        name: 'VendorsQuestionnairesEdit',
                        params: { questionnaire: item?.id },
                      }"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                    >
                      <span class="icon is-small fa fa-pencil-alt"></span>
                    </router-link>
                    <button
                      v-tooltip="'Duplicate questionnaire'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="replicateQuestionnaire(item)"
                    >
                      <span class="icon is-small fa fa-clone"></span>
                    </button>
                  </td>
                  <td v-else class="text-end">
                    <button
                      v-tooltip="'Use questionnaire'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="replicateQuestionnaire(item)"
                    >
                      <span class="icon is-small fa fa-clone"></span>
                    </button>
                    <button
                      v-tooltip="'Preview questionnaire'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="previewQuestionnaire(item)"
                    >
                      <span class="icon is-small fa fa-window-maximize"></span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="questionnaires"
          @pagination-change-page="getQuestionnaires"
        />

        <VendorsQuestionnairesPreviewModal
          v-if="showPreviewModal"
          :editable="editable"
          :workspace="workspace"
          @closeModal="hideModal"
        />

        <VendorsQuestionnaireSendModal
          v-if="showSendModal"
          :editable="editable"
          :workspace="workspace"
          @closeModal="hideModal"
        />
      </div>
    </div>

    <VModal is="div" :open="replicating" title="Duplication in progress " size="medium">
      <template #content>
        <div class="has-text-centered">
          <h5 class="mt-0">Please wait while we finish duplicating the questionnaire</h5>
          <div class="p-3">
            <VLoader :active="true">
              <div style="height: 200px" />
            </VLoader>
          </div>
        </div>
      </template>
    </VModal>

    <ImportQuestionnairesModal
      v-if="showImportModal"
      @closeModal="
        () => {
          showImportModal = false
          getQuestionnaires()
        }
      "
    />

    <VModal
      is="div"
      :open="showAnswersModal"
      title="Answers"
      size="big"
      @close="showAnswersModal = false"
    >
      <template #content>
        <VendorsQuestionnaireAnswersComponent :questionnaire="editable" />
      </template>
    </VModal>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/src/axios'

import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VControl from '/src/components/base/form/VControl.vue'
import NoData from '/src/components/NoData.vue'
import Pagination from '/src/components/Pagination.vue'
import VLoader from '/src/components/base/loader/VLoader.vue'
import VField from '/src/components/base/form/VField.vue'
import VInput from '/src/components/base/form/VInput.vue'
import TableCustomizationDropdown from '/src/components/TableCustomizationDropdown.vue'
import TableSortableHeader from '/src/components/TableSortableHeader.vue'
import AreYouSureModal from '/src/components/AreYouSureModal.vue'
import VendorsQuestionnaireSendModal from '/@src/components/vendors/questionnaires/VendorsQuestionnaireSendModal.vue'
import VendorsQuestionnairesPreviewModal from '/@src/components/vendors/questionnaires/VendorsQuestionnairesPreviewModal.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import VendorsQuestionnaireAnswersComponent from '/@src/components/vendors/questionnaires/VendorsQuestionnaireAnswersComponent.vue'
import QuestionnaireStatusBadge from '/@src/components/vendors/questionnaires/QuestionnaireStatusBadge.vue'
import Multiselect from '@vueform/multiselect'
import VButton from '/@src/components/base/button/VButton.vue'
import ImportQuestionnairesModal from '/@src/components/vendors/questionnaires/ImportQuestionnairesModal.vue'

export default {
  components: {
    ImportQuestionnairesModal,
    VButton,
    QuestionnaireStatusBadge,
    VendorsQuestionnaireAnswersComponent,
    VModal,
    Multiselect,
    VendorsQuestionnairesPreviewModal,
    VendorsQuestionnaireSendModal,
    AreYouSureModal,
    TableSortableHeader,
    TableCustomizationDropdown,
    VInput,
    VField,
    Pagination,
    VLoader,
    NoData,
    VControl,
  },
  mixins: [permissionsMixin],
  props: ['vendor', 'workspace', 'admin'],
  data: () => ({
    showImportModal: false,
    showModal: false,
    showSendModal: false,
    showPreviewModal: false,
    loading: false,
    replicating: false,
    showAnswersModal: false,

    search: '',
    searchStatus: '',
    sort: '',

    editable: null,
    columns: {
      Title: true,
      'Acceptable score': true,
      Status: true,
    },
  }),
  computed: {
    ...mapGetters(['questionnaires', 'isMobile', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    sort: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addQuestionnaires', null)

    this.searchStatus = 'Active'

    this.loadColumns()

    await Promise.all([this.getQuestionnaires()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    openLink(url) {
      window.open('http://' + url, '_blank')
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendor-contacts-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getQuestionnaires(page = 1) {
      let url = `/questionnaire`
      let params = {
        workspace_id: this.workspace?.id,
        vendor_id: this.vendor?.id,
        q: this.search,
        sort: this.sort,
        status: this.searchStatus,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addQuestionnaires', res.data)
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.showSendModal = false
      this.showPreviewModal = false
      this.editable = null
      this.getQuestionnaires()
    },
    sendQuestionnaire(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showSendModal = true
    },
    previewQuestionnaire(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showPreviewModal = true
    },
    viewAnswers(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showAnswersModal = true
    },
    editAsset(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    replicateQuestionnaire(item) {
      let url = `/questionnaire/${item.id}/replicate`

      const params = {
        workspace_id: this.workspace?.id,
      }

      this.replicating = true

      return axios
        .post(url, params, {
          timeout: 60000,
        })
        .then(() => {
          this.searchType = ''
          this.getQuestionnaires()
          this.replicating = false
        })
        .catch(() => {
          this.replicating = false
        })
    },
    canCreate() {
      return this.canPerformAction('vendors', 'create')
    },
    canUpdate() {
      return this.canPerformAction('vendors', 'update')
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
  min-width: 85%;
}
.tile-grid-toolbar .control {
  margin-inline-end: 0;
}
@media (width <= 767px) {
  .asset-filters {
    min-width: 70%;
  }
}
</style>
