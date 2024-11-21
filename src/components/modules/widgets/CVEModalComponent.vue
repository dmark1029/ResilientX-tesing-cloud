<template>
  <VModal
    is="form"
    :open="true"
    :title="cve?.cve?.CVE_data_meta?.ID ?? 'Loading...'"
    size="big"
    actions="right"
    @close="$emit('closeModal')"
  >
    <template #content>
      <div v-if="loading">
        <VLoader :active="true">
          <div style="height: 300px"></div>
        </VLoader>
      </div>
      <div v-else>
        <div v-if="hasCVE">
          <h1 class="title is-5">Details</h1>

          <p class="mb-3">{{ cve.cve.description.description_data[0].value }}</p>

          <ul>
            <li>
              <p><b>Published</b>: {{ cve.publishedDate }}</p>
            </li>
            <li>
              <p><b>Modified</b>: {{ cve.lastModifiedDate }}</p>
            </li>
            <li class="mt-3">
              <p>
                <span v-if="cve.impact.baseMetricV2">
                  <b>Risk CVSS V2 </b>:
                  <IssueSeverityBadge :severity="cve.impact.baseMetricV2.severity" />
                </span>
                <span v-if="cve.impact.baseMetricV3" class="ml-3"
                  ><b>Risk CVSS V3</b>:
                  <IssueSeverityBadge
                    :severity="cve.impact.baseMetricV3?.cvssV3?.baseSeverity"
                /></span>
              </p>
            </li>
          </ul>

          <h1 class="title is-5 mt-5">CVSS Analysis</h1>

          <div class="columns">
            <div class="column is-10">
              <p v-if="cve.impact.baseMetricV2" class="mb-2">
                CVSS Version 2:
                <small>{{ cve.impact.baseMetricV2.cvssV2.baseScore }}</small>
              </p>
              <VProgress
                v-if="cve.impact.baseMetricV2"
                size="smaller"
                :value="cve.impact.baseMetricV2.cvssV2.baseScore"
                :color="getColor(cve.impact.baseMetricV2.cvssV2.baseScore)"
                :max="10"
              />

              <p v-if="cve.impact.baseMetricV3" class="mb-2">
                CVSS Version 3:
                <small>{{ cve.impact.baseMetricV3?.cvssV3?.baseScore }}</small>
              </p>
              <VProgress
                v-if="cve.impact.baseMetricV3"
                size="smaller"
                :value="cve.impact.baseMetricV3?.cvssV3?.baseScore"
                :color="getColor(cve.impact.baseMetricV3?.cvssV3?.baseScore)"
                :max="10"
              />

              <p v-if="cve.impact.baseMetricV3" class="mb-2">
                Exploitablity Score:
                <small>{{ cve.impact.baseMetricV3?.exploitabilityScore }}</small>
              </p>
              <VProgress
                v-if="cve.impact.baseMetricV3"
                size="smaller"
                :value="cve.impact.baseMetricV3?.exploitabilityScore"
                :color="getColor(cve.impact.baseMetricV3?.exploitabilityScore)"
                :max="10"
              />

              <p v-if="cve.impact.baseMetricV3" class="mb-2">
                Impact Score: <small>{{ cve.impact.baseMetricV3?.impactScore }}</small>
              </p>
              <VProgress
                v-if="cve.impact.baseMetricV3"
                size="smaller"
                :value="cve.impact.baseMetricV3?.impactScore"
                :color="getColor(cve.impact.baseMetricV3?.impactScore)"
                :max="10"
              />
            </div>
          </div>

          <div v-if="cve.impact" class="mt-4">
            <h1 class="title is-5 mt-5">Impact</h1>

            <!-- Vulnerable Nodes -->
            <table class="table datatable-table is-fullwidth">
              <tbody v-if="cve.impact.baseMetricV2">
                <tr>
                  <td><b>Confidentiality</b></td>
                  <td>{{ cve.impact.baseMetricV2?.cvssV2?.confidentialityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Integrity</b></td>
                  <td>{{ cve.impact.baseMetricV2?.cvssV2?.integrityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Availability</b></td>
                  <td>{{ cve.impact.baseMetricV2.cvssV2.availabilityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Access Vector</b></td>
                  <td>{{ cve.impact.baseMetricV2.cvssV2.accessVector }}</td>
                </tr>
                <tr>
                  <td><b>Access Complexity</b></td>
                  <td>{{ cve.impact.baseMetricV2.cvssV2.accessComplexity }}</td>
                </tr>
              </tbody>
              <tbody v-else-if="cve.impact.baseMetricV3">
                <tr>
                  <td><b>Confidentiality</b></td>
                  <td>{{ cve.impact.baseMetricV3?.cvssV3?.confidentialityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Integrity</b></td>
                  <td>{{ cve.impact.baseMetricV3?.cvssV3?.integrityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Availability</b></td>
                  <td>{{ cve.impact.baseMetricV3.cvssV3.availabilityImpact }}</td>
                </tr>
                <tr>
                  <td><b>Attack Vector</b></td>
                  <td>{{ cve.impact.baseMetricV3.cvssV3.attackVector }}</td>
                </tr>
                <tr>
                  <td><b>Attack Complexity</b></td>
                  <td>{{ cve.impact.baseMetricV3.cvssV3.attackComplexity }}</td>
                </tr>
                <tr>
                  <td><b>Required Preveliges</b></td>
                  <td>{{ cve.impact.baseMetricV3.cvssV3.privilegesRequired }}</td>
                </tr>
                <tr>
                  <td><b>Required User Itegration</b></td>
                  <td>{{ cve.impact.baseMetricV3.cvssV3.userInteraction }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="cve.configurations" class="mt-4">
            <h1 class="title is-5 mt-5">CPE Match</h1>

            <!-- Vulnerable Nodes -->
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>NODE</th>
                  <th>VULNERABLE</th>
                  <th>LAST VULNERABLE VERSION</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="node in cve.configurations.nodes" :key="node">
                  <tr v-for="cpeMatch in node.cpe_match" :key="cpeMatch">
                    <td>{{ cpeMatch.cpe23Uri }}</td>
                    <td>{{ cpeMatch.vulnerable ? 'Yes' : '-' }}</td>
                    <td>{{ cpeMatch.versionEndIncluding }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <h1 class="title is-5 mt-5">References</h1>

          <div class="is-relative">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>REFERENCE</th>
                  <th>TAGS</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="reference in cve.cve.references.reference_data"
                  :key="reference"
                >
                  <td>
                    <a :href="reference.url" target="_blank">{{ reference.name }}</a>
                  </td>
                  <td>{{ reference.tags.join(', ') }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>
          <p>No data about "{{ id }}" available</p>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import { axios } from '/@src/axios'
import VProgress from '/@src/components/base/progress/VProgress.vue'
import IssueSeverityBadge from '/@src/components/issues/IssueSeverityBadge.vue'

export default {
  components: {
    IssueSeverityBadge,
    VProgress,
    VModal,
    VLoader,
  },
  props: ['id'],
  emits: ['closeModal'],
  data: () => ({
    cve: null,
    hasCVE: false,
    loading: true,
  }),
  computed: {
    ...mapGetters(['general', 'project']),
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true

      this.cve = axios
        .get('cve/' + this.id)
        .then((res) => {
          this.cve = res.data
          this.hasCVE = Object.keys(res.data).length > 0
          this.loading = false
        })
        .catch(() => {})
    },
    getColor(score) {
      if (score >= 7) {
        return 'danger'
      } else if (score >= 3) {
        return 'warning'
      } else {
        return 'success'
      }
    },
  },
}
</script>
