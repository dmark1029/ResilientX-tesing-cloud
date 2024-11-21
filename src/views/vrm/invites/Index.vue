<template>
  <div class="page-content-inner">
    <div class="action-page-wrapper action-page-v2">
      <div class="wrapper-outer">
        <div class="wrapper-inner">
          <div class="action-box">
            <div class="box-content">
              <div class="v-avatar is-big">
                <img class="avatar" :src="workspace.setting.logo" alt="" />
              </div>

              <h3 class="dark-inverted">
                Invite to join
                <span class="is-dark-primary">{{ workspace.name }}</span>
                workspace as company.
              </h3>
              <div class="sender-message is-dark-card-bordered is-dark-bg-4">
                <h4 class="dark-inverted">Unique onboarding URL</h4>
                <p v-if="active" style="word-break: break-all">{{ active.url }}</p>
                <p v-else>-</p>
              </div>

              <div v-if="active" class="buttons">
                <VButton
                  dark-outlined
                  :disabled="!canPerformAction('vendors', 'create')"
                  @click="deleteInvite"
                >
                  Revoke
                </VButton>
                <VButton
                  color="primary"
                  raised
                  tabindex="0"
                  @keydown.space.prevent=""
                  @click="copyToClipboard"
                >
                  Copy
                </VButton>
              </div>
            </div>
          </div>
        </div>

        <div class="side-wrapper">
          <div class="side-inner">
            <div class="side-title">
              <h3 class="dark-inverted">Onboarding links</h3>
              <p>Ask your partners to join via unique onboarding URL</p>
            </div>

            <div v-if="invites?.data" class="action-list">
              <VBlock
                v-for="invite in invites.data"
                :key="invite.id"
                class="is-clickable"
                :title="`Expires: ${invite.expires ? invite.expires : 'Never'}`"
                @click="active = invite"
              >
                <p>{{ invite.hash.slice(0, 25) }}..</p>

                <template #icon>
                  <VIconWrap icon="fa fa-link" dark="3" dark-primary dark-card-bordered />
                </template>
              </VBlock>

              <div v-if="!invites.data.length">
                <p>No onboarding links found</p>
              </div>

              <Pagination :data="invites" :limit="5" @pagination-change-page="getData" />

              <div class="field">
                <hr />
                <label class="label">Create new onboarding link</label>
              </div>

              <form @submit.prevent="invite" @keydown="form.onKeydown($event)">
                <div class="columns">
                  <div class="column is-6">
                    <div class="field">
                      <label class="label">Expires after:</label>
                      <div class="select">
                        <select v-model="form.expires" class="form-select">
                          <option value="">Never</option>
                          <option :value="1">1 day</option>
                          <option :value="7">7 days</option>
                          <option :value="30">1 Month</option>
                          <option :value="90">3 Months</option>
                          <option :value="180">6 Months</option>
                          <option :value="365">1 Year</option>
                        </select>
                      </div>
                      <HasError :form="form" field="expires" />
                    </div>
                  </div>
                  <div class="column is-6">
                    <FormButton
                      :form="form"
                      :disabled="!canPerformAction('vendors', 'create')"
                      class="button v-button is-primary btn-sm mt-5"
                    >
                      Create
                    </FormButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import VBlock from '/@src/components/base/block/VBlock.vue'
import VIconWrap from '/@src/components/base/icon/VIconWrap.vue'
import { axios } from '/@src/axios'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import Pagination from '/@src/components/Pagination.vue'

export default {
  components: {
    Pagination,
    VIconWrap,
    VBlock,
    VButton,
    VBreadcrumb,
    HasError,
    FormButton,
  },
  mixins: [permissionsMixin],
  data: () => ({
    isLoading: false,
    filter: 'active',
    editable: null,
    showScanNowModal: false,
    showImportModal: false,
    scanNowItem: null,
    search: '',
    invites: [],
    links: [],
    active: null,
    form: new Form({
      expires: 30,
    }),
  }),
  computed: {
    ...mapGetters(['projectAssets', 'loading', 'isMobile', 'workspace']),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
  },
  async mounted() {
    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
      },
      {
        label: 'Workspaces',
        to: {
          name: 'VRMWorkspaces',
        },
      },
      {
        label: this.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
      },
      {
        label: 'Onboarding Automation',
        to: {},
      },
    ]

    this.form.workspace_id = this.workspace?.id

    this.getData()

    this.$store.dispatch('hideLoading')
  },
  methods: {
    getData(page = 1) {
      axios
        .get('/vendor-invite', {
          params: {
            workspace_id: this.workspace?.id,
            page: page,
          },
        })
        .then((res) => {
          this.$store.dispatch('hideLoading')
          this.invites = res.data
          this.active = null
          if (this.invites.data.length > 0) {
            this.active = this.invites.data[0]
          }
        })
        .catch(() => {})
    },
    invite() {
      if (this.form.expires) {
        this.form.expires = parseInt(this.form.expires)
      }

      this.form.post('/vendor-invite').then(() => {
        this.getData()
      })
    },
    deleteInvite() {
      axios
        .delete('/vendor-invite/' + this.active.id)
        .then(() => {
          this.getData()
        })
        .catch(() => {})
    },
    copyToClipboard(event) {
      event.target.setAttribute('disabled', 'disabled')
      event.target.innerText = 'Copied'

      setTimeout(() => {
        event.target.removeAttribute('disabled')
        event.target.innerText = 'Copy'
      }, 1000)

      const el = document.createElement('textarea')
      el.value = this.active.url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
  },
  metaInfo() {
    return {
      title: this.workspace?.name + ' Onboarding Automation',
    }
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.action-page-wrapper {
  &.action-page-v2 {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 840px;
    min-height: 560px;
    margin: 0 auto;

    .wrapper-outer {
      @include vuero-s-card;

      display: flex;
      padding: 0;

      .wrapper-inner {
        .action-box {
          border: none;
          background: none;
          border-radius: 0;
          border-inline-end: 1px solid var(--fade-grey-dark-3);
        }
      }

      .side-wrapper {
        flex-grow: 2;
        padding: 40px;

        .side-inner {
          .side-title {
            font-family: var(--font);
            margin-bottom: 16px;

            h3 {
              font-family: var(--font-alt);
              font-weight: 600;
              color: var(--dark-text);
            }

            p {
              font-size: 0.9rem;
            }
          }

          .action-list {
            .media-flex {
              .icon-wrap {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 32px;
                width: 32px;
                min-width: 32px;
                border-radius: var(--radius-rounded);
                background: var(--white);
                border: 1px solid var(--fade-grey-dark-3);
                box-shadow: var(--light-box-shadow);
                color: var(--primary);

                svg {
                  width: 16px;
                  height: 16px;
                  stroke-width: 3px;
                }
              }

              .flex-meta {
                span {
                  font-weight: 400;
                  font-size: 0.9rem;
                }

                p {
                  font-size: 0.9rem;
                  max-width: 240px;
                }
              }
            }
          }
        }
      }
    }

    .wrapper-inner {
      .action-box {
        @include vuero-s-card;

        padding: 40px;

        .box-content {
          text-align: center;
          font-family: var(--font);

          .v-avatar {
            display: block;
            margin: 0 auto 8px;
          }

          h3 {
            font-family: var(--font-alt);
            font-weight: 600;
            max-width: 320px;
            margin: 0 auto 16px;

            span {
              color: var(--primary);
            }
          }

          .sender-message {
            text-align: inset-inline-start;
            padding: 20px;
            border: 1px solid var(--fade-grey-dark-3);
            max-width: 360px;
            margin: 0 auto;
            border-radius: var(--radius-large);
            box-shadow: var(--light-box-shadow);

            h4 {
              font-family: var(--font-alt);
              font-size: 0.7rem;
              font-weight: 500;
              color: var(--dark-text);
              text-transform: uppercase;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
            }
          }

          .people-wrap {
            .people {
              display: flex;
              justify-content: center;
              padding: 16px 0 8px;

              .v-avatar {
                margin: 0 4px;
              }
            }

            .people-text {
              p {
                font-size: 0.9rem;
              }
            }
          }

          .buttons {
            margin: 0 auto;
            display: flex;
            justify-content: center;
            padding-top: 30px;

            .button {
              margin: 0 4px;
              min-width: 150px;
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-inner {
        .action-box {
          @include vuero-card--dark;
        }
      }

      .wrapper-outer {
        @include vuero-card--dark;
      }
    }
  }
}

/* ==========================================================================
3. Media Queries
========================================================================== */

@media only screen and (width <= 767px) {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-outer {
        flex-direction: column;

        .wrapper-inner {
          .action-box {
            padding: 20px 20px 40px;
            border-inline-end: none;
            border-bottom: 1px solid var(--fade-grey-dark-3);

            .box-content {
              .buttons {
                .button {
                  min-width: 130px;
                }
              }
            }
          }
        }

        .side-wrapper {
          padding: 40px 20px;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .action-page-wrapper {
    &.action-page-v2 {
      .wrapper-outer {
        .wrapper-inner {
          .action-box {
            padding: 30px;

            .box-content {
              .buttons {
                .button {
                  min-width: 130px;
                }
              }
            }
          }
        }

        .side-wrapper {
          padding: 30px;
        }
      }
    }
  }
}
</style>
