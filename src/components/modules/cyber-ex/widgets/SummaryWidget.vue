<template>
  <div class="is-relative">
    <div
      v-if="calendar && selectedDate"
      style="position: absolute; right: 20px; top: 20px; z-index: 2"
    >
      <div>
        <div class="field">
          <AssetsDetailCalendarFilter
            :selected-date="selectedDate"
            :data="calendarData"
            @taskDateChanged="taskDateChanged"
          />
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column is-4">
        <CountComponent title="IP's" :loading="loading" :count="data.ip_list" />
      </div>
      <div class="column is-4">
        <CountComponent
          title="IP's with CVE"
          :loading="loading"
          :count="data.ip_list_with_vuln"
        />
      </div>
      <div class="column is-4">
        <CountComponent
          title="Opened ports"
          :loading="loading"
          :count="data.list_ip_ports"
        />
      </div>
    </div>
    <div class="columns is-desktop">
      <div class="column is-4 is-full-mobile">
        <CountComponent
          title="Subdomain's"
          :loading="loading"
          :count="data.subdomains_list"
        />
      </div>
      <div class="column is-4 is-full-mobile">
        <CountComponent
          title="Certificates"
          :loading="loading"
          :count="data.certificates"
        />
      </div>
      <div class="column is-4 is-full-mobile">
        <CountComponent
          title="Technologies"
          :loading="loading"
          :count="data.list_all_technologies"
        />
      </div>
    </div>
    <div class="columns is-desktop">
      <div v-tooltip="`Total CVE`" class="column is-one-fifth is-full-mobile">
        <CountComponent
          title="CVE"
          :loading="loadingVulnerabilities"
          :count="data.list_vulnerabilities"
        />
      </div>
      <div v-tooltip="`Critical level CVE`" class="column is-one-fifth is-full-mobile">
        <CountComponent
          title="Critical"
          :loading="loadingVulnerabilities"
          :count="data.list_critical_vulnerabilities"
          status="critical"
        />
      </div>
      <div v-tooltip="`High level CVE`" class="column is-one-fifth is-full-mobile">
        <CountComponent
          title="High"
          :loading="loadingVulnerabilities"
          :count="data.list_high_vulnerabilities"
          status="high"
        />
      </div>
      <div v-tooltip="`Medium level CVE`" class="column is-one-fifth is-full-mobile">
        <CountComponent
          title="Medium"
          :loading="loadingVulnerabilities"
          :count="data.list_med_vulnerabilities"
          status="medium"
        />
      </div>
      <div v-tooltip="`Low level CVE`" class="column is-one-fifth is-full-mobile">
        <CountComponent
          title="Low"
          :loading="loadingVulnerabilities"
          :count="data.list_low_vulnerabilities"
          status="low"
        />
      </div>
    </div>
    <div class="columns is-desktop">
      <div v-tooltip="`Total typosquatting`" class="column is-3 is-full-mobile">
        <CountComponent
          title="Typosquatting"
          :loading="loading"
          :count="data.typosquatting"
        />
      </div>
      <div v-tooltip="`High level typosquatting`" class="column is-3 is-full-mobile">
        <CountComponent
          title="High"
          :loading="loading"
          :count="data.typosquatting_high"
          status="high"
        />
      </div>
      <div v-tooltip="`Medium level typosquatting`" class="column is-3 is-full-mobile">
        <CountComponent
          title="Medium"
          :loading="loading"
          :count="data.typosquatting_med"
          status="medium"
        />
      </div>
      <div v-tooltip="`Low level typosquatting`" class="column is-3 is-full-mobile">
        <CountComponent
          title="Low"
          :loading="loading"
          :count="data.typosquatting_low"
          status="low"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import CountComponent from '../../widgets/CountComponent.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'

export default {
  components: {
    AssetsDetailCalendarFilter,
    CountComponent,
  },
  props: [
    'project',
    'task',
    'collection',
    'asset',
    'trial',
    'calendar',
    'grouped',
    'specificDate',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    data: {
      reports: [],
      ip_list: 0,
      ip_list_details: 0,
      ip_list_details_with_vuln: 0,
      subdomain_ips_list: 0,
      certificates: 0,
      typosquatting: 0,
      typosquatting_high: 0,
      typosquatting_med: 0,
      typosquatting_low: 0,
      list_ip_ports: 0,
      subdomains_list: 0,
      list_high_vulnerabilities: 0,
      list_med_vulnerabilities: 0,
      list_low_vulnerabilities: 0,
      list_vulnerabilities: 0,
      list_all_technologies: 0,
    },
    loading: true,
    loadingVulnerabilities: true,
  }),
  async mounted() {
    if (this.calendar) {
      await this.getCalendarData()
    }
    if (this.specificDate) {
      this.selectedDate = this.specificDate
    }
    await this.getData()
  },
  methods: {
    async getData() {
      await Promise.all([
        axios
          .get('/summary', {
            params: {
              grouped: this.grouped,
              task_id: this.task?.id,
              date: this.selectedDate,
              project_id: this.project?.id,
              collection_id: this.collection?.id,
              asset_id: this.asset?.id,
            },
          })
          .then(async (res) => {
            this.data = { ...this.data, ...res.data }
            this.loading = false
          }),
        axios
          .get('/summary/vulnerabilities', {
            params: {
              grouped: this.grouped,
              task_id: this.task?.id,
              date: this.selectedDate,
              project_id: this.project?.id,
              collection_id: this.collection?.id,
              asset_id: this.asset?.id,
            },
          })
          .then((res) => {
            this.data = { ...this.data, ...res.data }
            this.loadingVulnerabilities = false
          }),
      ])
    },
    async getCalendarData() {
      await axios
        .get('/summary/calendar', {
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
    scrollToElement(slug) {
      let top = this.scrollToElementPosition(document.getElementById(slug)) - 100
      window.scroll(0, top)
    },
    scrollToElementPosition(obj) {
      var currenttop = 0
      if (obj.offsetParent) {
        do {
          currenttop += obj.offsetTop
        } while ((obj = obj.offsetParent))
        return [currenttop]
      }
    },
  },
}
</script>
