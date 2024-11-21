<template>
  <div class="modern-login">
    <div class="underlay h-hidden-mobile h-hidden-tablet-p" />

    <div class="columns is-gapless is-vcentered">
      <div class="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p">
        <div class="hero is-fullheight is-image">
          <div class="hero-body">
            <div class="container">
              <div class="columns">
                <div class="column">
                  <img
                    :src="general.settings?.logo?.light"
                    class="hero-image"
                    alt="logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4 is-relative">
        <div class="top-tools">
          <RouterLink to="/" class="top-logo">
            <img :src="general.settings?.logo?.sidebar" height="120" alt="logo" />
          </RouterLink>
        </div>
        <div v-if="invite" class="is-form">
          <div class="is-form-inner">
            <div class="form-text">
              <h2 class="mb-5">
                You have been invited to join workspace "{{ invite.workspace.name }}"
              </h2>

              <form
                v-if="!finished"
                class="mb-5"
                @submit.prevent="submitForm"
                @keydown="form.onKeydown($event)"
              >
                <div v-if="step === 1">
                  <div class="field">
                    <label class="label">Company name</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="input v-input"
                      placeholder="Enter company name"
                    />
                    <HasError :form="form" field="name" />
                  </div>

                  <div class="field">
                    <label class="label">Industry</label>
                    <div class="select">
                      <select v-model="form.industry_id" class="form-select">
                        <option :value="undefined">Select industry</option>
                        <option
                          v-for="(name, id) in general.vrm.industries"
                          :key="id"
                          :value="id"
                        >
                          {{ name }}
                        </option>
                      </select>
                    </div>
                    <HasError :form="form" field="industry_id" />
                  </div>

                  <div class="field">
                    <label class="label">Assets</label>
                    <div class="control">
                      <textarea
                        v-model="form.assets"
                        type="text"
                        class="textarea"
                        placeholder="Enter assets (one per line)"
                      />
                      <HasError :form="form" field="assets" />
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Address</label>
                    <input
                      v-model="form.address"
                      type="text"
                      class="input v-input"
                      placeholder="Enter address"
                    />
                    <HasError :form="form" field="address" />
                  </div>

                  <div class="columns">
                    <div class="column is-8">
                      <div class="field">
                        <label class="label">Employees</label>
                        <div class="select">
                          <select v-model="form.employees" class="form-select">
                            <option :value="undefined">Select number of employees</option>
                            <option
                              v-for="(name, id) in general.vrm.employees"
                              :key="id"
                              :value="id"
                            >
                              {{ name }}
                            </option>
                          </select>
                        </div>
                        <HasError :form="form" field="employees" />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="step === 2">
                  <div>
                    <div class="field">
                      <label class="label">Type</label>
                      <div class="select">
                        <select
                          v-model="form.contact.contact_type_id"
                          class="form-select"
                        >
                          <option :value="undefined">Select contact type</option>
                          <option
                            v-for="(name, id) in general.vrm.contactTypes"
                            :key="id"
                            :value="id"
                          >
                            {{ name }}
                          </option>
                        </select>
                      </div>
                      <HasError :form="form" field="contact.contact_type_id" />
                    </div>

                    <div class="columns">
                      <div class="column is-6">
                        <div class="field">
                          <label class="label">Name</label>
                          <input
                            v-model="form.contact.name"
                            type="text"
                            class="input v-input"
                            placeholder="Enter name"
                          />
                          <HasError :form="form" field="contact.name" />
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="field">
                          <label class="label">Surname</label>
                          <input
                            v-model="form.contact.surname"
                            type="text"
                            class="input v-input"
                            placeholder="Enter surname"
                          />
                          <HasError :form="form" field="contact.surname" />
                        </div>
                      </div>
                    </div>

                    <div class="field">
                      <label class="label">Job title</label>
                      <input
                        v-model="form.contact.job_title"
                        type="text"
                        class="input v-input"
                        placeholder="Enter job title"
                      />
                      <HasError :form="form" field="contact.job_title" />
                    </div>

                    <div class="columns">
                      <div class="column is-6">
                        <div class="field">
                          <label class="label">Email</label>
                          <input
                            v-model="form.contact.email"
                            type="text"
                            class="input v-input"
                            placeholder="Enter email"
                          />
                          <HasError :form="form" field="contact.email" />
                        </div>
                      </div>
                      <div class="column is-6">
                        <div class="field">
                          <label class="label">Phone</label>
                          <input
                            v-model="form.contact.phone"
                            type="text"
                            class="input v-input"
                            placeholder="Enter phone"
                          />
                          <HasError :form="form" field="contact.phone" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <div class="field">
                    <label class="label" for="userpassword"
                      >Password
                      <span
                        v-tooltip.bottom="
                          'Password requirements:\n' +
                          '* Password require to be min 8 characters\n' +
                          '* Password require at least one letter.\n' +
                          '* Password require at least one uppercase and one lowercase letter.\n' +
                          '* Password require at least one number.\n' +
                          '* Password require at least one symbol.\n' +
                          '* Password should be uncompromised.'
                        "
                        class="is-capitalized password-hint"
                      >
                        <i class="ml-1 fa fa-info-circle" /> </span
                    ></label>
                    <input
                      id="userpassword"
                      v-model="form.password"
                      type="password"
                      class="input v-input"
                      name="password"
                      placeholder="Enter password"
                    />
                    <HasError :form="form" field="password" />
                  </div>
                </div>

                <button
                  v-if="step === 1"
                  type="button"
                  class="button v-button is-primary btn-sm mt-5"
                  @click="step = 2"
                >
                  {{ $t('Next') }}
                </button>

                <button
                  v-if="step === 2"
                  type="button"
                  class="button v-button is-outlined is-primary btn-sm mt-5 mr-3"
                  @click="step = 1"
                >
                  {{ $t('Back') }}
                </button>

                <FormButton
                  v-if="step === 2"
                  :form="form"
                  class="button v-button is-primary btn-sm mt-5"
                >
                  {{ $t('Submit') }}
                </FormButton>
              </form>
              <div v-else>
                <p class="mb-5">Thank you for submitting form.</p>

                <div>
                  <router-link :to="{ name: 'Login' }" class="v-button button is-primary"
                    >Sign in</router-link
                  >
                </div>
                <div class="mt-3">
                  <RouterLink to="/">Or return home</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="is-form">
            <div class="is-form-inner">
              <div class="form-text">
                <HasError :form="form" field="error" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '/@src/form'
import { useMeta } from 'vue-meta'
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'

export default {
  components: {
    HasError,
    FormButton,
  },
  setup() {
    useMeta({
      title: 'Company onboarding',
      bodyAttrs: {},
    })
  },
  data: () => ({
    form: new Form({
      contact: {},
    }),
    invite: null,
    finished: false,
    step: 1,
  }),
  computed: {
    ...mapGetters(['user', 'theme', 'general']),
  },
  mounted() {
    this.getInvite()
  },
  beforeMount() {
    this.$store.dispatch('addBodyClass', 'authorization')
  },
  beforeUnmount() {
    this.$store.dispatch('addBodyClass', '')
  },
  methods: {
    getInvite() {
      return new Promise((resolve) => {
        axios
          .get('/vendor-invite/' + this.$route.params.id, {
            params: {
              hash: this.$route.params.hash,
            },
          })
          .then((res) => {
            this.invite = res.data.data
            resolve()
          })
          .catch(() => {
            this.form.errors.set('error', 'Failed to get valid invitation information')
          })
      })
    },
    submitForm() {
      this.form
        .post('/vendor-invite/' + this.$route.params.id + '/' + this.$route.params.hash)
        .then(() => {
          this.form.name = ''
          this.form.employees = ''
          this.form.address = ''
          this.form.assets = ''
          this.finished = true
        })
        .catch(() => {
          if (
            this.form.errors.get('name') ||
            this.form.errors.get('industry_id') ||
            this.form.errors.get('assets') ||
            this.form.errors.get('address') ||
            this.form.errors.get('employees')
          ) {
            this.step = 1
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.button-invite {
  margin-top: 20px;
}
.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

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

  .top-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 1.25rem;
    margin-bottom: 5rem;

    .dark-mode {
      transform: scale(0.6);
      z-index: 2;
    }

    .top-logo {
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;

      img {
        display: block;
        width: 100%;
        max-width: 50px;
        margin: 0 auto;
      }

      svg {
        height: 50px;
        width: 50px;
      }
    }
  }

  .is-image {
    position: relative;
    border-inline-end: 1px solid var(--fade-grey);

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
  }

  .is-form {
    position: relative;
    max-width: 400px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      padding: 0 20px;
      animation: fadeInLeft 0.5s;

      h2 {
        font-family: var(--font-alt);
        font-weight: 400;
        font-size: 2rem;
        color: var(--primary);
      }

      p {
        color: var(--muted-grey);
        margin-top: 10px;
      }
    }

    .recover-text {
      font-size: 0.9rem;
      color: var(--dark-text);
    }

    .login-wrapper {
      padding: 30px 20px;

      .control {
        position: relative;
        width: 100%;
        margin-top: 16px;

        .input {
          padding-top: 14px;
          height: 60px;
          border-radius: 10px;
          padding-inline-start: 55px;
          transition: all 0.3s; // transition-all test

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

      .button-wrap {
        margin: 40px 0;

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
          height: 46px;
          width: 140px;
          margin-inline-start: 6px;

          &:first-child {
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}

.remember-toggle {
  width: 65px;
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
  transform: scale(0.9);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .active,
      .inactive {
        transform: translateX(calc(var(--transform-direction) * 100%)) rotate(360deg);
      }

      .active {
        opacity: 1;
      }

      .inactive {
        opacity: 0;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 34px;
    width: 61px;
    border: 2px solid var(--placeholder);
    border-radius: 100px;
    transition: all 0.3s; // transition-all test

    .active,
    .inactive {
      position: absolute;
      top: 2px;
      inset-inline-start: 2px;
      height: 26px;
      width: 26px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(calc(var(--transform-direction) * 0))
        rotate(calc(var(--transform-direction) * 0));
      transition: all 0.3s ease;

      svg {
        color: var(--white);
        height: 14px;
        width: 14px;
        stroke-width: 3px;
      }
    }

    .inactive {
      background: var(--placeholder);
      border-color: var(--placeholder);
      opacity: 1;
      z-index: 1;
    }

    .active {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;
    }
  }
}

@media only screen and (width <= 767px) {
  .modern-login {
    .top-logo {
      top: 30px;
    }

    .dark-mode {
      top: 36px;
      inset-inline-end: 44px;
    }

    .is-form {
      padding-top: 100px;
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      inset-inline-end: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }
}

/* ==========================================================================
Dark mode
========================================================================== */

.is-dark {
  .modern-login {
    background: var(--dark-sidebar);

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

  .remember-toggle {
    input {
      &:checked + .toggler {
        border-color: var(--primary);

        > span {
          background: var(--primary);
        }
      }
    }

    .toggler {
      border-color: var(--dark-sidebar-light-12);

      > span {
        background: var(--dark-sidebar-light-12);
      }
    }
  }
}
</style>
