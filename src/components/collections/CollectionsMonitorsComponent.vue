<template>
  <div>
    <VLoader v-if="!loaded" :active="true">
      <div style="height: 100px" />
    </VLoader>
    <div v-else>
      <div v-for="(value, index) in general.monitors" :key="index" class="columns">
        <div class="column is-12">
          <div class="card">
            <!--end card-header-->
            <div class="card-body">
              <h4 class="title is-5">
                {{ value.name }} <small>({{ value.description }})</small>
              </h4>
              <dl
                v-if="items.find((item) => item.monitor === value.slug)"
                class="columns mb-0 is-multiline"
              >
                <dt class="column is-3">Schedule</dt>
                <dd class="column is-9">
                  {{ items.find((item) => item.monitor === value.slug).type_text }}
                </dd>
                <dt class="column is-3">Next run</dt>
                <dd class="column is-9">
                  {{ items.find((item) => item.monitor === value.slug).next_run_text }}
                </dd>
              </dl>
              <div v-else>
                <p>No schedule set</p>
              </div>
            </div>
            <!--end card-body-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['collection', 'noData'],
  data: () => ({
    items: [],
    page: 1,
    q: '',
    loaded: false,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    await this.getMonitors()
  },
  methods: {
    async getMonitors(page = 1) {
      this.page = page
      return axios
        .get(`/schedule`, {
          params: {
            collection_id: this.collection.id,
            project_id: this.collection.project_id,
          },
        })
        .then((res) => {
          this.items = res.data.data
          this.loaded = true
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}
.asset-filters {
  display: flex;
  align-self: center;
}
@media only screen and (width <= 767px) {
  .tile-grid-toolbar.assets {
    position: relative;
    margin-bottom: 60px;
  }
  .asset-filters {
    position: absolute;
    top: 52px;
    width: 100%;
  }
}
</style>