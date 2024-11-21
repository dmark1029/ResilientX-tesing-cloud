<template>
  <div class="stat-widget table-widget-v1 is-straight">
    <div class="widget-head">
      <h3 class="dark-inverted">Top CVE's</h3>
      <router-link
        v-if="project"
        :to="{ name: 'ProjectIssuesView', params: { id: project.id } }"
        class="action-link"
        tabindex="0"
        >View issues</router-link
      >
    </div>
    <div v-if="loaded">
      <VTabs
        slider
        type="rounded"
        selected=""
        :tabs="[
          { label: 'Most Critical CVE', value: '' },
          { label: 'Most Seen CVE', value: 'seen' },
        ]"
        @update:selected="
          (value) => {
            value === '' ? getData() : getData('seen')
          }
        "
      >
        <template #tab=""> </template>
      </VTabs>
      <div v-if="issues.length" class="datatable-container">
        <table class="table is-hoverable is-fullwidth">
          <tbody>
            <tr
              v-for="issue in issues"
              :key="issue.id"
              v-table-click="() => $router.push(getAssetViewURL(issue.asset))"
              class="is-clickable"
            >
              <td>
                <div class="double-line">
                  <span class="dark-inverted">{{ issue.cve }}</span
                  ><span>Found on {{ issue.created }}</span>
                </div>
              </td>
              <td>
                <div class="double-line">
                  <span class="dark-inverted">{{ issue.asset.value }}</span>
                  <span v-if="issue.count">Seen {{ issue.count }} times</span>
                </div>
              </td>
              <td>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div
                  v-dompurify-html="getAttackPredictionScore(issue.cvss)"
                  class="tag-wrap"
                ></div>
              </td>
              <td class="is-end">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div v-dompurify-html="getImpact(issue.cvss)" class="tag-wrap"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul v-else>
        <li class="pt-4 pb-3">
          <p>No CVE's found</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <VLoader :active="true">
        <div style="height: 160px" />
      </VLoader>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'

export default {
  components: { VLoader, VTabs },
  mixins: [urlMixin],
  props: ['project', 'collection', 'asset'],
  data: () => ({
    loaded: false,
    issues: null,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async getData(seen) {
      await axios
        .get('/widget/vulnerabilities-top', {
          params: {
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            seen: seen,
          },
        })
        .then((res) => {
          this.loaded = true
          this.issues = res.data.data.slice(0, 5)
        })
    },
    getModule(item) {
      let found
      this.general.modules.forEach((m) => {
        if (m.id === item.module_id) {
          found = m
        }
      })
      return found
    },

    getAttackPredictionScore(score) {
      if (score >= 66) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-danger" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score >= 33) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-warning" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score && score >= 0) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-info" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else {
        return 'N/A'
      }
    },
    getImpact(cvss) {
      if (cvss >= 9) {
        return "<span class='tag is-critical'>Critical</span>"
      } else if (cvss >= 7) {
        return "<span class='tag is-danger'>High</span>"
      } else if (cvss >= 4) {
        return "<span class='tag is-warning'>Medium</span>"
      } else if (cvss && cvss >= 0) {
        return "<span class='tag is-info'>Low</span>"
      } else {
        return '-'
      }
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