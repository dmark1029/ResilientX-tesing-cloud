<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Asset details</h3>
    </div>
    <div class="active-team">
      <ul v-if="details" class="user-list">
        <li v-if="details.country_name">
          <div class="user-list-info">
            <div class="name dark-inverted">Location</div>
            <div class="position">
              {{ details.country_name }}, {{ details.city }} ({{ details.lat }},
              {{ details.lng }})
            </div>
          </div>
        </li>
        <li v-if="details.asn">
          <div class="user-list-info">
            <div class="name dark-inverted">ASN</div>
            <div class="position">{{ details.asn }}</div>
          </div>
        </li>
        <li v-if="details.organization">
          <div class="user-list-info">
            <div class="name dark-inverted">Organization</div>
            <div class="position">{{ details.organization }}</div>
          </div>
        </li>
        <li v-if="details.isp">
          <div class="user-list-info">
            <div class="name dark-inverted">ISP</div>
            <div class="position">{{ details.isp }}</div>
          </div>
        </li>
        <li v-if="details.domains?.length">
          <div class="user-list-info">
            <div class="name dark-inverted">Domains</div>
            <div class="position">
              <span v-for="item in details.domains" :key="item" class="mr-2">
                {{ item }}
                <a :href="'http://' + item" target="_blank"
                  ><i class="fa fa-external-link-alt"
                /></a>
              </span>
            </div>
          </div>
        </li>
        <li v-if="details.hostnames?.length">
          <div class="user-list-info">
            <div class="name dark-inverted">Hostnames</div>
            <div class="position">
              <span v-for="item in details.hostnames" :key="item" class="mr-2">
                {{ item }}
                <a :href="'http://' + item" target="_blank"
                  ><i class="fa fa-external-link-alt"
                /></a>
              </span>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li>
          <p>No details found</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'

export default {
  props: ['asset'],
  data: () => ({
    details: null,
    loaded: false,
  }),
  async mounted() {
    await axios
      .get('/widget/ip-details', {
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
