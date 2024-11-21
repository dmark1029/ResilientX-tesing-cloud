<template>
  <div class="stat-widget table-widget-v1 is-straight">
    <div class="widget-head">
      <h3 class="dark-inverted">
        Last findings on scan at: {{ formatDate(specificDate) }}
      </h3>
    </div>
    <div v-if="loaded" class="datatable-container" style="max-height: 600px">
      <table v-if="issues.length" class="table is-hoverable is-fullwidth">
        <tbody>
          <tr
            v-for="issue in issues"
            :key="issue.id"
            v-table-click="() => goToDetails(issue)"
            class="is-clickable"
          >
            <td style="max-width: 40px; min-width: 40px">
              <VAvatar
                class="cloud-avatar"
                :picture="`/assets/integrations/` + issue.provider + `.svg`"
                size="small"
              />
            </td>
            <td>
              <div class="double-line">
                <span class="dark-inverted">{{ issue.check_title }}</span
                ><span>{{ issue.identifier }}</span>
              </div>
            </td>
            <td>
              <div class="tag-wrap">
                <CloudScannerStatusBadge :status="issue.status" />
              </div>
            </td>
            <td>
              <div class="tag-wrap">
                <CloudScannerSeverityBadge :severity="issue.severity" />
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
          <p>No new findings found</p>
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
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import CloudScannerStatusBadge from '/@src/components/modules/cloud-scanner/widgets/CloudScannerStatusBadge.vue'
import CloudScannerSeverityBadge from '/@src/components/modules/cloud-scanner/widgets/CloudScannerSeverityBadge.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'

export default {
  components: {
    VAvatar,
    CloudScannerSeverityBadge,
    CloudScannerStatusBadge,
    VLoader,
  },
  mixins: [urlMixin],
  props: [
    'project',
    'workspace',
    'collection',
    'asset',
    'specificDate',
    'provider',
    'account',
    'region',
    'subscription',
    'cloudProject',
  ],
  data: () => ({
    loaded: false,
    issues: null,
  }),
  computed: {
    ...mapGetters(['general', 'module']),
  },
  watch: {
    specificDate() {
      this.getData()
    },
    provider() {
      this.getData()
    },
    account() {
      this.getData()
    },
    region() {
      this.getData()
    },
    subscription() {
      this.getData()
    },
    cloudProject() {
      this.getData()
    },
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    formatDate(inputDate) {
      if (!inputDate) {
        return ''
      }
      var parts = inputDate.split('-')
      return parts[2] + '.' + parts[1] + '.' + parts[0]
    },
    goToDetails(issue) {
      if (this.project) {
        this.$router.push({
          name: 'CyberExCloudDetailsView',
          params: { id: this.project.id },
          query: {
            q: issue.check_title,
            provider: this.provider,
            account_id: issue.account_id,
            region: this.region,
            subscription: issue.subscription,
            cloud_project: issue.cloud_project,
            date: this.specificDate,
          },
        })
      } else {
        this.$router.push({
          name: 'WorkspaceCyberExCloudDetailsView',
          params: { id: this.workspace.id },
          query: {
            q: issue.check_title,
            provider: this.provider,
            account_id: issue.account_id,
            region: this.region,
            subscription: issue.subscription,
            cloud_project: issue.cloud_project,
            date: this.specificDate,
          },
        })
      }
    },
    async getData() {
      await axios
        .get('/widget/asset-cloud-details/new-findings', {
          params: {
            provider: this.provider,
            account_id: this.account,
            region: this.region,
            subscription: this.subscription,
            cloud_project: this.cloudProject,
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            date: this.specificDate,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.loaded = true
          this.issues = res.data.data
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