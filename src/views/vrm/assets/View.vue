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
                    <span class="mr-2">
                      <AssetStatusBadge :status="asset.priority" />
                    </span>
                    <span class="mr-2">
                      <span class="tag is-blue text-capitalize">
                        {{ asset.type_text }}
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

            <div class="end"></div>
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
                    >Companies</a
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
                <li :class="[activeTab === 'vulnerabilities' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'vulnerabilities'"
                    @click="activeTab = 'vulnerabilities'"
                    >CVE</a
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
                <li :class="[activeTab === 'technologies' && 'is-active']">
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
                <li :class="[activeTab === 'graph' && 'is-active']">
                  <a
                    :class="[!asset.scanned_date ? 'is-disabled' : '']"
                    @keydown.space.prevent="activeTab = 'graph'"
                    @click="activeTab = 'graph'"
                    >Network graph</a
                  >
                </li>
              </ul>
            </div>
          </div>

          <div v-if="activeTab === 'overview'">
            <VendorNotScannedComponent
              v-if="!asset.scanned_date"
              :asset="asset"
              :button="false"
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
            </div>
          </div>

          <div v-if="activeTab === 'collections'">
            <VendorCollectionsGridComponent
              v-if="!loading"
              :project="project"
              :asset="asset"
            />
          </div>

          <div v-if="activeTab === 'events'">
            <VendorEventsComponent v-if="!loading" :asset="asset" />
          </div>

          <div v-if="activeTab === 'issues'">
            <VendorIssuesComponent v-if="!loading" :asset="asset" />
          </div>

          <div v-if="activeTab === 'details'">
            <IpsDetailsWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'ports'">
            <VendorPortsTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'technologies'">
            <VendorTechnologiesTableWidget
              v-if="!loading"
              :asset="asset"
              :calendar="true"
            />
          </div>

          <div v-if="activeTab === 'vulnerabilities'">
            <VendorVulnerabilitiesTableWidget
              v-if="!loading"
              :asset="asset"
              :calendar="true"
            />
          </div>

          <div v-if="activeTab === 'certificates'">
            <CertificatesTableWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>

          <div v-if="activeTab === 'typosquatting'">
            <VendorTyposquattingTableWidget
              v-if="!loading"
              :asset="asset"
              :calendar="true"
            />
          </div>

          <div v-if="activeTab === 'graph'">
            <NetworkGraphWidget v-if="!loading" :asset="asset" :calendar="true" />
          </div>
        </div>
      </div>
    </div>

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
import IpsDetailsWidget from '/@src/components/modules/cyber-ex/widgets/IpsDetailsWidget.vue'
import AssetStatusBadge from '/@src/components/assets/AssetStatusBadge.vue'
import CertificatesTableWidget from '/@src/components/modules/cyber-ex/widgets/CertificatesTableWidget.vue'
import NetworkGraphWidget from '/@src/components/modules/cyber-ex/widgets/NetworkGraphWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import IssuesStatsWidget from '/@src/components/issues/widgets/IssuesStatsWidget.vue'
import CVEStatsWidget from '/@src/components/modules/cyber-ex/widgets/CVEStatsWidget.vue'
import IpDetailsWidget from '/@src/components/modules/cyber-ex/widgets/IpDetailsWidget.vue'
import ConnectedIPsWidget from '/@src/components/modules/cyber-ex/widgets/ConnectedIPsWidget.vue'
import DiscoveryPathWidget from '/@src/components/modules/cyber-ex/widgets/DiscoveryPathWidget.vue'
import AssetLocationsWidget from '/@src/components/modules/cyber-ex/widgets/AssetLocationsWidget.vue'
import AssetSummaryWidget from '/@src/components/modules/cyber-ex/widgets/AssetSummaryWidget.vue'
import ExposureGradeWidget from '/@src/components/modules/cyber-ex/widgets/ExposureGradeWidget.vue'
import VendorVulnerabilitiesTableWidget from '/@src/components/vendors/assets/VendorVulnerabilitiesTableWidget.vue'
import VendorTechnologiesTableWidget from '/@src/components/vendors/assets/VendorTechnologiesTableWidget.vue'
import VendorIssuesComponent from '/@src/components/vendors/assets/VendorIssuesComponent.vue'
import VendorEventsComponent from '/@src/components/vendors/assets/VendorEventsComponent.vue'
import VendorTyposquattingTableWidget from '/@src/components/vendors/assets/VendorTyposquattingTableWidget.vue'
import VendorCollectionsGridComponent from '/@src/components/vendors/assets/VendorCollectionsGridComponent.vue'
import VendorPortsTableWidget from '/@src/components/vendors/assets/VendorPortsTableWidget.vue'
import VendorNotScannedComponent from '/@src/components/vendors/assets/VendorNotScannedComponent.vue'

export default {
  components: {
    VendorNotScannedComponent,
    VendorPortsTableWidget,
    VendorCollectionsGridComponent,
    VendorTyposquattingTableWidget,
    VendorEventsComponent,
    VendorIssuesComponent,
    VendorTechnologiesTableWidget,
    VendorVulnerabilitiesTableWidget,
    ExposureGradeWidget,
    AssetSummaryWidget,
    AssetLocationsWidget,
    DiscoveryPathWidget,
    ConnectedIPsWidget,
    IpDetailsWidget,
    CVEStatsWidget,
    IssuesStatsWidget,
    NetworkGraphWidget,
    CertificatesTableWidget,
    VLoader,
    AssetStatusBadge,
    IpsDetailsWidget,
    Favorite,
    Modal,
  },
  mixins: [permissionsMixin],
  data: () => ({
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
            label: 'Assets',
            to: {
              name: 'ProjectAssetsView',
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
    async getAsset() {
      return axios
        .get(`/asset/${this.$route.params.asset}`, {
          params: {
            workspace_collection_id: this.workspace.id,
          },
        })
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