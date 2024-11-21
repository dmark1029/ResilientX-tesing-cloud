<template>
  <div v-if="!loading">
    <div>
      <div v-if="licenses.meta && licenses.meta.total" class="datatable-container">
        <table class="table datatable-table is-fullwidth mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Type</th>
              <th>Security app</th>
              <th>Projects</th>
              <th>Assets</th>
              <th>Users</th>
              <th>Vendors</th>
              <th>Created</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in licenses.data" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <VTag
                  v-if="item.status === 'active'"
                  color="success"
                  label="Active"
                  rounded
                />
                <VTag v-else color="danger" label="Inactive" rounded />
              </td>
              <td>
                <VTag v-if="item.trial" color="info" label="Trial" rounded />
                <VTag v-else color="success" label="Standard" rounded />
              </td>
              <td v-dompurify-html="getModulesText(item)"></td>
              <td>
                <span v-if="item.status === 'active'">
                  <span v-if="item.project_limit">
                    {{ item.workspace.projects_count }} / {{ item.project_limit }}
                  </span>
                  <span v-else> Unlimited </span>
                </span>
                <span v-else> - </span>
              </td>
              <td>
                <span v-if="item.status === 'active'">
                  <span v-if="item.asset_limit">
                    {{ item.workspace.assets_count }} / {{ item.asset_limit }}
                  </span>
                  <span v-else> Unlimited </span>
                </span>
                <span v-else> - </span>
              </td>
              <td>
                <span v-if="item.status === 'active'">
                  <span v-if="item.user_limit">
                    {{ item.workspace.users_count }} / {{ item.user_limit }}
                  </span>
                  <span v-else> Unlimited </span>
                </span>
                <span v-else> - </span>
              </td>
              <td>
                <span v-if="item.status === 'active'">
                  <span v-if="item.vendor_limit">
                    {{ item.workspace.vendors_count }} / {{ item.vendor_limit }}
                  </span>
                  <span v-else> Unlimited </span>
                  <span
                    v-if="item.vendor_manage_enabled"
                    v-tooltip="`Vendor manage enabled`"
                  >
                    <i class="ml-1 fa fa-cogs"></i>
                  </span>
                </span>
                <span v-else> - </span>
              </td>
              <td>
                <span v-tooltip="item.created">{{ item.created_date }}</span>
              </td>
              <td>
                <span v-tooltip="item.expires">{{ item.expires_date }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!--end /table-->
      </div>
      <div v-else>
        <NoData :meta="licenses.meta" />
      </div>

      <div class="mt-3">
        <Pagination :data="licenses" @pagination-change-page="getLicenses" />
      </div>
    </div>

    <button
      v-if="user && user.type === 'LicenseManager'"
      class="button v-button is-bold is-big is-raised is-primary btn-sm"
      style="flex: initial"
      @click="showModal = true"
    >
      Add license
    </button>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>

    <Modal v-if="showModal" :workspace="workspace" @closeModal="hideModal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'
import Modal from '/@src/components/licenses/LicensesModal.vue'
import { useMeta } from 'vue-meta'
import Form from '/@src/form'
import VTag from '/@src/components/base/tags/VTag.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'

export default {
  components: {
    VBreadcrumb,
    Pagination,
    NoData,
    VTag,
    Modal,
  },
  props: ['workspace'],
  setup() {
    useMeta({
      title: `Licenses`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    links: [],
    form: new Form({}),
    showModal: false,
  }),
  computed: {
    ...mapGetters(['licenses', 'loading', 'user', 'isMobile']),
  },
  async mounted() {
    this.$store.dispatch('showLoading')

    await this.getLicenses()

    this.links = [
      {
        label: 'Home',
        to: {
          name: 'Home',
        },
        active: false,
      },
      {
        label: 'Workspaces',
        to: {
          name: 'Workspaces',
        },
        active: false,
      },
      {
        label: this.workspace.name,
        to: {
          name: 'WorkspacesView',
          params: { id: this.workspace.id },
        },
        active: false,
      },
      {
        label: 'Licenses',
        to: {},
        active: true,
      },
    ]

    this.$store.dispatch('hideLoading')
  },
  methods: {
    getModulesText(item) {
      if (item.modules.length === 0) {
        return 'All modules'
      }

      return item.modules
        .map((module) => {
          let scans = 'None'

          if (item.licenseModules) {
            const licenseModule = item.licenseModules.find(
              (lm) => lm.module_id === module.id
            )
            if (licenseModule) {
              scans = licenseModule.scan_used + '/' + licenseModule.scan_limit

              if (licenseModule.scan_limit === 0) {
                scans = 'Unlimited'
              }
            }
          }

          return module.name + ' (' + scans + ' scans)'
        })
        .join('<br/>')
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getLicenses()
    },
    getLicenses(page = 1) {
      let url = `/license?page=${page}`
      if (this.workspace) {
        url = `/license?workspace_id=${this.workspace.id}&page=${page}`
      }
      return axios
        .get(url)
        .then((res) => {
          this.$store.dispatch('addLicenses', res.data)
        })
        .catch(() => {})
    },
  },
}
</script>
