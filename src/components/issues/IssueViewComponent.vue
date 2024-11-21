<template>
  <div>
    <div v-if="!loaded" class="app-init-wrapper">
      <VLoader :active="true">
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
            <div class="columns mb-0">
              <div class="column is-4">
                <div class="dashboard-card mb-0">
                  <AssetItemComponent :asset="issue.asset" />
                </div>
              </div>
              <div class="column is-8 has-text-right">
                <button
                  v-if="issue.type.slug !== 'sbom-issues'"
                  type="button"
                  aria-hidden="false"
                  class="button button v-button is-elevated is-primary"
                  :disabled="relaunched"
                  @click="retest"
                >
                  <span class="icon rtl-reflect"
                    ><i aria-hidden="true" class="fas fa-rocket"></i></span
                  ><span> Run retest </span>
                </button>
              </div>
            </div>
            <hr />
            <div class="card-head"><h3 class="dark-inverted">Description</h3></div>
            <p v-if="issue.description" style="white-space: pre-wrap">
              {{ issue.description }}
            </p>

            <!--            <div v-if="!issue.description && issue.type.slug === 'network-issue'">-->
            <!--              <div v-if="issue.items.length">-->
            <!--                <p style="white-space: pre-wrap">-->
            <!--                  {{ issue.items[0].issuable.description ?? '-' }}-->
            <!--                </p>-->
            <!--                <p-->
            <!--                  v-if="issue.items[0].issuable.nvt_tags?.summary"-->
            <!--                  style="white-space: pre-wrap"-->
            <!--                >-->
            <!--                  {{ issue.items[0].issuable.nvt_tags?.summary }}-->
            <!--                </p>-->
            <!--                <p-->
            <!--                  v-if="issue.items[0].issuable.nvt_tags?.solution"-->
            <!--                  style="white-space: pre-wrap"-->
            <!--                >-->
            <!--                  {{ issue.items[0].issuable.nvt_tags?.solution }}-->
            <!--                </p>-->
            <!--              </div>-->
            <!--            </div>-->

            <!--            <p v-if="!issue.description && issue.type.slug === 'technologies-issues'">-->
            <!--              {{ issue.items.length }} potential issues found on asset-->
            <!--              {{ issue.asset.value }}. <br /><br />-->
            <!--              CVE's:-->
            <!--              {{ issue.items.map((item) => item.issuable.identification).join(', ') }}-->
            <!--            </p>-->

            <!--            <div-->
            <!--              v-if="!issue.description && issue.type.slug === 'application-issue' && zap"-->
            <!--            >-->
            <!--              <p class="mb-2">-->
            <!--                <b>{{ zap.title }}</b>-->
            <!--              </p>-->
            <!--              <p class="mb-2">{{ zap.description ?? '-' }}</p>-->
            <!--              <p class="mb-2"><b>Other information: </b> {{ zap.other ?? '-' }}</p>-->
            <!--              <p class="mb-2"><b>Solution: </b> {{ zap.solution ?? '-' }}</p>-->

            <!--              <div v-if="zap.references?.length" class="mb-2">-->
            <!--                <p class="mb-2"><b>References</b></p>-->
            <!--                <ul>-->
            <!--                  <li v-for="reference in zap.references" :key="reference">-->
            <!--                    <p>-->
            <!--                      <a :href="reference" target="_blank">{{ reference }}</a>-->
            <!--                    </p>-->
            <!--                  </li>-->
            <!--                </ul>-->
            <!--              </div>-->

            <!--              <div v-if="zap.alerttags?.length" class="mb-2">-->
            <!--                <p class="mb-2"><b>Tags</b></p>-->
            <!--                <span v-for="tag in zap.alerttags" :key="tag">-->
            <!--                  <span class="tag is-capitalized mr-2">{{ tag }}</span>-->
            <!--                </span>-->
            <!--              </div>-->
            <!--            </div>-->

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
                      <span>{{ issue.status_text }}</span>
                    </td>
                    <td v-if="issue.closed">
                      <span>{{ issue.closed }}</span>
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

          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Remediation</h3></div>
            <div class="section-content">
              <div class="recommendations-wrapper">
                <div class="recommendations-item">
                  <div class="recommendations-item-icon">
                    <VIconBox size="medium" color="primary" rounded>
                      <i class="fa fa-comments has-text-white"></i>
                    </VIconBox>
                  </div>

                  <h3 class="dark-inverted">RESILIENTX AI</h3>
                  <div class="meta mb-3">
                    <span>CHAT</span>
                  </div>
                  <p>
                    ResilientX AI is trained on a vast amount of security data and can
                    provide guidance to remediate this issue
                  </p>

                  <div class="flex-end">
                    <button
                      class="button v-button is-raised is-primary-outlined"
                      @click="showAIModal = true"
                    >
                      REMEDIATE
                    </button>
                  </div>
                </div>
                <div class="recommendations-item">
                  <div class="recommendations-item-icon">
                    <VIconBox size="medium" color="primary" rounded>
                      <i class="fa fa-search has-text-white"></i>
                    </VIconBox>
                  </div>

                  <h3 class="dark-inverted">INVESTIGATE RESOURCE</h3>
                  <div class="meta mb-3">
                    <span>MANUAL</span>
                    <span v-if="!issue.type.remediation">Coming soon</span>
                  </div>
                  <p>
                    This remediation is based on a fast analysis of the resource &
                    automatically suggested fixes.
                  </p>

                  <div class="flex-end">
                    <button
                      class="button v-button is-raised is-primary-outlined"
                      :disabled="!issue.type.remediation"
                      @click="showRemadiationModal = true"
                    >
                      REMEDIATE
                    </button>
                  </div>
                </div>
                <div class="recommendations-item">
                  <div class="recommendations-item-icon">
                    <VIconBox size="medium" color="primary" rounded>
                      <i class="fa fa-share has-text-white"></i>
                    </VIconBox>
                  </div>

                  <h3 class="dark-inverted">SHARE EXTERNALLY</h3>
                  <div class="meta mb-3">
                    <span>MANUAL</span>
                  </div>
                  <p>This remediation is based on a fast analysis of the resource.</p>

                  <div class="flex-end">
                    <button
                      ref="copy"
                      class="button v-button is-raised is-primary-outlined"
                      @click="copyToClipboard($event)"
                    >
                      SHARE
                    </button>
                  </div>
                </div>
                <div class="recommendations-item">
                  <div class="recommendations-item-icon">
                    <VIconBox size="medium" color="primary" rounded>
                      <i class="fa fa-envelope has-text-white"></i>
                    </VIconBox>
                  </div>

                  <h3 class="dark-inverted">RESILIENTX REMEDIATION</h3>
                  <div class="meta mb-3">
                    <span>MANUAL</span>
                  </div>
                  <p>
                    Contact our ResilientX Cyber Security team to help you mitigate the
                    current issue.
                  </p>

                  <div class="flex-end">
                    <router-link
                      :to="{ name: 'Support' }"
                      class="button v-button is-raised is-primary-outlined"
                    >
                      CONTACT US
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4">
          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Issue status</h3></div>

            <div
              :class="
                canChangeStatus()
                  ? 'status-item is-flex is-align-items-center mb-2 is-clickable'
                  : 'status-item is-flex is-align-items-center mb-2 is-disabled'
              "
              @click="changeStatus('opened')"
            >
              <VIconWrap
                size="medium"
                color="info"
                :has-background="issue.status === 'opened'"
                dark-card-bordered
                icon="fa fa-folder-open has-text-white"
                rounded
              ></VIconWrap>

              <div class="meta ml-3"><p>Open</p></div>
            </div>
            <div
              :class="
                canChangeStatus()
                  ? 'status-item is-flex is-align-items-center mb-2 is-clickable'
                  : 'status-item is-flex is-align-items-center mb-2 is-disabled'
              "
              @click="changeStatus('in_progress')"
            >
              <VIconWrap
                size="medium"
                color="warning"
                :has-background="issue.status === 'in_progress'"
                dark-card-bordered
                icon="fa fa-spinner has-text-white"
                rounded
              ></VIconWrap>

              <div class="meta ml-3"><p>In progress</p></div>
            </div>
            <div
              :class="
                canChangeStatus()
                  ? 'status-item is-flex is-align-items-center mb-2 is-clickable'
                  : 'status-item is-flex is-align-items-center mb-2 is-disabled'
              "
              @click="changeStatus('risk_accepted')"
            >
              <VIconWrap
                size="medium"
                color="danger"
                :has-background="issue.status === 'risk_accepted'"
                dark-card-bordered
                icon="fa fa-exclamation-circle has-text-white"
                rounded
              ></VIconWrap>

              <div class="meta ml-3"><p>Risk accepted</p></div>
            </div>
            <div
              :class="
                canChangeStatus()
                  ? 'status-item is-flex is-align-items-center mb-2 is-clickable'
                  : 'status-item is-flex is-align-items-center mb-2 is-disabled'
              "
              @click="changeStatus('closed')"
            >
              <VIconWrap
                size="medium"
                color="success"
                :has-background="issue.status === 'closed'"
                dark-card-bordered
                icon="fa fa-check has-text-white"
                rounded
              ></VIconWrap>

              <div class="meta ml-3"><p>Closed</p></div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-head">
              <h3 class="dark-inverted">Mark as false</h3>
              <VControl>
                <VSwitchBlock
                  color="success"
                  :disabled="!canChangeStatus()"
                  :model-value="isFalsePositive"
                  :checked="issue.status === 'false_positive'"
                  @update:modelValue="
                    () => {
                      if (isFalsePositive) {
                        isFalsePositive = false
                        changeStatus('opened')
                      } else {
                        isFalsePositive = true
                        changeStatus('false_positive')
                      }
                    }
                  "
                />
              </VControl>
            </div>

            <p>
              Is this issue a False Positive? Mark it as False positive so ResilientX
              Security would get notified and improve it’s security engine.
            </p>
          </div>

          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Assignee</h3></div>

            <div v-if="issue.user_id">
              <div class="status-item is-flex is-align-items-center">
                <VAvatar :picture="issue.user.avatar" />

                <div class="meta ml-3">
                  <p>{{ issue.user.name }}</p>
                  <p>{{ issue.user.email }}</p>
                </div>
              </div>
              <button
                form=""
                class="button v-button is-raised is-primary-outlined mt-5"
                @click="showAssignModal = true"
              >
                Manage assignee
              </button>
            </div>
            <div v-else>
              <button
                form=""
                :class="
                  canPerformAction('issues', 'update')
                    ? 'button v-button is-raised is-primary-outlined'
                    : 'button v-button is-raised is-primary-outlined is-disabled'
                "
                @click="showAssignModal = true"
              >
                Assign user
              </button>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">History</h3></div>

            <div
              v-if="issue.activities.length"
              class="has-slimscroll"
              style="max-height: 400px"
            >
              <div
                v-for="user in issue.activities"
                :key="user.id"
                class="status-item is-flex is-align-items-center mb-3"
              >
                <VAvatar v-if="user?.user?.avatar" :picture="user.user.avatar" />

                <div class="meta ml-3">
                  <p>
                    {{ user?.user?.name ?? '-' }} <small>{{ user.created }}</small>
                  </p>
                  <p>{{ user.type_text }}</p>
                </div>
              </div>
            </div>
            <p v-else>No history.</p>
          </div>

          <div class="dashboard-card">
            <div class="card-head"><h3 class="dark-inverted">Notes</h3></div>

            <div
              v-if="issue.notes.length"
              class="has-slimscroll"
              style="max-height: 400px"
            >
              <div
                v-for="user in issue.notes"
                :key="user.id"
                class="status-item is-flex is-align-items-center mb-3"
              >
                <VAvatar :picture="user.user.avatar" />

                <div class="meta ml-3">
                  <p>
                    {{ user.user.name }} <small>{{ user.created }}</small>
                  </p>
                  <p style="word-break: break-all">{{ user.note }}</p>
                </div>
              </div>
            </div>
            <p v-else>Notes haven't been added yet.</p>

            <hr />

            <form @submit.prevent="addNote" @keydown="form.onKeydown($event)">
              <div class="field">
                <div class="control">
                  <textarea
                    v-model="form.note"
                    type="text"
                    class="textarea"
                    placeholder="Enter notes"
                  />
                </div>
              </div>

              <HasError :form="form" field="note" />

              <FormButton
                :form="form"
                class="button v-button is-primary btn-sm"
                :disabled="!canPerformAction('issues', 'update')"
              >
                {{ $t('Add') }}
              </FormButton>
            </form>
          </div>

          <button
            class="button v-button is-bold is-big is-raised is-primary btn-sm mb-2"
            style="flex: initial"
            @click="downloadReport($event)"
          >
            Download PDF
          </button>
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
      title="Remadiation"
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
import permissionsMixin from '../../mixins/permissionsMixin.js'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VIconBox from '/@src/components/base/icon/VIconBox.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VSwitchBlock from '/@src/components/base/form/VSwitchBlock.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import VIconWrap from '/@src/components/base/icon/VIconWrap.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import AssetItemComponent from '/@src/components/assets/widgets/AssetItemComponent.vue'
import IssueSeverityBadge from '/@src/components/issues/IssueSeverityBadge.vue'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import IssueAssignModal from '/@src/components/issues/IssueAssignModal.vue'
import CVEModalComponent from '/@src/components/modules/widgets/CVEModalComponent.vue'
import slugify from 'slugify'
import CWEModalComponent from '/@src/components/modules/widgets/CWEModalComponent.vue'
import Chat from '/@src/components/ai/Chat.vue'
import EmailLeakModalComponent from '/@src/components/modules/email-leaks/widgets/EmailLeakModalComponent.vue'
import NssModalComponent from '/@src/components/modules/nss/widgets/NssModalComponent.vue'
import CloudModalComponent from '/@src/components/modules/cloud-scanner/widgets/CloudModalComponent.vue'

export default {
  components: {
    CloudModalComponent,
    NssModalComponent,
    EmailLeakModalComponent,
    Chat,
    CWEModalComponent,
    CVEModalComponent,
    IssueAssignModal,
    IssueSeverityBadge,
    AssetItemComponent,
    ExposureGradeWidget,
    FormButton,
    HasError,
    VIconWrap,
    VModal,
    VAvatar,
    VSwitchBlock,
    VControl,
    VIconBox,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    relaunched: false,
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
    zap: null,
  }),
  computed: {
    ...mapGetters(['issue', 'general', 'workspace', 'manageableVendors']),
  },
  async mounted() {
    await Promise.all([this.getIssue()])
      .then(() => {
        // if (!this.issue.description && this.issue.type.slug === 'application-issue') {
        //   const id = this.issue.items[0].issuable.ref
        //   axios
        //     .get(`/zap/${id}`)
        //     .then((res) => {
        //       this.zap = res.data
        //     })
        //     .catch(() => {})
        // }

        this.formRemediationAsk.remediation_asked = this.issue.remediation_asked
        this.formRemediationAsk.remediation_question = this.issue.remediation_question
      })
      .finally(() => {
        this.loaded = true
      })
  },
  methods: {
    async retest() {
      return axios
        .post(`/task/${this.issue.task_id}/relaunch`)
        .then((res) => {
          this.relaunched = true
          if (res.data.success) {
            this.$store.dispatch('addAlert', {
              text: 'Retest launched',
              type: 'success',
            })
          } else {
            this.$store.dispatch('addAlert', {
              text: 'Error launching retest, asset already tested today',
              type: 'danger',
            })
          }
        })
        .catch(() => {
          this.$store.dispatch('addAlert', {
            text: 'Error launching retest',
            type: 'danger',
          })
        })
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
      return this.canPerformAction('issues', 'update')
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
    askRemediationAsk() {
      return this.formRemediationAsk
        .post(`/issue/${this.$route.params.issue}/remediation`)
        .then(() => {
          this.getIssue()
        })
        .catch(() => {})
    },
    askRemediationAnswer() {
      return this.formRemediationAnswer
        .put(`/issue/${this.$route.params.issue}/remediation`)
        .then(() => {
          this.formRemediationAnswer.remediation_answer = ''
          this.getIssue()
        })
        .catch(() => {})
    },
    async getIssue() {
      return axios
        .get(`/issue/${this.$route.params.issue}`)
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