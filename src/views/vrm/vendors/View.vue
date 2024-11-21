<template>
  <div>
    <div v-if="loading" class="app-init-wrapper">
      <VLoader class="is-grey" :active="true">
        <div />
      </VLoader>
    </div>
    <div v-else>
      <div class="lifestyle-dashboard lifestyle-dashboard-v1">
        <div class="lifestyle-dashboard-bg"></div>
        <div class="dashboard-header-wrapper">
          <div class="dashboard-header">
            <div v-if="scoreCard" class="avatar-container">
              <ExposureGradeWidget
                v-if="!asset.scanned_date"
                :key="scoreCard?.id"
                score="0"
                grade="N/A"
              />
              <ExposureGradeWidget
                v-else
                :key="scoreCard?.id"
                :score="scoreCard.exposure_score"
                :grade="scoreCard.exposure_score_grade ?? ''"
              />
            </div>
            <div class="header-meta">
              <div class="username-wrap">
                <div class="username">
                  <h3>
                    <span>{{ asset.name }}</span>
                    <Favorite
                      :id="asset.id"
                      class="mt-2"
                      type="vendor"
                      :value="asset.favorite"
                      @saved="getAsset()"
                    />
                  </h3>
                </div>
                <div class="badges"></div>
              </div>
              <div class="meta-description">
                <p>
                  Last scanned: <span>{{ asset.scanned_date_text }}</span>
                </p>
                <p>
                  {{ asset.industries.map((i) => i.name).join(', ') }},
                  {{ asset.address }}.
                </p>
              </div>
              <div class="meta-achievements">
                <span class="mr-2">
                  <a>
                    <span :key="scoreCard?.id" class="tag is-info">{{
                      scoreCard?.name
                    }}</span>
                  </a>
                </span>
                <span class="mr-2">
                  <a>
                    <span v-if="asset.fields.status === 'active'" class="tag is-success"
                      >Active</span
                    >
                    <span v-else class="tag is-danger">Archived</span>
                  </a>
                </span>
                <span class="mr-2">
                  <BusinessImpactBadge :impact="asset.fields.business_impact" />
                </span>
                <span class="mr-2">
                  <BusinessImpactRiskBadge :impact="asset.fields.business_impact_risk" />
                </span>
              </div>

              <div class="meta-achievements"></div>
            </div>
            <div class="end">
              <VDropdown right spaced class="user-dropdown profile-dropdown">
                <template #button="{ toggle }">
                  <a
                    class="is-trigger dropdown-trigger button v-button"
                    @keydown.space.prevent="toggle"
                    @click="toggle"
                  >
                    Scorecards
                  </a>
                </template>

                <template #content="{}">
                  <a
                    v-for="card in asset.scorecards"
                    :key="card.id"
                    class="dropdown-item is-media is-flex is-justify-content-space-between"
                    @click="switchCard(card)"
                  >
                    <div class="meta">
                      <span>{{ card.name }}</span>
                    </div>
                    <div
                      v-if="card.workspace_id"
                      @click.stop.prevent="
                        () => {
                          manageScoreCardModal = true
                          manageScoreCard = card
                        }
                      "
                    >
                      <i class="fa fa-pencil-alt"></i>
                    </div>
                  </a>

                  <hr class="dropdown-divider" />

                  <a
                    class="dropdown-item is-media"
                    @click="
                      () => {
                        manageScoreCardModal = true
                        manageScoreCard = null
                      }
                    "
                  >
                    <div class="meta">
                      <span>Add scorecard</span>
                    </div>
                  </a>
                </template>
              </VDropdown>

              <div class="has-text-right mt-3">
                <VendorDropdown :item="asset" @editAsset="editAsset" />
              </div>
            </div>
          </div>
        </div>

        <div class="tabs-wrapper">
          <div class="tabs-inner">
            <div class="tabs">
              <ul>
                <li :class="[activeTab === 'overview' && 'is-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="activeTab = 'overview'"
                    @click="activeTab = 'overview'"
                    >Overview</a
                  >
                </li>
                <li :class="[activeTab === 'domains' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'domains'"
                    @click="activeTab = 'domains'"
                    >Assets</a
                  >
                </li>
                <li :class="[activeTab === 'issues' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'issues'"
                    @click="activeTab = 'issues'"
                    >Issues</a
                  >
                </li>

                <li :class="[activeTab === 'events' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'events'"
                    @click="activeTab = 'events'"
                    >Events</a
                  >
                </li>

                <li :class="[activeTab === 'matrix' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'matrix'"
                    @click="activeTab = 'matrix'"
                    >Risk matrix</a
                  >
                </li>

                <li :class="[activeTab === 'vulnerabilities' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'vulnerabilities'"
                    @click="activeTab = 'vulnerabilities'"
                    >CVE</a
                  >
                </li>
                <li :class="[activeTab === 'technologies' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'technologies'"
                    @click="activeTab = 'technologies'"
                    >Technologies</a
                  >
                </li>
                <li :class="[activeTab === 'sbom' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'sbom'"
                    @click="activeTab = 'sbom'"
                    >SBOM</a
                  >
                </li>
                <li :class="[activeTab === 'certificates' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'certificates'"
                    @click="activeTab = 'certificates'"
                    >Certificates</a
                  >
                </li>
                <li :class="[activeTab === 'ports' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'ports'"
                    @click="activeTab = 'ports'"
                    >Ports</a
                  >
                </li>
                <li :class="[activeTab === 'typosquatting' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'typosquatting'"
                    @click="activeTab = 'typosquatting'"
                    >Typosquatting</a
                  >
                </li>
                <li :class="[activeTab === 'phishings' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'phishings'"
                    @click="activeTab = 'phishings'"
                    >Phishing</a
                  >
                </li>
                <li :class="[activeTab === 'email-leaks' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'email-leaks'"
                    @click="activeTab = 'email-leaks'"
                    >Credential leaks</a
                  >
                </li>
                <li :class="[activeTab === 'questionnaires' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'questionnaires'"
                    @click="activeTab = 'questionnaires'"
                    >Questionnaires</a
                  >
                </li>
                <li :class="[activeTab === 'contacts' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'contacts'"
                    @click="activeTab = 'contacts'"
                    >Contacts</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'overview'">
            <VendorNotScannedComponent :button="true" :asset="asset" :project="project" />

            <div v-if="asset.scanned_date" class="collection-overview">
              <AssetSummaryWidget
                :key="scoreCard.id"
                :collection="{ id: scoreCard.id }"
              />

              <div class="columns">
                <div class="column is-7">
                  <ExposureOverTimeWidget
                    :key="scoreCard.id"
                    :collection="{ id: scoreCard.id }"
                  />
                </div>
                <div class="column is-5">
                  <div class="dashboard-card p-2">
                    <IssuesStatsWidget
                      :key="scoreCard.id"
                      class="mb-5"
                      :collection="{ id: scoreCard.id }"
                    />

                    <CVEStatsWidget
                      :key="scoreCard.id"
                      :collection="{ id: scoreCard.id }"
                    />
                  </div>
                </div>
              </div>

              <div class="columns">
                <div class="column is-9">
                  <VulnerabilitiesTopWidget
                    :key="scoreCard.id"
                    :collection="{ id: scoreCard.id }"
                  />
                </div>
                <div class="column is-3">
                  <TopAssetsInRisk
                    :key="scoreCard.id"
                    :collection="{ id: scoreCard.id }"
                  />
                </div>
              </div>

              <div class="columns">
                <div class="column is-9">
                  <LatestIssuesWidget
                    :key="scoreCard.id"
                    :collection="{ id: scoreCard.id }"
                  />
                </div>
                <div class="column is-3">
                  <LatestEventsWidget
                    :key="scoreCard.id"
                    :collection="{ id: scoreCard.id }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'domains'">
            <VendorsDomainsComponent
              :key="scoreCard.id"
              :project="{ id: asset.project_id }"
              :collection="{ id: scoreCard.id }"
            />
          </div>

          <div v-if="activeTab === 'events'">
            <VendorEventsComponent
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
            />
          </div>

          <div v-if="activeTab === 'matrix'">
            <RiskMatrix v-if="!loading" :vendor="asset" @edited="getAsset" />
          </div>

          <div v-if="activeTab === 'issues'">
            <VendorIssuesComponent
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
            />
          </div>

          <div v-if="activeTab === 'questionnaires'">
            <VendorsQuestionnairesLinkComponent :vendor-id="asset.id" />
          </div>

          <div v-if="activeTab === 'technologies'">
            <VendorTechnologiesTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'sbom'">
            <VendorSBOMTableWidget
              v-if="!loading"
              :key="asset.id"
              :collection="asset"
              :calendar="true"
              :link="false"
            />
          </div>

          <div v-if="activeTab === 'certificates'">
            <CertificatesTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'phishings'">
            <VendorPhishingsTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'email-leaks'">
            <EmailLeaksStatsWidget
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              class="mb-5"
            />

            <VendorEmailLeaksTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'ports'">
            <VendorPortsTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'typosquatting'">
            <VendorTyposquattingTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'vulnerabilities'">
            <VendorVulnerabilitiesTableWidget
              v-if="!loading"
              :key="scoreCard.id"
              :collection="{ id: scoreCard.id }"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'contacts'">
            <VendorsContactsComponent :vendor="asset" :workspace="workspace" />
          </div>
        </div>
      </div>
    </div>

    <VendorsModal
      v-if="showModal"
      :editable="editable"
      :workspace="workspace"
      :project="project"
      @closeModal="hideModal"
    />

    <div>
      <VModal
        is="form"
        :open="manageScoreCardModal"
        title="Manage scorecard"
        size="big"
        actions="right"
        @submit.prevent="false"
        @close="
          () => {
            loading = true
            manageScoreCardModal = false
            const card = scoreCard
            scoreCard = null
            $nextTick(() => {
              scoreCard = card
              loading = false
            })
            getAsset()
          }
        "
      >
        <template #content>
          <ScoreCardAssetsComponent
            :collection="asset"
            :card="manageScoreCard"
            @edit="scoreCardEdited"
          />
        </template>
      </VModal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import { axios } from '/@src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import Favorite from '/@src/components/favorites/FavoriteComponent.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import VendorsDomainsComponent from '/@src/components/vendors/VendorsDomainsComponent.vue'
import VendorsContactsComponent from '/@src/components/vendors/VendorsContactsComponent.vue'
import AssetSummaryWidget from '/@src/components/modules/cyber-ex/widgets/AssetSummaryWidget.vue'
import CVEStatsWidget from '/@src/components/modules/cyber-ex/widgets/CVEStatsWidget.vue'
import VulnerabilitiesTopWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTopWidget.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import LatestEventsWidget from '/@src/components/events/widgets/LatestEventsWidget.vue'
import LatestIssuesWidget from '/@src/components/issues/widgets/LatestIssuesWidget.vue'
import TopAssetsInRisk from '/@src/components/modules/cyber-ex/widgets/TopAssetsInRisk.vue'
import VendorDropdown from '/@src/components/vendors/VendorDropdown.vue'
import VendorsModal from '/@src/components/vendors/VendorsModal.vue'
import VendorsQuestionnairesLinkComponent from '/@src/components/vendors/questionnaires/VendorsQuestionnairesLinkComponent.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import ScoreCardAssetsComponent from '/@src/components/vendors/ScoreCardAssetsComponent.vue'
import VendorTechnologiesTableWidget from '/@src/components/vendors/assets/VendorTechnologiesTableWidget.vue'
import VendorIssuesComponent from '/@src/components/vendors/assets/VendorIssuesComponent.vue'
import VendorEventsComponent from '/@src/components/vendors/assets/VendorEventsComponent.vue'
import VendorVulnerabilitiesTableWidget from '/@src/components/vendors/assets/VendorVulnerabilitiesTableWidget.vue'
import VendorNotScannedComponent from '/@src/components/vendors/assets/VendorNotScannedComponent.vue'
import ExposureOverTimeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureOverTimeWidget.vue'
import RiskMatrix from '/@src/components/RiskMatrix.vue'
import CertificatesTableWidget from '/@src/components/modules/cyber-ex/widgets/CertificatesTableWidget.vue'
import VendorPortsTableWidget from '/@src/components/vendors/assets/VendorPortsTableWidget.vue'
import VendorTyposquattingTableWidget from '/@src/components/vendors/assets/VendorTyposquattingTableWidget.vue'
import VendorEmailLeaksTableWidget from '/@src/components/vendors/assets/VendorEmailLeaksTableWidget.vue'
import VendorPhishingsTableWidget from '/@src/components/vendors/assets/VendorPhishingsTableWidget.vue'
import BusinessImpactBadge from '/@src/components/assets/BusinessImpactBadge.vue'
import BusinessImpactRiskBadge from '/@src/components/assets/BusinessImpactRiskBadge.vue'
import EmailLeaksStatsWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksStatsWidget.vue'
import VendorSBOMTableWidget from '/@src/components/vendors/assets/VendorSBOMTableWidget.vue'

export default {
  components: {
    VendorSBOMTableWidget,
    EmailLeaksStatsWidget,
    BusinessImpactRiskBadge,
    BusinessImpactBadge,
    VendorPhishingsTableWidget,
    VendorEmailLeaksTableWidget,
    VendorTyposquattingTableWidget,
    VendorPortsTableWidget,
    CertificatesTableWidget,
    ExposureOverTimeWidget,
    VendorNotScannedComponent,
    VendorVulnerabilitiesTableWidget,
    VendorEventsComponent,
    VendorIssuesComponent,
    VendorTechnologiesTableWidget,
    ScoreCardAssetsComponent,
    VModal,
    VDropdown,
    VendorsQuestionnairesLinkComponent,
    VendorsModal,
    VendorDropdown,
    TopAssetsInRisk,
    LatestIssuesWidget,
    LatestEventsWidget,
    IssuesStatsWidget,
    VulnerabilitiesTopWidget,
    CVEStatsWidget,
    AssetSummaryWidget,
    VendorsContactsComponent,
    VendorsDomainsComponent,
    ExposureGradeWidget,
    Favorite,
    RiskMatrix,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    scoreCard: null,
    manageScoreCard: null,
    manageScoreCardModal: false,
    asset: null,
    loading: true,
    activeTab: 'overview',
    showModal: false,
    monitors: [],
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  beforeCreate() {
    this.loading = true
  },
  async mounted() {
    await Promise.all([this.getAsset()])
      .then(() => {
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
              name: 'Workspaces',
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
            label: 'Companies',
            to: {
              name: 'VendorsView',
              params: { id: this.workspace.id },
            },
          },
          {
            label: this.asset.name,
            to: {},
          },
        ]
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    switchCard(card) {
      this.loading = true
      this.scoreCard = null
      this.scoreCard = card
      this.loading = false
    },
    async getAsset() {
      return axios
        .get(`/vendor/${this.$route.params.asset}?workspace_id=${this.workspace.id}`)
        .then((res) => {
          this.asset = res.data.data

          if (!this.scoreCard) {
            this.scoreCard = this.asset.scorecards[0]

            if (this.asset.fields.vendor_scorecard_id) {
              this.scoreCard = this.asset.scorecards.find(
                (card) => card.id === this.asset.fields.vendor_scorecard_id
              )
            }
          } else {
            if (this.asset.fields.vendor_scorecard_id) {
              this.scoreCard = this.asset.scorecards.find(
                (card) => card.id === this.scoreCard.id
              )
              this.$forceUpdate()
            }
          }

          this.monitors = this.getAllMonitors(this.asset.collections)
        })
        .catch(() => {})
    },
    getAllMonitors(collections) {
      let monitors = []

      collections.forEach((collection) => {
        if (collection.schedules) {
          collection.schedules.forEach((schedule) => {
            monitors.push(schedule)
          })
        }
      })

      return monitors
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getAsset()
    },
    editAsset(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    scoreCardEdited(card) {
      this.scoreCard = card
      this.getAsset()
    },
  },
  metaInfo() {
    return {
      title: this.asset ? this.asset.name : '',
    }
  },
}
</script>

<style scoped>
.collection-overview {
  .dashboard-card,
  .stat-widget {
    height: 100%;
  }
}
</style>