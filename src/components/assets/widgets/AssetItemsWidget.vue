<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Assets</h3>
    </div>
    <div class="active-team">
      <div v-if="loaded" class="columns is-mobile is-multiline">
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'domain' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'domain' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fa fa-globe"></i>
            </div>
            <div class="value">{{ items.domains }}</div>
            <div class="value-title">Domains</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'subdomain' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'subdomain' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fa fa-cogs"></i>
            </div>
            <div class="value">{{ items.subdomains }}</div>
            <div class="value-title">Subdomains</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'ipv4' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'ipv4' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fa fa-network-wired"></i>
            </div>
            <div class="value">{{ items.ips }}</div>
            <div class="value-title">IP Addresses</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'CyberExCertificatesView',
                    params: { id: project.id },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceCyberExCertificatesView',
                    params: { id: workspace.id },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fa fa-certificate"></i>
            </div>
            <div class="value">{{ items.certificates }}</div>
            <div class="value-title">Certificates</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'CyberExTechnologiesView',
                    params: { id: project.id },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceCyberExTechnologiesView',
                    params: { id: workspace.id },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fa fa-code"></i>
            </div>
            <div class="value">{{ items.technologies }}</div>
            <div class="value-title">Technologies</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'aws' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'aws' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fab fa-aws" style="color: white"></i>
            </div>
            <div class="value">{{ items.aws }}</div>
            <div class="value-title">AWS Accounts</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'gcp' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'gcp' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fab fa-google" style="color: white"></i>
            </div>
            <div class="value">{{ items.gcp }}</div>
            <div class="value-title">GCP Accounts</div>
          </div>
        </div>
        <div
          class="column is-3-desktop is-6-mobile is-4-tablet is-3-widescreen is-3-fullhd"
        >
          <div
            class="has-text-centered asset-item is-clickable"
            @click="
              () => {
                if (project) {
                  $router.push({
                    name: 'ProjectAssetsView',
                    params: { id: project.id },
                    query: { type: 'azure' },
                  })
                } else {
                  $router.push({
                    name: 'WorkspaceAssetsView',
                    params: { id: workspace.id },
                    query: { type: 'azure' },
                  })
                }
              }
            "
          >
            <div class="v-icon is-rounded">
              <i aria-hidden="true" class="fab fa-microsoft" style="color: white"></i>
            </div>
            <div class="value">{{ items.azure }}</div>
            <div class="value-title">Azure Accounts</div>
          </div>
        </div>
      </div>
      <div v-else>
        <VLoader :active="true">
          <div style="height: 200px" />
        </VLoader>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { VLoader },
  props: ['project', 'workspace', 'collection', 'asset'],
  data: () => ({
    items: [],
    loaded: false,
  }),
  computed: {
    ...mapGetters(['module']),
  },
  async mounted() {
    await axios
      .get('/widget/assets-items', {
        params: {
          workspace_id: this.workspace?.id,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        // this.spark1.series[0].data = res.data.dates.map((item) => item.count)
        // this.spark1.labels = res.data.dates.map((item) => item.date)
        this.items = res.data.data
      })
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.asset-item {
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    .value {
      color: var(--light-text-dark-2);
    }
    .value-title {
      color: var(--light-text-dark-2);
    }
  }
  .v-icon {
    margin: 0 auto;
  }
  .value {
    margin-top: 15px;
    color: var(--light-text);
    font-weight: 700;
    font-size: 15px;
    line-height: 15px;
  }
  .value-title {
    margin-top: 2px;
    color: var(--light-text);
  }
}
</style>
