<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Companies by issues</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded" class="datatable-container">
        <table v-if="data.length" class="table is-hoverable is-fullwidth">
          <tbody>
            <tr
              v-for="vendor in data"
              :key="vendor.vendor.id"
              v-table-click="
                () =>
                  $router.push({
                    name: 'VendorView',
                    params: { asset: vendor.vendor.id },
                  })
              "
              class="is-clickable"
            >
              <td>
                <div class="double-line">
                  <span class="dark-inverted">{{ vendor.vendor.name }}</span>
                </div>
              </td>
              <td>
                <AssetExposureScoreBadge
                  v-if="vendor.vendor.exposure_score !== null"
                  :previous-score="getPreviousExposureScore(vendor.vendor)"
                  :score="getExposureScore(vendor.vendor)"
                  class="mr-2"
                />
                <span v-else>-</span>
              </td>
              <td>
                <div class="tag-wrap">
                  <span class="tag is-critical is-capitalized"
                    >{{ vendor.issues_count }} issues</span
                  >
                </div>
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
            <p>No issues found</p>
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

export default {
  components: {
    AssetExposureScoreBadge,
    VLoader,
  },
  props: ['workspaceCollectionId'],
  data: () => ({
    data: false,
    loaded: false,
  }),
  async mounted() {
    await axios
      .get('/widget/issues-project-vendors', {
        params: {
          workspace_collection_id: this.workspaceCollectionId,
        },
      })
      .then((res) => {
        this.loaded = true
        this.data = res.data.data
      })
  },
  methods: {
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