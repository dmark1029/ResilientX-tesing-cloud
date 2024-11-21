<template>
  <div class="personal-dashboard personal-dashboard-v2">
    <!--Personal Dashboard V2-->
    <div v-if="user" class="columns is-multiline">
      <div class="column is-12">
        <div class="dashboard-header">
          <VAvatar :picture="user.avatar" size="xl" />
          <div class="user-meta is-dark-bordered-12">
            <h3 class="title is-4 is-narrow is-bold">Welcome back, {{ user.name }}</h3>
            <p class="light-text">It's really nice to see you again</p>
          </div>
          <div class="user-action">
            <h3 class="title is-2 is-narrow">
              {{ user.workspaces_count }}
            </h3>
            <p class="light-text">Your workspace count</p>
            <router-link
              v-if="product === UEM_PRODUCT"
              :to="{ name: 'Workspaces' }"
              class="action-link"
              tabindex="0"
            >
              View Workspaces
            </router-link>
            <router-link
              v-if="product === VRM_PRODUCT"
              :to="{ name: 'VRMWorkspaces' }"
              class="action-link"
              tabindex="0"
            >
              View Workspaces
            </router-link>
          </div>
          <div class="cta h-hidden-tablet-p">
            <div class="media-flex inverted-text">
              <i aria-hidden="true" class="fa fa-question-circle" />
              <p class="white-text">
                If you have any inquires or need any assistance feel free to reach out.
              </p>
            </div>
            <router-link :to="{ name: 'Support' }" class="link inverted-text">
              Contact us
            </router-link>
          </div>
        </div>
      </div>

      <div v-if="manageableVendors.length" class="column is-12">
        <h3 class="title is-5 dark-inverted">{{ $t('Companies') }}</h3>

        <VendorsManageComponent :add="true" :limit="2" />

        <hr class="mb-0" />
      </div>

      <div class="column is-8">
        <div
          v-if="latestProjects?.length && product === UEM_PRODUCT"
          class="dashboard-card has-margin-bottom"
        >
          <div class="card-head">
            <h3 class="dark-inverted">Latest Activity</h3>
            <router-link
              class="button v-button is-primary"
              :to="{ name: 'WorkspacesView', params: { id: workspace.id } }"
            >
              All Projects
            </router-link>
          </div>
          <div class="active-projects">
            <VBlock
              v-for="project in latestProjects"
              :key="project.id"
              :title="project.name"
              :subtitle="project.workspace.name"
              center
            >
              <template #icon>
                <VAvatar :picture="project.logo" size="medium" squared />
              </template>
              <template #action>
                <router-link
                  :class="
                    canViewProject(project)
                      ? 'button v-button'
                      : 'button v-button is-disabled'
                  "
                  :to="{
                    name: 'ProjectOverview',
                    params: { id: project?.id },
                  }"
                >
                  View project
                </router-link>
              </template>
            </VBlock>
          </div>
        </div>

        <div v-if="product === VRM_PRODUCT" class="dashboard-card has-margin-bottom">
          <div class="card-head">
            <h3 class="dark-inverted">Latest Activity</h3>
            <router-link
              class="button v-button is-primary"
              :to="{ name: 'VRMWorkspaces' }"
            >
              All workspaces
            </router-link>
          </div>
          <div class="active-projects">
            <VBlock
              v-for="workspace in latestWorkspaces"
              :key="workspace.id"
              :title="workspace.name"
              :subtitle="workspace.name"
              center
            >
              <template #icon>
                <VAvatar :picture="workspace.logo" size="medium" squared />
              </template>
              <template #action>
                <router-link
                  class="button v-button"
                  :to="{
                    name: 'VendorOverview',
                    params: { id: workspace.id },
                  }"
                >
                  View workspace
                </router-link>
              </template>
            </VBlock>
          </div>
        </div>

        <div v-if="!project" class="dashboard-card">
          <div class="section-placeholder">
            <div class="placeholder-content">
              <h3 class="dark-inverted">Let's get started</h3>
              <p>Unlock more features by creating your first workspace</p>
              <router-link
                :to="{ name: 'Workspaces' }"
                class="button v-button is-elevated is-primary"
              >
                Create workspace
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-4">
        <div class="dashboard-card is-upgrade is-clickable" @click="launchWizard">
          <i aria-hidden="true" class="fa fa-globe" />
          <div class="cta-content">
            <h4>Gain access to the most recent insights regarding your assets.</h4>
            <p class="white-text">Start monitoring assets with our solution</p>
            <a class="link inverted-text">Create project</a>
          </div>
        </div>

        <div v-if="project" class="dashboard-card">
          <div v-if="user.invites.length">
            <div class="card-head">
              <h3 class="dark-inverted">Pending invites</h3>
            </div>
            <InvitesComponent />
          </div>
          <VPlaceholderSection
            v-else
            title="Invite your colleague"
            subtitle="Unlock more features together"
          >
            <template #action>
              <router-link
                class="v-button button is-primary"
                :to="{
                  name: 'WorkspaceUsersView',
                  params: { id: project.workspace.id },
                }"
              >
                Invite now
              </router-link>
            </template>
          </VPlaceholderSection>
        </div>

        <div class="text-muted has-text-centered">
          <a
            href="https://resilientx.com/terms-and-conditions"
            target="_blank"
            class="text-muted mr-2"
            >Terms & conditions</a
          >
          <a
            href="https://resilientx.com/privacy-policy"
            target="_blank"
            class="text-muted mr-2"
            >Privacy policy</a
          >
          <router-link :to="{ name: 'Support' }" target="_blank" class="text-muted"
            >Contact us</router-link
          >
        </div>
      </div>

      <div class="column is-12">
        <footer class="has-text-light has-text-centered-mobile">
          &copy; {{ year }} {{ general.settings?.copyright }}
          <span class="is-size-6">v{{ version }}-{{ env }}</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InvitesComponent from '/@src/components/invites/InvitesComponent.vue'
import { useMeta } from 'vue-meta'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VBlock from '/@src/components/base/block/VBlock.vue'
import VPlaceholderSection from '/@src/components/base/placeholder/VPlaceholderSection.vue'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VendorsManageComponent from '/@src/components/vendors-manage/VendorsManageComponent.vue'
import { UEM_PRODUCT, VRM_PRODUCT } from '/@src/models/constants'

export default {
  name: 'HomeView',
  components: {
    VendorsManageComponent,
    VPlaceholderSection,
    VBlock,
    VAvatar,
    InvitesComponent,
  },
  mixins: [permissionsMixin],
  setup() {
    useMeta({
      title: `Home`,
    })
  },
  data: () => ({
    version: __APP_VERSION__,
    env: import.meta.env.VITE_ENV,
    year: new Date().getFullYear(),
    links: [],
    UEM_PRODUCT,
    VRM_PRODUCT,
  }),
  computed: {
    ...mapGetters([
      'user',
      'general',
      'project',
      'workspace',
      'latestProjects',
      'latestWorkspaces',
      'manageableVendors',
      'product',
    ]),
  },
  mounted() {
    if (this.product === VRM_PRODUCT) {
      this.$store.commit('setProject', null)
    }
  },
  methods: {
    launchWizard() {
      this.$router.push({ name: 'OnboardingProject' })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v2 {
  max-width: 1200px;
  margin: 0 auto;
  .quick-stats {
    .quick-stats-inner {
      display: flex;
      flex-wrap: wrap;
      margin-inline-start: -8px;
      margin-inline-end: -8px;

      .v-icon .fa {
        color: var(--white);
      }

      .quick-stat {
        width: calc(50% - 16px);
        padding: 40px 20px;
        background: var(--widget-grey);
        margin: 8px;
        border-radius: var(--radius-large);
        transition: all 0.3s; // transition-all test

        ::v-deep(.media-flex-center) {
          .flex-meta {
            span {
              &:first-child {
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--dark-text);
              }
            }
          }
        }
      }
    }
  }

  .dashboard-header {
    @include vuero-s-card;

    display: flex;
    align-items: center;
    padding: 30px;

    .user-meta {
      padding: 0 3rem;
      border-inline-end: 1px solid var(--fade-grey-dark-3);

      h3 {
        max-width: 180px;
      }
    }

    .user-action {
      padding: 0 3rem;
    }

    .cta {
      position: relative;
      flex-grow: 2;
      max-width: 275px;
      margin-inline-start: auto;
      background: var(--primary-light-8);
      padding: 20px;
      border-radius: var(--radius-large);
      box-shadow: var(--primary-box-shadow);

      .fa,
      .lnir {
        position: absolute;
        bottom: 1rem;
        inset-inline-end: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .link {
        font-family: var(--font-alt);
        display: block;
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover,
        &:focus {
          color: var(--smoke-white);
          opacity: 0.6;
        }
      }
    }
  }

  .dashboard-card {
    @include vuero-s-card;

    padding: 30px;

    &.is-upgrade {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--primary-light-8);
      border-color: var(--primary-light-8);
      padding: 20px 40px;
      min-height: 320px;
      border-radius: var(--radius-large);
      box-shadow: var(--primary-box-shadow);

      .fa,
      .lnir {
        position: absolute;
        bottom: 1rem;
        inset-inline-end: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .cta-content {
        text-align: center;

        h4 {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 1.2rem;
          color: var(--smoke-white);
          margin-bottom: 8px;
        }
      }

      .link {
        display: block;
        font-family: var(--font-alt);
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover,
        &:focus {
          color: var(--smoke-white);
          opacity: 0.6;
        }
      }
    }

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0;
      }
    }

    .active-projects,
    .active-team,
    .active-list {
      padding: 10px 0;
    }
  }
}

.is-dark {
  .personal-dashboard-v2 {
    .dashboard-header,
    .dashboard-card {
      @include vuero-card--dark;

      &.is-upgrade {
        background: var(--primary);
        border-color: var(--primary);
        box-shadow: var(--primary-box-shadow);
      }
    }

    .quick-stats {
      .quick-stats-inner {
        .quick-stat {
          background: var(--dark-sidebar-light-2);
          border: 1px solid var(--dark-sidebar-light-12);

          .media-flex-center {
            .flex-meta {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }
          }
        }
      }
    }

    .home-header {
      .cta {
        background: var(--primary-light-2);
        box-shadow: var(--primary-box-shadow);
      }
    }
  }
}

@media only screen and (width <= 767px) {
  .personal-dashboard-v2 {
    .dashboard-header {
      flex-direction: column;
      text-align: center;

      .v-avatar {
        margin-bottom: 10px;
      }

      .user-meta {
        padding-top: 10px;
        padding-bottom: 10px;
        border: none;
      }

      .user-action {
        padding-bottom: 30px;
      }

      .cta {
        margin-inline-start: 0;
      }
    }

    .active-projects {
      .media-flex-center {
        .flex-end {
          .avatar-stack {
            display: none;
          }
        }
      }
    }
  }
}
</style>
