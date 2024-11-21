<template>
  <div class="tile-grid-collections">
    <div v-if="asset.collections.length">
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div
          v-for="item in asset.collections.filter((item) => {
            return item.status === 'active'
          })"
          :key="item.id"
          class="column is-6"
        >
          <div
            :class="
              canPerformAction('collections', 'view')
                ? 'tile-grid-item'
                : 'tile-grid-item'
            "
            @click="navigateToCollection(item)"
          >
            <div class="tile-grid-item-inner">
              <div class="meta">
                <span class="dark-inverted mb-1">{{ item.name }}</span>
                <span>
                  <i
                    aria-hidden="true"
                    class="fas fa-circle icon-separator is-hidden-mobile"
                  />
                  <span class="is-hidden-mobile">{{ item.assets_count }} assets</span>
                </span>
              </div>
              <div class="right-menu">
                <div>
                  <VTag
                    v-if="item.status === 'active'"
                    color="success"
                    label="Active"
                    rounded
                  />
                  <VTag v-else color="danger" label="Archived" rounded />
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <NoData v-else :meta="{ total: 0 }"></NoData>
  </div>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VTag from '/@src/components/base/tags/VTag.vue'
import NoData from '/@src/components/NoData.vue'

export default {
  components: { NoData, VTag },
  mixins: [permissionsMixin],
  props: ['asset', 'project'],
  emits: ['editCollection'],
  methods: {
    navigateToCollection(item) {
      this.$router.push({
        name: 'VendorView',
        params: { asset: item.id },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.tile-grid-collections {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.tile-grid-collections {
  .tile-grid-item {
    @include vuero-s-card;

    border-radius: 14px;
    padding: 16px;
    cursor: pointer;

    &:hover,
    &:focus {
      border-color: var(--primary);
      box-shadow: var(--light-box-shadow);
    }

    .tile-grid-item-inner {
      display: flex;
      align-items: center;

      > img {
        display: block;
        width: 50px;
        height: 50px;
        min-width: 50px;
      }

      .meta {
        margin-inline-start: 10px;
        line-height: 1.4;

        span {
          display: block;
          font-family: var(--font);

          &:first-child {
            color: var(--dark-text);
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1rem;
          }

          &:nth-child(2) {
            display: flex;
            align-items: center;

            span {
              display: inline-block;
              color: var(--light-text);
              font-size: 0.8rem;
              font-weight: 400;
            }

            .icon-separator {
              position: relative;
              font-size: 4px;
              color: var(--light-text);
              padding: 0 6px;
            }
          }
        }
      }

      .right-menu {
        margin-inline-start: auto;
        display: flex;
        align-items: center;
        .favorite {
          margin-right: 12px;
        }
        .tag {
          margin-right: 12px;
        }
      }

      .dropdown {
        margin-inline-start: auto;
      }
    }
  }
}

.is-dark {
  .tile-grid-collections {
    .tile-grid-item {
      @include vuero-card--dark;
    }
  }

  .tile-grid-collections {
    .tile-grid-item {
      @include vuero-card--dark;

      &:hover,
      &:focus {
        border-color: var(--primary) !important;
      }
    }
  }
}
</style>
