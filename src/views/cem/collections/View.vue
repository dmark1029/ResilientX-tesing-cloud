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
            <div class="avatar-container">
              <ExposureGradeWidget
                v-if="!asset.scanned_date"
                :score="asset.exposure_score ?? 0"
                grade="N/A"
              />
              <ExposureGradeWidget
                v-else
                :score="asset.exposure_score"
                :grade="asset.exposure_score_grade ?? 0"
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
                      type="asset"
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
                <p>{{ asset.assets_count }} assets</p>
              </div>
              <div class="meta-achievements">
                <p class="mr-2">Monitors:</p>
                <span v-if="asset.schedules.length">
                  <template v-for="schedule in asset.schedules" :key="schedule.id">
                    <span class="tag is-info mr-2">
                      {{ schedule.monitor_text }}
                    </span>
                    <span
                      v-if="schedule.monitor === 'exposure' && schedule.values?.discovery"
                      class="tag is-info mr-2"
                    >
                      Asset discovery
                    </span>
                  </template>
                </span>
                <span v-else> - </span>
              </div>

              <!--              <div class="meta-achievements">-->
              <!--                <router-link-->
              <!--                  :to="{-->
              <!--                    name: 'ProjectCollectionReportView',-->
              <!--                    params: { id: asset.project_id, collection: asset.id },-->
              <!--                  }"-->
              <!--                  :class="-->
              <!--                    asset.scanned_date-->
              <!--                      ? 'button v-button is-primary mb-2'-->
              <!--                      : 'button is-disabled v-button is-primary mb-2'-->
              <!--                  "-->
              <!--                >-->
              <!--                  View full report-->
              <!--                </router-link>-->
              <!--              </div>-->
            </div>

            <div class="end has-text-right">
              <div class="mb-2">
                <button
                  type="button"
                  aria-hidden="false"
                  class="button button v-button is-elevated is-primary"
                  @click="showScanNowModal = true"
                >
                  <span class="icon rtl-reflect"
                    ><i aria-hidden="true" class="fas fa-rocket"></i></span
                  ><span> Scan Now </span>
                </button>
              </div>

              <CollectionsDropdown
                :item="asset"
                @editCollection="editCollection"
                @manageAssets="
                  () => {
                    activeTab = 'assets'
                  }
                "
              />
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

                <li :class="[activeTab === 'assets' && 'is-active']">
                  <a
                    tabindex="0"
                    role="button"
                    @keydown.space.prevent="activeTab = 'assets'"
                    @click="activeTab = 'assets'"
                    >Assets</a
                  >
                </li>

                <li :class="[activeTab === 'issues' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'issues'"
                    @click="activeTab = 'issues'"
                    >Issues</a
                  >
                </li>

                <li :class="[activeTab === 'events' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'events'"
                    @click="activeTab = 'events'"
                    >Events</a
                  >
                </li>

                <li :class="[activeTab === 'matrix' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'matrix'"
                    @click="activeTab = 'matrix'"
                    >Risk matrix</a
                  >
                </li>

                <li :class="[activeTab === 'vulnerabilities' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'vulnerabilities'"
                    @click="activeTab = 'vulnerabilities'"
                    >CVE</a
                  >
                </li>
                <li :class="[activeTab === 'alerts' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'alerts'"
                    @click="activeTab = 'alerts'"
                    >Risks</a
                  >
                </li>
                <li :class="[activeTab === 'cloud' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'cloud'"
                    @click="activeTab = 'cloud'"
                    >Cloud findings</a
                  >
                </li>
                <li :class="[activeTab === 'technologies' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'technologies'"
                    @click="activeTab = 'technologies'"
                    >Technologies</a
                  >
                </li>

                <li :class="[activeTab === 'certificates' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'certificates'"
                    @click="activeTab = 'certificates'"
                    >Certificates</a
                  >
                </li>
                <li :class="[activeTab === 'ports' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'ports'"
                    @click="activeTab = 'ports'"
                    >Ports</a
                  >
                </li>
                <li :class="[activeTab === 'typosquatting' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'typosquatting'"
                    @click="activeTab = 'typosquatting'"
                    >Typosquatting</a
                  >
                </li>
                <li :class="[activeTab === 'phishings' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'phishings'"
                    @click="activeTab = 'phishings'"
                    >Phishing</a
                  >
                </li>
                <li :class="[activeTab === 'email-leaks' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'email-leaks'"
                    @click="activeTab = 'email-leaks'"
                    >Credential leaks</a
                  >
                </li>
                <li :class="[activeTab === 'locations' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'locations'"
                    @click="activeTab = 'locations'"
                    >Attack surface</a
                  >
                </li>
                <li :class="[activeTab === 'graph' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'graph'"
                    @click="activeTab = 'graph'"
                    >Network graph</a
                  >
                </li>
                <li :class="[activeTab === 'reports' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'reports'"
                    @click="activeTab = 'reports'"
                    >Reports</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'overview'">
            <NotScannedComponent
              v-if="!asset.scanned_date"
              :button="true"
              :asset="asset"
              :project="project"
            />

            <div v-if="asset.scanned_date" class="collection-overview">
              <AssetSummaryWidget :collection="asset" />

              <div class="columns">
                <div class="column is-6">
                  <IssuesStatsWidget :collection="asset" />
                </div>
                <div class="column is-6">
                  <CVEStatsWidget :collection="asset" />
                </div>
              </div>

              <div class="columns">
                <div class="column is-9">
                  <VulnerabilitiesTopWidget :collection="asset" />
                </div>
                <div class="column is-3">
                  <TopAssetsInRisk :collection="asset" />
                </div>
              </div>

              <div class="columns">
                <div class="column is-9">
                  <LatestIssuesWidget :collection="asset" />
                </div>
                <div class="column is-3">
                  <LatestEventsWidget :collection="asset" />
                </div>
              </div>

              <div class="columns">
                <div class="column is-6">
                  <ExposureOverTimeWidget :collection="asset" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'events'">
            <EventsComponent v-if="!loading" :collection="asset" />
          </div>

          <div v-if="activeTab === 'reports'">
            <ReportGenerationComponent
              v-if="!loading"
              :collection="asset"
              :workspace="workspace"
            />
          </div>

          <div v-if="activeTab === 'issues'">
            <IssuesComponent v-if="!loading" :collection="asset" />
          </div>

          <div v-if="activeTab === 'assets'">
            <CollectionsAssetsComponent v-if="!loading" :collection="asset" />
          </div>

          <div v-if="activeTab === 'alerts'">
            <VTabs
              slider
              type="rounded"
              selected="app"
              :tabs="[
                { label: 'Application', value: 'app' },
                { label: 'Network', value: 'network' },
              ]"
            >
              <template #tab="{ activeValue }">
                <div v-if="activeValue === 'app'">
                  <DastScannerWidget
                    v-if="!loading"
                    :collection="asset"
                    :calendar="true"
                    :link="true"
                  />
                </div>
                <div v-else-if="activeValue === 'network'">
                  <NssScannerWidget
                    v-if="!loading"
                    :collection="asset"
                    :calendar="true"
                    :link="true"
                  />
                </div>
              </template>
            </VTabs>
          </div>

          <div v-if="activeTab === 'technologies'">
            <TechnologiesTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'cloud'">
            <CloudDetailsTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'vulnerabilities'">
            <VulnerabilitiesTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'phishings'">
            <PhishingsTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'email-leaks'">
            <EmailLeaksStatsWidget :collection="asset" class="mb-5" />

            <EmailLeaksTableWidget v-if="!loading" :collection="asset" :link="true" />
          </div>

          <div v-if="activeTab === 'ports'">
            <PortsGroupedTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'certificates'">
            <CertificatesTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'typosquatting'">
            <TyposquattingTableWidget
              v-if="!loading"
              :collection="asset"
              :calendar="true"
              :link="true"
            />
          </div>

          <div v-if="activeTab === 'matrix'">
            <RiskMatrix v-if="!loading" :collection="asset" @edited="getAsset" />
          </div>

          <div v-if="activeTab === 'locations'">
            <MapWidget v-if="!loading" :collection="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'graph'">
            <NetworkGraphWidget v-if="!loading" :collection="asset" :calendar="true" />
          </div>
        </div>
      </div>
    </div>

    <TasksModal
      v-if="showScanNowModal"
      :asset="asset"
      :project="project"
      @close="showScanNowModal = false"
    />

    <Modal
      v-if="showModal"
      :editable="editable"
      :project="project"
      @closeModal="hideModal"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import { axios } from '/@src/axios'
import Favorite from '/@src/components/favorites/FavoriteComponent.vue'
import Modal from '/@src/components/collections/NewCollectionsModal.vue'
import PhishingsTableWidget from '/@src/components/modules/cyber-ex/widgets/PhishingsTableWidget.vue'
import CollectionsDropdown from '/@src/components/collections/CollectionsDropdown.vue'
import NotScannedComponent from '/@src/components/tasks/NotScannedComponent.vue'
import CollectionsAssetsComponent from '/@src/components/collections/CollectionsAssetsComponent.vue'
import DastScannerWidget from '/@src/components/modules/dast-scanner/widgets/DastScannerWidget.vue'
import TechnologiesTableWidget from '/@src/components/modules/cyber-ex/widgets/TechnologiesTableWidget.vue'
import VulnerabilitiesTableWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTableWidget.vue'
import PortsGroupedTableWidget from '/@src/components/modules/cyber-ex/widgets/PortsGroupedTableWidget.vue'
import NetworkGraphWidget from '/@src/components/modules/cyber-ex/widgets/NetworkGraphWidget.vue'
import MapWidget from '/@src/components/modules/cyber-ex/widgets/MapWidget.vue'
import TyposquattingTableWidget from '/@src/components/modules/cyber-ex/widgets/TyposquattingTableWidget.vue'
import CertificatesTableWidget from '/@src/components/modules/cyber-ex/widgets/CertificatesTableWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import CVEStatsWidget from '/@src/components/modules/cyber-ex/widgets/CVEStatsWidget.vue'
import AssetSummaryWidget from '/@src/components/modules/cyber-ex/widgets/AssetSummaryWidget.vue'
import LatestEventsWidget from '/@src/components/events/widgets/LatestEventsWidget.vue'
import LatestIssuesWidget from '/@src/components/issues/widgets/LatestIssuesWidget.vue'
import VulnerabilitiesTopWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTopWidget.vue'
import TopAssetsInRisk from '/@src/components/modules/cyber-ex/widgets/TopAssetsInRisk.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import IssuesComponent from '/@src/components/issues/IssuesComponent.vue'
import EventsComponent from '/@src/components/events/EventsComponent.vue'
import EmailLeaksTableWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksTableWidget.vue'
import CloudDetailsTableWidget from '/@src/components/modules/cloud-scanner/widgets/CloudDetailsTableWidget.vue'
import ReportGenerationComponent from '/@src/components/reports/ReportGenerationComponent.vue'
import EmailLeaksStatsWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksStatsWidget.vue'
import NssScannerWidget from '/@src/components/modules/nss/widgets/NssScannerWidget.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import ExposureOverTimeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureOverTimeWidget.vue'
import RiskMatrix from '/@src/components/RiskMatrix.vue'
import TasksModal from '/@src/components/tasks/TasksModal.vue'

export default {
  components: {
    TasksModal,
    ExposureOverTimeWidget,
    VTabs,
    NssScannerWidget,
    EmailLeaksStatsWidget,
    ReportGenerationComponent,
    CloudDetailsTableWidget,
    EmailLeaksTableWidget,
    EventsComponent,
    IssuesComponent,
    ExposureGradeWidget,
    TopAssetsInRisk,
    VulnerabilitiesTopWidget,
    LatestIssuesWidget,
    LatestEventsWidget,
    AssetSummaryWidget,
    CVEStatsWidget,
    IssuesStatsWidget,
    CertificatesTableWidget,
    VLoader,
    TyposquattingTableWidget,
    MapWidget,
    NetworkGraphWidget,
    PortsGroupedTableWidget,
    VulnerabilitiesTableWidget,
    TechnologiesTableWidget,
    DastScannerWidget,
    CollectionsAssetsComponent,
    NotScannedComponent,
    CollectionsDropdown,
    PhishingsTableWidget,
    Favorite,
    Modal,
    RiskMatrix,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    asset: null,
    loading: true,
    activeTab: 'overview',
    showScanNowModal: false,
    showModal: false,
  }),
  computed: {
    ...mapGetters(['general', 'workspace']),
  },
  beforeCreate() {
    this.loading = true
  },
  async mounted() {
    await Promise.all([this.getAsset()])
      .then(() => {})
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async getAsset() {
      return axios
        .get(`/collection/${this.$route.params.collection}`)
        .then((res) => {
          this.asset = res.data.data
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getAsset()
    },
    editCollection(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
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