<template>
  <div>
    <VLoader v-if="!loaded" :active="true">
      <div style="height: 100px" />
    </VLoader>
    <div v-else>
      <div class="app-search mb-3" style="width: 50%">
        <form role="search" @submit.prevent="searchAssets">
          <input
            v-model="q"
            type="search"
            name="search"
            class="input v-input top-search mb-0"
            placeholder="Search for assets.."
            @paste="searchAssets"
            @input="searchAssets"
          />
        </form>
      </div>

      <!--Tile Grid v1-->
      <TransitionGroup name="list" tag="div">
        <div class="datatable-container">
          <table class="table datatable-table is-fullwidth">
            <thead>
              <tr>
                <th style="vertical-align: middle">
                  <div class="is-pulled-left">
                    <VControl v-if="!savingBulk">
                      <VSwitchSegment
                        color="success"
                        :disabled="savingBulk"
                        :model-value="isAllCheckedValue"
                        @update:modelValue="
                          async (value) => {
                            await bulkSave(value)
                          }
                        "
                      />
                    </VControl>
                  </div>
                  <span
                    v-if="savingBulk"
                    style="position: absolute; left: 69px; top: 20px"
                  >
                    <i class="fa fa-spinner fa-spin has-text-info" />
                  </span>
                  <span style="line-height: 25px">Asset</span>
                </th>
                <th style="vertical-align: middle">Type</th>
                <th style="vertical-align: middle">Scanned</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="items?.meta?.total">
                <tr v-for="itemAsset in items.data" :key="itemAsset.id">
                  <td>
                    <div class="is-pulled-left">
                      <VControl>
                        <VSwitchSegment
                          color="success"
                          :model-value="isChecked(itemAsset)"
                          @update:modelValue="
                            (value) => {
                              if (value) {
                                addAssetToCollection(collection.id, itemAsset.id)
                              } else {
                                removeAssetFromCollection(collection.id, itemAsset.id)
                              }
                            }
                          "
                        />
                      </VControl>
                    </div>
                    <router-link
                      :to="{
                        name: 'ProjectAssetView',
                        params: { id: itemAsset.project_id, asset: itemAsset.id },
                      }"
                      >{{ itemAsset.value }}</router-link
                    >
                  </td>
                  <td class="text-capitalize">
                    {{ itemAsset.type_text }}
                  </td>
                  <td class="text-end">
                    {{ itemAsset.scanned_date_text }}
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="7" class="has-text-left">No assets in collection</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </TransitionGroup>

      <Pagination
        :limit="5"
        :data="items"
        :per-page="limit"
        @pagination-change-page="getAssets"
        @per-page-change="
          (perPage) => {
            $store.dispatch('addLimit', perPage)
            getAssets()
          }
        "
      />
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { debounce } from 'vue-debounce'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VSwitchSegment from '/@src/components/base/form/VSwitchSegment.vue'
import { mapGetters } from 'vuex'

export default {
  components: { VSwitchSegment, VControl, Pagination, VLoader },
  mixins: [permissionsMixin],
  props: ['collection', 'noData'],
  data: () => ({
    items: [],
    found: [],
    page: 1,
    q: '',
    loaded: false,
    savingBulk: false,
    isAllCheckedValue: false,
    forceUnchecked: false,
    forceChecked: false,
  }),
  computed: {
    ...mapGetters(['limit']),
  },
  watch: {
    'items.data': {
      deep: true,
      handler(newValue) {
        this.isAllChecked(newValue)
      },
    },
  },
  async mounted() {
    this.searchAssets = debounce(() => {
      this.getAssets()
    }, '500ms')

    await this.getAssets()
  },
  methods: {
    async bulkSave(value) {
      this.savingBulk = true
      if (value) {
        const promises = []
        for (const asset of this.items.data) {
          if (!this.isChecked(asset, false)) {
            promises.push(this.addAssetToCollection(this.collection.id, asset.id, false))
          }
        }
        this.forceChecked = true
        await Promise.all(promises)
        this.forceChecked = false
        await this.getAssets(this.page, true)
      } else {
        const promises = []
        for (const asset of this.items.data) {
          if (this.isChecked(asset, false)) {
            promises.push(
              this.removeAssetFromCollection(this.collection.id, asset.id, false)
            )
          }
        }

        this.forceUnchecked = true
        await Promise.all(promises)
        this.forceUnchecked = false
        await this.getAssets(this.page ? this.page - 1 : this.page, true)
      }

      this.savingBulk = false
    },
    isAllChecked(items) {
      this.isAllCheckedValue = true
      if (!items) {
        this.isAllCheckedValue = false
      }
      if (!items.length) {
        this.isAllCheckedValue = false
      }
      items.forEach((item) => {
        if (!this.isChecked(item)) {
          this.isAllCheckedValue = false
        }
      })
    },
    isChecked(asset, checkForced = true) {
      if (checkForced) {
        if (this.forceUnchecked) {
          return false
        }
        if (this.forceChecked) {
          return true
        }
      }
      if (!asset.collections) {
        return false
      }
      return !!asset.collections.find((item) => item.id === this.collection.id)
    },
    async getAssets(page = 1) {
      this.page = page

      let url = `/asset?q=${this.q}&id=${this.collection.project_id}&status=active&sort=collection:${this.collection.id}&page=${page}&limit=${this.limit}`

      if (!this.q) {
        url = `/collection/${this.collection.id}/assets?page=${page}&limit=${this.limit}`
      }

      return axios
        .get(url)
        .then((res) => {
          this.items = res.data
          this.loaded = true
        })
        .catch(() => {})
    },
    async removeAssetFromCollection(collectionId, assetId, refresh = true) {
      return axios
        .delete(`/collection/${collectionId}/assets/${assetId}`)
        .then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.collection.assets_count = this.collection.assets_count - 1
          if (refresh) {
            this.getAssets(this.page)
          }
        })
        .catch(() => {})
    },
    async addAssetToCollection(collectionId, assetId, refresh = true) {
      return axios
        .post(`/collection/${collectionId}/assets/${assetId}`)
        .then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.collection.assets_count = this.collection.assets_count + 1
          if (refresh) {
            this.getAssets(this.page)
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}
.asset-filters {
  display: flex;
  align-self: center;
}
@media only screen and (width <= 767px) {
  .tile-grid-toolbar.assets {
    position: relative;
    margin-bottom: 60px;
  }
  .asset-filters {
    position: absolute;
    top: 52px;
    width: 100%;
  }
}
</style>