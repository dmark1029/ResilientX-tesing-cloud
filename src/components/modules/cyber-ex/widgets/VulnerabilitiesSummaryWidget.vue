<template>
  <div>
    <div v-if="calendar" class="field">
      <AssetsDetailCalendarFilter
        :selected-date="selectedDate"
        :data="calendarData"
        @taskDateChanged="taskDateChanged"
      />
    </div>
    <div v-if="data?.attack_prediction || loading" class="columns">
      <div class="column is-one-fifth is-flex">
        <div
          v-if="loading"
          class="card w-100 placeholder-glow h-100"
          style="height: 208px"
        >
          <div class="card-body placeholder h-100 w-100" />
        </div>
        <div v-else class="card w-100">
          <div class="card-body" style="height: 100%">
            <h5 class="title is-5">Grade</h5>
            <div class="w-100" style="padding: 50px">
              <div class="grade-wrapper">
                <div
                  :class="`grade grade-` + data.attack_prediction.grade.toLowerCase()"
                />
                <div v-if="data.activity" class="grade-text">
                  {{ data.attack_prediction.grade }}
                </div>
                <div v-else class="grade-text">-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-one-fifth is-flex">
        <div
          v-if="loading"
          class="card w-100 placeholder-glow h-100"
          style="height: 208px"
        >
          <div class="card-body placeholder h-100 w-100" />
        </div>
        <CircleGaugeComponent
          v-else
          title="Potential attack probability"
          :count="data.attack_prediction.potential_attack_probability"
          class="w-100"
          color="#ff2833"
        />
      </div>
      <div class="column is-one-fifth is-flex">
        <div
          v-if="loading"
          class="card w-100 placeholder-glow h-100"
          style="height: 208px"
        >
          <div class="card-body placeholder h-100 w-100" />
        </div>
        <CircleGaugeComponent
          v-else
          title="Overall attack easiness"
          :count="data.attack_prediction.overall_attack_easiness"
          class="w-100"
          color="#ff2833"
        />
      </div>
      <div class="column is-one-fifth is-flex">
        <div
          v-if="loading"
          class="card w-100 placeholder-glow h-100"
          style="height: 208px"
        >
          <div class="card-body placeholder h-100 w-100" />
        </div>
        <CircleGaugeComponent
          v-else
          title="Overall attack impact"
          :count="data.attack_prediction.overall_attack_impact"
          class="w-100"
          color="#ff2833"
        />
      </div>
      <div class="column is-one-fifth is-flex">
        <div
          v-if="loading"
          class="card w-100 placeholder-glow h-100"
          style="height: 208px"
        >
          <div class="card-body placeholder h-100 w-100" />
        </div>
        <CircleGaugeComponent
          v-else
          title="Overall AI Killchain"
          :count="data.attack_prediction.overall_ai_killchain"
          class="w-100"
          color="#ff2833"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import CircleGaugeComponent from '../../widgets/CircleGaugeComponent.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'

export default {
  components: {
    AssetsDetailCalendarFilter,
    CircleGaugeComponent,
  },
  props: [
    'workspace',
    'project',
    'task',
    'collection',
    'workspaceCollectionId',
    'asset',
    'trial',
    'calendar',
    'grouped',
    'specificDate',
  ],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    data: null,
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
        .get('/summary/vulnerabilities/calendar', {
          params: {
            task_id: this.task?.id,
            workspace_id: this.workspace?.id,
            workspace_collection_id: this.workspaceCollectionId,
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
        .get('/summary/vulnerabilities', {
          params: {
            grouped: this.grouped,
            workspace_id: this.workspace?.id,
            task_id: this.task?.id,
            workspace_collection_id: this.workspaceCollectionId,
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

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.grade-f {
  background: #b40000;
}
.grade-f:before {
  background: #b40000;
}
.grade-d {
  background: #f03202;
}
.grade-d:before {
  background: #f03202;
}
.grade-c {
  background: #ef8e00;
}
.grade-c:before {
  background: #ef8e00;
}
.grade-b {
  background: #e5bd00;
}
.grade-b:before {
  background: #e5bd00;
}
.grade-a {
  background: #4ebf00;
}
.grade-a:before {
  background: #4ebf00;
}

.grade-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.grade {
  width: 130px;
  height: 130px;
  position: relative;
  text-align: center;
  transform: rotate(20deg);
}
.grade:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 130px;
  width: 130px;
  transform: rotate(135deg);
}

.grade-text {
  position: absolute;
  top: auto;
  left: auto;
  right: auto;
  bottom: auto;
  font-size: 52px;
  font-weight: 700;
}
</style>
