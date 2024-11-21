<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 v-if="sort === 'score'" class="dark-inverted">Companies by score</h3>
      <h3 v-if="sort === 'risk'" class="dark-inverted">Companies by risk rating</h3>
      <h3 v-if="sort === 'score_questionnaire'" class="dark-inverted">
        Companies by questionnaires score
      </h3>
      <h3 v-if="sort === 'risk_questionnaire'" class="dark-inverted">
        Companies by questionnaires risk rating
      </h3>

      <div>
        <VDropdown icon="fas fa-ellipsis-v" spaced right>
          <template #content>
            <a class="dropdown-item is-media" @click.stop.prevent="changeSort('score')">
              <div class="meta">
                <span>By Exposure Score</span>
              </div>
            </a>
            <a class="dropdown-item is-media" @click.stop.prevent="changeSort('risk')">
              <div class="meta">
                <span>By Risk Rating</span>
              </div>
            </a>
            <a
              class="dropdown-item is-media"
              @click.stop.prevent="changeSort('score_questionnaire')"
            >
              <div class="meta">
                <span>By Questionnaires Score</span>
              </div>
            </a>
            <a
              class="dropdown-item is-media"
              @click.stop.prevent="changeSort('risk_questionnaire')"
            >
              <div class="meta">
                <span>By Questionnaires Risk Rating</span>
              </div>
            </a>
          </template>
        </VDropdown>
      </div>
    </div>
    <div class="active-team">
      <div v-if="loaded" class="datatable-container">
        <table v-if="data.length" class="table is-hoverable is-fullwidth">
          <tbody>
            <tr
              v-for="vendor in data"
              :key="vendor.id"
              v-table-click="
                () =>
                  $router.push({
                    name: 'VendorView',
                    params: { asset: vendor.id },
                  })
              "
              class="is-clickable"
            >
              <td>
                <div class="double-line">
                  <span class="dark-inverted">{{ vendor.name }}</span>
                </div>
              </td>
              <td v-if="sort === 'risk' || sort === 'score'">
                <BusinessImpactRiskBadge :impact="vendor.fields.business_impact_risk" />
              </td>
              <td v-if="sort === 'risk' || sort === 'score'">
                <AssetExposureScoreBadge
                  v-if="vendor.exposure_score !== null"
                  :previous-score="getPreviousExposureScore(vendor)"
                  :score="getExposureScore(vendor)"
                  class="mr-2"
                />
                <span v-else>-</span>
              </td>

              <td v-if="sort === 'score_questionnaire' || sort === 'risk_questionnaire'">
                <BusinessImpactRiskBadge
                  :impact="vendor.fields.business_impact_questionnaires_risk"
                />
              </td>
              <td v-if="sort === 'score_questionnaire' || sort === 'risk_questionnaire'">
                <QuestionnairesScoreBadge
                  v-if="vendor.fields.questionnaires_score !== null"
                  :previous-score="vendor.fields.previous_questionnaires_score"
                  :score="vendor.fields.questionnaires_score"
                  class="mr-2"
                />
                <span v-else>-</span>
              </td>
              <td class="is-end">
                <div class="buttons">
                  <button class="button is-dark-outlined">
                    <span class="icon is-small fa fa-eye"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <ul v-else>
          <li class="pt-4 pb-3">
            <p>No data found</p>
          </li>
        </ul>
      </div>
      <div v-else>
        <VLoader :active="true">
          <div style="height: 200px" />
        </VLoader>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'
import QuestionnairesScoreBadge from '/@src/components/vendors/questionnaires/QuestionnairesScoreBadge.vue'

export default {
  components: {
    QuestionnairesScoreBadge,
    VDropdown,
    BusinessImpactRiskBadge,
    AssetExposureScoreBadge,
    VLoader,
  },
  props: ['workspace'],
  data: () => ({
    data: false,
    loaded: false,
    sort: 'risk',
  }),
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.loaded = false

      let sort = ''
      if (this.sort === 'score_questionnaire') {
        sort = '-questionnaires_score'
      }
      if (this.sort === 'risk_questionnaire') {
        sort = '-business_impact_questionnaires_risk'
      }
      if (this.sort === 'score') {
        sort = '-exposure_score'
      }
      if (this.sort === 'risk') {
        sort = '-business_impact_risk'
      }

      await axios
        .get('/vendor', {
          params: {
            workspace_id: this.workspace?.id,
            sort: sort,
            status: 'active',
          },
        })
        .then((res) => {
          this.loaded = true
          this.data = res.data.data
            .filter((vendor) => vendor.exposure_score !== null)
            .slice(0, 5)
        })
    },
    changeSort(sort) {
      this.sort = sort
      this.getData()
    },
    getExposureScore(asset) {
      if (asset.fields.vendor_scorecard_id) {
        return asset.scorecards.find(
          (card) => card.id === asset.fields.vendor_scorecard_id
        ).exposure_score
      } else {
        return asset.exposure_score
      }
    },
    getPreviousExposureScore(asset) {
      if (asset.fields.vendor_scorecard_id) {
        return asset.scorecards.find(
          (card) => card.id === asset.fields.vendor_scorecard_id
        ).previous_exposure_score
      } else {
        return asset.previous_exposure_score
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.user-list {
  li {
    transition: all 0.3s;

    &:hover {
      transform: translateX(5px);

      .position {
        color: var(--light-text-dark-2);
      }

      .name {
        color: var(--light-text-dark-2) !important;
      }
    }
  }
}
</style>