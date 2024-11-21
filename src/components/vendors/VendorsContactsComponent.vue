<template>
  <div>
    <div>
      <div v-if="!loading" class="tile-grid-toolbar assets">
        <div class="asset-filters">
          <div class="columns w-100">
            <div class="column is-3 pt-0 pb-0">
              <VField>
                <VControl>
                  <VInput v-model="search" type="text" placeholder="Search..." />
                </VControl>
              </VField>
            </div>
            <div class="column pt-0 is-3 pb-0 is-hidden-mobile">
              <VField v-slot="{ id }" class="is-curved-select">
                <VControl>
                  <Multiselect
                    v-model="searchType"
                    :attrs="{ id }"
                    :options="general.vrm.contactTypes"
                    placeholder="Type"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <div v-if="canCreate() && vendor" class="buttons">
          <VButton color="primary" raised @click="showModal = true">
            <span class="icon">
              <i aria-hidden="true" class="fas fa-plus" />
            </span>
            <span>Add</span>
          </VButton>
        </div>
      </div>

      <div v-if="loading || !vendorContacts" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else class="tile-grid tile-grid-v2">
        <!--List Empty Search Placeholder -->
        <NoData :meta="vendorContacts?.meta" :search="search" />

        <!--Tile Grid v1-->
        <TransitionGroup name="list" tag="div">
          <div v-if="vendorContacts?.meta?.total" class="datatable-container">
            <table class="table datatable-table is-fullwidth is-hoverable">
              <thead>
                <tr>
                  <TableSortableHeader
                    v-if="columns['Name']"
                    :sort="sort"
                    title="Name"
                    slug="name"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Company']"
                    :sort="sort"
                    title="Company"
                    slug="company"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Job title']"
                    :sort="sort"
                    title="Job title"
                    slug="job_title"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Type']"
                    :sort="sort"
                    title="Type"
                    slug="type"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Email']"
                    :sort="sort"
                    title="Email"
                    slug="email"
                    @changeSort="changeSort"
                  />
                  <TableSortableHeader
                    v-if="columns['Phone']"
                    :sort="sort"
                    title="Phone"
                    slug="phone"
                    @changeSort="changeSort"
                  />
                  <th style="min-width: 199px">
                    <TableCustomizationDropdown
                      id="vendor-contacts-table"
                      :types="columns"
                      @typesUpdated="loadColumns"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in vendorContacts.data"
                  :key="item.id"
                  v-table-click="
                    () => {
                      $router.push({
                        name: 'VendorView',
                        params: { asset: item.vendor.id },
                      })
                    }
                  "
                  class="is-clickable"
                >
                  <td v-if="columns['Name']">{{ item.name }} {{ item.surname }}</td>
                  <td v-if="columns['Company']">
                    {{ item.vendor.name ?? '-' }}
                  </td>
                  <td v-if="columns['Job title']">
                    {{ item.job_title ?? '-' }}
                  </td>
                  <td v-if="columns['Type']">
                    {{ item.contact_type?.name }}
                  </td>
                  <td v-if="columns['Email']">
                    {{ item.email ?? '-' }}
                  </td>
                  <td v-if="columns['Phone']">
                    {{ item.phone ?? '-' }}
                  </td>
                  <td class="text-end">
                    <button
                      v-if="vendor"
                      v-tooltip="'Edit contact'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="editAsset(item)"
                    >
                      <span class="icon is-small fa fa-pencil-alt"></span>
                    </button>
                    <button
                      v-if="vendor"
                      v-tooltip="'Delete contact'"
                      :class="
                        canUpdate()
                          ? 'button is-dark-outlined mr-2'
                          : 'button is-dark-outlined is-disabled mr-2'
                      "
                      @click.stop.prevent="deleteContact(item)"
                    >
                      <span class="icon is-small fa fa-trash"></span>
                    </button>
                    <router-link
                      v-if="!vendor"
                      :to="{
                        name: 'VendorView',
                        params: { asset: item.vendor.id },
                      }"
                      @click.stop.prevent=""
                    >
                      <button
                        v-tooltip="'View company'"
                        :class="
                          canPerformAction('vendors', 'view')
                            ? 'button is-dark-outlined mr-2'
                            : 'button is-dark-outlined is-disabled mr-2'
                        "
                      >
                        <span class="icon is-small fa fa-eye"></span>
                      </button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TransitionGroup>

        <Pagination
          :limit="5"
          :data="vendorContacts"
          @pagination-change-page="getVendorContacts"
        />

        <div>
          <VendorsContactsModal
            v-if="showModal"
            :editable="editable"
            :vendor="vendor"
            @closeModal="hideModal"
          />
        </div>
      </div>
    </div>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/@src/axios'

import permissionsMixin from '../../mixins/permissionsMixin.js'
import VControl from '/@src/components/base/form/VControl.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VField from '/@src/components/base/form/VField.vue'
import Multiselect from '@vueform/multiselect'
import VInput from '/@src/components/base/form/VInput.vue'
import TableCustomizationDropdown from '/@src/components/TableCustomizationDropdown.vue'
import TableSortableHeader from '/@src/components/TableSortableHeader.vue'
import VendorsContactsModal from '/@src/components/vendors/VendorsContactsModal.vue'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'

export default {
  components: {
    AreYouSureModal,
    VendorsContactsModal,
    TableSortableHeader,
    TableCustomizationDropdown,
    VInput,
    Multiselect,
    VField,
    Pagination,
    VLoader,
    NoData,
    VButton,
    VControl,
  },
  mixins: [permissionsMixin],
  props: ['vendor', 'workspace', 'admin'],
  data: () => ({
    showModal: false,
    loading: false,

    search: '',
    searchType: '',
    sort: '',

    editable: null,
    columns: {
      Name: true,
      Company: true,
      'Job title': true,
      Email: true,
      Phone: true,
      Type: true,
    },
  }),
  computed: {
    ...mapGetters(['vendorContacts', 'isMobile', 'general']),
  },
  watch: {
    search: _.debounce(function () {
      this.getVendorContacts()
    }, 500),
    searchType: _.debounce(function () {
      this.getVendorContacts()
    }, 500),
    sort: _.debounce(function () {
      this.getVendorContacts()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addVendorContacts', null)

    this.loadColumns()

    await Promise.all([this.getVendorContacts()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    openLink(url) {
      window.open('http://' + url, '_blank')
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendor-contacts-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getVendorContacts(page = 1) {
      let url = `/vendor-contact`
      let params = {
        workspace_id: this.workspace?.id,
        vendor_id: this.vendor?.id,
        q: this.search,
        sort: this.sort,
        type: this.searchType,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addVendorContacts', res.data)
        })
        .catch(() => {})
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getVendorContacts()
    },
    editAsset(item) {
      this.editable = JSON.parse(JSON.stringify(item))
      this.showModal = true
    },
    async deleteContact(item) {
      let ok = false
      if (item.status === 'disabled') {
        ok = true
      } else {
        ok = await this.$refs.confirmDialogue.show({
          title: 'Confirmation',
          message: 'Are you sure you want to delete this item?',
          okButton: 'Yes',
          cancelButton: 'No',
        })
      }
      if (ok) {
        axios
          .delete('/vendor-contact/' + item.id)
          .then((res) => {
            if (res.data.data.success) {
              this.getVendorContacts()
            } else {
              if (res.data.data.message) {
                this.$store.dispatch('addAlert', {
                  text: res.data.data.message,
                  type: 'danger',
                })
              } else {
                this.$store.dispatch('addAlert', {
                  text: 'Error deleting contact. Please try again.',
                  type: 'danger',
                })
              }
            }
          })
          .catch(() => {})
      }
    },
    canCreate() {
      // if (!this.admin) {
      //   if (this.vendor?.permissions === 'edit') {
      //     return true
      //   }
      //   return false
      // }
      return this.canPerformAction('vendors', 'create')
    },
    canUpdate() {
      // if (!this.admin) {
      //   if (this.vendor?.permissions === 'edit') {
      //     return true
      //   }
      //   return false
      // }
      return this.canPerformAction('vendors', 'update')
    },
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