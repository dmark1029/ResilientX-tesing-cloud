<template>
  <div class="dashboard-card">
    <div class="card-head">
      <h3 class="dark-inverted">Location</h3>
    </div>
    <div class="active-team">
      <div v-if="locations.length">
        <GoogleMap
          ref="mapRef"
          :api-key="googleMapsApiKey"
          :class="['gmaps']"
          :center="{
            lat: locations[0].latitude,
            lng: locations[0].longitude,
          }"
          :zoom="5"
          :min-zoom="2"
          :max-zoom="12"
          :disable-default-ui="true"
          :styles="googleMapsStyle"
        >
          <template v-if="locations.length">
            <MarkerCluster :options="{ maxZoom: 15 }">
              <MapMarker
                v-for="(location, i) in locations"
                :key="i"
                :options="{
                  position: {
                    lat: location.latitude,
                    lng: location.longitude,
                  },
                }"
              >
                <InfoWindow>
                  <div id="p-5">
                    <h5 class="has-text-black mt-0 mb-2">Location details</h5>
                    <!-- eslint-disable vue/no-v-html -->
                    <div v-dompurify-html="getLocationHtml(location)" />
                    <!-- eslint-enable -->
                  </div>
                </InfoWindow>
              </MapMarker>
            </MarkerCluster>
          </template>
        </GoogleMap>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { googleMapStyle } from '/@src/helpers/googleMapStyle'
import {
  GoogleMap,
  MarkerCluster,
  InfoWindow,
  Marker as MapMarker,
} from 'vue3-google-map'

export default {
  components: { GoogleMap, MarkerCluster, MapMarker, InfoWindow },
  props: ['asset'],
  data: () => ({
    googleMapsStyle: googleMapStyle,
    locations: [],
    loaded: false,
  }),
  async mounted() {
    this.googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    await axios
      .get('/widget/asset-locations', {
        params: {
          asset_id: this.asset?.id,
        },
      })
      .then((res) => {
        this.loaded = true
        this.locations = res.data.data
      })
  },
  methods: {
    getLocationHtml(location) {
      let html =
        "<p class='has-text-black mb-2'>We found <b>" +
        location.ips.length +
        '</b> IP addresses in this location.</p>'

      location.ips.forEach((item) => {
        html += '<p class="mb-0"><a class="has-text-black">' + item + '</a></p>'
      })

      return html
    },
  },
}
</script>
