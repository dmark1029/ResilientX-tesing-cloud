<template>
  <VModal
    is="div"
    :open="true"
    :title="
      asset.taskable_type === 'asset'
        ? 'Start new scan on selected asset'
        : 'Start new scan on selected collection'
    "
    size="big"
    @close="closeModal"
  >
    <template #content>
      <div class="modal-content">
        <div v-if="!selected" class="modal-body">
          <div class="app-search mb-3">
            <form role="search" @submit.prevent="searchAsset">
              <input
                v-model="q"
                type="search"
                name="search"
                class="input v-input top-search mb-0"
                placeholder="Type text to search..."
              />
            </form>
          </div>

          <div v-if="assets.meta && assets.meta.total">
            <div class="datatable-container">
              <table class="table datatable-table is-fullwidth mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in assets.data" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td class="text-end">
                      <button
                        type="button"
                        :class="[
                          item.id === selected?.id
                            ? 'button v-button is-bold is-big is-raised is-primary btn-sm'
                            : 'button v-button',
                        ]"
                        :disabled="item.id === selected?.id"
                        @click="select(item)"
                      >
                        <i
                          :class="[
                            item.id === selected?.id
                              ? 'mdi mdi-checkbox-marked'
                              : 'mdi mdi-checkbox-blank-outline',
                          ]"
                        />
                        Select asset
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="mt-3">
              <Pagination
                :data="assets"
                :limit="1"
                @pagination-change-page="searchAsset"
              />
            </div>
          </div>
          <div v-else>
            <p>No assets found</p>
          </div>
        </div>
        <div v-else-if="!selectedModule" class="modal-body">
          <div class="datatable-container">
            <table class="table datatable-table is-fullwidth mb-0">
              <thead>
                <tr>
                  <th>Security app</th>
                  <th v-if="asset.taskable_type === 'asset'">Group</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in getModules(selected)" :key="item.id">
                  <td>
                    {{ item.name }}
                  </td>
                  <td v-if="asset.taskable_type === 'asset'">
                    <div v-if="item.slug === 'exposure'" class="select">
                      <select v-model="form.collection_id" class="form-select">
                        <option
                          v-for="collection in asset.collections"
                          :key="collection.id"
                          :value="collection.id"
                        >
                          {{ collection.name }}
                        </option>
                      </select>
                    </div>
                    <div v-else>-</div>
                  </td>
                  <td class="text-end">
                    <button
                      type="button"
                      :class="[
                        item.id === selected?.id
                          ? 'button v-button is-bold is-big is-raised is-primary btn-sm'
                          : 'button v-button',
                      ]"
                      :disabled="item.id === selected?.id"
                      @click="selectModule(item)"
                    >
                      Select app
                    </button>
                  </td>
                </tr>
                <tr v-if="!getModules(selected).length">
                  <td colspan="3" class="has-text-left">No security apps available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="modal-body has-text-centered">
          <h5 class="mt-5 mb-4">
            Run {{ selectedModule.name }} security app on {{ selected.name }}
          </h5>

          <Component
            :is="component"
            v-if="component && selectedModule"
            :key="selectedModule.slug"
            :form="form"
            :values="form.values"
            :asset="asset"
            :project="project"
          />

          <button
            :class="
              form.busy
                ? 'button v-button is-bold is-big is-raised is-primary is-disabled'
                : 'button v-button is-bold is-big is-raised is-primary'
            "
            @click="save"
          >
            Start scan now
          </button>

          <div v-if="form.errors.any()" class="mt-3">
            <HasError :form="form" field="asset_id" />
            <HasError :form="form" field="license" />
            <HasError :form="form" field="tasks_limit" />
          </div>
          <div class="mt-4 mb-5">
            <a class="d-inline-block is-clickable" @click="goBack">Back</a>
          </div>
          <div class="terms-wrapper mb-5">
            <p>
              I accept responsibility and declare that I'm authorized for running the
              chosen scan on this target and accept
              {{ general.settings.title }}
              <a
                href="https://resilientx.com/terms-and-conditions"
                target="_blank"
                class=""
                >Terms and Conditions</a
              >.
            </p>
          </div>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import { debounce } from 'vue-debounce'
import VModal from '/@src/components/base/modal/VModal.vue'
import Pagination from '/@src/components/Pagination.vue'
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    Pagination,
    VModal,
    HasError,
  },
  props: ['project', 'module', 'asset'],
  emits: ['success', 'close'],
  data: () => ({
    form: new Form({
      values: {},
    }),
    component: null,
    assets: [],
    editable: null,
    loading: false,
    selected: null,
    selectedModule: null,
    q: '',
    watchTaskDelay: 4000,
  }),
  computed: {
    ...mapGetters(['general', 'assetTasks', 'workspace']),
  },
  watch: {
    selectedModule: {
      immediate: true,
      handler(newModule) {
        if (newModule && newModule.slug) {
          this.component = defineAsyncComponent(
            () => import(`./modules/${newModule.slug}.vue`)
          )
        } else {
          this.component = null
        }
      },
    },
  },
  mounted() {
    this.loading = true

    if (this.module) {
      this.selectedModule = this.module
      this.form.module_id = this.module.id
    }

    if (this.asset.taskable_type === 'asset') {
      this.form.collection_id = this.asset.collections[0].id
    }

    if (this.asset) {
      this.select(this.asset)
    } else {
      this.searchAsset = debounce((page = 1) => {
        let url
        if (this.selectedModule) {
          url = `/asset?id=${this.project.id}&module_id=${this.selectedModule.id}&q=${this.q}&status=active&page=${page}`
        } else {
          url = `/asset?id=${this.project.id}&q=${this.q}&status=active&page=${page}`
        }
        axios
          .get(url)
          .then((res) => {
            this.loading = false
            this.assets = res.data
          })
          .catch(() => {})
      }, '500ms')

      this.searchAsset()
    }
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    getModules(selected) {
      if (selected.taskable_type === 'asset') {
        return this.general.monitors
          .filter((m) => {
            let wk = null
            if (this.workspace) {
              wk = this.workspace
            }
            if (this.project) {
              wk = this.project.workspace
            }
            if (wk?.activeLicense?.show_unlicensed) {
              return true
            } else {
              return wk?.activeLicense?.modules
                .map((module) => module.slug)
                .includes(m.module)
            }
          })
          .filter(function (value) {
            if (value.slug === 'exposure') {
              return value.assets.includes(selected.type) && !selected.private_network
            }
            if (value.slug === 'network-scanner-external') {
              return value.assets.includes(selected.type) && !selected.private_network
            }
            if (value.slug === 'application-scanner') {
              return value.assets.includes(selected.type) && !selected.private_network
            }
            return value.assets.includes(selected.type)
          })
      } else {
        return this.general.monitors.filter((m) => {
          let wk = null
          if (this.workspace) {
            wk = this.workspace
          }
          if (this.project) {
            wk = this.project.workspace
          }
          if (wk?.activeLicense?.show_unlicensed) {
            return true
          } else {
            return wk?.activeLicense?.modules
              .map((module) => module.slug)
              .includes(m.module)
          }
        })
      }
    },
    select(item) {
      this.selected = item
      if (item.taskable_type === 'asset') {
        this.form.asset_id = this.selected.id
      }
      if (item.taskable_type === 'collection') {
        this.form.collection_id = this.selected.id
      }
      this.form.errors.clear()
    },
    selectModule(module) {
      this.selectedModule = module
      this.form.monitor = module.slug
    },
    async save() {
      return await this.send()
        .then(() => {
          this.closeModal()
        })
        .catch(() => {})
    },
    goBack() {
      if (this.asset) {
        this.selectedModule = null
      } else {
        this.selected = null
        this.component = null
      }
    },
    closeModal() {
      this.selected = null
      this.selectedModule = null
      this.form.taskable_id = null
      this.form.taskable_type = null
      this.form.module_id = null
      this.form.collection_id = null

      this.$emit('close')
    },
    openModal() {},
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/task/monitor' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/task/monitor')
      }

      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            if (res.data.success) {
              this.$store.dispatch('addAlert', {
                text: 'Scans launched',
                type: 'success',
              })
            } else {
              this.$store.dispatch('addAlert', {
                text: 'Error launching scans, asset already scanned today',
                type: 'danger',
              })
            }

            resolve(res.data)
          })
          .catch((e) => {
            reject()
          })
      })
    },
  },
}
</script>
