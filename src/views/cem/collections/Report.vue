<template>
  <div>
    <div v-if="loading" class="app-init-wrapper">
      <VLoader class="is-grey" :active="true">
        <div />
      </VLoader>
    </div>
    <div v-else>
      <div class="columns">
        <div class="column is-8 is-flex">
          <SummaryWidget
            class="w-100"
            :collection="collection"
            :calendar="true"
            sort="latest"
          />
        </div>
        <div class="column is-4 is-flex">
          <ImpactWidget
            class="w-100"
            :collection="collection"
            :calendar="true"
            :grouped="true"
            sort="latest"
          />
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <h4 class="title is-5">Issues</h4>
              <IssuesComponent
                :collection="collection"
                :hide-filter="true"
                default-sort="severity"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <VulnerabilitiesTableWidget
                :collection="collection"
                :calendar="true"
                :grouped="true"
                :link="true"
                sort="latest"
                class="w-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <SubdomainsTableWidget
                :collection="collection"
                :link="true"
                :calendar="true"
                :grouped="true"
                sort="latest"
              />
            </div>
          </div>
        </div>
      </div>

      <MapWidget
        :collection="collection"
        :calendar="true"
        :grouped="true"
        sort="latest"
      />

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <IpsTableWidget
                :collection="collection"
                :calendar="true"
                :link="true"
                :grouped="true"
                sort="latest"
              />
            </div>
          </div>
        </div>
      </div>

      <NetworkGraphWidget
        :collection="collection"
        :specific-date="collection.scanned_date"
        :calendar="true"
        :grouped="true"
        sort="latest"
      />

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <TechnologiesTableWidget
                :collection="collection"
                :link="true"
                :calendar="true"
                :grouped="true"
                sort="latest"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <TyposquattingTableWidget
                :collection="collection"
                :calendar="true"
                :link="true"
                :grouped="true"
                sort="latest"
              />
            </div>
          </div>
        </div>
      </div>

      <CertificatesTableWidget
        :collection="collection"
        :calendar="true"
        :link="true"
        :grouped="true"
        sort="latest"
      />

      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <div class="card-body">
              <EmailLeaksTableWidget
                :collection="collection"
                :specific-date="collection.scanned_date"
                :link="true"
                :grouped="true"
                sort="latest"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import { axios } from '/@src/axios'
import SummaryWidget from '/@src/components/modules/cyber-ex/widgets/SummaryWidget.vue'
import ImpactWidget from '/@src/components/modules/cyber-ex/widgets/ImpactWidget.vue'
import VulnerabilitiesTableWidget from '/@src/components/modules/cyber-ex/widgets/VulnerabilitiesTableWidget.vue'
import SubdomainsTableWidget from '/@src/components/modules/cyber-ex/widgets/SubdomainsTableWidget.vue'
import MapWidget from '/@src/components/modules/cyber-ex/widgets/MapWidget.vue'
import IpsTableWidget from '/@src/components/modules/cyber-ex/widgets/IpsTableWidget.vue'
import NetworkGraphWidget from '/@src/components/modules/cyber-ex/widgets/NetworkGraphWidget.vue'
import TechnologiesTableWidget from '/@src/components/modules/cyber-ex/widgets/TechnologiesTableWidget.vue'
import TyposquattingTableWidget from '/@src/components/modules/cyber-ex/widgets/TyposquattingTableWidget.vue'
import CertificatesTableWidget from '/@src/components/modules/cyber-ex/widgets/CertificatesTableWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import IssuesComponent from '/@src/components/issues/IssuesComponent.vue'
import EmailLeaksTableWidget from '/@src/components/modules/email-leaks/widgets/EmailLeaksTableWidget.vue'

export default {
  components: {
    EmailLeaksTableWidget,
    IssuesComponent,
    CertificatesTableWidget,
    TyposquattingTableWidget,
    VLoader,
    TechnologiesTableWidget,
    NetworkGraphWidget,
    IpsTableWidget,
    MapWidget,
    SubdomainsTableWidget,
    VulnerabilitiesTableWidget,
    ImpactWidget,
    SummaryWidget,
  },
  mixins: [permissionsMixin],
  props: ['project'],
  data: () => ({
    collection: null,
    loading: true,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  beforeCreate() {
    this.loading = true
  },
  async mounted() {
    await Promise.all([this.getCollection()])
      .then(() => {})
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async getCollection() {
      return axios
        .get(`/collection/${this.$route.params.collection}`)
        .then((res) => {
          this.collection = res.data.data
        })
        .catch(() => {})
    },
  },
  metaInfo() {
    return {
      title: this.collection ? this.collection.name + ' cyber exposure report' : '',
    }
  },
}
</script>
