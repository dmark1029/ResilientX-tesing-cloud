<template>
  <div class="card">
    <!--end card-header-->
    <div class="card-body">
      <h4 class="title is-5">Risk Rating Matrix</h4>

      <div>
        <p class="mb-5">
          Determine the appropriate level of risk in accordance with the exposure score
          ranges, taking into consideration the associated business impact.
        </p>

        <div v-if="!loading">
          <table class="table is-bordered datatable-table is-fullwidth is-hoverable mb-5">
            <thead>
              <tr>
                <th></th>
                <th colspan="5" class="has-text-centered">Business impact</th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th>Exposure Score</th>
                <th>Minimal</th>
                <th>Minor</th>
                <th>Moderate</th>
                <th>Significant</th>
                <th class="has-text-left">Severe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in riskMatrix" :key="rowIndex">
                <td>{{ row.scoreRange }}</td>
                <td v-for="(risk, colIndex) in row.risks" :key="colIndex" class="p-0">
                  <div class="select is-fullwidth">
                    <select
                      v-model="risk.label"
                      :class="[risk.class, 'has-text-white']"
                      :disabled="editing"
                      @change="changeRisk(risk, row.scoreRange)"
                    >
                      <option
                        v-for="option in options"
                        :key="option.label"
                        :value="option.label"
                        :class="option.class"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="columns">
            <div class="column is-4">
              <table class="table is-bordered datatable-table is-fullwidth mb-5">
                <thead>
                  <tr>
                    <th colspan="2" class="has-text-centered">Current details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Exposure score</th>
                    <td>
                      <AssetExposureScoreBadge
                        v-if="exposureScore !== null"
                        :score="exposureScore"
                        :previous-score="previousExposureScore"
                        class="mr-2"
                      />
                      <span v-else>-</span>
                    </td>
                  </tr>
                  <tr>
                    <th>Business impact</th>
                    <td>
                      <BusinessImpactBadge :impact="impact" />
                    </td>
                  </tr>
                  <tr>
                    <th>Risk rating</th>
                    <td>
                      <BusinessImpactRiskBadge :impact="impactRisk" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="column is-8 has-text-right">
              <button
                class="button v-button is-primary"
                :disabled="editing"
                @click="restoreDefault"
              >
                Restore to default
              </button>
            </div>
          </div>
        </div>
        <VLoader v-else :active="loading">
          <div style="height: 400px"></div>
        </VLoader>
      </div>
    </div>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import BusinessImpactBadge from '/@src/components/assets/BusinessImpactBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import AssetExposureScoreBadge from '/@src/components/assets/AssetExposureScoreBadge.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'

export default {
  components: {
    AreYouSureModal,
    AssetExposureScoreBadge,
    BusinessImpactRiskBadge,
    BusinessImpactBadge,
    VLoader,
  },
  props: ['collection', 'asset', 'vendor'],
  emits: ['edited'],
  data() {
    return {
      impact: null,
      impactRisk: null,
      exposureScore: null,
      previousExposureScore: null,
      editing: false,
      options: [
        { label: 'Bad', class: 'has-background-bad' },
        { label: 'Poor', class: 'has-background-poor' },
        { label: 'Fair', class: 'has-background-fair has-text-grey-dark' },
        { label: 'Good', class: 'has-background-good has-text-grey-dark' },
        { label: 'Excellent', class: 'has-background-excellent' },
      ],
      riskMatrix: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['workspace']),
  },
  watch: {
    vendor: {
      handler() {
        this.impact = this.vendor.fields.business_impact
        this.impactRisk = this.vendor.fields.business_impact_risk

        if (this.vendor.fields.vendor_scorecard_id) {
          this.exposureScore = this.vendor.scorecards.find(
            (card) => card.id === this.vendor.fields.vendor_scorecard_id
          ).exposure_score
        } else {
          this.exposureScore = this.vendor.exposure_score
        }

        if (this.vendor.fields.vendor_scorecard_id) {
          this.previousExposureScore = this.vendor.scorecards.find(
            (card) => card.id === this.vendor.fields.vendor_scorecard_id
          ).previous_exposure_score
        } else {
          this.previousExposureScore = this.vendor.previous_exposure_score
        }
      },
      deep: true,
    },
    asset: {
      handler() {
        this.impact = this.asset.business_impact
        this.impactRisk = this.asset.business_impact_risk
        this.exposureScore = this.asset.exposure_score
        this.previousExposureScore = this.asset.previous_exposure_score
      },
      deep: true,
    },
    collection: {
      handler() {
        this.impact = this.collection.business_impact
        this.impactRisk = this.collection.business_impact_risk
        this.exposureScore = this.collection.exposure_score
        this.previousExposureScore = this.collection.previous_exposure_score
      },
      deep: true,
    },
    riskMatrix: {
      handler(newMatrix) {
        newMatrix.forEach((row) => {
          row.risks.forEach((risk) => {
            const option = this.options.find((option) => option.label === risk.label)
            risk.class = option ? option.class : ''
          })
        })
      },
      deep: true,
    },
  },
  async mounted() {
    if (this.vendor) {
      this.impact = this.vendor.fields.business_impact
      this.impactRisk = this.vendor.fields.business_impact_risk

      if (this.vendor.fields.vendor_scorecard_id) {
        this.exposureScore = this.vendor.scorecards.find(
          (card) => card.id === this.vendor.fields.vendor_scorecard_id
        ).exposure_score
      } else {
        this.exposureScore = this.vendor.exposure_score
      }

      if (this.vendor.fields.vendor_scorecard_id) {
        this.previousExposureScore = this.vendor.scorecards.find(
          (card) => card.id === this.vendor.fields.vendor_scorecard_id
        ).previous_exposure_score
      } else {
        this.previousExposureScore = this.vendor.previous_exposure_score
      }
    }
    if (this.asset) {
      this.impact = this.asset.business_impact
      this.impactRisk = this.asset.business_impact_risk
      this.exposureScore = this.asset.exposure_score
      this.previousExposureScore = this.asset.previous_exposure_score
    }
    if (this.collection) {
      this.impact = this.collection.business_impact
      this.impactRisk = this.collection.business_impact_risk
      this.exposureScore = this.collection.exposure_score
      this.previousExposureScore = this.collection.previous_exposure_score
    }

    this.loading = true
    await this.getData()
    this.loading = false
  },
  methods: {
    async changeRisk(risk, scoreRange) {
      let params = {
        workspace_id: this.workspace.id,
      }
      if (this.vendor) {
        params.type = 'vendor'
        params.type_id = this.vendor.id
      }
      if (this.asset) {
        params.type = 'asset'
        params.type_id = this.asset.id
      }
      if (this.collection) {
        params.type = 'collection'
        params.type_id = this.collection.id
      }

      params.range = scoreRange
      params.business_impact = risk.impact
      params.business_impact_risk = risk.label

      this.editing = true

      await axios
        .post('risk-matrix', params)
        .then((response) => {
          this.riskMatrix = response.data.data
          this.$emit('edited')

          this.editing = false
        })
        .catch(() => {
          this.editing = false
        })
    },
    async getData() {
      let params = {
        workspace_id: this.workspace.id,
      }
      if (this.vendor) {
        params.type = 'vendor'
        params.type_id = this.vendor.id
      }
      if (this.asset) {
        params.type = 'asset'
        params.type_id = this.asset.id
      }
      if (this.collection) {
        params.type = 'collection'
        params.type_id = this.collection.id
      }

      await axios
        .get('risk-matrix', {
          params: params,
        })
        .then((response) => {
          this.riskMatrix = response.data.data
        })
        .catch(() => {})
    },
    async restoreDefault() {
      const ok = await this.$refs.confirmDialogue.show({
        title: 'Confirmation',
        message: 'Are you sure you want to restore this to default?',
        okButton: 'Yes',
        cancelButton: 'No',
      })

      if (!ok) {
        return
      }

      let params = {
        workspace_id: this.workspace.id,
      }
      if (this.vendor) {
        params.type = 'vendor'
        params.type_id = this.vendor.id
      }
      if (this.asset) {
        params.type = 'asset'
        params.type_id = this.asset.id
      }
      if (this.collection) {
        params.type = 'collection'
        params.type_id = this.collection.id
      }

      await axios
        .delete('risk-matrix', {
          params: params,
        })
        .then((response) => {
          this.riskMatrix = response.data.data
          this.$emit('edited')
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped>
.select select {
  width: 100%;
  height: 45px;
  border-radius: 0;
}
</style>