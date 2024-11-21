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
              <ExposureGradeWidget v-if="!asset.scanned_date" score="0" grade="N/A" />
              <ExposureGradeWidget
                v-else
                :score="asset.exposure_score"
                :grade="asset.exposure_score_grade"
              />
            </div>
            <div class="header-meta">
              <div class="username-wrap">
                <div class="username mb-4">
                  <h3>
                    <span>{{ asset.value }}</span>
                    <Favorite
                      :id="asset.id"
                      class="mt-2"
                      type="asset"
                      :value="asset.favorite"
                      @saved="getAsset()"
                    />
                    <span class="mr-2">
                      <a>
                        <span v-if="asset.status === 'active'" class="tag is-success"
                          >Active</span
                        >
                        <span v-else class="tag is-danger">Archived</span>
                      </a>
                    </span>
                    <!--                    <span class="mr-2">-->
                    <!--                      <AssetStatusBadge :status="asset.priority" />-->
                    <!--                    </span>-->
                    <span class="mr-2">
                      <span class="tag is-blue text-capitalize">
                        {{ asset.type_text }}
                      </span>
                      <span v-if="asset.private_network" class="ml-2">
                        <span class="tag is-small is-capitalized">Private network</span>
                      </span>
                    </span>
                  </h3>
                  <span>{{ asset.name }}</span>
                </div>
                <div class="badges">
                  <span v-if="asset.tags.length">
                    <span
                      v-for="tag in asset.tags"
                      :key="tag"
                      class="tag is-primary mr-2"
                      >{{ tag }}</span
                    >
                  </span>
                </div>
              </div>
              <div class="meta-description">
                <p>
                  First seen: <span>{{ asset.created_date }}</span> Last seen:
                  <span>{{ asset.scanned_date ?? '-' }}</span>
                </p>
                <p>
                  Added by: <small>{{ asset.added_by }}</small>
                </p>
              </div>
              <div class="meta-achievements">
                <p class="mr-2">Monitors:</p>
                <span v-if="monitors.length">
                  <template v-for="schedule in monitors" :key="schedule.id">
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

              <AssetDropdown :item="asset" @editAsset="editAsset" />
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
                <li :class="[activeTab === 'collections' && 'is-active']">
                  <a
                    @keydown.space.prevent="activeTab = 'collections'"
                    @click="activeTab = 'collections'"
                    >Groups</a
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

                <li
                  v-if="
                    asset.type === 'gcp' || asset.type === 'aws' || asset.type === 'azure'
                  "
                  :class="[activeTab === 'cloud' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'cloud'"
                    @click="activeTab = 'cloud'"
                    >Cloud findings</a
                  >
                </li>

                <li
                  v-if="asset.type === 'ipv4'"
                  :class="[activeTab === 'details' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'details'"
                    @click="activeTab = 'details'"
                    >Details</a
                  >
                </li>
                <li
                  v-if="
                    asset.type === 'ipv4' ||
                    asset.type === 'domain' ||
                    asset.type === 'subdomain'
                  "
                  :class="[activeTab === 'vulnerabilities' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'vulnerabilities'"
                    @click="activeTab = 'vulnerabilities'"
                    >CVE</a
                  >
                </li>
                <li
                  v-if="
                    asset.type === 'ipv4' ||
                    asset.type === 'domain' ||
                    asset.type === 'subdomain'
                  "
                  :class="[activeTab === 'alerts' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'alerts'"
                    @click="activeTab = 'alerts'"
                    >Risks</a
                  >
                </li>
                <li
                  v-if="asset.type === 'ipv4'"
                  :class="[activeTab === 'ports' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'ports'"
                    @click="activeTab = 'ports'"
                    >Ports</a
                  >
                </li>
                <li
                  v-if="
                    asset.type === 'ipv4' ||
                    asset.type === 'domain' ||
                    asset.type === 'subdomain'
                  "
                  :class="[activeTab === 'technologies' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'technologies'"
                    @click="activeTab = 'technologies'"
                    >Technologies</a
                  >
                </li>
                <li
                  v-if="asset.type === 'domain' || asset.type === 'subdomain'"
                  :class="[activeTab === 'certificates' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'certificates'"
                    @click="activeTab = 'certificates'"
                    >Certificates</a
                  >
                </li>
                <li
                  v-if="asset.type === 'domain' || asset.type === 'subdomain'"
                  :class="[activeTab === 'urls' && 'is-active']"
                >
                  <a
                    @keydown.space.prevent="activeTab = 'urls'"
                    @click="activeTab = 'urls'"
                    >URL's</a
                  >
                </li>
                <li
                  v-if="
                    asset.type === 'domain' ||
                    asset.type === 'subdomain' ||
                    asset.type === 'ipv4'
                  "
                  :class="[activeTab === 'sbom' && 'is-active']"
                >
                  <a
                    @keydown.space.prevent="activeTab = 'sbom'"
                    @click="activeTab = 'sbom'"
                    >SBOM</a
                  >
                </li>
                <li
                  v-if="asset.type === 'domain'"
                  :class="[activeTab === 'typosquatting' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'typosquatting'"
                    @click="activeTab = 'typosquatting'"
                    >Typosquatting</a
                  >
                </li>
                <li
                  v-if="asset.type === 'domain'"
                  :class="[activeTab === 'phishings' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'phishings'"
                    @click="activeTab = 'phishings'"
                    >Phishing</a
                  >
                </li>
                <li
                  v-if="asset.type === 'domain'"
                  :class="[activeTab === 'leaks' && 'is-active']"
                >
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'leaks'"
                    @click="activeTab = 'leaks'"
                    >Credential leaks</a
                  >
                </li>
                <li
                  v-if="
                    asset.type === 'ipv4' ||
                    asset.type === 'domain' ||
                    asset.type === 'subdomain'
                  "
                  :class="[activeTab === 'graph' && 'is-active']"
                >
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
              :asset="asset"
              :button="true"
              :project="project"
            />

            <div v-if="asset.scanned_date" class="asset-overview">
              <AssetSummaryWidget :asset="asset" />

              <div class="columns">
                <div class="column is-6">
                  <IssuesStatsWidget :asset="asset" />
                </div>
                <div class="column is-6">
                  <CVEStatsWidget :asset="asset" />
                </div>
              </div>

              <div class="columns">
                <div class="column is-4">
                  <IpDetailsWidget v-if="asset.type === 'ipv4'" :asset="asset" />
                  <ConnectedIPsWidget v-else :asset="asset" />
                </div>
                <div class="column is-4">
                  <AssetLocationsWidget :asset="asset" />
                </div>
                <div class="column is-4">
                  <DiscoveryPathWidget :asset="asset" />
                </div>
              </div>

              <div class="columns">
                <div class="column is-6">
                  <ExposureOverTimeWidget :asset="asset" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'collections'">
            <CollectionsGridComponent v-if="!loading" :project="project" :asset="asset" />
          </div>

          <div v-if="activeTab === 'reports'">
            <ReportGenerationComponent v-if="!loading" :asset="asset" />
          </div>

          <div v-if="activeTab === 'events'">
            <EventsComponent v-if="!loading" :asset="asset" />
          </div>

          <div v-if="activeTab === 'issues'">
            <IssuesComponent v-if="!loading" :asset="asset" />
          </div>

          <div v-if="activeTab === 'phishings'">
            <PhishingsTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'details'">
            <IpsDetailsWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'cloud'">
            <CloudDetailsTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'ports'">
            <PortsTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'technologies'">
            <TechnologiesTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'vulnerabilities'">
            <VulnerabilitiesTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'certificates'">
            <CertificatesTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'urls'">
            <UrlTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'sbom'">
            <SBOMTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'matrix'">
            <RiskMatrix v-if="!loading" :asset="asset" @edited="getAsset" />
          </div>

          <div v-if="activeTab === 'typosquatting'">
            <TyposquattingTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'leaks'">
            <EmailLeaksStatsWidget :asset="asset" class="mb-5" />

            <EmailLeaksTableWidget v-if="!loading" :asset="asset" />
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
                    :asset="asset"
                    :calendar="true"
                    :link="true"
                  />
                </div>
                <div v-else-if="activeValue === 'network'">
                  <NssScannerWidget
                    v-if="!loading"
                    :asset="asset"
                    :calendar="true"
                    :link="true"
                  />
                </div>
              </template>
            </VTabs>
          </div>

          <div v-if="activeTab === 'graph'">
            <NetworkGraphWidget v-if="!loading" :asset="asset" :calendar="true" />
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
import Modal from '/@src/components/assets/AssetsModal.vue'
import CollectionsGridComponent from '/@src/components/collections/CollectionsGridComponent.vue'
import PhishingsTableWidget from '/@src/components/modules/cyber-ex/widgets/PhishingsTableWidget.vue'
import IpsDetailsWidget from '/@src/components/modules/cyber-ex/widgets/IpsDetailsWidget.vue'
import AssetDropdown from '/@src/components/assets/AssetDropdown.vue'
import DastScannerWidget from '/@src/components/modules/dast-scanner/widgets/DastScannerWidget.vue'
import PortsTableWidget from '/@src/components/modules/cyber-ex/widgets/PortsTableWidget.vue'
import TechnologiesTableWidget from '/@src/components/modules/cyber-ex/widgets/TechnologiesTableWidget.vue'
import VulnerabilitiesTableWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTableWidget.vue'
import CertificatesTableWidget from '/@src/components/modules/cyber-ex/widgets/CertificatesTableWidget.vue'
import TyposquattingTableWidget from '/@src/components/modules/cyber-ex/widgets/TyposquattingTableWidget.vue'
import NetworkGraphWidget from '/@src/components/modules/cyber-ex/widgets/NetworkGraphWidget.vue'
import NotScannedComponent from '/@src/components/tasks/NotScannedComponent.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import CVEStatsWidget from '/@src/components/modules/cyber-ex/widgets/CVEStatsWidget.vue'
import IpDetailsWidget from '/@src/components/modules/cyber-ex/widgets/IpDetailsWidget.vue'
import ConnectedIPsWidget from '/@src/components/modules/cyber-ex/widgets/ConnectedIPsWidget.vue'
import DiscoveryPathWidget from '/@src/components/modules/cyber-ex/widgets/DiscoveryPathWidget.vue'
import AssetLocationsWidget from '/@src/components/modules/cyber-ex/widgets/AssetLocationsWidget.vue'
import AssetSummaryWidget from '/@src/components/modules/cyber-ex/widgets/AssetSummaryWidget.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import EventsComponent from '/@src/components/events/EventsComponent.vue'
import IssuesComponent from '/@src/components/issues/IssuesComponent.vue'
import EmailLeaksTableWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksTableWidget.vue'
import NssScannerWidget from '/@src/components/modules/nss/widgets/NssScannerWidget.vue'
import CloudDetailsTableWidget from '/@src/components/modules/cloud-scanner/widgets/CloudDetailsTableWidget.vue'
import ReportGenerationComponent from '/@src/components/reports/ReportGenerationComponent.vue'
import EmailLeaksStatsWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksStatsWidget.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import ExposureOverTimeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureOverTimeWidget.vue'
import RiskMatrix from '/@src/components/RiskMatrix.vue'
import TasksModal from '/@src/components/tasks/TasksModal.vue'
import UrlTableWidget from '/@src/components/modules/cyber-ex/widgets/UrlTableWidget.vue'
import SBOMTableWidget from '/@src/components/modules/cyber-ex/widgets/SBOMTableWidget.vue'

export default {
  components: {
    SBOMTableWidget,
    UrlTableWidget,
    TasksModal,
    ExposureOverTimeWidget,
    VTabs,
    EmailLeaksStatsWidget,
    ReportGenerationComponent,
    CloudDetailsTableWidget,
    NssScannerWidget,
    EmailLeaksTableWidget,
    IssuesComponent,
    EventsComponent,
    ExposureGradeWidget,
    AssetSummaryWidget,
    AssetLocationsWidget,
    DiscoveryPathWidget,
    ConnectedIPsWidget,
    IpDetailsWidget,
    CVEStatsWidget,
    IssuesStatsWidget,
    NotScannedComponent,
    NetworkGraphWidget,
    TyposquattingTableWidget,
    CertificatesTableWidget,
    VulnerabilitiesTableWidget,
    TechnologiesTableWidget,
    PortsTableWidget,
    VLoader,
    DastScannerWidget,
    AssetDropdown,
    IpsDetailsWidget,
    PhishingsTableWidget,
    CollectionsGridComponent,
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
    monitors: [],
  }),
  computed: {
    ...mapGetters(['general']),
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
            label: this.project.workspace.name,
            to: {
              name: 'WorkspacesView',
              params: { id: this.project.workspace.id },
            },
          },
          {
            label: this.project.name,
            to: {
              name: 'ProjectOverview',
              params: { id: this.project.id },
            },
          },
          {
            label: 'Assets',
            to: {
              name: 'ProjectAssetsView',
              params: { id: this.project.id },
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
    async getAsset() {
      return axios
        .get(`/asset/${this.$route.params.asset}`)
        .then((res) => {
          this.asset = res.data.data

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
  },
  metaInfo() {
    return {
      title: this.asset ? this.asset.name : '',
    }
  },
}
</script>

<style scoped>
.asset-overview {
  .dashboard-card,
  .stat-widget {
    height: 100%;
  }
}
</style>