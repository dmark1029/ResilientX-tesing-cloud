<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Top 10 Asset In Risk</h3>
    </div>
    <div v-if="loaded" class="active-team pb-0">
      <ul v-if="assets.length" class="user-list">
        <li v-for="asset in assets" :key="asset.id">
          <div>
            <div
              class="v-icon is-rounded"
              :style="`background: ` + getModule(asset)?.color"
            >
              <i aria-hidden="true" :class="getModule(asset)?.icon" />
            </div>
          </div>
          <div class="user-list-info">
            <div class="name dark-inverted">{{ asset.value }}.</div>
            <div class="position">
              On {{ asset.issues }} Issues, {{ asset.vulnerabilities }} CVEs
            </div>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li>
          <p>No risks found</p>
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
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VLoader },
  props: ['project', 'collection', 'asset'],
  data: () => ({
    loaded: false,
    assets: null,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await axios
      .get('/widget/asset-in-risk', {
        params: {
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.assets = res.data.data
      })
  },
  methods: {
    getModule() {
      let found
      this.general.modules.forEach((m) => {
        if (m.slug === 'cyber-ex') {
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