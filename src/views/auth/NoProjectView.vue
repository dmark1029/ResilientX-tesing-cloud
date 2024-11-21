<template>
  <div class="confirm-account-wrapper">
    <div class="wrapper-inner">
      <div class="action-box">
        <div>
          <div class="box-content">
            <div class="title-wrap mb-5">
              <p>Looks like you're new here</p>
              <h2 class="dark-inverted">
                Either you don't have an active project or you have pending invite.
              </h2>
            </div>

            <InvitesComponent v-if="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '/@src/form'
import { useMeta } from 'vue-meta'
import { mapGetters } from 'vuex'
import InvitesComponent from '/@src/components/invites/InvitesComponent.vue'

export default {
  name: 'NoProjectView',
  components: { InvitesComponent },
  setup() {
    useMeta({
      title: 'No project',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['theme', 'general', 'user', 'project', 'workspace']),
  },
  mounted() {
    if (this.user && this.project) {
      this.$router.push({ name: 'Home' })
    }
    if (this.user && this.workspace) {
      this.$router.push({ name: 'Home' })
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

/* ==========================================================================
1. Confirm Account
========================================================================== */
.confirm-account-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 540px;
  min-height: 560px;
  margin: 0 auto;

  .wrapper-inner {
    .loading-wrapper {
      height: 50px;
      margin-top: 50px;
    }
    .action-box {
      @include vuero-s-card;

      padding: 40px;

      .box-content {
        text-align: center;
        font-family: var(--font);

        img {
          display: block;
          width: 100%;
          max-width: 220px;
          margin: 0 auto 8px;

          &.is-larger {
            max-width: 300px;
          }
        }

        h3 {
          font-size: 1.1rem;
          font-family: var(--font-alt);
          font-weight: 600;
          max-width: 320px;
          margin: 0 auto 8px;

          span {
            color: var(--primary);
          }
        }

        p {
          font-size: 0.9rem;
        }

        .buttons {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          padding-top: 30px;

          .button {
            margin: 0 4px;
            min-width: 180px;
          }
        }
      }
    }
  }
}

.is-dark {
  .confirm-account-wrapper {
    .wrapper-inner {
      .action-box {
        @include vuero-card--dark;
      }
    }

    .wrapper-outer {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width <= 767px) {
  .confirm-account-wrapper {
    .wrapper-inner {
      .action-box {
        padding: 20px;

        .box-content {
          .buttons {
            .button {
              min-width: 130px;
            }
          }
        }
      }
    }
  }
}
</style>