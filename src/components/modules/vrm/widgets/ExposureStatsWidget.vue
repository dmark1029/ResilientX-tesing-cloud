<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Total score</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded" class="columns is-multiline">
        <div class="column is-12">
          <ExposureGradeWidget
            v-if="score.custom.blank"
            :score="score.custom.score"
            grade="N/A"
          />
          <ExposureGradeWidget
            v-else
            :score="score.custom.score"
            :grade="score.custom.grade"
          />
        </div>
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
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VLoader,
    ExposureGradeWidget,
  },
  props: ['project', 'collection', 'asset', 'workspaceCollectionId'],
  data: () => ({
    checkbox: false,
    score: null,
    loaded: false,
  }),
  async mounted() {
    await axios
      .get('/widget/vendor-assets-exposure', {
        params: {
          project_id: this.project?.id,
          workspace_collection_id: this.workspaceCollectionId,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.score = res.data.data
      })
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