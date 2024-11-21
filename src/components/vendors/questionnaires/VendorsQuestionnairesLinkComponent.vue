<template>
  <div>
    <QuestionnaireAnswersStatsWidget :vendor-id="vendorId" />

    <div>
      <div v-if="loading || !items" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else>
        <div class="tile-grid-toolbar assets">
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
          <div class="buttons">
            <button
              class="button v-button is-primary is-raised"
              tabindex="0"
              @click="showSendModal = true"
            >
              <span class="icon">
                <i aria-hidden="true" class="fas fa-plus" />
              </span>
              <span>Send</span>
            </button>
          </div>
        </div>

        <QuestionnaireSendModal
          v-if="showSendModal"
          :workspace="workspace"
          :vendor-id="vendorId"
          @closeModal="hideModal"
        />

        <div class="tile-grid tile-grid-v2">
          <!--List Empty Search Placeholder -->
          <NoData :meta="items?.meta" :search="search" />

          <!--Tile Grid v1-->
          <TransitionGroup name="list" tag="div">
            <div v-if="items?.meta?.total" class="datatable-container">
              <table class="table datatable-table is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <TableSortableHeader
                      v-if="columns['Questionnaire']"
                      :sort="sort"
                      title="Questionnaire"
                      slug="questionnaire"
                      @changeSort="changeSort"
                    />
                    <TableSortableHeader
                      v-if="columns['Acceptable score']"
                      :sort="sort"
                      title="Acceptable score"
                      slug="acceptable_score"
                      @changeSort="changeSort"
                    />
                    <TableSortableHeader
                      v-if="columns['Score']"
                      :sort="sort"
                      title="Score"
                      slug="score"
                      @changeSort="changeSort"
                    />
                    <TableSortableHeader
                      v-if="columns['Risk rating']"
                      :sort="sort"
                      title="Risk rating"
                      slug="business_impact_risk"
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
                      v-if="columns['Percentage']"
                      :sort="sort"
                      title="Percentage"
                      slug="percentage"
                      @changeSort="changeSort"
                    />
                    <th style="min-width: 199px">
                      <TableCustomizationDropdown
                        id="vendor-questionnaire-answer-vendor-table"
                        :types="columns"
                        @typesUpdated="loadColumns"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in items.data"
                    :key="item.id"
                    v-table-click="
                      () => {
                        showAnswersModal = item
                      }
                    "
                    class="is-clickable"
                  >
                    <td v-if="columns['Questionnaire']">
                      {{ item.questionnaire.title }}
                    </td>
                    <td v-if="columns['Acceptable score']">
                      {{ item.questionnaire.acceptable_score ?? '-' }}
                    </td>
                    <td v-if="columns['Score']">
                      <QuestionnairesScoreBadge :score="item.score" />
                    </td>
                    <td v-if="columns['Risk rating']">
                      <BusinessImpactRiskBadge :impact="item.business_impact_risk" />
                    </td>
                    <td v-if="columns['Status']" class="is-capitalized">
                      <QuestionnaireAnswerStatusBadge :status="item.status" />
                    </td>
                    <td v-if="columns['Percentage']">
                      <div>
                        <VProgress
                          class="mb-0"
                          size="small"
                          :value="item.percentage"
                          color="primary"
                          :max="100"
                        />
                        <p class="is-size-7 mt-2">
                          {{ item.percentage + `%` }} Questions answered
                        </p>
                      </div>
                    </td>
                    <td class="text-end">
                      <span @click.stop.prevent="showAnswersModal = item">
                        <button
                          v-tooltip="'View answers'"
                          :class="'button is-dark-outlined mr-2'"
                        >
                          <span class="icon is-small fa fa-eye"></span>
                        </button>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TransitionGroup>

          <Pagination
            :limit="5"
            :data="items"
            @pagination-change-page="getQuestionnaires"
          />
        </div>
      </div>
    </div>

    <VendorsQuestionnaireAnswersModal
      v-if="showAnswersModal"
      :item="showAnswersModal"
      @closeModal="showAnswersModal = null"
    />
  </div>
</template>

<script>
import { axios } from '/src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import QuestionnairesScoreBadge from '/@src/components/vendors/questionnaires/QuestionnairesScoreBadge.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import QuestionnaireAnswerStatusBadge from '/@src/components/vendors/questionnaires/QuestionnaireAnswerStatusBadge.vue'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import VendorsQuestionnaireAnswersModal from '/@src/components/vendors/questionnaires/VendorsQuestionnaireAnswersModal.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import VField from '/@src/components/base/form/VField.vue'
import _ from 'lodash'
import QuestionnaireAnswersStatsWidget from '/@src/components/vendors/questionnaires/widgets/QuestionnaireAnswersStatsWidget.vue'
import QuestionnaireSendModal from '/@src/components/vendors/questionnaires/QuestionnaireSendModal.vue'

export default {
  components: {
    QuestionnaireSendModal,
    QuestionnaireAnswersStatsWidget,
    VField,
    VInput,
    VControl,
    VendorsQuestionnaireAnswersModal,
    VProgress,
    QuestionnaireAnswerStatusBadge,
    TableSortableHeader,
    QuestionnairesScoreBadge,
    TableCustomizationDropdown,
    BusinessImpactRiskBadge,
    Pagination,
    NoData,
    VLoader,
  },
  props: ['vendorIds', 'vendorId'],
  data: () => ({
    loading: false,
    search: '',
    items: [],
    showSendModal: false,
    showAnswersModal: null,
    sort: '',
    columns: {
      Vendor: true,
      'Acceptable score': true,
      'Risk rating': true,
      Status: true,
      Percentage: true,
      Questionnaire: true,
      Score: true,
    },
  }),
  computed: {
    ...mapGetters(['workspace']),
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

    this.loadColumns()

    await Promise.all([this.getQuestionnaires()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    changeSort(sort) {
      this.sort = sort
    },
    hideModal() {
      this.showSendModal = false
      this.getQuestionnaires()
    },
    loadColumns() {
      const existing = localStorage.getItem('vendor-questionnaire-answer-vendor-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getQuestionnaires(page = 1) {
      let url = `/questionnaire-answer`
      let params = {
        vendor_ids: this.vendorIds,
        vendor_id: this.vendorId,
        workspace_id: this.workspace.id,
        q: this.search,
        sort: this.sort,
        status: this.searchStatus,
        business_impact_risk: this.searchImpactRisk,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.items = res.data
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
