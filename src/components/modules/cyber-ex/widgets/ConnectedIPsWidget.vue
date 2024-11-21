<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Connected IP's</h3>
    </div>
    <div class="list-widget">
      <div v-for="item in details" :key="item.ip" class="mb-5">
        <AssetItemComponent :asset="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import AssetItemComponent from '/@src/components/assets/widgets/AssetItemComponent.vue'

export default {
  components: { AssetItemComponent },
  props: ['asset'],
  data: () => ({
    details: null,
    loaded: false,
  }),
  computed: {
    ...mapGetters(['project']),
  },
  async mounted() {
    await axios
      .get('/widget/connected-ips', {
        params: {
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.details = res.data.data
      })
  },
}
</script>
