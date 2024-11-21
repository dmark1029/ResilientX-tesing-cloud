<template>
  <div>
    <div>
      <div v-if="loading || !vendors" class="app-init-wrapper">
        <VLoader :active="true">
          <div />
        </VLoader>
      </div>
      <div v-else>
        <div class="user-grid-toolbar">
          <VControl icon="fa fa-search">
            <input
              v-model="search"
              class="input custom-text-filter"
              placeholder="Search..."
            />
          </VControl>
        </div>

        <!--List Empty Search Placeholder -->
        <NoData :meta="vendors?.meta" :search="search" />

        <div v-if="vendors?.meta?.total">
          <div>
            <div class="user-grid user-grid-v1">
              <TransitionGroup name="list" tag="div" class="columns is-multiline">
                <!--Grid item-->
                <div v-for="item in vendors.data" :key="item.id" class="column is-3">
                  <div class="grid-item">
                    <VAvatar
                      :picture="getPicture(item)"
                      :initials="item.name.substring(0, 2)"
                      size="big"
                    />
                    <h3 class="dark-inverted">
                      {{ item.name }}
                    </h3>
                    <p class="mb-4">{{ getDescription(item) }}</p>

                    <div class="buttons">
                      <button
                        class="button v-button is-dark-outlined"
                        @click="openVendorModal(item)"
                      >
                        <span>More information</span>
                      </button>
                      <button
                        class="button v-button is-primary"
                        :disabled="
                          item.fields ||
                          submitting === item.id ||
                          !canPerformAction('vendors', 'create')
                        "
                        @click="startWatching(item)"
                      >
                        <span>Start watching</span>
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>

        <Pagination :limit="5" :data="vendors" @pagination-change-page="getVendors" />
      </div>
    </div>

    <VModal
      is="div"
      :open="viewVendor"
      title="Company Information"
      size="medium"
      @close="viewVendor = null"
    >
      <template #content>
        <div class="profile-header has-text-centered p-5">
          <VAvatar size="xl" :picture="getPicture(viewVendor)" />

          <h3 class="title is-4 is-narrow mb-3 mt-3">
            {{ viewVendor.name }}
          </h3>
          <p class="light-text mb-1">
            {{ viewVendor.description ?? '-' }}
          </p>
          <div class="profile-stats">
            <div class="profile-stat">
              <i aria-hidden="true" class="lnil lnil-users-alt" />
              <span>{{ viewVendor.followed_count }} Watchers</span>
            </div>
            <div class="separator" />
            <div class="profile-stat">
              <i aria-hidden="true" class="lnil lnil-users-alt" />
              <span>{{ totalAssets }} Assets</span>
            </div>
            <div
              v-if="
                viewVendor.website ||
                viewVendor.facebook ||
                viewVendor.twitter ||
                viewVendor.linkedin
              "
              class="separator"
            />
            <div class="socials">
              <a v-if="viewVendor.website" :href="viewVendor.website" target="_blank">
                <i aria-hidden="true" class="fa fa-globe"></i>
              </a>
              <a v-if="viewVendor.facebook" :href="viewVendor.facebook" target="_blank">
                <i aria-hidden="true" class="fab fa-facebook-f"></i>
              </a>
              <a v-if="viewVendor.twitter" :href="viewVendor.twitter" target="_blank">
                <i aria-hidden="true" class="fab fa-twitter"></i>
              </a>
              <a v-if="viewVendor.linkedin" :href="viewVendor.linkedin" target="_blank">
                <i aria-hidden="true" class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <p v-if="domains" class="mb-4">
            {{ domains.join(', ') }}
          </p>
          <VLoader v-else :active="true" class="p-5" size="xs-small">
            <div style="height: 5px"></div>
          </VLoader>

          <div>
            <button
              class="button v-button is-primary"
              :disabled="
                viewVendor.fields ||
                submitting === viewVendor.id ||
                !canPerformAction('vendors', 'create')
              "
              @click="startWatching(viewVendor)"
            >
              <span>Start watching</span>
            </button>
          </div>
        </div>
      </template>
    </VModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { axios } from '/@src/axios'

import permissionsMixin from '../../mixins/permissionsMixin.js'
import VControl from '/@src/components/base/form/VControl.vue'
import NoData from '/@src/components/NoData.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import Form from '/@src/form'

export default {
  components: {
    VModal,
    VAvatar,
    Pagination,
    VLoader,
    NoData,
    VControl,
  },
  mixins: [permissionsMixin],
  data: () => ({
    showModal: false,
    form: new Form({}),
    submitting: false,
    loading: false,
    viewVendor: null,
    search: '',
    searchIndustry: '',
    searchPriority: '',
    searchContact: '',
    sort: '',

    editable: null,

    totalAssets: null,
    domains: null,

    tags: [],
    tagsLoaded: null,
    countries: [],
    columns: {
      Name: true,
      Industry: true,
      'Exposure score': true,
      Employees: true,
      Permissions: true,
      Address: true,
      Status: true,
      Priority: true,
      Scanned: true,
    },
  }),
  computed: {
    ...mapGetters(['vendors', 'isMobile', 'general', 'workspace']),
  },
  watch: {
    search: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchStatus: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchIndustry: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchPriority: _.debounce(function () {
      this.getVendors()
    }, 500),
    searchContact: _.debounce(function () {
      this.getVendors()
    }, 500),
    sort: _.debounce(function () {
      this.getVendors()
    }, 500),
  },
  async mounted() {
    this.loading = true
    this.$store.dispatch('addVendors', null)

    this.loadColumns()

    await Promise.all([this.getVendors()]).then(() => {
      this.loading = false
    })
  },
  methods: {
    getPicture(item) {
      if (item?.logo) {
        return 'https://rx-cdn.s3.eu-central-1.amazonaws.com/companies/' + item.logo
      }
      return ''
    },
    getDescription(item) {
      if (item.description && item.description.length > 80) {
        return item.description.substring(0, 80) + '...'
      }

      return item.description ?? '-'
    },
    openVendorModal(item) {
      this.totalAssets = null
      this.domains = null

      axios
        .get(`/asset`, {
          params: {
            collection_id: item.id,
            type: 'domain',
            status: 'active',
          },
        })
        .then((res) => {
          this.domains = res.data.data.map((item) => item.value)
        })

      axios
        .get(`/asset`, {
          params: {
            collection_id: item.id,
            status: 'active',
          },
        })
        .then((res) => {
          this.totalAssets = res.data.meta.total
        })

      this.viewVendor = item
    },
    async startWatching(item) {
      this.submitting = item.id
      this.form.status = 'active'
      this.form.permissions = ''
      this.form.priority = 'medium'
      this.form.business_impact = 'Moderate'
      this.form.workspace_id = this.workspace.id
      this.form.schedule = 'weeklyOn'
      this.form.vendor_id = item.id
      const form = this.form.post('/vendor')

      let error = null

      await form
        .then((res) => {
          const { data } = res.data

          this.$router.push({
            name: 'VendorView',
            params: { asset: data.id },
          })
        })
        .catch((e) => {
          this.submitting = null
          if (e.response.data.message) {
            error = e.response.data.message
          } else {
            error = 'An error occurred'
          }
        })

      if (error) {
        alert(error)
        this.$store.dispatch('addAlert', {
          message: error,
          type: 'danger',
        })
      }
    },
    changeSort(sort) {
      this.sort = sort
    },
    loadColumns() {
      const existing = localStorage.getItem('vendors-table')
      if (existing) {
        this.columns = JSON.parse(existing)
      }
    },
    getVendors(page = 1) {
      let url = `/vendor`

      let params = {
        workspace_id: this.$route.params.id,
        public: true,
        q: this.search,
        sort: this.sort,
        page: page,
      }

      return axios
        .get(url, {
          params: params,
        })
        .then((res) => {
          this.$store.dispatch('addVendors', res.data)
        })
        .catch(() => {})
    },
    goToVendor(item) {
      this.$router.push({
        name: 'VendorView',
        params: { asset: item.id },
      })
    },
    hideModal() {
      this.showModal = false
      this.editable = null
      this.getVendors()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/profile-stats';

.is-dark {
  .user-grid {
    .grid-item {
      @include vuero-card--dark;
    }
  }
}

.user-grid-v1 {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }

  .grid-item {
    @include vuero-s-card;

    text-align: center;

    > .v-avatar {
      display: block;
      margin: 0 auto 4px;
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.85rem;
    }

    .people {
      display: flex;
      justify-content: center;
      padding: 8px 0 30px;

      .v-avatar {
        margin: 0 4px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        width: calc(50% - 4px);

        &:hover,
        &:focus {
          box-shadow: var(--light-box-shadow);
        }
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .user-grid-v1 {
    .columns {
      display: flex;

      .column {
        min-width: 50% !important;
      }
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .user-grid-v1 {
    .columns {
      .column {
        min-width: 33.3% !important;
      }
    }
  }
}
</style>
