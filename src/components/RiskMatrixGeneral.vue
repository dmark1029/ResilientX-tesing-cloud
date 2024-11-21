<template>
  <div class="card">
    <!--end card-header-->
    <div class="card-body">
      <div>
        <p v-if="type === 'vendors_general'" class="mb-5">
          Set default risk matrix for the workspace. This will be used as the default risk
          matrix for all companies.
        </p>
        <p v-if="type === 'cyber_general'" class="mb-5">
          Set default risk matrix for the workspace. This will be used as the default risk
          matrix for all assets and groups.
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
                  <div
                    class="mt-2 select is-fullwidth is-flex is-align-items-center is-justify-content-center"
                  >
                    <select
                      v-model="risk.label"
                      :class="[risk.class]"
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
              <p class="">
                <small
                  >Changing default Risk Matrix will take effect only on next
                  scans.</small
                >
              </p>
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
import VLoader from '/@src/components/base/loader/VLoader.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'

export default {
  components: {
    AreYouSureModal,
    VLoader,
  },
  props: ['workspace', 'type'],
  emits: ['edited'],
  data() {
    return {
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
  watch: {
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
    this.loading = true
    await this.getData()
    this.loading = false
  },
  methods: {
    async changeRisk(risk, scoreRange) {
      let params = {
        workspace_id: this.workspace.id,
        type: this.type,
        type_id: this.workspace.id,
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
        type: this.type,
        type_id: this.workspace.id,
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

      await axios
        .delete('risk-matrix', {
          params: {
            workspace_id: this.workspace.id,
            type: this.type,
            type_id: this.workspace.id,
          },
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