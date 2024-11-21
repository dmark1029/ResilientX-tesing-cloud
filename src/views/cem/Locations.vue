<template>
  <div v-if="loading" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="dashboard-map-wrapper">
      <div class="dashboard-map-wrapper-inner">
        <div class="map-section h-100">
          <MapWidget :workspace="project.workspace" :project="project" :module="module" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import MapWidget from '/@src/components/modules/cyber-ex/widgets/MapWidget.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: { MapWidget, VLoader },
  setup() {
    useMeta({
      title: `Locations`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    showModal: false,
    editable: null,
    links: [],
  }),
  computed: {
    ...mapGetters(['project', 'loading', 'module']),
  },
  beforeCreate() {
    this.$store.dispatch('showLoading')
  },
  async mounted() {
    await Promise.all([this.getData()])
      .then(() => {
        this.links = [
          {
            label: 'Home',
            to: {
              name: 'Home',
            },
          },
          {
            label: 'Workspaces',
            to: {
              name: 'Workspaces',
            },
          },
          {
            label: this.project.workspace.name,
            to: {
              name: 'WorkspacesView',
              params: { id: this.project.workspace.id },
            },
          },
          {
            label: this.project.name,
            to: {
              name: 'ProjectOverview',
              params: { id: this.project.id },
            },
          },
          {
            label: 'Locations',
            to: {},
          },
        ]
      })
      .finally(() => {
        this.$store.dispatch('hideLoading')
      })
  },
  methods: {
    async getData() {
      await this.$store.dispatch('addProject', this.$route.params.id)
    },
  },
}
</script>

<style lang="scss" >
.dashboard-map-wrapper {
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: calc(100vh - 80px);
  overflow: hidden;

  .dashboard-map-wrapper-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;

    &.is-reversed {
      flex-direction: row-reverse;
    }

    .map-section {
      position: relative;
      width: 100%;
      .card {
        border: 0px;
      }

      .card-body {
        padding: 0px;
      }
      h4 {
        display: none;
      }
      .gmaps {
        height: calc(100vh - 80px);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .has-top-nav {
    .dashboard-map-wrapper {
      top: 0;
      height: 100%;
    }
  }

  .dashboard-map-wrapper {
    overflow-x: hidden;

    .dashboard-map-wrapper-inner {
      flex-direction: column;

      &.is-reversed {
        flex-direction: column;
      }

      .map-section {
        min-height: 30vh;
        width: 100%;
      }

      .content-section {
        height: 70vh;
      }
    }
  }

  .geocoder {
    padding: 0 2rem;
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .has-top-nav {
    .dashboard-map-wrapper {
      top: 0;
      height: 100%;
    }
  }

  .dashboard-map-wrapper {
    overflow-x: hidden;

    .dashboard-map-wrapper-inner {
      flex-direction: column;

      &.is-reversed {
        flex-direction: column;
      }

      .map-section {
        min-height: 30vh;
        width: 100%;
      }

      .content-section {
        height: calc(70vh - 60px);
        width: 100%;
      }
    }
  }

  .geocoder {
    padding: 0 2rem;
  }
}
</style>
