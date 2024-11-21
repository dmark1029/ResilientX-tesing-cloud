<template>
  <div class="modern-login">
    <div class="columns is-gapless is-vcentered signup-panel">
      <div class="column is-relative is-6 h-hidden-mobile h-hidden-tablet-p">
        <div class="hero is-fullheight is-image">
          <div class="hero-body is-flex is-align-items-center">
            <div>
              <div class="brand-section" @click="directToHome">
                <img src="/images/logos/logo/logo-1.svg" alt="brand" />
              </div>
              <div class="main-section">
                <img
                  id="img1"
                  src="/images/logos/logo/Registration-page.png"
                  alt="sign1"
                  :class="currentSlide === 0 ? 'active' : 'in-active'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="column is-12-tablet is-6-desktop is-6-fullhd is-6-widescreen is-relative right-side"
      >
        <div class="mark-section">
          <div class="account-image"></div>
        </div>
        <div class="is-form">
          <div class="is-form-inner">
            <div class="form-text">
              <RouterLink
                to="/"
                class="top-logo is-flex is-justify-content-center is-align-items-center"
              >
                <img :src="logoSrc" height="120" alt="logo" />
              </RouterLink>
              <p class="account-text">Register now to & secure your infrastructure</p>
            </div>
            <form
              class="signup-wrapper"
              @submit.prevent="register"
              @keydown="regForm.onKeydown($event)"
            >
              <div class="field">
                <div class="is-flex-grow-1 input-field">
                  <label class="label" for="fullName">Your full name</label>
                  <input
                    id="name"
                    v-model="regForm.name"
                    type="text"
                    class="input v-input"
                    name="name"
                    placeholder="Your full name"
                  />
                  <HasError :form="regForm" field="name" />
                </div>
                <div class="is-flex-grow-1 input-field">
                  <label class="label" for="companyName">Company name</label>
                  <input
                    id="company"
                    v-model="regForm.companyName"
                    type="text"
                    class="input v-input"
                    name="company"
                    placeholder="Enter company name"
                  />
                  <HasError :form="regForm" field="company" />
                </div>
              </div>

              <div class="field">
                <div class="is-flex-grow-1 input-field">
                  <label class="label" for="email">Email</label>
                  <input
                    id="email"
                    v-model="regForm.email"
                    type="text"
                    class="input v-input"
                    name="email"
                    placeholder="Enter email"
                  />
                  <HasError :form="regForm" field="email" />
                </div>
                <div class="is-flex-grow-1 input-field">
                  <label class="label" for="userpassword">Password</label>
                  <div class="password-wrapper">
                    <input
                      id="userpassword"
                      v-model="regForm.password"
                      :type="passwordFieldType"
                      class="input v-input"
                      name="password"
                      placeholder="Enter password"
                    />
                    <span class="eye-icon" @click="toggleImage">
                      <img
                        id="eyetoggle-button"
                        :src="eyeSrc"
                        width="28"
                        class="active"
                      />
                    </span>
                    <HasError :form="regForm" field="password" />
                  </div>
                </div>
              </div>

              <div class="control is-agree">
                <label class="checkbox is-outlined p-0">
                  <span />
                  <span>
                    <p>
                      By signing up, you agree to our
                      <a
                        href="https://resilientx.com/terms-and-conditions"
                        target="_blank"
                        class="text-primary terms-and-conditions"
                        >Terms and Conditions</a
                      >, and
                      <a
                        href="https://resilientx.com/privacy-policy"
                        target="_blank"
                        class="text-primary terms-and-conditions"
                        >Privacy Policy</a
                      >.
                    </p>
                  </span>
                </label>
              </div>
              <HasError :form="regForm" field="agree" />

              <div class="button-wrap has-help">
                <FormButton
                  :form="regForm"
                  class="button is-rounded v-button is-bold is-big is-raised is-primary"
                  type="submit"
                  style="font-family: Poppins"
                >
                  <label class="sign-up">Sign Up</label>
                </FormButton>
              </div>

              <div class="forgot-link has-has-text-centereded">
                <div class="footer-section">
                  <span class="footer-text">
                    Do have an account?
                    <span class="text-style-1">&nbsp;</span>
                    <span>
                      <RouterLink :to="{ name: 'Login' }" class="sign-in"
                        >Sign in&nbsp;</RouterLink
                      >
                    </span>
                    <span class="text-style-3">here</span>
                  </span>
                </div>
              </div>

              <div class="has-text-centered or-line">
                <div class="row or-part is-flex is-align-items-center">
                  <div class="line-stroke"></div>
                  <p class="or-text">Or sign in with</p>
                  <div class="line-stroke"></div>
                </div>
              </div>

              <div
                class="group-button is-flex is-justify-content-center is-align-items-center"
              >
                <span
                  class="google-button is-flex is-justify-content-center is-align-items-center"
                  @click="loginGoogle"
                >
                  <img src="/images/icons/logos/Google.svg" class="google-button-image" />
                </span>
                <span
                  class="google-button is-flex is-justify-content-center is-align-items-center"
                  @click="loginMicrosoft"
                >
                  <img
                    src="/images/icons/logos/Microsoft.svg"
                    class="google-button-image"
                  />
                </span>
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
import { axios } from '/@src/axios'
import { useMeta } from 'vue-meta'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'

export default {
  name: 'RegistrationView',
  components: {
    FormButton,
    HasError,
  },
  setup() {
    useMeta({
      title: 'Register',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({
      email: '',
      password: '',
    }),
    regForm: new Form({}),
    link: null,
    isToggled: true,
    isPasswordVisible: false,
    eyeSrc: '/images/icons/logos/eye.svg',
    currentSlide: 0,
    windowWidth: window.innerWidth,
  }),
  computed: {
    ...mapGetters(['theme', 'general']),
    passwordFieldType() {
      return this.isPasswordVisible ? 'text' : 'password'
    },
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
    if (this.$route.params.hash) {
      this.getRegistrationLink()
    }
    if (this.$route.query.email) {
      this.regForm.email = this.$route.query.email
    }
  },
  beforeMount() {
    this.$store.dispatch('addBodyClass', 'authorization')
  },
  beforeUnmount() {
    this.$store.dispatch('addBodyClass', '')
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth
    },
    loginGoogle() {
      axios
        .get('/login/google')
        .then((res) => {
          window.location.href = res.data.data.url
        })
        .catch(() => {})
    },
    loginMicrosoft() {
      axios
        .get('/login/microsoft')
        .then((res) => {
          window.location.href = res.data.data.url
        })
        .catch(() => {})
    },
    getRegistrationLink() {
      return new Promise((resolve, reject) => {
        axios
          .get('/register/' + this.$route.params.hash)
          .then((res) => {
            this.link = res.data.data
            resolve()
          })
          .catch(() => {
            this.form.errors.set('error', 'Failed retrieve registration link information')
            reject()
          })
      })
    },
    async register() {
      this.regForm.type = 'user'
      this.regForm.agree = 1
      this.regForm.hash = this.$route.params.hash
      await this.regForm
        .post('/register')
        .then(async (res) => {
          await this.$store.dispatch('addAccessToken', res.data.data.access_token)
          window.location.href = '/'
        })
        .catch(() => {})
    },
    toggleImage() {
      this.isToggled = !this.isToggled
      this.isPasswordVisible = !this.isPasswordVisible
      this.eyeSrc = this.isToggled
        ? '/images/icons/logos/eye.svg'
        : '/images/icons/logos/eye-1.svg'
    },
    changeSlide(index) {
      if (index !== this.currentSlide) {
        this.currentSlide = index
      }
    },
    directToHome() {
      this.$router.push({ name: 'Home' })
    },
  },
}
</script>

<style lang="scss" scoped>
.small {
  font: italic 13px sans-serif;
}
.google-button {
  transition: all 0.3s;
}
.google-button:hover {
  fill: var(--primary-box-shadow);
  box-shadow: gray !important;
  opacity: 0.7;
}
.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

  .signup-panel {
    background-color: #11131c;
    color: #e2e1ee;
  }
  .column {
    &.is-relative {
      position: relative;
    }
  }
  .h-hidden-mobile {
    display: block;
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
        width: 603px;
        height: 663px;
        margin-top: 80px;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 100%;
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
          line-height: 1.33;
          color: #e2e1ee;
        }
      }
    }
  }

  .is-form {
    position: relative;
    max-width: 780px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      padding: 0 20px;
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

    .signup-wrapper {
      margin-top: 45px;

      .or-line {
        margin-bottom: 32px;
      }

      .or-part {
        margin-top: 70px;
        justify-content: center;
        gap: 32px;

        .or-text {
          font-family: Poppins;
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
        gap: 20px;
        display: flex;
        justify-content: center;

        .input-field {
          margin-bottom: 12px;
        }

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
            right: 5px;
            top: 5px;
            background: #11131c;
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
        margin-top: 25px;

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
        p {
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #ebf1ff;

          .terms-and-conditions {
            font-size: 16px;
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
        margin: 45px 0 40px 0;

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
          width: 100%;
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
          .sign-up {
            width: 61px;
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
        .sign-in {
          width: 53px;
          height: 26px;
          flex-grow: 0;
          font-family: Poppins;
          font-size: 16px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.6;
          text-align: left;
          color: #fff;
        }
      }
      .group-button {
        height: 40px;
        align-self: stretch;
        flex-grow: 0;
        flex-direction: row;
        gap: 20px;
        padding: 0;
        .google-button {
          flex-grow: 1;
          flex-direction: row;
          gap: 12px;
          padding: 7px 16px;
          border-radius: 6px;
          border: solid 1px #fff;
          background-color: #fff;
          cursor: pointer;
        }
      }
    }
  }
}

@media only screen and (max-width: 960px) {
  .modern-login {
    .h-hidden-mobile {
      display: none;
    }
    .right-side {
      width: 100%;
    }
    .top-logo {
      top: 30px;
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
        .top-logo {
          img {
            width: 48.2px;
            height: 48px;
          }
        }

        .account-text {
          flex-grow: 0;
          font-size: 16px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: center;
          color: #fff;
        }

        p {
          margin-top: 12px;
        }
      }

      .signup-wrapper {
        padding: 48px 16px 0;
        margin-top: 0px;

        .field {
          margin-bottom: 8px;
          display: block;

          input {
            font-size: 14px;
          }

          label {
            line-height: 1.5;
            align-self: stretch;
            flex-grow: 0;
            font-family: Poppins;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.2;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            text-align: left;
            color: #fff;
            margin: 0 0 4px 0;
          }
          .password-wrapper {
            .eye-icon {
              right: 2px;
              background-color: #000b3a;
            }
          }
          .forgot-password {
            margin: 8px 0;
          }
        }

        .button-wrap {
          margin-top: 17px;
          margin-bottom: 0px;
        }

        .or-line {
          margin-bottom: 12px;
          .or-part {
            margin-top: 40px;
            justify-content: space-between;
            .line-stroke {
              width: 88px;
              height: 0.7px;
            }
            .or-text {
              margin: 0px 0px;
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
              flex-grow: 0;
              font-family: Poppins;
              font-size: 14px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              text-align: center;
              color: #ebf1ff;

              a {
                font-size: 18px;
                font-weight: 600;
                line-height: 1.2;
                color: #fff;
              }

              .sign-in {
                font-size: 16px;
                font-weight: 600;
                line-height: 1.2;
                color: #e2e1ee;
              }
            }
          }
        }

        .control {
          margin-top: 16px;
          p {
            align-self: stretch;
            flex-grow: 0;
            font-family: Poppins;
            font-size: 11.5px;
            font-weight: normal;
            font-stretch: normal;
            font-style: normal;
            line-height: 1.5;
            letter-spacing: normal;
            text-align: left;
            color: #ebf1ff;

            .terms-and-conditions {
              align-self: stretch;
              flex-grow: 0;
              font-family: Poppins;
              font-size: 11.5px;
              font-weight: normal;
              font-stretch: normal;
              font-style: normal;
              line-height: 1.5;
              letter-spacing: normal;
              text-align: left;
              color: #ebf1ff;
            }
          }
        }
      }
    }
  }
}
@media only screen and (min-width: 961px) and (max-width: 1024px) {
  .modern-login {
    .h-hidden-mobile {
      width: 40% !important;
    }
    .right-side {
      width: 60% !important;
    }
    .hero {
      .hero-body {
        .brand-section {
          scale: 0.7;
        }
        .main-section {
          scale: 0.75;
          width: 415px;
          height: 435px;
          margin-top: 0px;
        }
      }
    }
    .is-form {
      margin: 0 25px;

      .form-text {
        .top-logo {
          scale: 0.9;
        }
        .account-text {
          margin-top: 1px;
          font-size: 19px;
        }
      }
      .signup-wrapper {
        margin-top: 10px;
        .control {
          margin-top: 1px;
        }
        .field {
          margin-bottom: 0px;
          label {
            margin-top: 12px;
            font-size: 16px;
          }
        }
        .button-wrap {
          margin: 30px 0 20px 0;
        }
        .or-line {
          margin-bottom: 12px;
          .or-part {
            margin-top: 10px;
          }
        }
      }
    }
  }
}
@media only screen and (min-width: 1025px) and (max-width: 1216px) {
  .modern-login {
    .hero {
      .hero-body {
        .brand-section {
          scale: 0.7;
        }
        .main-section {
          scale: 0.75;
          width: 540px;
          height: 555px;
          margin-top: 0px;
        }
      }
    }
    .is-form {
      margin: 0 25px;

      .form-text {
        .top-logo {
          scale: 0.9;
        }
        .account-text {
          margin-top: 15px;
          font-size: 19px;
        }
      }
      .signup-wrapper {
        margin-top: 10px;
        .control {
          margin-top: 15px;
        }
        .field {
          label {
            margin-top: 12px;
            font-size: 16px;
          }
        }
        .button-wrap {
          margin: 30px 0 20px 0;
        }
        .or-part {
          margin-top: 25px;
        }
      }
    }
  }
}
@media only screen and (min-width: 1217px) and (max-width: 1440px) {
  .modern-login {
    .hero-body {
      .brand-section {
        scale: 0.85;
      }
      .main-section {
        width: 580px;
        height: 605px;
        scale: 0.85;
        margin-top: 0px !important;
      }
    }
    .is-form {
      margin: 0 50px;
      .form-text {
        .top-logo {
          scale: 0.9;
        }
        .account-text {
          margin-top: 15px;
          font-size: 19px;
        }
      }
      .signup-wrapper {
        margin-top: 55px;
        .control {
          margin-top: 15px;
        }
        .field {
          label {
            margin-top: 12px;
            font-size: 16px;
          }
        }
        .button-wrap {
          margin: 30px 0 20px 0;
        }
        .or-part {
          margin-top: 25px;
        }
      }
    }
  }
}
@media only screen and (min-width: 1441px) and (max-width: 1919px) {
  .modern-login {
    .is-form {
      margin: 0 65px;
    }
  }
}
@media only screen and (min-width: 1920px) {
  .modern-login {
    .is-form {
      max-width: 760px;
      margin-left: 100px;
    }
    .hero {
      .hero-body {
        max-width: 50vw;
        justify-content: flex-end;
        padding-right: 160px;
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

      .signup-wrapper {
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

    .account-image {
      background-image: url('./icons/Logo 2.svg');
      background-size: cover;
    }
  }
}
</style>