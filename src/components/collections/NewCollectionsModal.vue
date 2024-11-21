<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="dialog"
      class="add-group-modal"
      max-width="1280"
      persistent
      @close="$emit('closeModal')"
    >
      <v-card
        :class="
          isComplete
            ? 'complete'
            : step === 1 && monitors.length > 6
              ? 'columns-large'
              : 'columns'
        "
      >
        <div
          class="modal-header is-flex is-align-items-center is-justify-content-space-between"
        >
          <div class="is-flex column is-one-quarter">
            <img
              src="/images/icons/navbar/vuesax_linear_arrow-left.svg"
              class="add-group-back"
              alt="back"
              :style="{ cursor: isCompleteStep ? 'not-allowed' : 'pointer' }"
              @click="stepBack"
            />
            <p class="create-group v-label">
              {{ editable ? 'Edit' : 'Create a' }} asset group
            </p>
          </div>
          <div class="close-modal column is-three-quarters">
            <img
              src="/images/icons/navbar/vuesax_linear_close-circle.svg"
              class="group-close"
              alt="arrow-right"
              @click="$emit('closeModal')"
            />
          </div>
        </div>

        <div class="modal-body is-relative">
          <VProgress
            id="wizard-progress"
            class="wizard-progress"
            color="primary"
            size="smaller"
            style="position: absolute !important"
            :value="editable ? (step / 2) * 100 : (step / 3) * 100"
            :max="100"
          />
          <transition name="fade-slow" mode="out-in">
            <div :key="step">
              <div v-if="step === 0" class="asset-group">
                <p class="v-label">Asset group</p>
                <p class="v-label mt-2">
                  An asset group is a collection of assets that facilitates the organized
                  and consolidated viewing of aggregated findings across multiple assets.
                </p>
              </div>

              <div v-if="step === 1" class="asset-group">
                <p class="v-label">Which monitoring features should be enabled?</p>
                <p class="v-label mt-2">
                  Select the monitors for the specific activities or threats you wish to
                  oversee.
                </p>
              </div>
            </div>
          </transition>

          <transition name="fade-slow" mode="out-in">
            <div :key="step">
              <!-- step = 0 -->
              <div v-if="step === 0">
                <div class="group-name">
                  <p class="v-label">Group name</p>
                  <p class="v-label mt-2">
                    Please enter a unique name to easily identify this group:
                  </p>
                </div>

                <VField style="width: 765px">
                  <VControl>
                    <div
                      class="is-flex is-justify-content-space-between is-align-items-center group-name-input"
                    >
                      <VInput
                        v-model="form.name"
                        class="mt-5"
                        type="text"
                        placeholder="Group name"
                      >
                      </VInput>
                    </div>
                  </VControl>
                </VField>
                <HasError :form="form" field="name" />

                <div class="business-impact">
                  <p class="v-label">Business Impact</p>
                  <div class="impact-group">
                    <transition name="fade-slow" mode="out-in">
                      <div :key="step">
                        <ul
                          class="asset-mode is-flex is-align-items-center is-justify-content-center mt-4"
                        >
                          <li
                            v-for="(impact, key) in general.assets.impacts"
                            :key="key"
                            :class="[
                              'asset-mode-chip',
                              { selected: selectedMode === impact },
                            ]"
                            @click="selectMode(impact)"
                          >
                            <div class="circle">
                              <div
                                v-if="selectedMode === impact"
                                class="sub-circle"
                              ></div>
                            </div>
                            <div class="statement">
                              <p class="v-label">{{ impact }}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                  <HasError :form="form" field="business_impact" />
                </div>
              </div>
              <div v-if="step === 1" class="feature-group has-slimscroll">
                <template
                  v-for="monitor in monitors.filter((m) => modules.includes(m.module))"
                  :key="monitor.slug"
                >
                  <div
                    :class="{
                      'monitoring-feature p-5': monitor.active,
                      'monitoring-feature-disabled p-5': !monitor.active,
                    }"
                  >
                    <div class="is-flex is-justify-content-end">
                      <img
                        src="/images/icons/navbar/vuesax-linear-edit.svg"
                        :style="{ opacity: form.monitors[monitor.slug]['on'] ? 1 : 0.3 }"
                        alt="edit"
                        @click="monitor.active ? editMonitorFeature(monitor) : null"
                      />
                      <v-switch
                        v-model="form.monitors[monitor.slug]['on']"
                        color="primary"
                        @update:modelValue="
                          monitor.active ? handleSwitchToggle(monitor) : null
                        "
                      ></v-switch>
                    </div>
                    <p class="v-label feature-name">{{ monitor.name }}</p>
                    <p class="v-label feature-content">{{ monitor.description }}</p>
                    <EditMonitorFeatureModal
                      v-if="showEditModal && monitor.active"
                      :editable="editable"
                      :project="project"
                      :monitor="editingMonitor"
                      :values="selectedValues"
                      :schedule="selectedSchedule"
                      :form="form"
                      @closeModal="hideModal"
                      @saveChange="saveChange"
                    />
                  </div>
                  <div
                    v-if="monitor.slug === 'exposure'"
                    :class="{
                      'monitoring-feature p-5': monitor.active,
                      'monitoring-feature-disabled p-5': !monitor.active,
                    }"
                  >
                    <div class="is-flex is-justify-content-end">
                      <v-switch
                        v-model="form.monitors[monitor.slug]['values']['discovery']"
                        color="primary"
                        @update:modelValue="
                          monitor.active ? handleSwitchToggleDiscovery(monitor) : null
                        "
                      ></v-switch>
                    </div>
                    <p class="v-label feature-name">Asset discovery</p>
                    <p class="v-label feature-content">
                      Identifying and cataloging digital assets.
                    </p>
                  </div>
                </template>
              </div>
              <!-- step = 2 -->
              <div v-if="step === 2 && !editable && !isCompleteStep" class="last-step">
                <div class="group-name">
                  <p class="v-label">Add asset</p>
                  <p class="v-label mt-2">
                    Please enter each asset on a separate line. The system will
                    automatically detect the asset type and add them to group.
                  </p>
                </div>
                <div class="add-asset-part">
                  <v-textarea
                    v-model="form.assets"
                    class="content"
                    variant="outlined"
                    rows="9"
                    placeholder="Please enter the value of each asset, one per line."
                  ></v-textarea>
                </div>
                <v-btn class="complete-btn" @click="save">
                  <span class="v-label">Complete</span>
                </v-btn>
              </div>

              <div v-if="isCompleteStep">
                <VLoader :active="true">
                  <div style="height: 550px" />
                </VLoader>
              </div>
            </div>
          </transition>
        </div>
        <div v-if="!isCompleteStep && step < 2" class="modal-footer">
          <div
            class="is-flex column next-step"
            :style="{ opacity: disableContinue ? 0.38 : 1 }"
            @click="nextStep"
          >
            <p class="v-label">{{ editable && step === 1 ? 'Complete' : 'Continue' }}</p>
            <img src="/images/icons/navbar/vuesax_linear_arrow-right.svg" alt="back" />
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import EditMonitorFeatureModal from '/@src/components/collections/EditMonitorFeatureModal.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { HasError } from 'vform/src/components/bootstrap5'

export default {
  components: {
    VField,
    VControl,
    HasError,
    VInput,
    VProgress,
    EditMonitorFeatureModal,
    VLoader,
  },
  props: ['editable', 'project'],
  emits: ['closeModal'],
  data: () => ({
    dialog: '',
    form: new Form({}),
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
    step: 0,
    selectedMode: 'Moderate',
    disableContinue: true,
    showEditModal: false,
    isCompleteStep: false,
    isComplete: false, // change the height of the modal on the complete step
    processing: false,
    switchValue: false,
    editingMonitor: null,
    selectedValues: null,
    selectedSchedule: null,
  }),
  computed: {
    ...mapGetters(['general', 'projectAssets', 'workspace']),
    backgroundColor() {
      return this.addStatus ? 'var(--dark-body-color)' : 'var(--dark-hover-color)'
    },
  },
  watch: {
    'form.name'(newVal, oldVal) {
      this.isFirstStepComplete()
    },
    'form.business_impact'(newVal, oldVal) {
      this.isFirstStepComplete()
    },
  },
  mounted() {
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
      this.selectedMode = this.form.business_impact
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
        }
      })
    } else {
      this.form.name = ''
      this.form.project_id = this.project.id
      this.form.monitors = {}
      this.form.assets = null
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'
      this.selectedBusinessImpact = ''

      this.general.monitors.forEach((tool) => {
        this.form.monitors[tool.slug] = {
          on: false,
          schedule: 'weeklyOn',
          values: {},
        }
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
    handleSwitchToggle(monitor) {
      if (monitor.slug === 'exposure') {
        if (!this.form.monitors[monitor.slug]['on']) {
          this.form.monitors[monitor.slug]['values']['discovery'] = false
        }
      }
    },
    handleSwitchToggleDiscovery(monitor) {
      if (this.form.monitors[monitor.slug]['values']['discovery']) {
        this.form.monitors[monitor.slug]['on'] = true
      }
    },
    isFirstStepComplete() {
      if (this.form.name && this.form.business_impact) {
        this.disableContinue = false
      } else {
        this.disableContinue = true
      }
    },
    handleKeyPress(event) {
      if (event.key === 'Enter' && !this.processing) {
        this.nextStep()
      }
    },
    selectMode(mode) {
      this.selectedMode = mode
      this.form.business_impact = mode
    },
    stepBack() {
      if (this.isCompleteStep) {
        return
      }
      this.step !== 0 && this.step--
      if (this.step === 2 && !this.editable) {
        setTimeout(() => {
          this.isComplete = true
        }, 300)
      } else {
        setTimeout(() => {
          this.isComplete = false
        }, 300)
      }
    },
    async nextStep() {
      this.processing = true
      if (this.step === 0 && !this.form.name) {
        this.form.errors.set('name', 'Please enter group name.')
        this.processing = false
        return
      }

      this.form.errors.set('name', null)

      if (this.step === 0 && !this.form.business_impact) {
        this.$store.dispatch('addAlert', {
          text: 'Please select business impact',
          type: 'danger',
        })
        this.processing = false
        return
      }
      this.step !== 3 ? this.step++ : ''
      if (this.step === 2 && !this.editable) {
        setTimeout(() => {
          this.isComplete = true
        }, 300)
      } else {
        setTimeout(() => {
          this.isComplete = false
        }, 300)
      }
      if (this.step === 2 && this.editable) {
        await this.save()
      }
    },
    async save() {
      !this.editable ? (this.step = 3) : ''
      setTimeout(() => {
        this.isCompleteStep = true
      }, 300)
      await this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
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
    editMonitorFeature(monitor) {
      if (this.form.monitors[monitor.slug]['on']) {
        this.showEditModal = true
        this.editingMonitor = monitor
        this.selectedValues = this.form.monitors[monitor.slug]['values']
        this.selectedSchedule = this.form.monitors[monitor.slug]['schedule']
      } else {
        this.$store.dispatch('addAlert', {
          text: 'Please select the monitor',
          type: 'danger',
        })
        return
      }
    },
    hideModal() {
      this.showEditModal = false
      this.editingMonitor = null
    },
    saveChange() {
      this.showEditModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.5s ease;
}
.fade-slow-enter,
.fade-slow-leave-to {
  opacity: 0;
}

.add-group-modal {
  .v-card {
    background: var(--dark-body-color);
    margin: 0px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.columns {
      height: 720px;
      overflow: auto;
    }
    &.columns-large {
      height: 900px;
      overflow: auto;
      .feature-group {
        max-height: 590px !important;
      }
    }
    &.complete {
      height: 640px;
      overflow-y: auto;
    }
    .modal-header {
      background: var(--dark-body-color);
      height: 56px;

      div {
        height: 100%;

        img {
          width: 24.5px;
          height: 24.5px;
          cursor: pointer;
        }

        &:first-child {
          padding: 26px 22px 0;

          .create-group {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: normal;
            text-align: left;
            margin-left: 6px;
          }
        }

        &:last-child {
          padding: 26px 16px 8px;
          background: var(--dark-body-color);
          img {
            float: right;
          }
        }
      }
    }

    .modal-body {
      margin: 12px 56px;

      progress {
        top: 7px;
        height: 2px !important;
      }

      .asset-group {
        margin-top: 40px;

        p {
          &:first-child {
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: normal;
          }
          &:last-child {
            font-size: 18px;
            line-height: 1.5;
            white-space: inherit;
          }
        }
      }

      .group-name {
        margin-top: 54px;
        display: grid;

        p {
          &:first-child {
            font-size: 18px;
            font-weight: 600;
            line-height: 1.33;
            letter-spacing: normal;
          }
          &:last-child {
            font-size: 16px;
            line-height: 1.5;
            white-space: inherit;
          }
        }
      }

      .complete-btn {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 16px 0 12px;
        border-radius: 100px;
        background: var(--dark-primary) !important;
        text-transform: capitalize;
        border: none;
        margin-top: 92px;
        margin-bottom: 28px;
        span {
          font-weight: 500;
          letter-spacing: 0.13px;
          color: #fff;
        }
      }

      .group-name-input {
        input {
          padding: 11px 12px !important;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.13;
          letter-spacing: normal;
          text-align: left;
          color: var(--dark-table-sm-text-color);
          border-color: var(--dark-border-color) !important;

          &::placeholder {
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.13;
            letter-spacing: normal;
            text-align: left;
            color: var(--dark-table-sm-text-color) !important;
          }
          &:focus-visible {
            outline: none;
          }
        }
      }

      .business-impact {
        margin-top: 54px;
        p {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.33;
          letter-spacing: normal;
        }

        .impact-group {
          .asset-mode {
            .asset-mode-chip {
              margin: 0 11px;
              width: 216px;
              height: 108px;
              border: solid 1.6px var(--dark-border-color);
              display: flex;
              flex-direction: column;
              align-items: center;
              border-radius: 8px;

              &:hover {
                cursor: pointer;
                background: var(--dark-hover-color);
              }

              &:first-child {
                margin-left: 0px;
              }

              &:last-child {
                margin-right: 0px;
              }

              .circle {
                margin-top: 27px;
                margin-bottom: 8px;
                width: 20px;
                height: 20px;
                flex-grow: 0;
                border-radius: 100px;
                border: solid 2px var(--dark-table-text-color);
                display: flex;
                align-items: center;
                justify-content: center;

                .sub-circle {
                  width: 12px;
                  height: 12px;
                  flex-grow: 0;
                  background: var(--dark-table-text-color);
                  border-radius: 100px;
                  border: solid 2px var(--dark-table-text-color);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                }
              }

              .circle.selected {
                background: white;
              }

              .statement {
                display: flex;
                flex-direction: column;
                align-items: center;

                p {
                  font-size: 20px;
                  font-weight: 600;
                  line-height: 1.2;
                  letter-spacing: normal;
                  text-align: center;
                }

                ul {
                  padding: 0 8px 0 26px;

                  li {
                    margin-bottom: 4px;
                    list-style-type: disc;
                    font-family: Poppins;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;
                    color: #e1e1ef;
                  }
                }
              }
            }

            .asset-mode-chip.selected {
              background: var(--dark-primary);
            }
          }
        }
      }
      .feature-group {
        margin-top: 29px;
        display: flex;
        flex-wrap: wrap;
        gap: 18px 32px;
        width: 1200px;
        max-height: 432px;
        overflow-y: auto;
        overflow-x: hidden;

        .monitoring-feature,
        .monitoring-feature-disabled {
          width: 368px;
          height: 207px;
          flex-grow: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          padding: 24px;
          border-radius: 16px;
          background-color: var(--dark-hover-color);

          img {
            margin-right: 14px;
            cursor: pointer;
          }

          .feature-name {
            margin-top: 20px;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: normal;
            white-space: inherit;
          }

          .feature-content {
            margin-top: 12px;
            font-size: 14px;
            line-height: 1.5;
            letter-spacing: normal;
            white-space: inherit;
          }
        }

        .monitoring-feature-disabled {
          background: var(--dark-navbar-color);

          .v-switch {
            opacity: 0.3;
          }
          p {
            color: var(--dark-table-sm-text-color);
          }
        }
      }
      .last-step {
        .add-asset-part {
          margin-top: 50px;
        }
      }
    }

    .modal-footer {
      margin-top: auto;

      .next-step {
        opacity: 0.38;
        margin-bottom: 40px;
        padding: 0;
        float: right;
        margin-right: 44px;
        cursor: pointer;

        p {
          font-size: 16px;
          font-weight: 600;
          line-height: 1.5;
          letter-spacing: normal;
          margin-right: 6px;
        }
      }
    }
  }
}

.menu-list {
  background: var(--sidebar-color) !important;

  .dropdown-block {
    min-height: 40px !important;
    padding: 8px 12px !important;

    &:hover {
      background: var(--dark-hover-color) !important;
    }
  }

  .dropdown-divider {
    background: #434656;
  }
  .sub-item {
    display: flex !important;
    font-family: Poppins;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: 0.25px;
    text-align: left;
    color: #e1e1ef;

    .content {
      line-height: 0;
      gap: 12px;
    }
  }
  .logout {
    button {
      background: var(--dark-primary) !important;
      width: 140px;
      letter-spacing: 1px !important;
      font-size: 14px;
    }
  }
}
</style>