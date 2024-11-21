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
          </div>
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
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="questionnaires-templates-table"
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
                  v-table-click="() => previewQuestionnaire(item)"
                  class="is-clickable"
                >
                  <td v-if="columns['Title']">{{ item.title }}</td>
                  <td class="text-end">
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
import VendorsQuestionnairesPreviewModal from '/@src/components/vendors/questionnaires/VendorsQuestionnairesPreviewModal.vue'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    VendorsQuestionnairesPreviewModal,
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
    showModal: false,
    showPreviewModal: false,
    loading: false,
    replicating: false,

    search: '',
    searchType: '',
    sort: '',

    editable: null,
    columns: {
      Title: true,
    },
  }),
  computed: {
    ...mapGetters(['questionnaires', 'isMobile', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    sort: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addQuestionnaires', null)

    this.loadColumns()

    await Promise.all([this.getQuestionnaires()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('questionnaires-templates-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getQuestionnaires(page = 1) {
      return axios
        .get(`/questionnaire`, {
          params: {
            workspace_id: this.workspace?.id,
            vendor_id: this.vendor?.id,
            q: this.search,
            sort: this.sort,
            public: 1,
            page: page,
          },
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
    previewQuestionnaire(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showPreviewModal = true
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
          this.replicating = false

          this.$router.push({
            name: 'VendorsQuestionnaires',
            params: {
              workspace: this.workspace.id,
            },
          })
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
