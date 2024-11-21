<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Latest risks</h3>
      <router-link
        v-if="product === UEM_PRODUCT"
        :to="{
          name: 'CyberExAlertsView',
          params: { id: project?.id },
        }"
        class="action-link"
        tabindex="0"
        >View All</router-link
      >
    </div>
    <div v-if="loaded" class="active-team pb-0">
      <ul v-if="events.length" class="user-list">
        <li
          v-for="event in events"
          :key="event.id"
          class="is-clickable is-scalable"
          @click="goToAsset(event.asset)"
        >
          <div>
            <div
              class="v-icon is-rounded"
              :style="`background: ` + getModule(event)?.color"
            >
              <i aria-hidden="true" :class="getModule(event)?.icon" />
            </div>
          </div>
          <div class="user-list-info">
            <div class="name dark-inverted">{{ event.title }}.</div>
            <div class="position">
              {{ event.created }} - <small>{{ event.asset.value }}</small>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li>
          <p>No risks found</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <VLoader :active="true">
        <div style="height: 100px" />
      </VLoader>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import urlMixin from '/@src/mixins/urlMixin'
import { UEM_PRODUCT } from '/@src/models/constants'
export default {
  components: { VLoader },
  mixins: [urlMixin],
  props: ['project', 'workspace', 'collection', 'asset', 'workspaceCollectionId'],
  data: () => ({
    loaded: false,
    events: null,
    UEM_PRODUCT,
  }),
  computed: {
    ...mapGetters(['general', 'product']),
  },
  async mounted() {
    await axios
      .get('/alerts/grouped', {
        params: {
          workspace_collection_id: this.workspaceCollectionId,
          workspace_id: this.workspace?.id,
          project_id: this.project?.id,
          collection_id: this.collection?.id,
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.events = res.data.data.slice(0, 1)
      })
  },
  methods: {
    getModule() {
      let found
      this.general.modules.forEach((m) => {
        if (m.slug === 'dast-scanner') {
          found = m
        }
      })
      return found
    },
    goToAsset(item) {
      this.$router.push(this.getAssetViewURL(item))
    },
  },
}
</script>
