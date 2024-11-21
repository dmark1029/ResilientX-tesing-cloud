<template>
  <div class="onboarding-wrapper onboarding-v1">
    <div class="title-wrap">
      <p>Generate extensive reports</p>
      <h2 class="dark-inverted">Start by selecting report type</h2>
    </div>

    <div class="onboarding-wrap">
      <VTabs
        slider
        align="centered"
        type="rounded"
        selected="team"
        :tabs="
          navigation
            ? [
                { label: 'Generate', value: 'team' },
                { label: 'Generated', value: 'projects', new: isAnyNew },
                { label: 'Recurring', value: 'tasks' },
              ]
            : []
        "
        @update:selected="
          () => {
            getReports()
            getRecurringReports()
          }
        "
      >
        <template #tab="{ activeValue }">
          <div v-if="activeValue === 'team'" class="onboarding-wrap">
            <div class="onboarding-wrap-inner">
              <div
                class="onboarding-card"
                @click="hasLicense('cyber-ex') ? showModal('cyber-exposure') : ''"
              >
                <img class="dark-image" src="/assets/cyber.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="hasLicense('cyber-ex') ? 'is-clickable' : 'is-disabled'"
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
              <div
                class="onboarding-card is-clickable"
                @click="hasLicense('dast-scanner') ? showModal('application') : ''"
              >
                <img class="dark-image" src="/assets/app.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="hasLicense('dast-scanner') ? 'is-clickable' : 'is-disabled'"
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
              <div
                class="onboarding-card is-clickable"
                @click="hasLicense('network') ? showModal('network') : ''"
              >
                <img class="dark-image" src="/assets/network.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="hasLicense('network') ? 'is-clickable' : 'is-disabled'"
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
              <div
                class="onboarding-card is-clickable"
                @click="hasLicense('module-credential-leak') ? showModal('leak') : ''"
              >
                <img class="dark-image" src="/assets/leaks.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="
                    hasLicense('module-credential-leak') ? 'is-clickable' : 'is-disabled'
                  "
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
            </div>
            <div class="onboarding-wrap-inner">
              <div
                class="onboarding-card"
                @click="hasLicense('cloud-scanner') ? showModal('cloud') : ''"
              >
                <img class="dark-image" src="/assets/cloud.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="hasLicense('cloud-scanner') ? 'is-clickable' : 'is-disabled'"
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
              <div class="onboarding-card is-clickable" @click="showModal('issues')">
                <img class="dark-image" src="/assets/issues.png" alt="" />
                <div class="onboarding-content">
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>
              <div
                class="onboarding-card"
                @click="hasLicense('cyber-ex') ? showModal('typosquatting') : ''"
              >
                <img class="dark-image" src="/assets/typosquatting.png" alt="" />
                <div
                  class="onboarding-content"
                  :class="hasLicense('cyber-ex') ? 'is-clickable' : 'is-disabled'"
                >
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Generate </VButton>
                  </div>
                </div>
              </div>

              <div class="onboarding-card is-clickable" @click="goToSupport">
                <img class="dark-image" src="/assets/new-report.png" alt="" />
                <div class="onboarding-content">
                  <div class="button-wrap">
                    <VButton color="primary" rounded elevated> Contact us </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeValue === 'projects'" class="onboarding-wrap">
            <div class="onboarding-wrap-inner is-block">
              <div class="stat-widget table-widget-v1 is-straight">
                <div class="widget-head">
                  <h3 class="dark-inverted">Generated reports</h3>
                </div>
                <div v-if="loaded" class="datatable-container">
                  <table
                    v-if="issues?.data?.length"
                    class="table is-hoverable is-fullwidth"
                  >
                    <tbody>
                      <tr
                        v-for="issue in issues.data"
                        :key="issue.id"
                        v-table-click="() => download(issue)"
                        :class="issue.status === 'failed' ? '' : 'is-clickable'"
                      >
                        <td>
                          <div class="double-line">
                            <span class="dark-inverted"
                              >{{ issue.asset?.name }}{{ issue.collection?.name }}</span
                            >
                            <span>{{ getReportText(issue.type) }}</span>
                          </div>
                        </td>
                        <td>
                          <div class="tag-wrap">
                            <span v-if="issue.status === 'queued'" class="tag"
                              >Queued</span
                            >
                            <span
                              v-if="issue.status === 'generated'"
                              class="tag is-success"
                              >Generated</span
                            >
                            <span v-if="issue.status === 'failed'" class="tag is-danger"
                              >Failed</span
                            >
                          </div>
                        </td>
                        <td>
                          <div class="tag-wrap">
                            <span
                              v-if="issue.is_new && issue.status === 'generated'"
                              class="tag is-success"
                              >NEW</span
                            >
                            <span
                              :class="
                                issue.is_new && issue.status === 'generated'
                                  ? 'has-text-light ml-3'
                                  : 'has-text-light'
                              "
                              >{{ issue.date }}</span
                            >
                          </div>
                        </td>
                        <td class="is-end">
                          <div class="buttons">
                            <button
                              class="button is-dark-outlined"
                              :disabled="issue.status !== 'generated'"
                            >
                              <span class="icon is-small fa fa-download"></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ul v-else>
                    <li class="pt-4 pb-3">
                      <p>No reports found</p>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <VLoader :active="true">
                    <div style="height: 300px" />
                  </VLoader>
                </div>
              </div>
              <Pagination
                :limit="5"
                :data="issues"
                @pagination-change-page="getReports"
              />
            </div>
          </div>
          <div v-else-if="activeValue === 'tasks'" class="onboarding-wrap">
            <div class="onboarding-wrap-inner is-block">
              <div class="stat-widget table-widget-v1 is-straight">
                <div class="widget-head">
                  <h3 class="dark-inverted">Recurring reports</h3>
                  <button
                    class="button v-button is-primary"
                    @click="showAddRecurringReportModal = true"
                  >
                    Add new
                  </button>
                </div>
                <div v-if="loaded" class="datatable-container">
                  <table
                    v-if="recurrings?.data?.length"
                    class="table is-hoverable is-fullwidth"
                  >
                    <tbody>
                      <tr v-for="issue in recurrings.data" :key="issue.id">
                        <td>
                          <div class="double-line">
                            <span class="dark-inverted"
                              >{{ issue.asset?.name }}{{ issue.collection?.name }}</span
                            >
                            <span>{{ getReportText(issue.type) }}</span>
                          </div>
                        </td>
                        <td>Scheduled: {{ issue.next_run_text }}</td>
                        <td class="is-end">
                          <div class="buttons">
                            <a
                              class="has-text-danger"
                              @click="deleteRecurringReport(issue)"
                              ><i class="fa fa-trash"
                            /></a>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ul v-else>
                    <li class="pt-4 pb-3">
                      <p>No recurring reports found</p>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <VLoader :active="true">
                    <div style="height: 300px" />
                  </VLoader>
                </div>
              </div>
              <Pagination
                v-if="recurrings"
                :limit="5"
                :data="recurrings"
                @pagination-change-page="getRecurringReports"
              />
            </div>
          </div>
        </template>
      </VTabs>
    </div>

    <AreYouSureModal ref="confirmDialogue" />

    <VModal
      is="div"
      :open="showGenerateModal"
      title="Specify report details"
      size="big"
      :noscroll="true"
      @close="showGenerateModal = false"
    >
      <template #content>
        <div class="p-5">
          <VField v-if="!collection && !asset" v-slot="{}" class="is-curved-select w-100">
            <label class="label">Group</label>
            <VControl>
              <Multiselect
                id="ajax"
                v-model="collection_id"
                placeholder="Group"
                aria-autocomplete="none"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="3"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="countries"
                @open="asyncFind('')"
                @search-change="asyncFind"
              >
              </Multiselect>
            </VControl>
          </VField>

          <VField v-slot="{ id }" class="is-curved-select">
            <label :class="!collection && !asset ? 'label mt-4' : 'label'"
              >Report type</label
            >
            <VControl>
              <Multiselect
                v-model="type"
                :attrs="{ id }"
                :options="{ full: 'Full report', summary: 'Executive report' }"
                placeholder="Select type"
              />
            </VControl>
          </VField>

          <button
            class="button v-button is-bold is-big is-raised is-primary mt-4"
            :disabled="generating"
            @click="generate"
          >
            Generate
          </button>
        </div>
      </template>
    </VModal>

    <VModal
      is="div"
      :open="showAddRecurringReportModal"
      title="Add recurring report"
      size="big"
      :noscroll="true"
      @close="showAddRecurringReportModal = false"
    >
      <template #content>
        <div class="p-5">
          <VField v-if="!collection && !asset" v-slot="{}" class="is-curved-select w-100">
            <label class="label">Group</label>
            <VControl>
              <Multiselect
                id="ajax"
                v-model="form.collection_id"
                placeholder="Group"
                aria-autocomplete="none"
                :internal-search="false"
                :clear-on-select="false"
                :close-on-select="false"
                :options-limit="300"
                :limit="3"
                :max-height="600"
                :show-no-results="false"
                :hide-selected="true"
                open-direction="bottom"
                :searchable="true"
                :options="countries"
                @open="asyncFind('')"
                @search-change="asyncFind"
              >
              </Multiselect>
            </VControl>
          </VField>

          <VField v-slot="{ id }" class="is-curved-select">
            <label :class="!collection && !asset ? 'label mt-4' : 'label'"
              >Report type</label
            >
            <VControl>
              <Multiselect
                v-model="form.type"
                :attrs="{ id }"
                :options="reports"
                placeholder="Select type"
              />
            </VControl>
            <HasError :form="form" field="type" />
            <p v-if="form.type" class="help mt-2">
              Don't forget to create relevant scheduled scans.
            </p>
          </VField>

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
            <label class="label">Schedule</label>
            <VField addons>
              <VControl>
                <VButton
                  icon="fas fa-calendar-day"
                  :color="form.schedule === 'dailyAt' ? 'primary' : ''"
                  @click="
                    () => {
                      form.schedule = 'dailyAt'
                      form.time = '12:00'
                    }
                  "
                  >Daily</VButton
                >
              </VControl>
              <VControl>
                <VButton
                  icon="fas fa-calendar-week"
                  :color="form.schedule === 'weeklyOn' ? 'primary' : ''"
                  @click="
                    () => {
                      form.schedule = 'weeklyOn'
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
                  :color="form.schedule === 'monthlyOn' ? 'primary' : ''"
                  @click="
                    () => {
                      form.schedule = 'monthlyOn'
                      form.day_month = 1
                      form.time = '12:00'
                    }
                  "
                  >Monthly</VButton
                >
              </VControl>
            </VField>

            <div class="columns">
              <div class="column is-6">
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
              </div>
              <div class="column is-6">
                <div v-if="form.schedule === 'weeklyOn'" class="field">
                  <label class="label">Day of a week (1-7)</label>
                  <input
                    v-model="form.day_week"
                    type="text"
                    class="input v-input"
                    placeholder="Enter day of a week."
                  />
                  <HasError :form="form" field="day_week" />
                </div>
                <div v-if="form.schedule === 'monthlyOn'" class="field">
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
            </div>
          </div>

          <button
            class="button v-button is-bold is-big is-raised is-primary mt-4"
            :disabled="form.busy"
            @click="saveRecurringReport"
          >
            Add
          </button>
        </div>
      </template>
    </VModal>

    <VModal
      is="div"
      :open="$route.query.report"
      title="Downloading generated report"
      size="big"
      :noscroll="true"
      @close="$router.replace({ query: null })"
    >
      <template #content>
        <div class="p-5">
          <VLoader :active="true">
            <div style="height: 300px" />
          </VLoader>
        </div>
      </template>
    </VModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VButton from '/@src/components/base/button/VButton.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import slugify from 'slugify'
import Pagination from '/@src/components/Pagination.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import Form from '/@src/form'
import { HasError } from 'vform/src/components/bootstrap5'

export default {
  components: {
    AreYouSureModal,
    Pagination,
    VLoader,
    VField,
    VControl,
    Multiselect,
    HasError,
    VModal,
    VTabs,
    VButton,
  },
  props: ['project', 'workspace', 'collection', 'asset', 'navigation'],
  data: () => ({
    form: new Form({}),
    collection_id: null,
    countries: {},
    issues: null,
    recurrings: null,
    type: 'full',
    report: null,
    showGenerateModal: false,
    showAddRecurringReportModal: false,
    loaded: false,
    generating: false,
    isAnyNew: false,
    reports: {
      'cyber-exposure': 'Cyber exposure report',
      'cyber-exposure-summary': 'Cyber exposure executive report',
      application: 'Application security report',
      'application-summary': 'Application security executive report',
      network: 'Network security report',
      'network-summary': 'Network security executive report',
      leak: 'Credentials leak report',
      'leak-summary': 'Credentials leak executive report',
      cloud: 'Cloud security report',
      'cloud-summary': 'Cloud security executive report',
      issues: 'Issues report',
      'issues-summary': 'Issues executive report',
    },
  }),
  computed: {
    ...mapGetters(['user', 'general']),
  },
  async mounted() {
    await this.getReports()
    if (this.$route.query.report) {
      await axios.get('/report/' + this.$route.query.report).then(async (res) => {
        await this.download(res.data.data)

        setTimeout(() => {
          this.$router.replace({ query: null })
        }, 2000)
      })
    }

    if (this.user.timezone) {
      this.form.timezone = this.user.timezone
    }
  },
  methods: {
    hasLicense(slug) {
      let has = false
      if (!this.workspace?.activeLicense) {
        return false
      }

      this.workspace.activeLicense.modules.forEach((license) => {
        if (slug === 'network') {
          if (license.slug === 'nss-external' || license.slug === 'nss-internal') {
            has = true
          }
        } else {
          if (slug === license.slug) {
            has = true
          }
        }
      })
      return has
    },
    getReportText(type) {
      switch (type) {
        case 'cyber-exposure':
          return 'Cyber exposure report'
        case 'cyber-exposure-summary':
          return 'Cyber exposure executive report'
        case 'application':
          return 'Application security report'
        case 'application-summary':
          return 'Application security executive report'
        case 'network':
          return 'Network security report'
        case 'network-summary':
          return 'Network security executive report'
        case 'leak':
          return 'Credentials leak report'
        case 'leak-summary':
          return 'Credentials leak executive report'
        case 'cloud':
          return 'Cloud security report'
        case 'cloud-summary':
          return 'Cloud security executive report'
        case 'issues':
          return 'Issues report'
        case 'issues-summary':
          return 'Issues executive report'
      }
    },
    saveRecurringReport() {
      this.form.platform = 'uem'
      this.form.workspace_id = this.workspace.id
      const form = this.form.post('/recurring-report')

      return new Promise((resolve) => {
        form
          .then(() => {
            this.getRecurringReports()
            this.showAddRecurringReportModal = false
            resolve()
          })
          .catch(() => {})
      })
    },
    asyncFind(query) {
      this.isLoading = true
      axios
        .get('/collection', {
          params: {
            id: this.project?.id,
            workspace_id: this.workspace?.id,
            q: query,
          },
        })
        .then((res) => {
          const groups = {}
          res.data.data.forEach((item) => {
            groups[item.id] = item.name
          })
          this.countries = groups
          this.isLoading = false
        })
        .catch(() => {})
    },
    async deleteRecurringReport(item) {
      let ok = await this.$refs.confirmDialogue.show({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this item?',
        okButton: 'Yes',
        cancelButton: 'No',
      })

      if (ok) {
        if (item.id) {
          axios
            .delete('/recurring-report/' + item.id)
            .then(() => {
              this.getRecurringReports()
            })
            .catch((e) => {
              if (e.response.data.message) {
                alert(e.response.data.message)
              }
            })
        }
      }
    },
    goToSupport() {
      this.$router.push({ name: 'Support' })
    },
    generate() {
      if (!this.asset?.id && !this.collection_id && !this.collection?.id) {
        this.$store.dispatch('addAlert', {
          text: 'Please select a group or asset to generate a report',
          type: 'danger',
        })
        return
      }
      if (!this.type) {
        this.$store.dispatch('addAlert', {
          text: 'Please select report type to generate a report',
          type: 'danger',
        })
        return
      }

      this.generating = true

      axios
        .post('/report/' + this.report + (this.type === 'summary' ? '-summary' : ''), {
          collection_id: this.collection_id ?? this.collection?.id,
          asset_id: this.asset?.id,
        })
        .then(() => {
          this.showGenerateModal = false
          this.generating = false
          this.getReports()

          if (this.asset?.id || this.collection?.id) {
            this.$store.dispatch('addAlert', {
              text: 'Report generation has been queued, report will be available shortly',
              type: 'success',
            })
          }
        })
        .catch(() => {
          this.generating = false
          alert(
            'Failed to queue report generation. Please try again later or contact support'
          )
        })
    },
    async getReports(page = 1) {
      await axios
        .get('/report', {
          params: {
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            platform: 'uem',
            page: page,
          },
        })
        .then((res) => {
          this.loaded = true
          this.issues = res.data

          this.isAnyNew = this.issues.data.some(
            (issue) => issue.is_new && issue.status === 'generated'
          )
        })
    },
    getRecurringReports() {
      axios
        .get('/recurring-report', {
          params: {
            workspace_id: this.workspace?.id,
            project_id: this.project?.id,
            platform: 'uem',
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.recurrings = res.data
        })
    },
    showModal(report) {
      this.report = report
      this.showGenerateModal = true
    },
    download(issue) {
      if (issue.status !== 'generated') {
        return
      }

      axios
        .get('/report/' + issue.id + '/download', {
          responseType: 'blob',
          timeout: 60000,
        })
        .then((res) => {
          if (res.data !== '') {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            const href = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = href

            let title = ''
            if (issue.asset) {
              title = issue.asset.name
            } else if (issue.collection) {
              title = issue.collection.name
            }

            let name =
              slugify(title + '-' + issue.type + '-report', {
                lower: true,
              }) + '.pdf'

            link.setAttribute('download', name)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(href)

            this.getReports()
          } else if (res.status === 204) {
            setTimeout(() => {
              alert('Report is not ready yet. Please try again later')
            }, 3000)
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.is-navbar {
  .onboarding-wrapper {
    margin-top: 40px;
  }
}

.onboarding-wrapper {
  .title-wrap {
    text-align: center;

    h2 {
      font-family: var(--font-alt);
      font-weight: 600;
      font-size: 1.4rem;
      color: var(--dark-text);
    }

    p {
      text-transform: uppercase;
      font-family: var(--font);
      font-size: 0.85rem;
    }
  }

  &.onboarding-v1 {
    .onboarding-wrap {
      padding: 30px 0;

      .onboarding-wrap-inner {
        display: flex;
        max-width: 950px;
        margin: 0 auto;

        .onboarding-card {
          @include vuero-r-card;
          position: relative;

          margin: 8px;
          width: calc(33.3% - 16px);
          text-align: center;
          padding: 0;
          overflow: hidden;
          transition: all 0.3s; // transition-all test
          animation: fadeIn 0.3s ease-in-out;

          > img {
            display: block !important;
            width: 100%;
            margin: 0 auto;
          }

          &:hover {
            .onboarding-content {
              opacity: 1;
            }
          }
          .is-disabled {
            opacity: 1 !important;
            .button-wrap {
              opacity: 0 !important;
            }
          }
          .onboarding-content {
            padding: 0 20px 30px;
            position: absolute;
            bottom: 0px;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(165, 163, 163, 0.32);
            opacity: 0;
            transition:
              opacity 0.3s,
              transform 0.3s;

            h3 {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              color: var(--dark-text);
              margin-bottom: 12px;
            }

            p {
              font-family: var(--font);
              font-size: 0.95rem;
            }

            .button-wrap {
              position: absolute;
              bottom: 70px;
              left: 0;
              right: 0;
              text-align: center;
              padding: 20px 0 0;

              .button {
                min-width: 140px;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .onboarding-wrapper {
    &.onboarding-v1 {
      .onboarding-wrap {
        .onboarding-wrap-inner {
          .onboarding-card {
            @include vuero-card--dark;
          }
        }
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .onboarding-wrapper {
    .standard-onboarding {
      padding: 20px 0;
    }

    .title-wrap {
      h2 {
        max-width: 280px;
        margin: 0 auto;
      }
    }

    .onboarding-wrap {
      .onboarding-wrap-inner {
        flex-wrap: wrap;

        .onboarding-card {
          min-width: calc(100% - 16px) !important;
        }
      }
    }
  }
}
</style>


<style lang="scss" scoped>
.stat-widget {
  &.table-widget-v1 {
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
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .stat-widget {
    &.table-widget-v1 {
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
}
</style>