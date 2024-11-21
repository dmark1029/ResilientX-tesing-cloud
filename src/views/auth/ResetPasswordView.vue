<template>
  <div class="modern-login">
    <div class="underlay h-hidden-mobile h-hidden-tablet-p" />
    <div class="columns is-gapless is-vcentered login-panel">
      <div class="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p hidden-1024">
        <div class="hero is-fullheight is-image">
          <div class="hero-body is-flex is-align-items-center">
            <div>
              <div
                class="brand-section is-flex is-justify-content-flex-start is-align-items-flex-start"
              >
                <img src="/images/logos/logo/logo-1.svg" alt="brand" />
              </div>
              <div class="main-section">
                <img
                  id="img1"
                  src="/images/logos/logo/Sign-in-1.png"
                  alt="sign1"
                  :class="currentSlide === 0 ? 'active' : 'in-active'"
                />
                <img
                  id="img2"
                  src="/images/logos/logo/Sign-in-2.png"
                  alt="sign2"
                  :class="currentSlide === 1 ? 'active' : 'in-active'"
                />
                <img
                  id="img3"
                  src="/images/logos/logo/Sign-in-3.png"
                  alt="sign3"
                  :class="currentSlide === 2 ? 'active' : 'in-active'"
                />
              </div>
              <div
                class="slide-button is-flex is-justify-content-center is-align-items-center"
              >
                <div
                  class="move-button"
                  data-img-id="img1"
                  :class="currentSlide === 0 ? 'active' : 'in-active'"
                  @click="changeSlide(0)"
                ></div>
                <div
                  class="move-button"
                  :class="currentSlide === 1 ? 'active' : 'in-active'"
                  data-img-id="img2"
                  @click="changeSlide(1)"
                ></div>
                <div
                  class="move-button"
                  :class="currentSlide === 2 ? 'active' : 'in-active'"
                  data-img-id="img3"
                  @click="changeSlide(2)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="column is-12-tablet is-4-desktop is-4-fullhd is-4-widescreen is-relative right-side"
      >
        <div class="is-form">
          <div class="is-form-inner">
            <div class="form-text">
              <RouterLink
                to="/"
                class="top-logo is-flex is-justify-content-center is-align-items-center"
              >
                <img :src="logoSrc" height="120" alt="logo" />
              </RouterLink>
              <p class="account-text">Forgot password</p>
              <p class="forgot-password-statement">
                No worries! Just enter your email below, and we'll help you reset it in no
                time
              </p>
            </div>
            <form
              class="login-wrapper"
              @submit.prevent="getResetLink"
              @keydown="form.onKeydown($event)"
            >
              <div class="field">
                <label class="label" for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="text"
                  class="input v-input"
                  name="email"
                  placeholder="Enter email"
                />
                <HasError :form="form" field="email" />
              </div>
              <!--end field-->
              <div
                class="button-wrap has-help is-flex is-justify-content-center is-align-items-center"
              >
                <FormButton
                  :form="form"
                  class="button is-rounded v-button is-bold is-big is-raised is-primary is-flex is-justify-content-center is-align-items-center"
                  style="font-family: Poppins"
                  type="submit"
                  :disabled="disableSubmit"
                >
                  <label class="reset-password">Reset password</label>
                </FormButton>
              </div>

              <div class="forgot-link has-has-text-centereded">
                <div class="footer-section">
                  <span class="footer-text">
                    or
                    <span class="text-style-1">&nbsp;</span>
                    <span>
                      <RouterLink :to="{ name: 'Login' }" class="sign-in"
                        >Sign in&nbsp;</RouterLink
                      >
                    </span>
                    <span class="text-style-3">to your account</span>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '/@src/form'
import { useMeta } from 'vue-meta'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'

export default {
  name: 'ResetPasswordView',
  components: {
    FormButton,
    HasError,
  },
  setup() {
    useMeta({
      title: 'Reset password',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({}),
    isToggled: true,
    currentSlide: 0,
    disableSubmit: false,
    intervalId: null,
    windowWidth: window.innerWidth,
  }),
  computed: {
    ...mapGetters(['theme', 'general', 'redirectUrl']),
    logoSrc() {
      return this.windowWidth > 960
        ? '/images/logos/logo/logo-2.svg'
        : '/images/logos/logo/logo-2-mobile.svg'
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.changeSlide((this.currentSlide + 1) % 3)
    }, 5000)
  },
  beforeMount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.$store.dispatch('addBodyClass', 'authorization')
  },
  beforeUnmount() {
    this.$store.dispatch('addBodyClass', '')
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
    },
    login() {
      this.signin()
        .then(() => {
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl
          } else {
            this.$router.push({ name: 'Home' })
          }
        })
        .catch(() => {})
    },
    signin() {
      return new Promise((resolve, reject) => {
        this.form
          .post('/login')
          .then(async (res) => {
            const { data } = res.data
            await this.$store.dispatch('addAccessToken', data.access_token)
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    changeSlide(index) {
      if (index !== this.currentSlide) {
        this.currentSlide = index
      }
    },
    async getResetLink() {
      await this.form
        .post('/forgot')
        .then(() => {
          this.$store.dispatch('addAlert', {
            text: 'Please check you email.',
            type: 'success',
          })
          this.form.email = null
          this.disableSubmit = true
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.small {
  font: italic 13px sans-serif;
}
.social-button-bg {
  transition: all 0.3s;
}
.social-button-bg:hover {
  fill: #cccccc;
  box-shadow: var(--primary-box-shadow) !important;
}
.social-button:hover .social-button-bg {
  fill: #cccccc;
  box-shadow: var(--primary-box-shadow) !important;
}
.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

  .login-panel {
    background-color: #11131c;
    color: #e2e1ee;

    .right-side {
      margin-bottom: 200px;
    }
  }
  .column {
    &.is-relative {
      position: relative;
    }
  }

  .hero {
    &.has-background-image {
      position: relative;

      .hero-overlay {
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        background: #5d4298 !important;
        opacity: 0.6;
      }
    }

    .hero-body {
      background: url('/images/logos/logo/Blue_container.jpg') center / cover;
      min-height: 100vh;
      justify-content: center;

      .brand-section {
        align-self: stretch;
        flex-direction: column;
        padding: 0;
      }
      .main-section {
        position: relative;
        overflow: hidden;
        width: 880px;
        height: 660px;
        margin-top: 48px;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1s ease-in-out;

          &.active {
            left: 0;
            opacity: 1;
            z-index: 1;
          }
          &.in-active {
            left: 0;
            opacity: 0;
            transition: opacity 1s ease-in-out;
          }
        }
      }
      .slide-button {
        flex-direction: row;
        height: 16px;
        margin-top: 25px;

        .move-button {
          height: 16px;
          margin: 0 4px;
          border-radius: 10px;
          transition: width 0.5s ease-in-out;
        }
        .active {
          width: 48px;
          background-color: #3d5af1;
          border: 1px solid #3d5af1;
        }
        .in-active {
          width: 16px;
          background-color: #ededed;
          border: 1px solid #ededed;
        }
      }
    }
  }

  .underlay {
    display: block;
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 66.6%;
    height: 100%;
    background: #fdfdfd;
    z-index: 0;
  }

  .is-image {
    position: relative;

    .hero-image {
      position: relative;
      z-index: 2;
      display: block;
      margin: -80px auto 0;
      max-width: 60%;
      width: 60%;
    }
  }

  .google-login {
    position: absolute;
    top: 0;
    right: 5px;
    img {
      height: 45px;
    }
  }

  .forgot-link {
    margin-top: 10px;

    a {
      font-family: var(--font-alt);
      font-size: 0.9rem;
      color: var(--light-text);
      transition: color 0.3s;

      &:hover,
      &:focus {
        color: var(--primary);
      }
    }

    .footer-section {
      margin-top: 16px;
      text-align: center;

      .footer-text {
        height: 40px;
        align-self: stretch;
        flex-grow: 0;
        font-family: Poppins;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.6;
        letter-spacing: normal;
        text-align: center;
        color: #ebf1ff;

        .text-style-3 {
          color: #e2e1ee;
        }
        .sign-in {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.6;
          color: #e2e1ee;
        }
      }
    }
  }

  .is-form {
    position: relative;
    max-width: 440px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      animation: fadeInLeft 0.5s;

      .top-logo {
        z-index: 1;
        img {
          display: block;
          width: 80.3px;
          height: 80px;
          margin: 0 32px auto;
        }

        svg {
          height: 50px;
          width: 50px;
        }
      }

      .account-text {
        height: 32px;
        align-self: stretch;
        flex-grow: 0;
        font-family: Poppins;
        font-size: 24px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: center;
        color: #e2e1ee;
      }
      .forgot-password-statement {
        padding: 0px 20px;
        margin-top: 20px;
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
        color: #e2e1ee;
      }
      h2 {
        font-family: var(--font-alt);
        font-weight: 400;
        font-size: 2rem;
        color: var(--primary);
      }

      p {
        color: var(--muted-grey);
        margin-top: 32px;
      }
    }

    .recover-text {
      font-size: 0.9rem;
      color: var(--dark-text);
    }

    .login-wrapper {
      margin-top: 25px;
      padding: 44px 20px;

      .or-line {
        margin-bottom: 32px;
      }

      .or-part {
        margin-top: 49px;

        .or-text {
          margin: 0 32px;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #c4c5d8;
        }
      }

      .field {
        label {
          align-self: stretch;
          flex-grow: 0;
          font-family: Poppins;
          font-size: 18px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.33;
          letter-spacing: normal;
          text-align: left;
          color: #e2e1ee !important;
          margin-top: 19px;
          margin-bottom: 12px !important;
        }
        .forgot-password {
          margin-top: 16px;
          font-weight: normal;
        }
        .password-wrapper {
          position: relative;

          .eye-icon {
            display: flex;
            position: absolute;
            cursor: pointer;
            right: 12px;
          }
        }
        input {
          flex-grow: 0;
          font-family: Poppins;
          font-size: 16px !important;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #e2e1ee;
          height: 40px;
          padding: 8px 12px;
          border: solid 1px #8d90a1;
          &::placeholder {
            color: #c4c5d5 !important;
          }
        }
      }
      .control {
        position: relative;
        width: 100%;
        margin-top: 16px;

        .input {
          padding-top: 14px;
          height: 60px;
          border-radius: 10px;
          padding-inline-start: 55px;
          transition: all 0.3s;

          &:focus {
            background: var(--fade-grey-light-6);
            border-color: var(--placeholder);

            ~ .auth-label,
            ~ .autv-icon i {
              color: var(--muted-grey);
            }
          }
        }

        .error-text {
          color: var(--danger);
          font-size: 0.8rem;
          display: none;
          padding: 2px 6px;
        }

        .auth-label {
          position: absolute;
          top: 6px;
          inset-inline-start: 55px;
          font-size: 0.8rem;
          color: var(--dark-text);
          font-weight: 500;
          z-index: 2;
          transition: all 0.3s; // transition-all test
        }

        .autv-icon,
        :deep(.autv-icon) {
          position: absolute;
          top: 0;
          inset-inline-start: 0;
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: var(--placeholder);
          transition: all 0.3s;
        }

        &.has-validation {
          .validation-icon {
            position: absolute;
            top: 0;
            inset-inline-end: 0;
            height: 60px;
            width: 60px;
            display: none;
            justify-content: center;
            align-items: center;

            .icon-wrapper {
              height: 20px;
              width: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: var(--radius-rounded);

              svg {
                height: 10px;
                width: 10px;
                stroke-width: 3px;
                color: var(--white);
              }
            }

            &.is-success {
              .icon-wrapper {
                background: var(--success);
              }
            }

            &.is-error {
              .icon-wrapper {
                background: var(--danger);
              }
            }
          }

          &.has-success {
            .validation-icon {
              &.is-success {
                display: flex;
              }

              &.is-error {
                display: none;
              }
            }
          }

          &.has-error {
            .input {
              border-color: var(--danger);
            }

            .error-text {
              display: block;
            }

            .validation-icon {
              &.is-error {
                display: flex;
              }

              &.is-success {
                display: none;
              }
            }
          }
        }

        &.is-flex {
          display: flex;
          align-items: center;

          a {
            display: block;
            margin-inline-start: auto;
            color: var(--muted-grey);
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover,
            &:focus {
              color: var(--primary);
            }
          }

          .remember-me {
            font-size: 0.9rem;
            color: var(--muted-grey);
            font-weight: 500;
          }
        }
      }
      .line-stroke {
        width: 115.2px;
        height: 1.6px;
        flex-grow: 0;
        background-color: #c4c5d8;
      }
      .button-wrap {
        margin: 48px 0 16px 0;

        &.has-help {
          display: flex;
          align-items: center;

          > span {
            margin-inline-start: 12px;
            font-family: var(--font);

            a {
              color: var(--primary);
              font-weight: 500;
              padding: 0 2px;
            }
          }
        }

        .button {
          height: 40px;
          width: 440px;
          flex-direction: row;
          gap: 12px;
          padding: 7px 16px;
          border-radius: 60px;
          border: solid 1px #004eff;
          background-color: #004eff;

          &:first-child {
            &:hover {
              opacity: 0.8;
            }
          }

          .reset-password {
            flex-grow: 0;
            font-family: Poppins;
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.6;
            letter-spacing: normal;
            text-align: left;
            color: #fff;
          }
        }
      }
      .group-button {
        height: 40px;
        align-self: stretch;
        flex-grow: 0;
        flex-direction: row;
        gap: 8px;
        padding: 0;

        .google-button {
          flex-grow: 1;
          flex-direction: row;
          gap: 12px;
          padding: 7px 16px;
          border-radius: 6px;
          border: solid 1px #fff;
          background-color: #fff;
        }
      }
    }
  }
}

@media only screen and (max-width: 960px) {
  .modern-login {
    .top-logo {
      top: 30px;
    }
    .h-hidden-mobile {
      display: none;
    }
    .dark-mode {
      top: 36px;
      inset-inline-end: 44px;
    }

    .is-form {
      padding-top: 56px;
      padding-bottom: 28px;
      background-color: #000b3a;
      min-height: 100vh;
      max-width: 100vw;

      .form-text {
        padding: 0 16px;
        .forgot-password-statement {
          display: none;
        }
        .top-logo {
          img {
            width: 48.2px;
            height: 48px;
          }
        }

        .account-text {
          margin-top: 12px;
          font-size: 16px;
          font-family: Poppins;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
        }
      }

      .login-wrapper {
        padding: 64px 16px 0;
        margin-top: 0px;

        .field {
          margin-bottom: 8px;

          label {
            line-height: 1.5;
            align-self: stretch;
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.2;
            letter-spacing: normal;
            text-align: left;
            color: #fff;
          }
          .password-wrapper {
            .eye-icon {
              right: 0px;
            }
          }
          .forgot-password {
            margin: 8px 0;
          }
        }

        .button-wrap {
          margin-top: 267px;
          margin-bottom: 0px;
        }

        .or-line {
          margin-bottom: 12px;
          .or-part {
            margin-top: 60px;
            .line-stroke {
              width: 112px;
              height: 0.7px;
            }
            .or-text {
              margin: 0px 24px;
              font-size: 14px;
            }
          }
        }
        .forgot-link {
          .footer-section {
            margin-top: 12px;
            .footer-text {
              height: 40px;
              align-self: stretch;
              font-family: Poppins;
              font-size: 12px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              text-align: center;
              color: #e2e1ee;
            }
            a {
              font-size: 14px;
              font-weight: 600;
              line-height: 1.2;
            }
          }
        }
      }
    }
  }
}
@media only screen and (min-width: 961px) and (max-width: 1024px) {
  .main-section {
    width: 430px !important;
    height: 320px !important;
  }
  .slide-button {
    margin-top: 40px;
  }
  .brand-section {
    img {
      width: 65%;
    }
  }
  .right-side {
    margin-bottom: 15px !important;
  }
  .hidden-1024 {
    width: 60% !important;
  }
  .right-side {
    width: 40% !important;
  }
  .modern-login {
    .underlay {
      width: 60%;
    }
    .is-form {
      max-width: 350px;
      .form-text {
        .account-text {
          margin-top: 18px;
          font-size: 19px;
        }
        .top-logo {
          img {
            width: 68.3px;
            height: 68px;
          }
        }
      }
      .login-wrapper {
        margin-top: 0px;
        padding: 0px 20px;
        .field {
          label {
            margin-top: 20px;
          }
        }
        .button-wrap {
          margin: 20px 0 0 0;
        }
        .or-part {
          margin-top: 35px;
        }
      }
    }
    .forgot-link {
      .footer-section {
        .footer-text {
          font-size: 15px;
        }
      }
    }
  }
}
@media only screen and (min-width: 1025px) and (max-width: 1216px) {
  .brand-section {
    scale: 0.95;
  }
  .right-side {
    margin-bottom: 25px !important;
  }
  .main-section {
    width: 515px !important;
    height: 410px !important;
  }
  .slide-button {
    margin-top: 40px;
  }
  .modern-login {
    .is-form {
      .login-wrapper {
        margin-top: 0px;
      }
    }
  }
}
@media only screen and (min-width: 1217px) and (max-width: 1440px) {
  .main-section {
    width: 750px !important;
    height: 560px !important;
  }
  .brand-section {
    scale: 0.95;
  }
  .right-side {
    margin-bottom: 170px !important;
  }
  .modern-login {
    .is-form {
      max-width: 400px;

      .login-wrapper {
        margin-top: 0px;
        padding: 40px 20px;
      }
    }
  }
}
@media only screen and (min-width: 1441px) and (max-width: 1919px) {
  .main-section {
    width: 835px !important;
    height: 625px !important;
  }
  .brand-section {
    scale: 0.95;
  }
}
@media only screen and (min-width: 1920px) {
  .modern-login {
    .is-form {
      margin-left: 100px;
    }
    .hero {
      .hero-body {
        justify-content: flex-end;
        padding-right: 200px !important;
      }
    }
  }
}
/* ==========================================================================
Dark mode
========================================================================== */

.is-dark {
  .modern-login {
    background: #11131c;

    .underlay {
      background: var(--dark-sidebar-light-10);
    }

    .is-image {
      border-color: var(--dark-sidebar-light-10);
    }

    .is-form {
      .form-text {
        h2 {
          color: var(--primary);
        }
      }

      .login-wrapper {
        .control {
          &.is-flex {
            a:hover {
              color: var(--primary);
            }
          }

          .input {
            background: var(--dark-sidebar-light-4);

            &:focus {
              border-color: var(--primary);

              ~ .autv-icon {
                i {
                  color: var(--primary);
                }
              }
            }
          }

          .auth-label {
            color: var(--light-text);
          }
        }

        .button-wrap {
          &.has-help {
            span {
              color: var(--light-text);

              a {
                color: var(--primary);
              }
            }
          }
        }
      }
    }
  }

  .mark-section {
    align-self: stretch;
    flex-direction: column;
    padding: 0;
  }
}
</style>
