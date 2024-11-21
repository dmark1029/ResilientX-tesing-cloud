<template>
  <div v-if="!loading">
    <div class="tile-grid-toolbar">
      <VControl icon="fa fa-search">
        <input
          v-model="search"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>

      <div v-if="canPerformAction('monitoring', 'create')" class="buttons">
        <button
          class="button v-button is-bold is-big is-raised is-primary btn-sm"
          style="flex: initial"
          @click="showModal = true"
        >
          Create monitoring
        </button>
      </div>
    </div>

    <div
      v-if="assetScheduledTasks.meta && assetScheduledTasks.meta.total"
      class="datatable-container"
    >
      <table class="table datatable-table is-fullwidth mb-0">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Type</th>
            <th>Timezone</th>
            <th v-if="!module">Security app</th>
            <th>Next run</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assetScheduledTasks.data" :key="item.id">
            <td>{{ item.schedulable.name }}</td>
            <td>
              {{ item.type_text }}: {{ item.time }}
              <span v-if="item.type === 'weeklyOn'"
                >on day {{ item.day_week }} of a week</span
              ><span v-if="item.type === 'monthlyOn'"
                >on day {{ item.day_month }} of a month</span
              >
            </td>
            <td>{{ item.timezone }}</td>
            <td v-if="!module">
              {{ item.module.name }}
            </td>
            <td>{{ item.next_run }}</td>
            <td class="text-end">
              <a
                :class="
                  canPerformAction('monitoring', 'delete')
                    ? 'btn btn-sm btn-outline-danger is-clickable'
                    : 'btn btn-sm btn-outline-danger is-disabled'
                "
                @click="deleteSchedule(item)"
                ><i class="fa fa-trash has-text-danger"
              /></a>
            </td>
          </tr>
        </tbody>
      </table>
      <!--end /table-->
    </div>
    <div v-else>
      <NoData :meta="assetScheduledTasks.meta" />
    </div>

    <div class="mt-3">
      <Pagination
        :data="assetScheduledTasks"
        :limit="1"
        @pagination-change-page="getData"
      />
    </div>

    <VModal
      is="div"
      :open="showModal"
      title="Create monitoring"
      size="big"
      @close="showModal = false"
    >
      <template #content>
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

          <div v-if="assets.meta && assets.meta.total" class="datatable-container">
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
                      class="button v-button is-bold is-big is-raised is-primary btn-sm"
                      :disabled="item.id === selected?.id"
                      @click="select(item)"
                    >
                      Select target
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No assets found</p>
          </div>

          <div class="mt-3">
            <Pagination :data="assets" :limit="1" @pagination-change-page="getData" />
          </div>
        </div>
        <div v-else-if="!filled">
          <div class="modal-body">
            <VTabs
              slider
              type="rounded"
              selected="basic"
              :tabs="[
                { label: 'Basic', value: 'basic' },
                { label: 'Advanced', value: 'advanced' },
              ]"
            >
              <template #tab="{ activeValue }">
                <div v-if="activeValue === 'basic'" class="mb-3">
                  <div v-if="!module" class="field">
                    <label class="label">Security app</label>
                    <div class="select">
                      <select v-model="form.module_id" class="form-select">
                        <option :value="undefined">Select app</option>
                        <option
                          v-for="module in general.modules"
                          :key="module.id"
                          :value="module.id"
                        >
                          {{ module.name }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="module_id" />
                  </div>
                  <div class="field">
                    <label class="label">Timezone</label>
                    <div class="select">
                      <select v-model="form.timezone" class="form-select">
                        <option :value="undefined">Select timezone</option>
                        <option
                          v-for="(value, index) in general.timezones"
                          :key="index"
                          :value="index"
                        >
                          {{ value }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="timezone" />
                  </div>
                  <div class="field">
                    <label class="label">Type</label>
                    <VField addons>
                      <VControl>
                        <VButton
                          icon="fas fa-calendar-day"
                          :color="form.type === 'dailyAt' ? 'primary' : ''"
                          @click="
                            () => {
                              form.type = 'dailyAt'
                              form.time = '12:00'
                            }
                          "
                          >Daily</VButton
                        >
                      </VControl>
                      <VControl>
                        <VButton
                          icon="fas fa-calendar-week"
                          :color="form.type === 'weeklyOn' ? 'primary' : ''"
                          @click="
                            () => {
                              form.type = 'weeklyOn'
                              form.day_week = 1
                              form.time = '12:00'
                            }
                          "
                          >Weekly</VButton
                        >
                      </VControl>
                      <VControl>
                        <VButton
                          icon="fas fa-calendar"
                          :color="form.type === 'monthlyOn' ? 'primary' : ''"
                          @click="
                            () => {
                              form.type = 'monthlyOn'
                              form.day_month = 1
                              form.time = '12:00'
                            }
                          "
                          >Monthly</VButton
                        >
                      </VControl>
                    </VField>
                  </div>
                </div>
                <div v-else-if="activeValue === 'advanced'" class="mb-3">
                  <div v-if="!module" class="field">
                    <label class="label">Security app</label>
                    <div class="select">
                      <select v-model="form.module_id" class="form-select">
                        <option :value="undefined">Select app</option>
                        <option
                          v-for="module in general.modules"
                          :key="module.id"
                          :value="module.id"
                        >
                          {{ module.name }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="module_id" />
                  </div>
                  <div class="field">
                    <label class="label">Timezone</label>
                    <div class="select">
                      <select v-model="form.timezone" class="form-select">
                        <option :value="undefined">Select timezone</option>
                        <option
                          v-for="(value, index) in general.timezones"
                          :key="index"
                          :value="index"
                        >
                          {{ value }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="timezone" />
                  </div>
                  <div class="field">
                    <label class="label">Type</label>
                    <div class="select">
                      <select v-model="form.type" class="form-select">
                        <option :value="undefined">Select type</option>
                        <option
                          v-for="(value, index) in general.schedules.types"
                          :key="index"
                          :value="index"
                        >
                          {{ value }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="type" />
                  </div>
                  <div class="field">
                    <label class="label">Time (17:30)</label>
                    <input
                      v-model="form.time"
                      type="text"
                      class="input v-input"
                      placeholder="Enter time in 24h format"
                    />
                    <HasError :form="form" field="time" />
                  </div>
                  <div v-if="form.type === 'weeklyOn'" class="field">
                    <label class="label">Day of a week (1-7)</label>
                    <input
                      v-model="form.day_week"
                      type="text"
                      class="input v-input"
                      placeholder="Enter day of a week."
                    />
                    <HasError :form="form" field="day_week" />
                  </div>
                  <div v-if="form.type === 'monthlyOn'" class="field">
                    <label class="label">Day of a month (1-31)</label>
                    <input
                      v-model="form.day_month"
                      type="text"
                      class="input v-input"
                      placeholder="Enter day of a month"
                    />
                    <HasError :form="form" field="day_month" />
                  </div>
                </div>
              </template>
            </VTabs>

            <div class="modal-card-foot">
              <a class="button v-button is-clickable" @click="selected = null">Back</a>
              <button
                class="button v-button is-bold is-big is-raised is-primary btn-sm"
                @click="fill()"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div v-else class="modal-body has-text-centered">
          <h5 class="title is-5 mt-5 mb-4">
            Scheduled scan by {{ module.name }} app on {{ selected.name }}
          </h5>
          <Component
            :is="component"
            v-if="component && module"
            :form="form"
            :project="project"
          />
          <button
            class="button v-button is-bold is-big is-raised is-primary mt-5 mb-3"
            @click="save"
          >
            Create now
          </button>
          <div class="mb-5">
            <a @click="filled = null">Back</a>
          </div>

          <div v-if="form.errors.any()" class="mt-3">
            <HasError :form="form" field="timezone" />
            <HasError :form="form" field="type" />
            <HasError :form="form" field="time" />
            <HasError :form="form" field="day_week" />
            <HasError :form="form" field="day_month" />
            <HasError :form="form" field="asset_id" />
            <HasError :form="form" field="license" />
          </div>

          <div class="terms-wrapper mb-5">
            <p class="pl-5 pr-5">
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
      </template>
    </VModal>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import Form from '/@src/form'
import { HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import { debounce } from 'vue-debounce'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import { defineAsyncComponent } from 'vue'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import _ from 'lodash'
import VControl from '/@src/components/base/form/VControl.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VField from '/@src/components/base/form/VField.vue'
import VButton from '/@src/components/base/button/VButton.vue'

export default {
  components: {
    VButton,
    VField,
    VTabs,
    VModal,
    Pagination,
    NoData,
    VControl,
    HasError,

    AreYouSureModal,
  },
  mixins: [permissionsMixin],
  props: ['project', 'module'],
  data: () => ({
    form: new Form({
      values: {},
    }),
    showModal: false,
    selected: null,
    filled: null,
    search: '',
    q: '',
    assets: [],
  }),
  computed: {
    ...mapGetters(['general', 'assetScheduledTasks', 'user', 'general', 'loading']),
    component() {
      return defineAsyncComponent(() => import(`./modules/${this.module.slug}.vue`))
    },
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
  },
  mounted() {
    this.$store.dispatch('showLoading')

    if (this.user.timezone) {
      this.form.timezone = this.user.timezone
    }

    if (this.project.id) {
      this.getData()
    }

    if (this.module) {
      this.form.module_id = this.module.id
    }

    this.searchAsset = debounce(() => {
      var url = `/asset?id=${this.project.id}&q=${this.q}`
      if (this.module) {
        url = `/asset?id=${this.project.id}&module_id=${this.module.id}&q=${this.q}`
      }
      axios
        .get(url)
        .then((res) => {
          this.$store.dispatch('hideLoading')
          this.assets = res.data
        })
        .catch(() => {})
    }, '500ms')

    this.searchAsset()
  },
  methods: {
    select(item) {
      this.selected = item
      this.form.schedulable_id = this.selected.id
      this.form.schedulable_type = this.selected.taskable_type
      this.form.errors.clear()
    },
    fill() {
      this.filled = true
      this.form.errors.clear()
    },
    getData(page = 1) {
      var url = `/schedule?project_id=${this.project.id}&page=${page}&q=${this.search}`
      if (this.module) {
        url = `/schedule?project_id=${this.project.id}&module_id=${this.module.id}&page=${page}&q=${this.search}`
      }
      axios
        .get(url)
        .then((res) => {
          this.$store.dispatch('addAssetScheduledTasks', res.data)
          this.$store.dispatch('hideLoading')
        })
        .catch(() => {})
    },
    save() {
      this.send()
        .then(() => {
          this.showModal = false
          this.getData()
        })
        .catch(() => {})
    },
    send() {
      var form = this.form.post('/schedule')

      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            const { data } = res.data
            this.filled = null
            this.selected = null
            resolve(data)
          })
          .catch(() => {
            reject()
          })
      })
    },
    async deleteSchedule(item) {
      let ok = false
      if (item.status === 'disabled') {
        ok = true
      } else {
        ok = await this.$refs.confirmDialogue.show({
          title: 'Confirmation',
          message: 'Are you sure you want to delete this item?',
          okButton: 'Yes',
          cancelButton: 'No',
        })
      }
      if (ok) {
        this.form.delete('/schedule/' + item.id).then(() => {
          this.getData()
        })
      }
    },
    handleChangeTag(tags) {
      this.form.tags = tags
    },
    closeModal() {
      this.showModal = false
    },
    openModal() {
      this.showModal = true
    },
  },
}
</script>
