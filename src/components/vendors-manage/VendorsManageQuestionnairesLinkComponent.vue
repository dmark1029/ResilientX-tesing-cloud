<template>
  <div>
    <div>
      <div v-if="loading || !items" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="items?.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="items?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>Questionnaire</th>
                  <th>Answered</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in items.data"
                  :key="item.id"
                  v-table-click="
                    () => {
                      $router.push({
                        name: 'VRMQuestionnaireAnswer',
                        params: { hash: item.hash },
                      })
                    }
                  "
                  class="is-clickable"
                >
                  <td>{{ item.title }}</td>
                  <td>{{ item.answered ? 'Yes' : 'No' }}</td>
                  <td>
                    <router-link
                      v-tooltip="'Answer questionnaire'"
                      :to="{
                        name: 'VRMQuestionnaireAnswer',
                        params: { hash: item.hash },
                      }"
                      target="_blank"
                      class="button is-dark-outlined mr-2"
                    >
                      <span class="icon is-small fa fa-eye"></span>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="items"
          @pagination-change-page="getQuestionnaires"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { axios } from '/src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Pagination,
    NoData,
    VLoader,
  },
  props: ['vendorIds', 'vendorId'],
  data: () => ({
    loading: false,
    items: [],
  }),
  computed: {
    ...mapGetters(['workspace']),
  },
  async mounted() {
    this.loading = true

    await Promise.all([this.getQuestionnaires()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    getQuestionnaires(page = 1) {
      let url = `/vendor-manage/questionnaires`
      let params = {
        q: this.search,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.items = res.data
        })
        .catch(() => {})
    },
  },
}
</script>
