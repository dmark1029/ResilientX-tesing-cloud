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
        <NoData :meta="items?.meta" search="" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="items?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due date</th>
                  <th>Created</th>
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
                        name: 'VrmManageIssuesView',
                        params: { issue: item.issue_id },
                        query: { id: item.id },
                      })
                    }
                  "
                  class="is-clickable"
                >
                  <td>{{ item.title }}</td>
                  <td>
                    <RemediationRequestBadge :status="item.status" />
                  </td>
                  <td>
                    <RemediationRequestPriorityBadge :priority="item.priority" />
                  </td>
                  <td>
                    {{ item.due ?? '-' }}
                  </td>
                  <td>
                    {{ item.created }}
                  </td>
                  <td
                    :class="
                      !item.isMessageSeen
                        ? 'is-flex is-justify-content-space-between is-align-items-center'
                        : ''
                    "
                  >
                    <div v-if="!item.isMessageSeen" class="tag is-success">
                      New Message
                    </div>
                    <router-link
                      :to="{
                        name: 'VrmManageIssuesView',
                        params: { issue: item.issue_id },
                        query: { id: item.id },
                      }"
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
import RemediationRequestBadge from '/@src/components/vendors/RemediationRequestBadge.vue'
import RemediationRequestPriorityBadge from '/@src/components/vendors/RemediationRequestPriorityBadge.vue'

export default {
  components: {
    RemediationRequestPriorityBadge,
    RemediationRequestBadge,
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
      let url = `/vendor-manage/issues`
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
          this.items.data = this.items.data.map((item) => {
            const isMessageSeen =
              item.comments.length === 0 ||
              item.comments.every((comment) => {
                if (comment.workspace_id) {
                  return comment.is_seen
                }
                return true
              })
            return {
              ...item,
              isMessageSeen,
            }
          })
        })
        .catch(() => {})
    },
  },
}
</script>
