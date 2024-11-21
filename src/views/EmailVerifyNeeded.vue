<template>
  <div
    role="dialog"
    aria-modal="true"
    class="modal v-modal is-relative modal-body"
    style="display: block !important; height: 100vh"
  >
    <div
      tabindex="-1"
      role="button"
      class="modal-bg"
      style="
        background: url('/images/logos/logo/email_verification.jpg') center / cover;
        height: 100vh;
      "
    />
    <div class="modal-content">
      <div class="modal-card">
        <header
          v-if="!isNarrowScreen"
          class="modal-box-head is-flex is-justify-content-space-between is-align-items-center"
        >
          <div class="is-flex is-justify-content-center is-align-items-center">
            <img src="/images/logos/logo/arrow-left.svg" alt="brand" />
            <h3>Email verification</h3>
          </div>
          <img class="close-button" src="/images/logos/logo/close.svg" alt="brand" />
        </header>
        <div v-else class="modal-head">
          <div class="is-flex is-justify-content-center is-align-items-center">
            <img src="/images/logos/logo/arrow-left.svg" alt="brand" />
            <p class="ml-2">Email verification</p>
          </div>
          <img src="/images/logos/logo/close.svg" class="close-symbol" />
        </div>
        <div :class="bodyClass">
          <div
            class="has-text-centered body is-flex is-justify-content-center is-align-items-center"
          >
            <div class="main-body">
              <img src="/images/icons/logos/Envelope.svg" alt="brand" />
              <h5 class="title is-4">Email verification needed</h5>
              <p class="verify-statement">
                Please verify your email to unlock full access and receive your first
                report.
              </p>
            </div>
          </div>

          <div class="buttons">
            <router-link
              :to="{ name: 'Profile' }"
              type="button"
              aria-hidden="false"
              class="button v-button is-rounded is-raised is-primary edit-btn"
            >
              <span> Edit your Email </span>
            </router-link>
            <button
              type="button"
              aria-hidden="false"
              class="button v-button is-rounded is-raised is-primary resend-email"
              :disabled="disableResend"
              @click="resend"
            >
              <span> Resend Email </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useMeta } from 'vue-meta'
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'

export default {
  name: 'EmailUnverified',
  setup() {
    useMeta({
      title: 'Email unverified',
      bodyAttrs: {},
    })
  },
  data() {
    return {
      disableResend: false,
      windowWidth: window.innerWidth,
    }
  },
  computed: {
    ...mapGetters(['user']),
    bodyClass() {
      return this.windowWidth < 768 ? 'mobile-body' : 'modal-box-body'
    },
    isNarrowScreen() {
      return this.windowWidth < 768
    },
  },
  mounted() {
    // if (this.user.email_verified_at) {
    //   this.$router.push({
    //     name: 'Home',
    //   })
    // }
  },
  created() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    logout() {
      axios
        .post('/logout')
        .then(() => {
          this.$store.dispatch('removeAccessToken')
          window.location.reload()
        })
        .catch(() => {})
    },
    handleBack() {
      this.$router.push({ name: 'Login' })
    },
    handleResize() {
      this.windowWidth = window.innerWidth
    },
    resend() {
      axios.post('/resend').then(() => {
        this.disableResend = true
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.modal-content {
  width: 100%;
  max-width: 54vw;
  position: absolute;
  top: 12%;
  left: 23%;
  transform: translate(-50%, -50%);

  .modal-card {
    width: 100vw;
    overflow: auto;
    max-height: 80vh;

    .modal-box-head {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border-bottom: none !important;
      padding: 40px 60px 0 !important;
      background: #11131c !important;

      h3 {
        font-family: Poppins;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #e2e1ee !important;
      }
      .close-button {
        cursor: pointer;
      }
    }
    .modal-box-body {
      padding: 48px 60px 110px;
      background: #11131c !important;
    }
  }
}
.body {
  .main-body {
    width: 520px;
    margin-bottom: 48px;

    .title {
      margin-top: 70px;
      align-self: stretch;
      flex-grow: 0;
      font-family: Poppins;
      font-size: 32px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      text-align: center;
      color: #e2e1ee !important;
    }

    .verify-statement {
      align-self: stretch;
      flex-grow: 0;
      font-family: Poppins;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      text-align: center;
      color: #c4c5d8;
    }
  }
}
.buttons {
  width: 520px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 18px;

  .button {
    height: 40px;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 7px 16px;
    border-radius: 60px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: left;
  }
  .edit-btn {
    border: solid 1px #fbf8ff;
    background-color: transparent;
  }
  .resend-email {
    border: solid 1px #003fcd;
    background-color: #003fcd;
  }
}
@media only screen and (width <= 767px) {
  .modal-content {
    max-width: 100vw !important;
    max-height: 100vh !important;
    left: 0% !important;
    top: 0%;
    padding: 0px;
    .modal-box-head {
      display: none !important;
    }
    .modal-box-body {
      display: none;
    }
    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;

      img {
        width: 36px;
        height: 36px;
        color: #fff;
        object-fit: contain;
      }
      p {
        flex-grow: 0;
        font-family: Poppins;
        font-size: 16px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #e2e1ee;
      }
    }
    .modal-card {
      padding: 56px 16px 0;
      height: 100vh;
      max-height: 100vh;

      .mobile-body {
        .main-body {
          margin-bottom: 32px;
          padding: 0 24px;
          img {
            width: 120px;
            height: 122px;
            margin-top: 64px;
          }
          .title {
            margin-top: 24px;
            margin-bottom: 8px;
            align-self: stretch;
            flex-grow: 0;
            font-family: Poppins;
            font-size: 16px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: center;
            color: #e2e1ee;
          }
          .verify-statement {
            flex-grow: 0;
            font-family: Poppins;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: center;
            color: #c4c5d8;
          }
        }
        .buttons {
          width: 100%;
          gap: 8px;
        }
      }
    }
    .modal-body {
      margin-top: 64px;
    }
  }
  .modal-body {
    height: 100vh;
    .modal-bg {
      background: #000b3a !important;
      height: 100vh;
    }
  }
}
@media only screen and (width > 767px) and (max-width: 1024px) {
  .modal-content {
    width: 100%;
    max-width: 76vw;
    max-height: 80vh;
    position: absolute;
    top: 10%;
    left: 12%;
    transform: translate(-50%, -50%);

    .modal-card {
      width: 100vw;
      height: 80vh;

      .modal-box-head {
        padding: 20px 20px 0 !important;
      }
      .modal-box-body {
        padding: 10px 20px 20px;
        flex-grow: 0;
        height: 100%;
      }
    }
  }
  .body {
    .main-body {
      margin-bottom: 15px;
      img {
        height: 120px;
        width: 120px;
      }
      .title {
        font-size: 24px;
        margin-top: 15px;
        margin-bottom: 10px !important;
      }
      .verify-statement {
        font-size: 17px;
      }
    }
  }
}
@media only screen and (min-width: 1025px) and (width <= 1215px) {
  .modal-content {
    width: 100%;
    max-width: 70vw;
    position: absolute;
    top: 13%;
    left: 15%;
    transform: translate(-50%, -50%);

    .modal-card {
      width: 100vw;
      overflow: auto;
      .modal-box-head {
        padding: 30px 40px 0 !important;
      }

      .modal-box-body {
        padding: 15px 60px 55px;
        flex-grow: 0;
      }
    }
  }
  .body {
    .main-body {
      margin-bottom: 32px;
      img {
        height: 145px;
        width: 140px;
      }
      .title {
        font-size: 27px;
        margin-top: 30px;
      }
    }
  }
}
@media only screen and (width > 1215px) and (width <= 1440px) {
  .modal-content {
    width: 100%;
    max-width: 64vw;
    position: absolute;
    top: 12%;
    left: 18%;
    transform: translate(-50%, -50%);

    .modal-card {
      width: 100vw;
      overflow: auto;
      .modal-box-body {
        padding: 48px 60px 78px;
        flex-grow: 0;
      }
    }
  }
  .body {
    .main-body {
      margin-bottom: 32px;
      img {
        height: 150px;
        width: 145px;
      }
      .title {
        font-size: 27px;
        margin-top: 50px;
      }
    }
  }
}
@media only screen and (width > 1440px) and (width <= 1920px) {
  .body {
    .main-body {
      img {
        height: 175px;
        width: 170px;
      }
    }
  }
}
</style>
