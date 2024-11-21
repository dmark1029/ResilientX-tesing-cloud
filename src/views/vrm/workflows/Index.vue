<template>
  <div>
    <div v-if="!loading" class="tile-grid-toolbar assets">
      <div class="asset-filters">
        <div class="columns w-100">
          <div class="column is-3 pt-0 pb-0">
            <VField>
              <VControl>
                <VInput
                  v-model="search"
                  type="text"
                  placeholder="Search..."
                  :disabled="showConfiguration"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-3 pt-0 pb-0">
            <VButton
              color="primary"
              raised
              @click="
                () => {
                  showConfiguration = !showConfiguration
                }
              "
            >
              <span v-if="!showConfiguration" class="icon">
                <i aria-hidden="true" class="fas fa-cogs" />
              </span>
              <span v-if="!showConfiguration">Configuration</span>
              <span v-if="showConfiguration" class="icon">
                <i aria-hidden="true" class="fas fa-code-branch" />
              </span>
              <span v-if="showConfiguration">Workflows</span>
            </VButton>
          </div>
        </div>
      </div>
      <div class="buttons">
        <VButton
          v-if="canPerformAction('vendors', 'create')"
          color="primary"
          raised
          @click="showModal = true"
        >
          <span class="icon">
            <i aria-hidden="true" class="fas fa-plus" />
          </span>
          <span>Add</span>
        </VButton>
      </div>
    </div>

    <div>
      <VendorsWorkflowModal v-if="showModal" @closeModal="hideModal" />
    </div>

    <div v-if="!showConfiguration">
      <div v-if="loading || !items" class="app-init-wrapper">
        <VLoader class="is-grey" :active="true">
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
                  <TableSortableHeader
                    v-if="columns['Company']"
                    :sort="sort"
                    title="Company"
                    slug="company"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Trigger']"
                    :sort="sort"
                    title="Trigger"
                    slug="trigger"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Action']"
                    :sort="sort"
                    title="Action"
                    slug="action"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Contact']"
                    :sort="sort"
                    title="Contact"
                    slug="contact"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Triggered']"
                    :sort="sort"
                    title="Triggered"
                    slug="triggered_count"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="vendor-workflows-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items.data" :key="item.id">
                  <td v-if="columns['Company']">{{ item.vendor.name }}</td>
                  <td v-if="columns['Trigger']">
                    {{ getIssueType(item.issue_type) }}
                  </td>
                  <td v-if="columns['Action']">Create remediation request</td>
                  <td v-if="columns['Contact']">
                    {{
                      item.contact
                        ? item.contact.name +
                          ' ' +
                          item.contact.surname +
                          ' (' +
                          item.contact.email +
                          ')'
                        : 'All contacts'
                    }}
                  </td>
                  <td v-if="columns['Triggered']">{{ item.triggered }} times</td>
                  <td>
                    <a
                      :class="
                        canPerformAction('vendors', 'create')
                          ? 'btn btn-sm btn-outline-danger is-clickable'
                          : 'btn btn-sm btn-outline-danger is-disabled'
                      "
                      @click="deleteWorkflow(item)"
                      ><i class="fa fa-trash has-text-danger"
                    /></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination :limit="5" :data="items" @pagination-change-page="getData" />
      </div>
    </div>

    <div v-if="showConfiguration">
      <div class="columns">
        <div class="column is-6">
          <div class="dashboard-card">
            <div class="card-head mb-2">
              <h3 class="dark-inverted">Workflow configuration</h3>
            </div>

            <p>
              Enabling general workflow configuration will automatically create a
              "Remediation request" for all new issues for all companies in your
              workspace. You can also configure specific workflows for each company. To
              override override general workflow configuration for a specific company, go
              to the section and configure the workflow there.
            </p>
          </div>
        </div>
        <div class="column is-6"></div>
      </div>

      <div v-if="!loading">
        <div
          v-for="(name, id) in general.issues.categories"
          :key="id"
          class="dashboard-card"
          :value="id"
        >
          <div class="card-head mb-2">
            <h3 class="dark-inverted">{{ name }}</h3>
            <VControl>
              <VSwitchBlock
                v-model="workflows[id]"
                color="success"
                @change="updateWorkflows"
              />
            </VControl>
          </div>

          <p>
            Enabling this feature will automatically create a "Remediation request" for
            all new "{{ name }}" for all companies in your workspace.
          </p>
        </div>
      </div>
      <div v-else>
        <VLoader class="is-grey" :active="true">
          <div style="height: 300px"></div>
        </VLoader>
      </div>
    </div>
  </div>

  <AreYouSureModal ref="confirmDialogue" />

  <div class="breadcrumb-wrapper">
    <VBreadcrumb :items="links" :center="true" />
  </div>
</template>

<script>
import { axios } from '/src/axios'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import { mapGetters } from 'vuex'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VField from '/@src/components/base/form/VField.vue'
import VControl from '/@src/components/base/form/VControl.vue'
import VInput from '/@src/components/base/form/VInput.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import _ from 'lodash'
import VendorsWorkflowModal from '/@src/components/vendors/VendorsWorkflowModal.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import permissionsMixin from '../../../mixins/permissionsMixin.js'
import VSwitchBlock from '/@src/components/base/form/VSwitchBlock.vue'

export default {
  components: {
    VSwitchBlock,
    AreYouSureModal,
    VendorsWorkflowModal,
    TableCustomizationDropdown,
    TableSortableHeader,
    VButton,
    VInput,
    VControl,
    VField,
    VBreadcrumb,
    Pagination,
    NoData,
    VLoader,
  },
  mixins: [permissionsMixin],
  props: ['vendorIds', 'vendorId'],
  data: () => ({
    showModal: false,
    loading: false,
    items: [],
    generals: [],
    workflows: {},
    links: [],

    search: '',
    sort: '',
    showConfiguration: false,

    columns: {
      Company: true,
      Contact: true,
      Trigger: true,
      Action: true,
      Triggered: true,
    },
  }),
  computed: {
    ...mapGetters(['workspace', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getData()
    }, 500),
    sort: _.debounce(function () {
      this.getData()
    }, 500),
  },
  async mounted() {
    this.loadColumns()

    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
      },
      {
        label: 'Workflows',
        to: {},
      },
    ]

    this.loading = true

    await Promise.all([this.getData(), this.getGeneralData()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    async updateWorkflows() {
      axios
        .post(`/vendor-workflow/general`, {
          workspace_id: this.workspace.id,
          issue_type: this.workflows,
        })
        .then(() => {
          this.getData()
        })
    },
    getGeneralData(page = 1) {
      return axios
        .get(`/vendor-workflow`, {
          params: {
            workspace_id: this.workspace.id,
            general: true,
            page: page,
          },
        })
        .then((res) => {
          this.generals = res.data.data

          this.generals.forEach((item) => {
            this.workflows[item.issue_type] = true
          })
        })
        .catch(() => {})
    },
    getIssueType(type) {
      return this.general.issues.categories[type]
    },
    async deleteWorkflow(item) {
      let ok = false

      ok = await this.$refs.confirmDialogue.show({
        title: 'Confirmation',
        message: 'Are you sure you want to delete this item?',
        okButton: 'Yes',
        cancelButton: 'No',
      })

      if (ok) {
        axios.delete(`/vendor-workflow/${item.id}`).then(() => {
          this.getData()
        })
      }
    },
    hideModal() {
      this.showModal = false
      this.getData()
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendor-workflows-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getData(page = 1) {
      return axios
        .get(`/vendor-workflow`, {
          params: {
            workspace_id: this.workspace.id,
            q: this.search,
            sort: this.sort,
            status: this.searchStatus,
            priority: this.searchPriority,
            page: page,
          },
        })
        .then((res) => {
          this.items = res.data
        })
        .catch(() => {})
    },
  },
  metaInfo() {
    return {
      title: 'Workflows',
    }
  },
}
</script>


<style lang="scss" scoped>
.tile-grid-toolbar.assets {
  position: relative;
}

.asset-filters {
  display: flex;
  align-self: center;
  min-width: 85%;
}

.tile-grid-toolbar .control {
  margin-inline-end: 0px;
}

@media (width <= 767px) {
  .asset-filters {
    min-width: 70%;
  }
}
</style>