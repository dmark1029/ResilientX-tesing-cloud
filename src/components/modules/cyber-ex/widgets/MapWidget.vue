<template>
  <div class="columns h-100">
    <div class="column is-12">
      <div v-if="loading" class="card w-100">
        <div class="card-body">
          <h4 class="title is-5">Attack Surface</h4>
          <div class="gmaps">
            <div class="loading h-100 pb-3">
              <VLoader :active="true">
                <div />
              </VLoader>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card h-100">
        <div id="ips" class="card-body h-100">
          <h4 class="title is-5">Attack Surface</h4>
          <div v-if="locations.length">
            <GoogleMap
              ref="mapRef"
              :api-key="googleMapsApiKey"
              :class="[trial ? 'blur gmaps' : 'gmaps']"
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
          <NoData v-else :meta="{ total: 0 }"></NoData>
          <div
            v-if="trial"
            v-tooltip="`This report was generated in trial mode, upgrade required`"
            class="trial-overlay"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import { googleMapStyle } from '/@src/helpers/googleMapStyle'
import NoData from '/@src/components/NoData.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import {
  GoogleMap,
  MarkerCluster,
  InfoWindow,
  Marker as MapMarker,
} from 'vue3-google-map'

export default {
  components: {
    GoogleMap,
    MarkerCluster,
    MapMarker,
    InfoWindow,
    NoData,
    VLoader,
  },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'specificDate'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    googleMapsStyle: googleMapStyle,
    googleMapsApiKey: null,
    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    locations: [],
    data: null,
    loading: true,
  }),
  watch: {
    '$refs.mapRef.value.ready': {
      immediate: true,
      handler() {
        setTimeout(() => {
          let mapRef = this.$refs.mapRef
          if (mapRef && mapRef.api) {
            let bounds = new mapRef.api.LatLngBounds()

            this.locations.forEach((location) => {
              bounds.extend({
                lat: location.latitude,
                lng: location.longitude,
              })
            })

            mapRef.map.fitBounds(bounds)

            let zoom = mapRef.map.getZoom()
            mapRef.map.setZoom(zoom > 5 ? 5 : zoom)
          }
        }, 2000)
      },
    },
  },
  async mounted() {
    this.googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (this.calendar) {
      await this.getCalendarData()
    }
    if (this.specificDate) {
      this.selectedDate = this.specificDate
    }

    await this.getData()
  },
  methods: {
    async getCalendarData() {
      await axios
        .get('/locations/calendar', {
          params: {
            task_id: this.task?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.calendarData = res.data.data
          if (res.data.data[0]) {
            this.selectedDate = res.data.data[0].date
          }
        })
    },
    taskDateChanged(item) {
      this.selectedDate = item
      this.getData()
    },
    getLocationHtml(location) {
      let html =
        "<p class='has-text-black mb-2'>We found <b>" +
        location.ips.length +
        '</b> IP addresses in this location.</p>'

      location.ips.forEach((item) => {
        let link = '#'

        if (this.task) {
          html +=
            '<p class="mb-0"><a class="has-text-black" href="' +
            this.$router.resolve(link).href +
            '" target="_blank">' +
            item +
            '</a></p>'
        } else {
          html += '<p class="mb-0"><a class="has-text-black">' + item + '</a></p>'
        }
      })

      return html
    },
    async getData() {
      await axios
        .get('/locations', {
          params: {
            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            vulnerable: true,
          },
        })
        .then((res) => {
          this.data = res.data.data
          this.loading = false
        })

      if (this.data) {
        this.locations = this.data.map((item) => {
          return {
            ips: item.ips,
            latitude: item.latitude,
            longitude: item.longitude,
          }
        })
      }
    },

    ipLink(ip) {
      return {
        name: 'ReportsView',
        params: { id: this.task.id },
        query: { ip: ip },
      }
    },
    isLatitude(lat) {
      return isFinite(lat) && Math.abs(lat) <= 90
    },
    isLongitude(lng) {
      return isFinite(lng) && Math.abs(lng) <= 180
    },
  },
}
</script>

<style lang="scss" scoped>
.search-results-body {
  height: 100%;
  display: flex;
}
</style>