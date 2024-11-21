<template>
  <div
    id="project-quick-dropdown"
    class="is-flex is-align-items-center is-justify-content-center"
  >
    <v-menu v-if="product" ref="dropdown" transition="slide-y-transition" class="ml-0">
      <template #activator="{ props }">
        <v-btn v-bind="props">
          <img
            :src="toggleImages(product)"
            class="hero-image mr-2"
            alt="logo"
            @click="toggleDropdown()"
          />
          <span @click="toggleDropdown()">{{
            product === UEM_PRODUCT ? 'UEM' : 'TPRM'
          }}</span>
          <img
            src="/images/icons/datatable/arrow-down.png"
            class="dropdown ml-3"
            alt=""
            @click="toggleDropdown()"
          />
        </v-btn>
      </template>
      <v-list class="menu-item mt-1">
        <v-list-item>
          <v-list-item-title>
            <a
              :class="[
                hasLicenseUEM()
                  ? 'dropdown-item dropdown-block'
                  : 'dropdown-item dropdown-block is-disabled',
              ]"
              class="is-flex is-align-items-center is-justify-content-center"
              role="button"
              tabindex="0"
              @click="
                () => {
                  selectProduct(UEM_PRODUCT)
                }
              "
            >
              <div>
                <img src="/images/logos/logo/logo-red.svg" alt="logo" />
              </div>
              <div class="meta">
                <span class="dark-inverted is-block">UEM</span>
                <span class="is-hidden-mobile">Unified Exposure Management</span>
              </div>
            </a>
          </v-list-item-title>
          <v-list-item-title>
            <a
              :class="[
                hasLicenseVRM()
                  ? 'dropdown-item dropdown-block'
                  : 'dropdown-item dropdown-block is-disabled',
              ]"
              class="is-flex is-align-items-center is-justify-content-center"
              role="button"
              tabindex="0"
              @click="
                () => {
                  selectProduct(VRM_PRODUCT)
                }
              "
            >
              <div>
                <img src="/images/logos/logo/logo-fink.svg" height="24" alt="logo" />
              </div>
              <div class="meta">
                <span class="dark-inverted is-block">TPRM</span>
                <span class="is-hidden-mobile">Third-Party Risk Management</span>
              </div>
            </a>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { UEM_PRODUCT, VRM_PRODUCT } from '/@src/models/constants'
export default {
  data() {
    return {
      loading: false,
      open: false,
      id: '',
      projects: [],
      UEM_PRODUCT,
      VRM_PRODUCT,
    }
  },
  computed: {
    ...mapGetters(['product', 'general', 'workspace', 'latestProjects']),
  },
  methods: {
    async toggleDropdown() {
      this.open = !this.open
    },
    hasLicenseVRM() {
      let has = false

      if (!this.workspace?.activeLicense) {
        return false
      }

      this.workspace.activeLicense.modules.forEach((license) => {
        if (license.slug === VRM_PRODUCT) {
          has = true
        }
      })
      return has
    },
    hasLicenseUEM() {
      let has = false

      if (!this.workspace?.activeLicense) {
        return false
      }
      const modules = this.workspace.activeLicense.modules
      this.workspace.activeLicense.modules.forEach((license) => {
        const check_vrm = modules.find((item) => item.slug !== VRM_PRODUCT)
        if (license.slug === UEM_PRODUCT || check_vrm) {
          has = true
        }
      })
      return has
    },
    selectProduct(product) {
      this.$store.commit('setProduct', product)
      if (product === VRM_PRODUCT) {
        this.$store.commit('setProject', null)
      } else {
        const projects = Array.isArray(this.latestProjects)
          ? this.latestProjects.filter((p) => p.id !== this.workspace.id)
          : []

        if (projects.length === 0) {
          this.$store.commit('setProject', null)
        } else {
          this.$store.dispatch('addProject', projects[0].id)
        }
      }

      this.$router.push({
        name: 'Home',
      })
    },
    toggleImages(product) {
      const VRM_PRODUCT = 'vrm'
      if (product === VRM_PRODUCT) {
        return '/images/logos/logo/logo-fink.svg'
      } else {
        return '/images/logos/logo/logo-red.svg'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-item {
  background: var(--sidebar-color) !important;
}

.dropdown-item {
  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: var(--dark-hover-color);
  }

  .meta {
    margin-left: 12px;

    span {
      &:first-child {
        font-family: Poppins;
        font-size: 14px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.43;
        letter-spacing: 0.5px;
        text-align: left;
        color: #e1e1ef;
      }

      &:last-child {
        height: 15px;
        align-self: stretch;
        flex-grow: 0;
        font-family: Poppins;
        font-size: 12px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.2;
        letter-spacing: 0.25px;
        text-align: left;
        color: #c3c5d9;
      }
    }
  }
}

@media only screen and (device-width >=768px) and (device-width <=1024px) and (orientation: portrait) {
  #project-quick-dropdown-title {
    display: none;
  }

  .v-icon {
    max-width: 32px;
    min-width: 32px;
    max-height: 32px;
  }

  .dropdown-content .dropdown-block {
    display: flex;
    align-items: center;
    padding: 16px;
  }

  .meta {
    margin-left: 10px;
  }
}

@media only screen and (width <=767px) {
  #project-quick-dropdown-title {
    display: none;
  }

  .v-icon {
    max-width: 32px;
    min-width: 32px;
    max-height: 32px;
  }

  .dropdown-content .dropdown-block {
    display: flex;
    align-items: center;
    padding: 16px;
  }

  .meta {
    margin-left: 10px;
  }
}
</style>