<template>
  <div>
    <div v-if="!loaded" class="app-init-wrapper">
      <VLoader class="is-grey" :active="true">
        <div />
      </VLoader>
    </div>
    <div v-else>
      <div class="columns">
        <div class="column is-6">
          <div class="dashboard-card">
            <div class="columns is-align-items-center">
              <div class="column is-9">
                <div class="card-head"><h3 class="dark-inverted">Exposure score</h3></div>
                <p>
                  Overall impact of an analysis on your infrastructure, business
                  criticality of asset, this issue have
                  {{ issue.exposure_score ? issue.exposure_score + '%' : 'N/A' }} Impact
                  on your organization overall exposure.
                </p>
              </div>
              <div class="column is-3">
                <ExposureGradeWidget
                  :score="issue.exposure_score ? issue.exposure_score : 'N/A'"
                  grade=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="dashboard-card">
            <div class="columns is-align-items-center">
              <div class="column is-9">
                <div class="card-head">
                  <h3 class="dark-inverted">Attack prediction score</h3>
                </div>
                <p>
                  Based on multiple automated analysis on the current issue such as Threat
                  Intelligence, Exploit Prediction Scoring System and Darkweb Feed
                </p>
              </div>
              <div class="column is-3">
                <ExposureGradeWidget
                  :score="
                    issue.attack_prediction_score ? issue.attack_prediction_score : 'N/A'
                  "
                  grade=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-8">
          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Details</h3></div>

            <p><b>Status</b>: <IssueStatusBadge :status="issue.status_text" /></p>

            <p>
              <b>Asset</b>:
              <router-link
                :to="{
                  name: $route.name.startsWith('VrmManage')
                    ? 'VrmManageAssetView'
                    : 'VRMAssetView',
                  params: { id: issue.workspace_id, asset: issue.asset.id },
                }"
                >{{ issue.asset.value }}</router-link
              >
            </p>

            <p v-if="companies">
              <b>Company</b>:

              <span
                v-for="vend in issue.asset.collections
                  .filter((collection) => {
                    return collection.status === 'active'
                  })
                  .map((collection) => collection)"
                :key="vend.id"
              >
                <router-link
                  class="mr-2"
                  :to="{
                    name: 'VrmManageView',
                    params: { asset: vend.id },
                  }"
                >
                  {{ vend.name }}
                </router-link>
              </span>
            </p>

            <hr />
            <div class="card-head"><h3 class="dark-inverted">Description</h3></div>
            <p v-if="issue.description">
              {{ issue.description }}
            </p>
            <p v-if="!issue.description && issue.type.slug === 'technologies-issues'">
              {{ issue.items.length }} potential issues found on asset
              {{ issue.asset.value }}. <br /><br />
              CVE's:
              {{ issue.items.map((item) => item.issuable.identification).join(', ') }}
            </p>
            <div
              v-if="!issue.description && issue.type.slug === 'application-issue' && zap"
            >
              <p class="mb-2">
                <b>{{ zap.title }}</b>
              </p>
              <p class="mb-2">{{ zap.description ?? '-' }}</p>
              <p class="mb-2"><b>Other information: </b> {{ zap.other ?? '-' }}</p>
              <p class="mb-2"><b>Solution: </b> {{ zap.solution ?? '-' }}</p>

              <div v-if="zap.references?.length" class="mb-2">
                <p class="mb-2"><b>References</b></p>
                <ul>
                  <li v-for="reference in zap.references" :key="reference">
                    <p>
                      <a :href="reference" target="_blank">{{ reference }}</a>
                    </p>
                  </li>
                </ul>
              </div>

              <div v-if="zap.alerttags?.length" class="mb-2">
                <p class="mb-2"><b>Tags</b></p>
                <span v-for="tag in zap.alerttags" :key="tag">
                  <span class="tag is-capitalized mr-2">{{ tag }}</span>
                </span>
              </div>
            </div>
            <hr />
            <div class="card-head"><h3 class="dark-inverted">Other details</h3></div>
            <p><b>Category</b>: {{ issue.type.title }}</p>
            <p><b>Status</b>: {{ issue.status_text }}</p>
            <p><b>Severity</b>: {{ issue.severity_text }}</p>
            <p>
              <b>Created</b>: {{ issue.created }}, <b>Last seen</b>: {{ issue.last_seen }}
            </p>
          </div>

          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Items</h3></div>

            <div
              class="table-widget-v1 has-slimscroll"
              style="max-height: 500px; overflow-y: scroll"
            >
              <table class="table is-hoverable is-fullwidth">
                <tbody>
                  <tr
                    v-for="issue in issue.items"
                    :key="issue.id"
                    v-table-click="() => showModal(issue)"
                    class="is-clickable"
                  >
                    <td>
                      <div class="double-line">
                        <span class="dark-inverted">{{
                          issue.issuable.identification ?? '-'
                        }}</span
                        ><span>Found on {{ issue.issuable.created ?? '-' }}</span>
                      </div>
                    </td>
                    <td v-if="issue.issuable.attack_prediction_score">
                      <!-- eslint-disable vue/no-v-html -->
                      <div
                        v-dompurify-html="
                          getAttackPredictionScore(issue.issuable.attack_prediction_score)
                        "
                        class="tag-wrap"
                      ></div>
                      <!-- eslint-enable vue/no-v-html -->
                    </td>
                    <td>
                      <!--                      <div class="select" style="max-width:120px" @click.prevent.stop="">-->
                      <!--                        <select class="form-select" :value="issue.status">-->
                      <!--                          <option-->
                      <!--                            v-for="(name, id) in general.issues.statuses"-->
                      <!--                            :key="id"-->
                      <!--                            :value="id"-->
                      <!--                          >-->
                      <!--                            {{ name }}-->
                      <!--                          </option>-->
                      <!--                        </select>-->
                      <!--                      </div>-->
                      <span>{{ issue.status_text }}</span>
                    </td>
                    <td v-if="issue.issuable.severity" class="is-end">
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <div class="tag-wrap">
                        <IssueSeverityBadge :severity="issue.issuable.severity" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="dashboard-card">
            <div v-if="requests !== null" class="card-head">
              <h3 class="dark-inverted">Opened Remediation Requests</h3>
            </div>

            <div v-if="requests === null">
              <VLoader class="is-grey" :active="true">
                <div style="height: 50px" />
              </VLoader>
            </div>
            <div v-else>
              <p v-if="!requests.length">
                You haven't opened any remediation requests for this issue.
              </p>
              <div v-else>
                <ul class="user-list">
                  <li
                    v-for="req in requests"
                    :key="req.id"
                    class="is-clickable is-scalable mb-2"
                    @click="request = req"
                  >
                    <div class="user-list-info">
                      <div class="name dark-inverted">{{ req.title }}</div>
                      <div class="position">
                        <small class="is-capitalized">
                          <RemediationRequestBadge :status="req.status" />
                        </small>
                        Created {{ req.created }}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-if="!isVendor(companies)" class="dashboard-card">
            <div class="card-head">
              <h3 class="dark-inverted">Ask for remediation</h3>
            </div>

            <p>
              Ask for remediation for this issue. You can ask for remediation by company
              or contact ResilientX team to assist you.
            </p>
          </div>

          <button
            v-if="!isVendor(companies)"
            class="button v-button is-bold is-big is-raised is-primary btn-sm mb-2"
            style="flex: initial"
            :disabled="issue.status === 'closed'"
            @click="showRemediationModal = true"
          >
            Ask for Remediation
          </button>
        </div>
      </div>
    </div>

    <RemediationRequestModal
      v-if="showRemediationModal"
      :issue="issue"
      @close="
        () => {
          showRemediationModal = false
          getIssueRemediationRequests()
        }
      "
    />

    <div
      id="activity-panel"
      :class="[request ? 'is-active' : '']"
      class="right-panel-wrapper is-activity"
    >
      <div
        class="panel-overlay"
        tabindex="0"
        role="button"
        @keydown.space.prevent="closeCommentsModal"
        @click="closeCommentsModal"
      />

      <div>
        <div class="right-panel" style="width: 80%">
          <div class="right-panel-head">
            <h3>{{ request?.title }}</h3>
            <a
              class="close-panel"
              tabindex="0"
              role="button"
              @keydown.space.prevent="closeCommentsModal"
              @click="closeCommentsModal"
            >
              <i class="fa fa-times" />
            </a>
          </div>

          <div>
            <RemediationRequestCommentModal
              :issue="issue"
              :request="request"
              :is-vendor="isVendor(companies)"
              @close="closeCommentsModal"
            />
          </div>
        </div>
      </div>
    </div>

    <CVEModalComponent
      v-if="showCVEModal"
      :id="showCVEModal"
      @close="showCVEModal = null"
    />

    <CWEModalComponent
      v-if="showCWEModal"
      :details="showCWEDetails"
      @close="showCWEModal = null"
    />

    <EmailLeakModalComponent
      v-if="showEmailLeakModal"
      :details="showEmailLeakModal"
      @close="showEmailLeakModal = null"
    />

    <CloudModalComponent
      v-if="showCloudModal"
      :details="showCloudModal"
      @close="showCloudModal = null"
    />

    <NssModalComponent
      v-if="showNssModal"
      :details="showNssModal"
      @close="showNssModal = null"
    />

    <IssueAssignModal
      v-if="showAssignModal"
      :issue="issue"
      :project="project"
      @close="
        () => {
          showAssignModal = false
          getIssue()
        }
      "
    />

    <VModal
      is="div"
      :open="showAIModal"
      title="Chat with AI"
      size="large"
      @close="showAIModal = false"
    >
      <template #content>
        <Chat />
      </template>
    </VModal>

    <VModal
      is="div"
      :open="showRemadiationModal"
      title="Remediation"
      size="large"
      @close="showRemadiationModal = false"
    >
      <template #content>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-dompurify-html="issue.type.remediation" style="white-space: pre"></p>

        <hr />

        <button
          type="button"
          class="button v-button is-raised is-primary"
          @click="
            () => {
              changeStatus('closed')
              showRemadiationModal = false
            }
          "
        >
          <span>Mark as closed</span>
        </button>
      </template>
    </VModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import IssueSeverityBadge from '/@src/components/issues/IssueSeverityBadge.vue'
import Form from '/@src/form'
import IssueAssignModal from '/@src/components/issues/IssueAssignModal.vue'
import CVEModalComponent from '/@src/components/modules/widgets/CVEModalComponent.vue'
import slugify from 'slugify'
import CWEModalComponent from '/@src/components/modules/widgets/CWEModalComponent.vue'
import Chat from '/@src/components/ai/Chat.vue'
import EmailLeakModalComponent from '/@src/components/modules/email-leaks/widgets/EmailLeakModalComponent.vue'
import NssModalComponent from '/@src/components/modules/nss/widgets/NssModalComponent.vue'
import CloudModalComponent from '/@src/components/modules/cloud-scanner/widgets/CloudModalComponent.vue'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import RemediationRequestModal from '/@src/components/vendors/RemediationRequestModal.vue'
import RemediationRequestCommentModal from '/@src/components/vendors/RemediationRequestCommentModal.vue'
import IssueStatusBadge from '/@src/components/issues/IssueStatusBadge.vue'
import RemediationRequestBadge from '/@src/components/vendors/RemediationRequestBadge.vue'

export default {
  components: {
    RemediationRequestBadge,
    IssueStatusBadge,
    RemediationRequestCommentModal,
    RemediationRequestModal,
    CloudModalComponent,
    NssModalComponent,
    EmailLeakModalComponent,
    Chat,
    CWEModalComponent,
    CVEModalComponent,
    IssueAssignModal,
    IssueSeverityBadge,
    ExposureGradeWidget,
    VModal,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    request: null,
    companies: null,
    active: true,
    showRemediationModal: false,
    loaded: false,
    form: new Form({}),
    formRemediationAnswer: new Form({}),
    formRemediationAsk: new Form({}),
    showRemadiationModal: false,
    showCVEModal: false,
    showCWEModal: false,
    showNssModal: false,
    showEmailLeakModal: false,
    showAIModal: false,
    showCWEDetails: null,
    showAssignModal: false,
    showCloudModal: false,
    isFalsePositive: false,
    requests: null,
    zap: null,
  }),
  computed: {
    ...mapGetters(['issue', 'general', 'workspace', 'manageableVendors']),
  },
  async mounted() {
    await Promise.all([this.getIssue()])
      .then(() => {
        this.companies = this.issue.asset.collections.filter((collection) => {
          return collection.status === 'active'
        })

        this.getIssueRemediationRequests()

        if (!this.issue.description && this.issue.type.slug === 'application-issue') {
          const id = this.issue.items[0].issuable.ref
          axios
            .get(`/zap/${id}`)
            .then((res) => {
              this.zap = res.data
            })
            .catch(() => {})
        }

        this.formRemediationAsk.remediation_asked = this.issue.remediation_asked
        this.formRemediationAsk.remediation_question = this.issue.remediation_question
      })
      .finally(() => {
        this.loaded = true
      })
  },
  methods: {
    closeCommentsModal() {
      this.request = null
      this.$router.replace({ query: null })
      this.getIssue()
      this.getIssueRemediationRequests()
    },
    showModal(issue) {
      if (issue.issuable.type === 'vulnerability') {
        this.showCVEModal = issue.issuable.identification
      }
      if (issue.issuable.type === 'alert') {
        this.showCWEModal = true
        this.showCWEDetails = issue.issuable
      }
      if (issue.issuable.type === 'email_leak') {
        this.showEmailLeakModal = issue.issuable
      }
      if (issue.issuable.type === 'network_detail') {
        this.showNssModal = issue.issuable
      }
      if (issue.issuable.type === 'cloud_detail') {
        this.showCloudModal = issue.issuable
      }
    },
    changeStatus(status) {
      return axios
        .put(`/issue/${this.$route.params.issue}`, {
          status: status,
        })
        .then(() => {
          this.getIssue()
        })
        .catch(() => {})
    },
    canChangeStatus() {
      let can = false

      this.issue.asset.collections.forEach((collection) => {
        this.manageableVendors.forEach((vendor) => {
          if (vendor.vendor.id === collection.id) {
            if (vendor.vendor.permissions === 'edit') {
              can = true
            }
          }
        })
      })

      return can
    },
    addNote() {
      return this.form
        .post(`/issue/${this.$route.params.issue}/notes`)
        .then(() => {
          this.form.note = ''
          this.getIssue()
        })
        .catch(() => {})
    },
    async getIssueRemediationRequests() {
      const isVendor = this.isVendor(this.companies)

      return axios
        .get(`/vendor-manage/issues`, {
          params: {
            issue_id: this.$route.params.issue,
          },
        })
        .then((res) => {
          this.requests = res.data.data

          if (this.$route.query.id) {
            this.request = this.requests.find((req) => req.id === this.$route.query.id)
          }
        })
        .catch(() => {})
    },
    async getIssue() {
      return axios
        .get(`/vendor-manage/issues/${this.$route.params.issue}`)
        .then((res) => {
          this.isFalsePositive = res.data.data.status === 'false_positive'
          this.$store.dispatch('addIssue', res.data.data)
        })
        .catch(() => {})
    },
    copyToClipboard(event) {
      event.target.setAttribute('disabled', 'disabled')
      event.target.innerText = 'COPIED'

      setTimeout(() => {
        event.target.removeAttribute('disabled')
        event.target.innerText = 'SHARE'
      }, 1000)

      const el = document.createElement('textarea')
      el.value = window.location.href
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
    downloadReport(event) {
      event.target.textContent = 'Generating..'
      axios
        .get('/issue/' + this.issue.id + '/pdf', {
          responseType: 'blob',
          timeout: 60000,
        })
        .then((res) => {
          if (res.status === 200) {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const href = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = href

            let name =
              slugify(this.issue.title + '-' + this.issue.asset.value, {
                lower: true,
              }) + '-issue.pdf'

            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href)
            event.target.textContent = 'Download PDF'
          } else if (res.status === 204) {
            event.target.textContent = 'Generation started, please come back later'
            setTimeout(() => {
              event.target.textContent = 'Download PDF'
            }, 3000)
          } else {
            event.target.textContent = 'Error'
          }
        })
        .catch(() => {})
    },
    getAttackPredictionScore(score) {
      if (score >= 66) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-danger" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score >= 33) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-warning" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else if (score && score >= 0) {
        return (
          '<div class="progress-bar"><progress class="progress is-small is-info" role="progressbar" value="' +
          score +
          '" max="100">' +
          score +
          "%</progress><span class='progress-text'>" +
          score.toFixed(2) +
          '%</span></div>'
        )
      } else {
        return 'N/A'
      }
    },
  },
  metaInfo() {
    return {
      title: this.issue ? this.issue.title : '',
    }
  },
}
</script>

<style lang="scss" scoped>
.table-widget-v1 {
  .table {
    margin-top: 1.5rem;

    tbody {
      tr,
      td {
        border: none;
      }

      tr {
        border-radius: 10px;
      }

      td {
        padding: 1em 0.75em;

        .double-line {
          line-height: 1.4;

          span {
            display: block;

            &:first-child {
              font-family: var(--font-alt);
              font-size: 1rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            &:nth-child(2) {
              color: var(--light-text);
              font-size: 0.9rem;
            }
          }
        }

        .avatars {
          > .v-avatar {
            margin: 0 0.15rem;
          }
        }

        // .rating-wrap {
        //   text-align: inset-inline-end;

        //   span {
        //     color: var(--light-text);
        //   }

        //   .rating {
        //     i {
        //       color: var(--widget-grey-dark-8);

        //       &.selected {
        //         color: var(--yellow) !important;
        //       }
        //     }
        //   }
        // }

        .tag-wrap {
          text-align: inset-inline-end;
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .table-widget-v1 {
    .table {
      tbody {
        td {
          &:nth-child(4),
          &:nth-child(5) {
            display: none;
          }
        }
      }
    }
  }
}

.recommendations-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-inline-start: -8px;
  margin-inline-end: -8px;

  .recommendations-item {
    width: calc(50% - 16px);
    margin: 8px;
    background: var(--fade-grey-light-3);
    text-align: center;
    padding: 30px 20px;
    border-radius: var(--radius);

    .recommendations-item-icon {
      display: flex;
      margin: 0 auto 15px;
      justify-content: center;
    }

    h3 {
      font-size: 1rem;
      font-family: var(--font-alt);
      font-weight: 600;
      color: var(--dark-text);
      margin-bottom: 8px;
    }

    p {
      font-size: 0.85rem;
      max-width: 80%;
      margin: 0 auto 16px;
    }

    .meta {
      span {
        display: block;

        &:first-child {
          font-weight: 600;
          font-family: var(--font-alt);
          font-size: 0.95rem;
          color: var(--primary);
        }

        &:nth-child(2) {
          font-size: 0.9rem;
          color: var(--light-text);
        }
      }
    }
  }
}

.is-dark {
  .recommendations-wrapper {
    .recommendations-item {
      background: var(--dark-sidebar-light-2);
      border-color: var(--dark-sidebar-light-12);

      .meta {
        span {
          &:first-child {
            color: var(--primary);
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .recommendations-wrapper {
    .experience-item,
    .languages-item,
    .recommendations-item {
      width: calc(100% - 16px);
    }
  }
}
</style>