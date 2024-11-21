<template>
  <v-dialog
    v-model="dialog"
    class="add-group-modal"
    max-width="900"
    persistent
    opacity="0.1"
    @close="$emit('closeModal')"
  >
    <v-card class="columns">
      <div
        class="modal-header is-flex is-align-items-center is-justify-content-space-between"
      >
        <div class="is-flex column is-one-quarter">
          <p class="create-group v-label">Edit</p>
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

      <div class="modal-body">
        <div class="asset-group">
          <div class="is-flex is-justify-content-space-between is-align-items-center">
            <p class="title">{{ monitor.name }}</p>
            <v-card class="switch">
              <!--eslint-disable-->
              <v-switch
                v-model="form.monitors[monitor.slug]['on']"
                color="primary"
                @update:modelValue="
                  () => {
                    if (monitor.slug === 'exposure') {
                      if (!form.monitors[monitor.slug]['on']) {
                        // eslint-disable-next-line
                        form.monitors['exposure']['values']['discovery'] = false
                      }
                    }
                  }
                "
              ></v-switch>
              <!--eslint-enable-->
            </v-card>
          </div>
          <p class="detail">{{ monitor.description }}</p>
        </div>
        <div class="configuration">
          <div
            class="is-flex is-align-items-center is-justify-content-space-between content"
          >
            <div style="flex: 1">
              <Component
                :is="component"
                v-if="component && monitor"
                :key="monitor.slug"
                :form="form"
                :values="form.monitors[monitor.slug]['values']"
                :project="project"
              />
            </div>
          </div>

          <p class="v-label sub-2">Frequency</p>
          <div class="impact-group">
            <transition name="fade-slow" mode="out-in">
              <div :key="step">
                <ul
                  class="asset-mode is-flex is-align-items-center is-justify-content-center"
                >
                  <li
                    :class="['asset-mode-chip', { selected: selectedMode === 'dailyAt' }]"
                    @click="selectMode('dailyAt')"
                  >
                    <div class="circle">
                      <div v-if="selectedMode === 'dailyAt'" class="sub-circle"></div>
                    </div>
                    <div class="statement">
                      <span class="v-label">Daily</span>
                    </div>
                  </li>
                  <li
                    :class="[
                      'asset-mode-chip',
                      { selected: selectedMode === 'weeklyOn' },
                    ]"
                    @click="selectMode('weeklyOn')"
                  >
                    <div class="circle">
                      <div v-if="selectedMode === 'weeklyOn'" class="sub-circle"></div>
                    </div>
                    <div class="statement">
                      <span class="v-label">Weekly</span>
                    </div>
                  </li>
                  <li
                    :class="[
                      'asset-mode-chip',
                      { selected: selectedMode === 'monthlyOn' },
                    ]"
                    @click="selectMode('monthlyOn')"
                  >
                    <div class="circle">
                      <div v-if="selectedMode === 'monthlyOn'" class="sub-circle"></div>
                    </div>
                    <div class="statement">
                      <span class="v-label">Monthly</span>
                    </div>
                  </li>
                  <li
                    :class="[
                      'asset-mode-chip',
                      { selected: selectedMode === 'quarterlyOn' },
                    ]"
                    @click="selectMode('quarterlyOn')"
                  >
                    <div class="circle">
                      <div v-if="selectedMode === 'quarterlyOn'" class="sub-circle"></div>
                    </div>
                    <div class="statement">
                      <span class="v-label">Quarterly</span>
                    </div>
                  </li>
                  <li
                    :class="[
                      'asset-mode-chip is-disabled',
                      { selected: selectedMode === 'custom' },
                    ]"
                  >
                    <div class="circle">
                      <div v-if="selectedMode === 'custom'" class="sub-circle"></div>
                    </div>
                    <div class="statement">
                      <span class="v-label">Custom</span>
                    </div>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
          <div class="save-changes">
            <v-btn class="add-asset-btn" @click="save">
              <span class="v-label">Save changes</span>
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { defineAsyncComponent } from 'vue'
import { HasError } from 'vform/src/components/bootstrap5'

export default {
  components: {
    HasError,
  },
  props: ['editable', 'project', 'monitor', 'values', 'schedule', 'form'],
  emits: ['closeModal', 'saveChange'],
  data: () => ({
    openType: true,
    openMode: true,
    dialog: '',
    mapTypeComponents: {},
    monitors: [],
    showModal: false,
    q: '',
    selectedBusinessImpact: '',
    step: 0,
    selectedMode: '',
    disableContinue: true,
    showEditModal: false,
    isShowConfiguration: false,
    vms: [],
    editValues: null,
  }),
  computed: {
    ...mapGetters(['general', 'projectAssets', 'workspace']),
    backgroundColor() {
      return this.addStatus ? 'var(--dark-body-color)' : 'var(--dark-hover-color)'
    },
    component() {
      return defineAsyncComponent(
        () => import(`./../tasks/modules/${this.monitor.slug}.vue`)
      )
    },
  },
  mounted() {
    this.editValues = this.values
    if (this.schedule) {
      this.selectedMode = this.schedule
    }
  },
  methods: {
    selectMode(mode) {
      this.selectedMode = mode
      this.disableContinue = false
    },
    save() {
      this.$emit('saveChange')
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
    height: 600px;
    background: var(--dark-body-color);
    margin: 0px !important;
    display: flex;
    flex-direction: column;

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
          padding: 26px 56px 0;

          .create-group {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: normal;
            text-align: left;
            margin-left: 6px;
          }
        }

        &:last-child {
          padding: 26px 44px 8px;
          background: var(--dark-body-color);
          img {
            float: right;
          }
        }
      }
    }

    .modal-body {
      margin: 0 56px;

      .asset-group {
        margin-top: 36px;
        .title {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: normal;
          margin-bottom: 0;
        }
        .detail {
          font-size: 16px;
          line-height: 1.5;
          white-space: inherit;
        }
        .v-card {
          height: 40px;
          padding: 0 10px;
          box-shadow: none !important;
        }
      }

      .configuration {
        margin-top: 32px;
        display: flex;
        flex-direction: column;

        .sub-1,
        .sub-2 {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.33;
          letter-spacing: normal;
        }
        .sub-2 {
          margin-top: 32px;
        }

        .content {
          gap: 12px;
          margin-bottom: 0;

          .select-project2 {
            margin-top: 20px;
            border-radius: 4px !important;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.13;
            letter-spacing: normal;
            text-align: left;
            color: var(--dark-table-sm-text-color);
            text-transform: none;
            height: 40px;
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0 12px !important;

            i {
              margin-left: 8px;
            }
          }
        }
        .impact-group {
          .asset-mode {
            margin-top: 20px;

            .asset-mode-chip {
              margin: 0 11px;
              width: 188px;
              height: 94px;
              border: solid 1.6px #8d90a2;
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
                margin-top: 21px;
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

                span {
                  font-size: 18px;
                  font-weight: 600;
                  line-height: 1.33;
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

        .save-changes {
          margin-top: 82px;

          .add-asset-btn {
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

            span {
              font-weight: 500;
              letter-spacing: 0.13px;
              color: #fff;
            }
          }
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
      }
      .feature-group {
        margin-top: 29px;
        display: flex;
        flex-wrap: wrap;
        gap: 18px 32px;

        .monitoring-feature {
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
          }

          .feature-name {
            margin-top: 20px;
            font-size: 20px;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: normal;
          }

          .feature-content {
            margin-top: 12px;
            font-size: 14px;
            line-height: 1.5;
            letter-spacing: normal;
            white-space: inherit;
          }
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