<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Cyber Exposure Score</h3>
      <!--      <a class="action-link" tabindex="0">View All</a>-->
    </div>
    <div class="active-team">
      <div v-if="loaded" class="columns is-multiline">
        <div class="column is-6">
          <ExposureGradeWidget v-if="unscanned" :score="score" grade="N/A" />
          <ExposureGradeWidget v-else :score="score" :grade="grade" />
        </div>
        <div class="column is-6">
          <ul class="user-list">
            <li
              v-for="issue in issues
                .filter((issue) => {
                  let wk = null
                  if (project) {
                    wk = project.workspace
                  } else if (workspace) {
                    wk = workspace
                  }
                  if (wk?.activeLicense?.show_unlicensed) {
                    return true
                  } else {
                    return wk?.activeLicense?.modules
                      .map((module) => module.slug)
                      .includes(issue.slug)
                  }
                })
                .filter((issue) => issue.slug !== VRM_PRODUCT)"
              :key="issue.id"
              class="mb-3 is-clickable"
              @click="goToIssue(issue)"
            >
              <div>
                <div class="v-icon is-rounded" :style="`background: ` + issue.color">
                  <i aria-hidden="true" :class="issue.icon" />
                </div>
              </div>
              <div class="user-list-info">
                <div class="name dark-inverted">{{ issue.name }}</div>
                <div class="position">{{ issue.issues }} issues</div>
              </div>
            </li>
          </ul>
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
import { VRM_PRODUCT } from '/@src/models/constants'
export default {
  components: {
    VLoader,
    ExposureGradeWidget,
  },
  props: ['project', 'workspace', 'collection', 'asset'],
  data: () => ({
    issues: [],
    grade: null,
    score: null,
    unscanned: false,
    loaded: false,
    VRM_PRODUCT,
  }),
  async mounted() {
    await axios
      .get('/widget/assets-exposure', {
        params: {
          workspace_id: this.workspace?.id,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.grade = res.data.data.grade
        this.score = res.data.data.score
        this.unscanned = res.data.data.blank

        this.issues = res.data.data.issues
      })
  },
  methods: {
    goToIssue(issue) {
      if (this.project) {
        this.$router.push({
          name: 'ProjectIssuesView',
          params: { id: this.project.id },
          query: { module_id: issue.id },
        })
      } else {
        this.$router.push({
          name: 'WorkspaceIssuesView',
          params: { id: this.workspace.id },
          query: { module_id: issue.id },
        })
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