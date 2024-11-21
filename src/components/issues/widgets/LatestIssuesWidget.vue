<template>
  <div class="stat-widget table-widget-v1 is-straight">
    <div class="widget-head">
      <h3 class="dark-inverted">Top 5 issues by Risk</h3>
      <router-link
        v-if="project"
        :to="getIssueIndexURL(project)"
        class="action-link"
        tabindex="0"
        >View issues</router-link
      >
    </div>
    <div v-if="loaded" class="datatable-container">
      <table v-if="issues.length" class="table is-hoverable is-fullwidth">
        <tbody>
          <tr
            v-for="issue in issues"
            :key="issue.id"
            v-table-click="() => $router.push(getIssueURL(issue))"
            class="is-clickable"
          >
            <td>
              <div class="double-line">
                <span class="dark-inverted">{{ issue.title }}</span
                ><span>{{ issue.asset.name }} | {{ issue.created }}</span>
              </div>
            </td>
            <td v-if="product === UEM_PRODUCT">
              <div class="double-line">
                <span class="dark-inverted">{{ getModule(issue)?.name ?? '-' }}</span>
              </div>
            </td>
            <td>
              <div class="tag-wrap">
                <IssueStatusBadge :status="issue.status_text" />
              </div>
            </td>
            <td>
              <div class="tag-wrap">
                <IssueSeverityBadge :severity="issue.severity" />
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
        <div style="height: 300px" />
      </VLoader>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import IssueSeverityBadge from '/@src/components/issues/IssueSeverityBadge.vue'
import IssueStatusBadge from '/@src/components/issues/IssueStatusBadge.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import { UEM_PRODUCT } from '/@src/models/constants'

export default {
  components: { VLoader, IssueStatusBadge, IssueSeverityBadge },
  mixins: [urlMixin],
  props: ['project', 'workspace', 'collection', 'asset', 'workspaceCollectionId'],
  data: () => ({
    loaded: false,
    issues: null,
    UEM_PRODUCT,
  }),
  computed: {
    ...mapGetters(['general', 'product']),
  },
  async mounted() {
    await axios
      .get('/issue', {
        params: {
          workspace_id: this.workspace?.id,
          workspace_collection_id: this.workspaceCollectionId,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
          sort: 'severity',
          status: 'opened',
        },
      })
      .then((res) => {
        this.loaded = true
        this.issues = res.data.data.slice(0, 5)
      })
  },
  methods: {
    getModule(item) {
      let found
      this.general.modules.forEach((m) => {
        if (m.id === item.module_id) {
          found = m
        }
      })
      return found
    },
  },
}
</script>

<style lang="scss" scoped>
.stat-widget {
  &.table-widget-v1 {
    .table {
      margin-top: 1.5rem;

      tbody {
        tr,
        td {
          border: none;
        }

        tr {
          border-radius: 10px;
        }

        td {
          padding: 1em 0.75em;

          .double-line {
            line-height: 1.4;

            span {
              display: block;

              &:first-child {
                font-family: var(--font-alt);
                font-size: 1rem;
                font-weight: 600;
                color: var(--dark-text);
              }

              &:nth-child(2) {
                color: var(--light-text);
                font-size: 0.9rem;
              }
            }
          }

          .avatars {
            > .v-avatar {
              margin: 0 0.15rem;
            }
          }

          // .rating-wrap {
          //   text-align: inset-inline-end;

          //   span {
          //     color: var(--light-text);
          //   }

          //   .rating {
          //     i {
          //       color: var(--widget-grey-dark-8);

          //       &.selected {
          //         color: var(--yellow) !important;
          //       }
          //     }
          //   }
          // }

          .tag-wrap {
            text-align: inset-inline-end;
          }
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .stat-widget {
    &.table-widget-v1 {
      .table {
        tbody {
          td {
            &:nth-child(4),
            &:nth-child(5) {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>