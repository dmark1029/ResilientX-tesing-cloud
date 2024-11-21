<template>
  <div>
    <h4 class="title is-5">IP details</h4>

    <div v-if="data" class="list-view-toolbar">
      <div v-if="calendar" class="field">
        <AssetsDetailCalendarFilter
          :selected-date="selectedDate"
          :data="calendarData"
          @taskDateChanged="taskDateChanged"
        />
      </div>
      <div class="buttons item-buttons">
        <button
          type="button"
          aria-hidden="false"
          :class="downloading ? 'button v-button is-disabled' : 'button v-button'"
          @click="exportData"
        >
          <span class="icon rtl-reflect">
            <i aria-hidden="true" class="fa fa-file-export" />
          </span>
          <span class="is-hidden-mobile">
            {{ downloading ? $t('Downloading..') : $t('Export') }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="details">
      <div class="columns">
        <div class="column is-12">
          <div class="card">
            <!--end card-header-->
            <div class="card-body">
              <h4 class="title is-5">Details</h4>
              <dl class="columns mb-0 is-multiline">
                <dt v-if="details.asset.value" class="column is-3">IP</dt>
                <dd v-if="details.asset.value" class="column is-9">
                  {{ details.asset.value }}
                </dd>
                <dt v-if="details.country_name" class="column is-3">Country</dt>
                <dd v-if="details.country_name" class="column is-9">
                  {{ details.country_name }}
                </dd>
                <dt v-if="details.city" class="column is-3">City</dt>
                <dd v-if="details.city" class="column is-9">
                  {{ details.city }}
                </dd>
                <dt v-if="details.lat" class="column is-3">GPS Location</dt>
                <dd v-if="details.lat" class="column is-9">
                  {{ details.lat }},
                  {{ details.lng }}
                </dd>
                <dt v-if="details.organization" class="column is-3">Organization</dt>
                <dd v-if="details.organization" class="column is-9">
                  {{ details.organization }}
                </dd>
                <dt v-if="details.asn" class="column is-3">ASN</dt>
                <dd v-if="details.asn" class="column is-9">
                  {{ details.asn }}
                </dd>
                <dt v-if="details.isp" class="column is-3">ISP</dt>
                <dd v-if="details.isp" class="column is-9">
                  {{ details.isp }}
                </dd>
                <dt v-if="details.domains?.length" class="column is-3">Domains</dt>
                <dd v-if="details.domains?.length" class="column is-9">
                  <ul class="ps-3 mb-0">
                    <li v-for="item in details.domains" :key="item">
                      {{ item }}
                      <a :href="'http://' + item" target="_blank"
                        ><i class="fa fa-external-link-alt"
                      /></a>
                    </li>
                  </ul>
                </dd>
                <dt v-if="details.hostnames?.length" class="column is-3">Hostnames</dt>
                <dd v-if="details.hostnames?.length" class="column is-9">
                  <ul class="ps-3 mb-0">
                    <li v-for="item in details.hostnames" :key="item">
                      {{ item }}
                      <a :href="'http://' + item" target="_blank"
                        ><i class="fa fa-external-link-alt"
                      /></a>
                    </li>
                  </ul>
                </dd>
              </dl>
            </div>
            <!--end card-body-->
          </div>
        </div>
      </div>

      <div class="columns">
        <div v-if="details.lat" class="column is-12">
          <div class="card">
            <div class="card-body">
              <h4 class="title is-5">Location</h4>
              <GoogleMap
                :api-key="googleMapsApiKey"
                class="gmaps"
                :center="{
                  lat: parseFloat(details.lat),
                  lng: parseFloat(details.lng),
                }"
                :zoom="5"
                :disable-default-ui="true"
                :styles="googleMapsStyle"
              >
                <MapMarker
                  :options="{
                    position: {
                      lat: parseFloat(details.lat),
                      lng: parseFloat(details.lng),
                    },
                  }"
                />
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import _ from 'lodash'
import { googleMapStyle } from '/@src/helpers/googleMapStyle'
import { GoogleMap, Marker as MapMarker } from 'vue3-google-map'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'

export default {
  components: {
    AssetsDetailCalendarFilter,
    GoogleMap,
    MapMarker,
  },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'specificDate'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    search: '',
    addToAssetsModal: false,
    downloading: false,
    googleMapsStyle: googleMapStyle,
    googleMapsApiKey: null,

    imageHost: 'https://s3.eu-central-1.amazonaws.com/rx-tech-media.resilientx.cloud',
    details: null,
    loading: true,
    ip: null,
    sorting: '-vulnerabilities_count',
  }),
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
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
    sortingEvent(sorting) {
      this.sorting = sorting.direction + sorting.field
      this.getData()
    },
    async getCalendarData() {
      await axios
        .get('/details/calendar', {
          params: {
            task_id: this.task?.id,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
          },
        })
        .then((res) => {
          this.calendarData = res.data.data
          // eslint-disable-next-line vue/no-mutating-props
          if (res.data.data[0]) {
            this.selectedDate = res.data.data[0].date
          }
        })
    },
    taskDateChanged(item) {
      this.selectedDate = item
      this.getData()
    },
    async getData(page = 1) {
      if (this.trial) {
        return
      }
      await axios
        .get('/details', {
          params: {
            q: this.search,
            sort: this.sorting,
            page: page,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            grouped: true,
          },
        })
        .then((res) => {
          this.data = res.data
          this.loading = false
        })

      if (this.data.data) {
        this.details = this.data.data[0]
      }
    },
    async exportData() {
      if (this.trial) {
        return
      }

      this.downloading = true

      await axios
        .get('/details/export', {
          params: {
            q: this.search,
            sort: this.sorting,

            task_id: this.task?.id,
            date: this.selectedDate,
            project_id: this.project?.id,
            collection_id: this.collection?.id,
            asset_id: this.asset?.id,
            grouped: true,
          },
        })
        .then((res) => {
          this.downloading = false

          if (res.data.data) {
            const blob = new Blob([res.data.data], { type: 'text/csv;charset=utf-8,' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'data.csv' // You can set the filename here
            a.click()
            window.URL.revokeObjectURL(url)
          }
        })
    },
    ipLink(item) {
      return {
        name: 'ProjectAssetView',
        params: { id: item.asset.project_id, asset: item.asset.id },
      }
    },
  },
}
</script>
