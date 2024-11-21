<template>
  <div class="d-flex h-100">
    <div v-if="loading" class="card w-100 h-100">
      <div class="card-body">
        <h5 class="title is-5">Vulnerabilities Impact</h5>
        <VLoader :active="true">
          <div style="height: 300px" />
        </VLoader>
      </div>
    </div>
    <div v-else class="d-flex w-100 h-100 is-relative">
      <div
        v-if="calendar"
        class="field"
        style="position: absolute; right: 20px; top: 20px; z-index: 2"
      >
        <AssetsDetailCalendarFilter
          :selected-date="selectedDate"
          :data="calendarData"
          @taskDateChanged="taskDateChanged"
        />
      </div>
      <PieChartComponent
        v-if="
          data &&
          (data.availability_sum || data.confidentiality_sum || data.integrity_sum)
        "
        class="w-100 h-100"
        title="Vulnerabilities Impact"
        :labels="['Availability', 'Confidentiality', 'Integrity']"
        :values="[data.availability_sum, data.confidentiality_sum, data.integrity_sum]"
      />
      <div v-else class="card w-100 h-100">
        <div
          class="card-body is-flex is-align-items-center is-justify-content-center h-100"
        >
          <div class="has-text-centered">
            <h5 class="title is-5">Vulnerabilities Impact</h5>
            <p class="mt-2 text-muted mb-0">
              No Impact found related to Potential Vulnerabilities
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import PieChartComponent from '../../widgets/PieChartComponent.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    AssetsDetailCalendarFilter,
    PieChartComponent,
    VLoader,
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
    data: {
      availability_sum: 0,
      confidentiality_sum: 0,
      integrity_sum: 0,
    },
    calendarData: [],
    selectedDate: null,
    loading: true,
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
    async getCalendarData() {
      await axios
        .get('/impact/calendar', {
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
    async getData() {
      await axios
        .get('/impact', {
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
          this.data = res.data
          this.loading = false
        })
    },
  },
}
</script>
