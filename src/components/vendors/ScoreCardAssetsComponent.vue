<template>
  <div>
    <VLoader v-if="!loaded" :active="true">
      <div style="height: 100px" />
    </VLoader>
    <div v-else>
      <form role="search" @submit.prevent="save">
        <div class="field">
          <label class="label">{{ $t('Name') }}</label>
          <input
            v-model="form.name"
            type="text"
            class="input v-input"
            placeholder="Enter scorecard name"
          />
          <HasError :form="form" field="name" />
        </div>

        <button class="button v-button is-primary" :disabled="form.busy">
          {{ $t('Save') }}
        </button>
      </form>

      <div v-if="managedCard">
        <hr />

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
            <HasError :form="formAsset" field="value" />
          </form>
        </div>

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="items?.meta?.total" class="datatable-container">
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
                                addAssetToCollection(managedCard.id, itemAsset.id)
                              } else {
                                removeAssetFromCollection(managedCard.id, itemAsset.id)
                              }
                            }
                          "
                        />
                      </VControl>
                    </div>
                    <span>{{ itemAsset.value }}</span>
                  </td>
                  <td class="text-capitalize">
                    {{ itemAsset.type_text }}
                  </td>
                  <td class="text-end">
                    {{ itemAsset.scanned_date_text }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p v-if="q" class="mb-3">Asset "{{ q }}" not found</p>
            <form @submit.prevent="addAsset">
              <button class="button v-button is-primary" :disabled="formAsset.busy">
                <span class="icon">
                  <i aria-hidden="true" class="fas fa-plus" />
                </span>
                <span>Add</span>
              </button>
            </form>
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
import Form from '/@src/form'
import { HasError } from 'vform/src/components/bootstrap5'

export default {
  components: { VSwitchSegment, VControl, Pagination, VLoader, HasError },
  mixins: [permissionsMixin],
  props: ['collection', 'card'],
  emits: ['edit'],
  data: () => ({
    form: new Form({}),
    formAsset: new Form({}),
    managedCard: null,
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
    ...mapGetters(['limit', 'workspace']),
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
    if (this.card) {
      this.managedCard = this.card
      this.form.name = this.card.name
    }
    this.searchAssets = debounce(() => {
      this.getAssets()
    }, '500ms')

    await this.getAssets()
  },
  methods: {
    addAsset() {
      this.formAsset.value = this.q

      this.formAsset
        .post(`/scorecard/${this.managedCard.id}/add-asset`)
        .then(async () => {
          this.q = ''
          await this.getAssets()
        })
        .catch(() => {
          this.$store.dispatch('addAlert', {
            text: 'Error occurred.',
            type: 'danger',
          })
        })
    },
    save() {
      if (this.managedCard) {
        this.form
          .put(`/scorecard/${this.managedCard.id}`)
          .then(() => {
            this.$emit('edit', this.managedCard)
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error occurred.',
              type: 'danger',
            })
          })
      } else {
        this.form.workspace_id = this.workspace.id
        this.form.vendor_id = this.collection.id
        this.form
          .post(`/scorecard`)
          .then((res) => {
            this.managedCard = res.data.data
            this.$emit('edit', this.managedCard)
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error occurred.',
              type: 'danger',
            })
          })
      }

      if (this.managedCard) {
        axios
          .post(`/scorecard/${this.managedCard.id}/sync`)
          .then(() => {})
          .catch(() => {})
      }
    },
    async bulkSave(value) {
      this.savingBulk = true
      if (value) {
        const promises = []
        for (const asset of this.items.data) {
          if (!this.isChecked(asset, false)) {
            promises.push(this.addAssetToCollection(this.managedCard.id, asset.id, false))
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
              this.removeAssetFromCollection(this.managedCard.id, asset.id, false)
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
      return !!asset.collections.find((item) => item.id === this.managedCard.id)
    },
    async getAssets(page = 1) {
      if (!this.managedCard) {
        this.loaded = true
        return
      }

      this.page = page

      let url = `/collection/${this.collection.id}/assets?q=${this.q}&status=active&sort=collection:${this.managedCard.id}&page=${page}&limit=${this.limit}`

      if (!this.q) {
        url = `/collection/${this.managedCard.id}/assets?page=${page}&limit=${this.limit}`
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
            this.save()
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
            this.save()
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