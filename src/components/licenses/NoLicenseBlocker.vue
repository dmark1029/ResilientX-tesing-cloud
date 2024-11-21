<template>
  <div class="is-active is-big modal v-modal no-license">
    <div class="modal-background v-modal-close" tabindex="-1" role="button" />
    <div class="modal-content">
      <div class="modal-card">
        <header class="modal-card-head">
          <button
            ref="closeButton"
            class="v-modal-close ml-auto"
            aria-label="close"
            tabindex="0"
            @keydown.space.prevent="$router.go(-1)"
            @click="$router.go(-1)"
          >
            <i aria-hidden="true" class="fa fa-times" />
          </button>
        </header>
        <div class="modal-card-body">
          <div class="confirm-account-wrapper">
            <div class="wrapper-inner">
              <div class="action-box">
                <div class="box-content">
                  <h3 class="dark-inverted">No active licenses found</h3>
                  <p>
                    It appears that access to a {{ module.name }} app is currently
                    unlicensed. To benefit from the features of this app and enhance your
                    experience, we recommend getting in touch with our dedicated sales
                    team.
                  </p>
                  <div class="buttons">
                    <router-link
                      :to="{ name: 'Sales' }"
                      class="button v-button is-bold is-big is-raised is-primary mb-4"
                    >
                      Contact sales
                    </router-link>
                  </div>
                  <a class="mt-0 mb-5 d-inline-block is-clickable" @click="$router.go(-1)"
                    >Go back</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['workspace', 'module'],
}
</script>

<style lang="scss" scoped>
.no-license {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  &.is-active {
    z-index: 99 !important;
  }
}
@import '/@src/scss/abstracts/all';

/* ==========================================================================
1. Confirm Account
========================================================================== */
.confirm-account-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;

  .wrapper-inner {
    .action-box {
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