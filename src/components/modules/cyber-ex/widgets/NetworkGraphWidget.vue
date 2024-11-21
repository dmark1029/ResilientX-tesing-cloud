<template>
  <div>
    <div class="columns">
      <div class="column is-12 col-xl-12">
        <div class="card">
          <div class="card-body">
            <h4 class="title is-5">Network graph</h4>

            <div
              v-if="calendar && !loading"
              class="list-view-toolbar"
              style="position: absolute; top: 20px; right: 20px"
            >
              <div v-if="calendar" class="field">
                <AssetsDetailCalendarFilter
                  :selected-date="selectedDate"
                  :data="calendarData"
                  @taskDateChanged="taskDateChanged"
                />
              </div>
            </div>

            <VTabs
              slider
              type="rounded"
              selected="all"
              :tabs="[
                { label: 'All', value: 'all' },
                { label: 'Vulnerable', value: 'vulnerable' },
              ]"
              @update:selected="
                (value) => {
                  value === 'all' ? setAllAssets() : setVulnAssets()
                }
              "
            >
              <template #tab="">
                <div class="card mb-0">
                  <CosmoComponent
                    v-if="dataAll && !loading && cat === 'all'"
                    id="large-all"
                    :data="dataAll"
                    :controls="false"
                    :zoom="true"
                    :h="600"
                    @selected="selected"
                  />
                  <CosmoComponent
                    v-if="dataVuln && !loading && cat === 'vuln'"
                    id="large-vuln"
                    :data="dataVuln"
                    :controls="false"
                    :zoom="true"
                    :h="600"
                    @selected="selected"
                  />

                  <VLoader v-if="loading" :active="true" class="loading p-5">
                    <div role="status" style="height: 300px"></div>
                  </VLoader>
                </div>
              </template>
            </VTabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/@src/axios'
import CosmoComponent from '../../widgets/CosmoComponent.vue'
import AssetsDetailCalendarFilter from '/@src/components/assets/AssetsDetailCalendarFilter.vue'
import VTabs from '/@src/components/base/tabs/VTabs.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    VTabs,
    AssetsDetailCalendarFilter,
    CosmoComponent,
    VLoader,
  },
  props: ['project', 'task', 'collection', 'asset', 'trial', 'calendar', 'specificDate'],
  data: () => ({
    calendarData: [],
    selectedDate: null,
    dataAll: null,
    dataVuln: null,
    selectedItem: null,
    loading: false,
    cat: 'all',
  }),
  async mounted() {
    if (this.calendar) {
      await this.getCalendarData()
    }
    if (this.specificDate) {
      this.selectedDate = this.specificDate
    }
    await this.setAllAssets()
  },
  methods: {
    async getCalendarData() {
      await axios
        .get('/graph/calendar', {
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
      if (this.cat === 'all') {
        this.setAllAssets()
      } else {
        this.setVulnAssets()
      }
    },
    async setVulnAssets() {
      this.cat = 'vuln'

      if (!this.dataVuln) {
        this.loading = true

        await axios
          .get('/graph', {
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
            let data = res.data

            let links = []
            Object.keys(data.links).forEach((key) => {
              if (key !== 'first' && key !== 'last' && key !== 'next' && key !== 'prev') {
                links.push(data.links[key])
              }
            })

            data.links = links

            this.dataVuln = data

            this.loading = false
          })
      }
    },
    async setAllAssets() {
      this.cat = 'all'

      if (!this.dataAll) {
        this.loading = true

        await axios
          .get('/graph', {
            params: {
              task_id: this.task?.id,
              date: this.selectedDate,
              project_id: this.project?.id,
              collection_id: this.collection?.id,
              asset_id: this.asset?.id,
            },
          })
          .then((res) => {
            let data = res.data

            let links = []
            Object.keys(data.links).forEach((key) => {
              if (key !== 'first' && key !== 'last' && key !== 'next' && key !== 'prev') {
                links.push(data.links[key])
              }
            })

            data.links = links

            this.dataAll = data

            this.loading = false
          })
      }
    },
    selected(value) {
      this.selectedItem = value
    },
  },
}
</script>