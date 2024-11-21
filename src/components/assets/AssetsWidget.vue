<template>
  <div v-if="overview?.assets?.length" class="dashboard-list">
    <div class="dashboard-title">
      <div class="left">
        <h2 class="dark-inverted">Assets</h2>
        <p class="h-hidden-mobile">Your latest / favorite assets</p>
      </div>
      <div class="right">
        <!--				<a-->
        <!--					class="action-link"-->
        <!--					tabindex="0"-->
        <!--				>View All</a>-->
      </div>
    </div>
    <div class="inner-list">
      <VTabs
        slider
        type="rounded"
        selected="latest"
        :tabs="[
          { label: 'Latest', value: 'latest' },
          { label: 'Favorite', value: 'favorite' },
        ]"
        @update:selected="
          (value) => {
            assetsTab = value
          }
        "
      >
        <template #tab="">
          <div v-if="assetsTab === 'latest'" id="latest">
            <div>
              <VBlock
                v-for="item in overview.assets"
                :key="item.id"
                :title="item.name"
                :subtitle="item.type_text"
                center
              >
                <template #action>
                  <FavoriteComponent
                    :id="item.id"
                    type="asset"
                    :value="item.favorite"
                    class="mr-3"
                    @saved="getOverview"
                  />
                  <AssetStatusBadge
                    :status="item.priority"
                    class="mr-3 is-hidden-mobile"
                  />
                  <router-link
                    :to="{
                      name: 'ProjectAssetView',
                      params: { id: project.id, asset: item.id },
                    }"
                    class="is-hidden-mobile"
                  >
                    <VIconButton
                      icon="fa fa-arrow-right"
                      circle
                      dark-outlined
                      class="rtl-reflect"
                    />
                  </router-link>
                </template>
              </VBlock>
            </div>
          </div>
          <div v-if="assetsTab === 'favorite'" id="favorites">
            <div v-if="overview.favorites.length">
              <VBlock
                v-for="item in overview.favorites"
                :key="item.id"
                :title="item.name"
                :subtitle="item.type_text"
                center
              >
                <template #action>
                  <FavoriteComponent
                    :id="item.id"
                    type="asset"
                    :value="item.favorite"
                    class="mr-3"
                    @saved="getOverview"
                  />
                  <AssetStatusBadge :status="item.priority" class="mr-3" />
                  <router-link
                    :to="{
                      name: 'ProjectAssetView',
                      params: { id: project.id, asset: item.id },
                    }"
                  >
                    <VIconButton
                      icon="fa fa-arrow-right"
                      circle
                      dark-outlined
                      class="rtl-reflect"
                    />
                  </router-link>
                </template>
              </VBlock>
            </div>
            <div v-else>
              <p>No assets found</p>
            </div>
          </div>
        </template>
      </VTabs>
    </div>
  </div>
</template>

<script>
import permissionsMixin from '../../mixins/permissionsMixin.js'
import { mapGetters } from 'vuex'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VBlock from '/@src/components/base/block/VBlock.vue'
import FavoriteComponent from '/@src/components/favorites/FavoriteComponent.vue'
import AssetStatusBadge from '/@src/components/assets/AssetStatusBadge.vue'
import VIconButton from '/@src/components/base/button/VIconButton.vue'

export default {
  components: {
    VIconButton,
    AssetStatusBadge,
    FavoriteComponent,
    VBlock,
    VTabs,
  },
  mixins: [permissionsMixin],
  props: ['overview'],
  emits: ['getOverview'],
  data: () => ({
    assetsTab: 'latest',
  }),
  computed: {
    ...mapGetters(['project']),
  },
  methods: {
    getOverview() {
      this.$emit('getOverview')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.dashboard-list {
  position: relative;
  .tabs-inner {
    position: absolute;
    top: 11px;
    right: 0;
    min-width: 185px;
  }
  .inner-list {
    .media-flex-center {
      @include vuero-l-card;

      display: flex;
      padding: 12px;
      max-height: 66px;

      &:hover,
      &:focus {
        .flex-end {
          .rating {
            opacity: 1;
          }
        }
      }

      .flex-meta {
        max-width: 160px;
        width: 100%;
      }

      .flex-end {
        .rating {
          padding: 0 20px;
          opacity: 0;
          transition: all 0.3s; // transition-all test

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

.dashboard-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-family: var(--font);

  &.is-main {
    margin-bottom: 30px;

    h2 {
      font-size: 1.8rem;
    }
  }

  h2 {
    font-family: var(--font-alt);
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--dark-text);
  }
}

.is-dark {
  .long-card {
    @include vuero-card--dark;
  }

  .dashboard-list {
    .inner-list {
      .media-flex-center {
        @include vuero-card--dark;
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .dashboard-list .tabs-inner {
    position: absolute;
    top: -5px;
    right: 0;
    min-width: 185px;
  }
}
</style>