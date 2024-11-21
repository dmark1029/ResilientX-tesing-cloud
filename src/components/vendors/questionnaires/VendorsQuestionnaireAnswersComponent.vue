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
                    v-model="searchImpactRisk"
                    mode="multiple"
                    :attrs="{ id }"
                    :options="general.assets.impact_risks"
                    placeholder="Risk rating"
                  />
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
                      pending: 'Pending',
                      draft: 'Draft',
                      completed: 'Completed',
                    }"
                    placeholder="Status"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading || !questionnaireAnswers" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <NoData :meta="questionnaireAnswers?.meta" :search="search" />

        <TransitionGroup name="list" tag="div">
          <div v-if="questionnaireAnswers?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    :sort="sort"
                    title="Company"
                    slug="vendor"
                    @changeSort="changeSort"
                  />
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
                      id="questionnaire-answers-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in questionnaireAnswers.data"
                  :key="item.id"
                  v-table-click="
                    () => {
                      showAnswersModal = item
                    }
                  "
                  class="is-clickable"
                >
                  <td v-if="columns['Vendor']">{{ item.vendor.name }}</td>
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
                    <span @click.stop.prevent="exportAnswers(item)">
                      <button
                        v-tooltip="'Export answers'"
                        :class="'button is-dark-outlined mr-2'"
                      >
                        <span class="icon is-small fa fa-file-export"></span>
                      </button>
                    </span>
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
          :data="questionnaireAnswers"
          @pagination-change-page="getQuestionnaires"
        />
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
import VendorsQuestionnaireAnswersModal from '/@src/components/vendors/questionnaires/VendorsQuestionnaireAnswersModal.vue'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import QuestionnaireAnswerStatusBadge from '/@src/components/vendors/questionnaires/QuestionnaireAnswerStatusBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import QuestionnairesScoreBadge from '/@src/components/vendors/questionnaires/QuestionnairesScoreBadge.vue'
import Multiselect from '@vueform/multiselect'

export default {
  components: {
    QuestionnairesScoreBadge,
    BusinessImpactRiskBadge,
    QuestionnaireAnswerStatusBadge,
    VProgress,
    Multiselect,
    VendorsQuestionnaireAnswersModal,
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
  props: ['questionnaire', 'workspace'],
  data: () => ({
    showAnswersModal: false,
    loading: false,

    search: '',
    searchStatus: '',
    searchImpactRisk: [],
    sort: '',

    editable: null,
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
    ...mapGetters(['questionnaireAnswers', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    searchImpactRisk: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
    sort: _.debounce(function () {
      this.getQuestionnaires()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addQuestionnaireAnswers', null)

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
      const existing = localStorage.getItem('vendor-questionnaire-answer-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    exportAnswers(item) {
      axios
        .get(`/questionnaire-answer/${item.id}/export`, {
          responseType: 'blob',
        })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'answers.xlsx')
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {})
    },
    getQuestionnaires(page = 1) {
      let url = `/questionnaire-answer`
      let params = {
        workspace_id: this.workspace?.id,
        questionnaire_id: this.questionnaire?.id,
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
          this.$store.dispatch('addQuestionnaireAnswers', res.data)
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
