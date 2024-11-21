<template>
  <div>
    <VModal
      is="form"
      :open="true"
      :title="editable ? `Edit asset group` : `Create asset group`"
      size="extra-large"
      actions="right"
      @submit.prevent="false"
      @close="$emit('closeModal')"
    >
      <template #content>
        <div class="modal-body wizard-v1-wrapper pt-0">
          <VProgress
            id="wizard-progress"
            class="wizard-progress"
            color="primary"
            size="smaller"
            style="position: absolute !important"
            :value="
              editable
                ? (currentStep / (totalSteps - 1)) * 100
                : (currentStep / totalSteps) * 100
            "
            :max="100"
          />

          <div
            v-if="currentStep === 1"
            id="wizard-step-1"
            class="inner-wrapper is-active"
          >
            <div class="step-content pt-5 pb-5">
              <div class="step-title">
                <h2 class="dark-inverted">What is the group name ?</h2>
                <p>Manage better by adding all relevant group information</p>
              </div>

              <form @submit.prevent="nextStep">
                <div class="project-info">
                  <div class="project-info-head">
                    <div class="project-info">
                      <div class="project-name">
                        <VField>
                          <VControl>
                            <VInput v-model="form.name" placeholder="Group name" />
                          </VControl>
                        </VField>
                      </div>
                    </div>
                  </div>
                  <div
                    class="columns is-justify-content-center is-align-items-center mt-5"
                  >
                    <div class="column is-5">
                      <div class="field">
                        <h1 class="label mb-5 has-text-centered">
                          {{ $t('Business impact') }}
                        </h1>
                        <div>
                          <div class="centered-drop">
                            <div
                              class="category-selector-inner is-flex is-justify-content-center is-align-items-center"
                            >
                              <div
                                v-for="(name, id) in general.assets.impacts"
                                :key="id"
                                :class="[
                                  'dropdown-option is-flex is-justify-content-start is-align-items-center mx-2 py-1 px-1 is-clickable',
                                  {
                                    scaled: selectedBusinessImpact === name ? '1.3' : '',
                                  },
                                ]"
                                :style="{
                                  border:
                                    selectedBusinessImpact === name
                                      ? '1px solid white'
                                      : '',
                                  borderRadius:
                                    selectedBusinessImpact === name ? '8px' : '',
                                  borderColor: 'var(--dark-dark-text)',
                                }"
                                @click="selectOption(name)"
                              >
                                <BusinessImpactBadge :impact="name" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <HasError :form="form" field="business_impact" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div
            v-if="currentStep === 2 && !loading"
            id="wizard-step-1"
            class="inner-wrapper is-active"
          >
            <div id="wizard-step-0" class="inner-wrapper is-active pt-0">
              <div class="step-content">
                <div class="step-title">
                  <h2 class="dark-inverted">What you want to monitor?</h2>
                </div>

                <div class="wizard-types">
                  <div class="columns is-multiline">
                    <template
                      v-for="monitor in monitors
                        .filter((m) => m.active)
                        .filter((m) => modules.includes(m.module))"
                      :key="monitor.slug"
                    >
                      <div class="column is-4">
                        <div
                          :class="[
                            form.monitors[monitor.slug]['on']
                              ? 'wizard-card active'
                              : 'wizard-card',
                          ]"
                        >
                          <h3 class="dark-inverted">{{ monitor.name }}</h3>
                          <p>{{ monitor.description }}</p>
                          <div class="button-wrap">
                            <VButton
                              v-model="form.monitors[monitor.slug]['on']"
                              color="primary"
                              class="type-select-button"
                              rounded
                              elevated
                              bold
                              @click="addMonitor(monitor)"
                            >
                              {{
                                form.monitors[monitor.slug]['on'] ? 'Unselect' : 'Select'
                              }}
                            </VButton>
                          </div>

                          <div v-if="form.monitors[monitor.slug]['on']" class="mt-5">
                            <component
                              :is="mapTypeComponents[monitor.slug]"
                              :form="form"
                              :workspace="workspace"
                              :project="project"
                              :values="form.monitors[monitor.slug]['values']"
                            />
                            <div class="select mt-3">
                              <select
                                v-model="form.monitors[monitor.slug]['schedule']"
                                class="input v-input"
                                @change="changedToCustom(form.monitors[monitor.slug])"
                              >
                                <option value="dailyAt">Daily</option>
                                <option value="weeklyOn">Weekly</option>
                                <option value="monthlyOn">Monthly</option>
                                <option value="quarterlyOn">Quarterly</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>

                            <!-- Custom Mode Selection -->
                            <div
                              v-if="form.monitors[monitor.slug]['schedule'] === 'custom'"
                              class="mt-3"
                            >
                              <label class="mb-2 is-block">Select Custom Mode:</label>
                              <div class="select">
                                <select
                                  v-model="form.monitors[monitor.slug]['customMode']"
                                  class="input v-input"
                                >
                                  <option value="noRepeat">No - Repeat</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">Quarterly</option>
                                </select>
                              </div>

                              <!-- No Repeat Fields -->
                              <div
                                v-if="
                                  form.monitors[monitor.slug]['customMode'] === 'noRepeat'
                                "
                                class="mt-3"
                              >
                                <div class="field">
                                  <label>Date and Time (next run):</label>
                                  <Datepicker
                                    v-model="
                                      form.monitors[monitor.slug]['customDateTime']
                                    "
                                    :lower-limit="new Date()"
                                    input-format="dd.MM.yyyy HH:mm"
                                    minimum-view="time"
                                    class="input v-input"
                                  />
                                </div>
                              </div>

                              <!-- Weekly Fields -->
                              <div
                                v-if="
                                  form.monitors[monitor.slug]['customMode'] === 'weekly'
                                "
                                class="mt-3"
                              >
                                <div class="field">
                                  <label>Date and Time (next run):</label>
                                  <Datepicker
                                    v-model="
                                      form.monitors[monitor.slug]['customDateTime']
                                    "
                                    :lower-limit="new Date()"
                                    input-format="dd.MM.yyyy HH:mm"
                                    minimum-view="time"
                                    class="input v-input"
                                  />
                                </div>
                                <div class="field">
                                  <label>Week Day Number:</label>
                                  <input
                                    v-model="form.monitors[monitor.slug]['customWeekDay']"
                                    type="number"
                                    class="input v-input"
                                    min="1"
                                    max="7"
                                  />
                                </div>
                              </div>

                              <!-- Monthly Fields -->
                              <div
                                v-if="
                                  form.monitors[monitor.slug]['customMode'] === 'monthly'
                                "
                                class="mt-3"
                              >
                                <div class="field">
                                  <label>Date and Time (next run):</label>
                                  <Datepicker
                                    v-model="
                                      form.monitors[monitor.slug]['customDateTime']
                                    "
                                    :lower-limit="new Date()"
                                    input-format="dd.MM.yyyy HH:mm"
                                    minimum-view="time"
                                    class="input v-input"
                                  />
                                </div>
                                <div class="field">
                                  <label>Day Number:</label>
                                  <input
                                    v-model="
                                      form.monitors[monitor.slug]['customDayNumber']
                                    "
                                    type="number"
                                    class="input v-input"
                                    min="1"
                                    max="31"
                                  />
                                </div>
                              </div>

                              <!-- Quarterly Fields -->
                              <div
                                v-if="
                                  form.monitors[monitor.slug]['customMode'] ===
                                  'quarterly'
                                "
                                class="mt-3"
                              >
                                <div class="field">
                                  <label>Date and Time (next run):</label>
                                  <Datepicker
                                    v-model="
                                      form.monitors[monitor.slug]['customDateTime']
                                    "
                                    :lower-limit="new Date()"
                                    input-format="dd.MM.yyyy HH:mm"
                                    minimum-view="time"
                                    class="input v-input"
                                  />
                                </div>
                                <div class="field">
                                  <label>Day Number:</label>
                                  <input
                                    v-model="
                                      form.monitors[monitor.slug]['customDayNumber']
                                    "
                                    type="number"
                                    class="input v-input"
                                    min="1"
                                    max="31"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="currentStep === 3 && !loading"
            id="wizard-step-1"
            class="inner-wrapper is-active"
          >
            <div class="step-content pt-5 pb-5">
              <div class="step-title">
                <h2 class="dark-inverted">What is the asset value ?</h2>
                <p>Enter your first asset so we can initialize scans</p>
              </div>

              <form @submit.prevent="nextStep">
                <div class="project-info">
                  <div class="project-info-head">
                    <div class="project-info">
                      <div class="project-name">
                        <VField>
                          <VControl>
                            <VInput v-model="form.assets" placeholder="Asset value" />
                          </VControl>
                        </VField>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              <div
                v-if="form.assets && form.assets.startsWith('http')"
                class="check-domain"
              >
                <p class="has-text-centered mt-5">You have entered URL.</p>
                <p class="mx-auto mb-5 has-text-centered">
                  Do you want to convert it to domain?
                </p>
                <div class="is-flex is-justify-content-center is-align-items-center">
                  <VButton
                    color="primary"
                    class="type-select-button"
                    rounded
                    elevated
                    bold
                    @click="() => convertToDomain(form.assets)"
                  >
                    Convert
                  </VButton>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="loading"
            id="wizard-step-1"
            style="min-height: 400px"
            class="inner-wrapper is-active"
          >
            <VLoader :active="true">
              <div style="height: 400px" />
            </VLoader>
          </div>
        </div>
        <div class="wizard-buttons is-active">
          <div v-if="!loading" class="wizard-buttons-inner">
            <VButton
              class="wizard-button-previous"
              :disabled="currentStep === 1"
              :color="currentStep === 1 ? 'light' : 'primary'"
              bold
              elevated
              @click="previousStep"
            >
              Previous
            </VButton>
            <VButton
              type="submit"
              class="wizard-button-previous"
              :color="currentStep <= totalSteps ? 'primary' : 'light'"
              bold
              elevated
              @click="nextStep"
            >
              {{
                currentStep !== 3 ? 'Next' : !form.assets ? 'Skip & Complete' : 'Complete'
              }}
            </VButton>
          </div>
        </div>
      </template>
      <template #action>
        <VButton type="submit" color="primary" raised> Publish </VButton>
      </template>
    </VModal>
    <div>
      <div
        id="bd-example-modal-xl"
        class="modal fade show bd-example-modal-xl"
        style="display: block"
      >
        <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h6 id="myExtraLargeModalLabel" class="modal-title m-0">
                {{ $t('Create asset') }}
              </h6>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
                @click="$emit('closeModal')"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" />
    </div>
    <div v-if="showModal">
      <AssetsModal :project="project" @closeModal="hideModal" />
    </div>
  </div>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import { defineAsyncComponent } from 'vue'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import BusinessImpactBadge from '/@src/components/assets/BusinessImpactBadge.vue'
import Datepicker from 'vue3-datepicker'

export default {
  components: {
    AssetsModal: defineAsyncComponent(
      () => import('/@src/components/assets/AssetsModal.vue')
    ),
    VButton,
    VModal,
    FormButton,
    HasError,
    Datepicker,
    VField,
    VControl,
    VInput,
    VProgress,
    VLoader,
    BusinessImpactBadge,
  },
  props: ['editable', 'project'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    mapTypeComponents: {},
    monitors: [],
    set: false,
    showModal: false,
    q: '',
    watchTaskDelay: 4000,
    loading: false,
    currentStep: 1,
    totalSteps: 3,
    modules: [],
    selectedBusinessImpact: '',
    collectionId: '',
    processing: false,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  async mounted() {
    window.addEventListener('keydown', this.handleKeyPress)
    this.monitors = this.general.monitors.filter((m) => {
      if (this.workspace?.activeLicense?.show_unlicensed) {
        return true
      } else {
        return this.workspace?.activeLicense?.modules
          .map((module) => module.slug)
          .includes(m.module)
      }
    })
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.assets = this.editable.assets
      this.form.monitors = {}
      this.form.status = this.editable.status
      this.form.business_impact = this.editable.business_impact
      this.selectedBusinessImpact = this.editable.business_impact
      this.general.monitors.forEach((tool) => {
        const existing = this.editable.schedules.find(
          (item) => item.monitor === tool.slug
        )

        let values = existing ? existing.values : {}

        if (!values.length && Array.isArray(values)) {
          values = {}
        }

        this.form.monitors[tool.slug] = {
          on: !!existing,
          schedule: existing ? existing.type : 'weeklyOn',
          values: values,
          customWeekDay: existing?.custom?.weekDay,
          customDayNumber: existing?.custom?.dayNumber,
          customMode: existing?.custom?.mode,
          customDateTime: existing?.next_run ? new Date(existing.next_run) : null,
        }
        this.mapTypeComponents[tool.slug] = defineAsyncComponent(
          () => import(`../tasks/modules/${tool.slug}.vue`)
        )
      })
    } else {
      this.form.name = ''
      this.form.project_id = this.project.id
      this.form.monitors = {}
      this.form.assets = null
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'
      this.selectedBusinessImpact = 'Moderate'

      this.general.monitors.forEach((tool) => {
        this.form.monitors[tool.slug] = {
          on: false,
          schedule: 'weeklyOn',
          values: {},
        }

        this.mapTypeComponents[tool.slug] = defineAsyncComponent(
          () => import(`../tasks/modules/${tool.slug}.vue`)
        )
      })
    }
    this.set = true
    if (this.workspace?.activeLicense?.show_unlicensed) {
      this.modules = this.workspace?.activeLicense?.modules
    } else {
      this.modules = this.workspace?.activeLicense?.modules.map((module) => module.slug)
    }
    if (!this.modules) {
      this.modules = []
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress)
  },
  methods: {
    async save() {
      this.loading = true
      await this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    changedToCustom(monitor) {
      if (monitor.schedule === 'custom') {
        monitor.customDateTime = new Date()
        monitor.customMode = 'weekly'
        monitor.customWeekDay = 1
      } else {
        monitor.customWeekDay = null
        monitor.customDayNumber = null
        monitor.customDateTime = null
        monitor.customMode = null
      }
    },
    selectOption(name) {
      this.selectedBusinessImpact = name
      this.form.business_impact = name
    },
    convertToDomain(url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }
      const parsedUrl = new URL(url)
      let domain = parsedUrl.hostname
      domain = domain.replace(/\/$/, '')
      this.form.assets = domain
    },
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/collection/' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/collection')
      }
      return new Promise((resolve, reject) => {
        form
          .then(async (res) => {
            const { data } = res.data
            this.collectionId = res.data.data?.id
            if (this.form.assets) {
              try {
                await this.saveAsset()
              } catch (e) {}
            }
            resolve(data)
          })
          .catch(() => {
            reject()
          })
      })
    },
    hideModal() {
      this.showModal = false
      this.search()
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    async nextStep() {
      this.processing = true
      if (this.currentStep === 1 && !this.form.name) {
        this.$store.dispatch('addAlert', {
          text: 'Please enter group name',
          type: 'danger',
        })
        this.processing = false
        return
      }
      if (this.currentStep === 1 && !this.form.business_impact) {
        this.$store.dispatch('addAlert', {
          text: 'Please select business impact',
          type: 'danger',
        })
        this.processing = false
        return
      }

      if (this.editable && this.currentStep === 2) {
        await this.save()
        this.processing = false
        return
      }
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      } else {
        await this.save()
      }
      this.processing = false
    },
    addMonitor(monitor) {
      this.form.monitors[monitor.slug]['on'] = !this.form.monitors[monitor.slug]['on']
    },
    saveAsset() {
      return new Promise((resolve, reject) => {
        new Form({
          collection_id: this.collectionId,
          value: this.form.assets,
          business_impact: this.form.business_impact,
          project_id: this.form.project_id,
        })
          .post('/asset/multiple')
          .then((res) => {
            if (res.data.success) {
              this.loading = false
            }
            resolve(res.data)
          })
          .catch(() => {
            this.$store.dispatch('addAlert', {
              text: 'Error creating asset',
              type: 'danger',
            })
            reject()
          })
      })
    },
    handleKeyPress(event) {
      if (event.key === 'Enter' && !this.processing) {
        this.nextStep()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.wizard-card {
  height: 100%;
}
.check-domain {
  .button {
    min-width: 140px;
  }
}
.dopdown-back {
  background: var(--dark-table-color) !important;
}
.scaled {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
</style>