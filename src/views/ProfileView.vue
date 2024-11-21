<template>
  <div class="page-content-inner">
    <!--Edit Profile-->
    <div class="account-wrapper">
      <div class="columns">
        <!--Navigation-->
        <div class="column is-4">
          <div class="account-box is-navigation">
            <VBlock :title="user.name" :subtitle="user.email" center>
              <template #icon>
                <VAvatar size="large" :picture="user.avatar" />
              </template>
            </VBlock>

            <div class="account-menu">
              <a
                :class="[
                  viewState === 'personal'
                    ? 'router-link-active router-link-exact-active account-menu-item'
                    : 'account-menu-item',
                ]"
                @click="changeView('personal')"
              >
                <i aria-hidden="true" class="fa fa-user" />
                <span>Personal information</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right" />
                </span>
              </a>
              <a
                :class="[
                  viewState === 'password'
                    ? 'router-link-active router-link-exact-active account-menu-item'
                    : 'account-menu-item',
                ]"
                @click="changeView('password')"
              >
                <i aria-hidden="true" class="fa fa-lock" />
                <span>Change password</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right" />
                </span>
              </a>
              <a
                :class="[
                  viewState === 'sessions'
                    ? 'router-link-active router-link-exact-active account-menu-item'
                    : 'account-menu-item',
                ]"
                @click="changeView('sessions')"
              >
                <i aria-hidden="true" class="fa fa-globe" />
                <span>Active sessions</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right" />
                </span>
              </a>
              <a
                v-if="user.type === 'LicenseManager'"
                :class="[
                  viewState === 'companies'
                    ? 'router-link-active router-link-exact-active account-menu-item'
                    : 'account-menu-item',
                ]"
                @click="changeView('companies')"
              >
                <i aria-hidden="true" class="fa fa-building" />
                <span>License management companies</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right" />
                </span>
              </a>
              <a
                :class="[
                  viewState === 'tokens'
                    ? 'router-link-active router-link-exact-active account-menu-item'
                    : 'account-menu-item',
                ]"
                @click="changeView('tokens')"
              >
                <i aria-hidden="true" class="fa fa-key" />
                <span>Access tokens</span>
                <span class="end">
                  <i aria-hidden="true" class="fas fa-arrow-right" />
                </span>
              </a>
            </div>
          </div>
        </div>
        <div class="column is-8">
          <Transition name="translate-page-y" mode="in-out">
            <div
              v-if="(isShowByProps && view === 'personal') || viewState === 'personal'"
              class="account-box is-form is-footerless"
            >
              <div class="form-head stuck-header">
                <div class="form-head-inner">
                  <div class="left">
                    <h3>Personal Information</h3>
                    <p>Edit your account's general information</p>
                  </div>
                </div>
              </div>
              <div class="form-body">
                <form
                  @submit.prevent="editProfile"
                  @keydown="personalForm.onKeydown($event)"
                >
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Name</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="personalForm.name"
                        class="input v-input"
                        type="text"
                        placeholder="Enter your fullname"
                      />
                      <HasError :form="personalForm" field="name" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Email</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="personalForm.email"
                        class="input v-input"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <div v-if="!user.email_verified_at && !sent" class="mt-2">
                        <span class="has-text-danger mr-2">Email not verified.</span>
                        <a class="d-inline is-clickable" @click="resend"
                          >Resend email verification</a
                        >
                      </div>
                      <HasError :form="personalForm" field="email" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Timezone</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <div class="select">
                        <select v-model="personalForm.timezone" class="form-select">
                          <option :value="null">Select timezone</option>
                          <option
                            v-for="(value, index) in general.timezones"
                            :key="index"
                            :value="index"
                          >
                            {{ value }}
                          </option>
                        </select>
                      </div>
                      <HasError :form="personalForm" field="timezone" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Language</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <div class="select">
                        <select v-model="personalForm.language" class="form-select">
                          <option :value="null">Select language</option>
                          <option
                            v-for="(value, index) in general.languages"
                            :key="index"
                            :value="index"
                          >
                            {{ value }}
                          </option>
                        </select>
                      </div>
                      <HasError :form="personalForm" field="language" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Phone</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="personalForm.phone"
                        placeholder="Enter your phone number"
                        class="input v-input"
                        type="text"
                      />
                      <HasError :form="personalForm" field="phone" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <div class="control is-agree">
                      <label class="checkbox is-outlined p-0">
                        <input v-model="personalForm.notify_general" type="checkbox" />
                        <span />
                        <span>Email Notifications</span>
                      </label>

                      <HasError :form="personalForm" field="notify_general" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <div class="control is-agree">
                      <label class="checkbox is-outlined p-0">
                        <input v-model="personalForm.notify_activity" type="checkbox" />
                        <span />
                        <span>Activity Notifications</span>
                      </label>

                      <HasError :form="personalForm" field="notify_activity" />
                    </div>
                  </div>
                  <FormButton
                    :form="personalForm"
                    class="button v-button is-bold is-big is-raised is-primary"
                    type="submit"
                  >
                    Update profile
                  </FormButton>
                </form>
              </div>
            </div>
          </Transition>
          <Transition name="translate-page-y" mode="in-out">
            <div
              v-if="(isShowByProps && view === 'password') || viewState === 'password'"
              class="account-box is-form is-footerless"
            >
              <div class="form-head stuck-header">
                <div class="form-head-inner">
                  <div class="left">
                    <h3>Change password</h3>
                    <p>Edit your account's password</p>
                  </div>
                </div>
              </div>
              <div class="form-body">
                <form
                  @submit.prevent="editPassword"
                  @keydown="passworForm.onKeydown($event)"
                >
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >Current password</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="passworForm.password"
                        class="input v-input"
                        type="password"
                        placeholder="Enter your current password"
                      />
                      <HasError :form="passworForm" field="password" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >New password
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
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="passworForm.password_new"
                        class="input v-input"
                        placeholder="Enter your new password"
                        type="password"
                      />
                      <HasError :form="passworForm" field="password_new" />
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label is-left"
                      >New password again</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <input
                        v-model="passworForm.password_new_confirmation"
                        placeholder="Enter your new password again"
                        class="input v-input"
                        type="password"
                      />
                      <HasError :form="passworForm" field="password_new_confirmation" />
                    </div>
                  </div>

                  <FormButton
                    :form="passworForm"
                    class="button v-button is-bold is-big is-raised is-primary"
                    type="submit"
                  >
                    Update password
                  </FormButton>
                </form>
              </div>
            </div>
          </Transition>
          <Transition name="translate-page-y" mode="in-out">
            <div
              v-if="(isShowByProps && view === 'tokens') || viewState === 'tokens'"
              class="account-box is-form is-footerless"
            >
              <div class="form-head stuck-header">
                <div class="form-head-inner">
                  <div class="left">
                    <h3>Access tokens</h3>
                    <p>
                      Long lived access tokens used for integrations with other platforms
                    </p>
                  </div>
                </div>
              </div>
              <div class="form-body">
                <div class="datatable-container">
                  <table class="table datatable-table is-fullwidth mb-0">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Last used</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in user.tokens" :key="item.id">
                        <td>{{ item.token }}</td>
                        <td>{{ item.last_used ?? 'Never' }}</td>
                        <td class="text-end">
                          <a class="is-clickable"
                            ><i
                              class="fa fa-trash has-text-danger font-16"
                              @click="deleteSession(item)"
                          /></a>
                        </td>
                      </tr>
                      <tr v-if="user.tokens.length === 0">
                        <td colspan="3" class="has-text-left">No tokens found</td>
                      </tr>
                    </tbody>
                  </table>
                  <!--end /table-->
                </div>
                <button
                  class="button v-button is-primary mb-0 mt-5"
                  @click="generateToken"
                >
                  Generate token
                </button>

                <div v-if="generatedToken" class="mt-5">
                  <div class="content">
                    <p>
                      Your token is: <strong>{{ generatedToken }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <Transition name="translate-page-y" mode="in-out">
            <div
              v-if="(isShowByProps && view === 'sessions') || viewState === 'sessions'"
              class="account-box is-form is-footerless"
            >
              <div class="form-head stuck-header">
                <div class="form-head-inner">
                  <div class="left">
                    <h3>Active sessions</h3>
                    <p>Manage your account active session</p>
                  </div>
                </div>
              </div>
              <div class="form-body">
                <div class="datatable-container">
                  <table class="table datatable-table is-fullwidth mb-0">
                    <thead>
                      <tr>
                        <th>IP</th>
                        <th>Platform</th>
                        <th>Time</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in user.sessions" :key="item.id">
                        <td>{{ item.ip_address }}</td>
                        <td>{{ item.platform }} / {{ item.browser }}</td>
                        <td>{{ item.ago }}</td>
                        <td class="text-end">
                          <a class="is-clickable"
                            ><i
                              class="fa fa-trash has-text-danger font-16"
                              @click="deleteSession(item)"
                          /></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <!--end /table-->
                </div>
              </div>
            </div>
          </Transition>
          <Transition name="translate-page-y" mode="in-out">
            <div
              v-if="(isShowByProps && view === 'companies') || viewState === 'companies'"
              class="account-box is-form is-footerless"
            >
              <div class="form-head stuck-header">
                <div class="form-head-inner">
                  <div class="left">
                    <h3>License management companies</h3>
                    <p>Edit your license management company information</p>
                  </div>
                </div>
              </div>
              <div class="form-body">
                <div class="card-body">
                  <div class="field mb-3 row">
                    <label
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                      >License management company</label
                    >
                    <div class="col-lg-9 col-xl-8">
                      <div class="select">
                        <select
                          v-model="selectedCompany"
                          class="form-select"
                          @change="selectCompany(selectedCompany)"
                        >
                          <option
                            v-for="company in user.companies"
                            :key="company.id"
                            :value="company.id"
                          >
                            {{ company.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="field mb-3 row">
                    <div
                      class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                    />
                    <div class="col-lg-9 col-xl-8">
                      <hr />
                    </div>
                  </div>

                  <form
                    class="my-4"
                    @submit.prevent="editCompany"
                    @keydown="companyForm.onKeydown($event)"
                  >
                    <div class="field mb-3 row">
                      <label
                        class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                        >Name</label
                      >
                      <div class="col-lg-9 col-xl-8">
                        <input
                          v-model="companyForm.name"
                          class="input v-input"
                          type="text"
                          placeholder="Enter company name"
                        />
                        <HasError :form="companyForm" field="name" />
                      </div>
                    </div>
                    <div class="field mb-3 row">
                      <label
                        class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                        >Country</label
                      >
                      <div class="col-lg-9 col-xl-8">
                        <div class="select">
                          <select v-model="companyForm.country" class="form-select">
                            <option :value="undefined">Select country</option>
                            <option
                              v-for="(value, index) in general.countries"
                              :key="index"
                              :value="index"
                            >
                              {{ value }}
                            </option>
                          </select>
                        </div>
                        <HasError :form="companyForm" field="country" />
                      </div>
                    </div>
                    <div class="field mb-3 row">
                      <label
                        class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                        >City</label
                      >
                      <div class="col-lg-9 col-xl-8">
                        <input
                          v-model="companyForm.city"
                          class="input v-input"
                          type="text"
                        />
                        <HasError :form="companyForm" field="city" />
                      </div>
                    </div>
                    <div class="field mb-3 row">
                      <label
                        class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                        >Registration number</label
                      >
                      <div class="col-lg-9 col-xl-8">
                        <input
                          v-model="companyForm.registration_number"
                          class="input v-input"
                          placeholder="Enter company registration number"
                          type="text"
                        />
                        <HasError :form="companyForm" field="registration_number" />
                      </div>
                    </div>
                    <div class="field mb-3 row">
                      <label
                        class="col-xl-3 col-lg-3 text-end mb-lg-0 align-self-center label"
                        >Tax number</label
                      >
                      <div class="col-lg-9 col-xl-8">
                        <input
                          v-model="companyForm.tax_number"
                          placeholder="Enter company tax number"
                          class="input v-input"
                          type="text"
                        />
                        <HasError :form="companyForm" field="tax_number" />
                      </div>
                    </div>

                    <FormButton
                      :form="companyForm"
                      class="button v-button is-bold is-big is-raised is-primary"
                      type="submit"
                    >
                      Update company
                    </FormButton>
                  </form>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useMeta } from 'vue-meta'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/components/bootstrap5'
import { axios } from '/@src/axios'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import VBlock from '/@src/components/base/block/VBlock.vue'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'

export default {
  components: {
    VAvatar,
    VBlock,
    FormButton,
    HasError,
    AreYouSureModal,
  },
  props: ['view'],
  setup() {
    useMeta({
      title: `Profile`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    links: [],
    generatedToken: null,
    sent: false,
    personalForm: new Form({}),
    companyForm: new Form({}),
    passworForm: new Form({}),
    selectedCompany: null,
    viewState: '',
    isShowByProps: false,
  }),
  computed: {
    ...mapGetters(['user', 'general']),
  },
  watch: {
    view(newVal, oldVal) {
      this.showDetail()
    },
  },
  mounted() {
    this.links = [
      {
        name: 'Home',
        to: {
          name: 'Home',
        },
        active: false,
      },
      {
        name: 'Profile',
        to: {
          name: 'Profile',
        },
        active: true,
      },
    ]
    this.personalForm.name = this.user.name
    this.personalForm.email = this.user.email
    this.personalForm.timezone = this.user.timezone
    this.personalForm.language = this.user.language
    this.personalForm.phone = this.user.phone
    this.personalForm.notify_activity = this.user.notify_activity
    this.personalForm.notify_general = this.user.notify_general
    if (this.user.companies.length) {
      this.selectCompany(this.user.companies[0].id)
    }
    this.view && this.showDetail()
  },
  methods: {
    showDetail() {
      this.isShowByProps = true
      this.viewState = ''
    },
    onceImageErrored,
    selectCompany(id) {
      this.selectedCompany = id

      let company = this.user.companies.filter(function (item) {
        return item.id === id
      })[0]

      this.companyForm.id = company.id
      this.companyForm.name = company.name
      this.companyForm.country = company.country
      this.companyForm.city = company.city
      this.companyForm.registration_number = company.registration_number
      this.companyForm.tax_number = company.tax_number
    },
    editProfile() {
      return new Promise((resolve, reject) => {
        this.personalForm
          .post('/profile')
          .then((res) => {
            const { data } = res.data
            this.$store.dispatch('addUser', data)
            this.$store.dispatch('addAlert', {
              text: 'Profile updated successfully.',
              type: 'success',
            })
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    generateToken() {
      axios.post('/token').then((res) => {
        this.generatedToken = res.data.data.access_token

        setTimeout(() => {
          this.generatedToken = null
        }, 60000)

        this.getUserData()
      })
    },
    editCompany() {
      return new Promise((resolve, reject) => {
        this.companyForm
          .post('/company')
          .then(() => {
            this.getUserData()
            this.$store.dispatch('addAlert', {
              text: 'Information updated successfully.',
              type: 'success',
            })
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    editPassword() {
      return new Promise((resolve, reject) => {
        this.passworForm
          .post('/password')
          .then(() => {
            this.$store.dispatch('addAlert', {
              text: 'Password changed successfully.',
              type: 'success',
            })
            this.passworForm.password = ''
            this.passworForm.password_new = ''
            this.passworForm.password_new_confirmation = ''
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    async deleteSession(item) {
      if (item.active) {
        alert("Don't remove current session please.")
      } else {
        let ok = false
        if (item.status === 'disabled') {
          ok = true
        } else {
          ok = await this.$refs.confirmDialogue.show({
            title: 'Confirmation',
            message: 'Are you sure you want to delete this item?',
            okButton: 'Yes',
            cancelButton: 'No',
          })
        }
        if (ok) {
          if (item.id) {
            axios.delete('/profile/' + item.id).then(() => {
              this.getUserData()
            })
          }
        }
      }
    },
    resend() {
      axios.post('/resend').then(() => {
        this.sent = true
      })
    },
    getUserData() {
      return new Promise((resolve, reject) => {
        axios
          .get('/profile')
          .then((res) => {
            const { data } = res.data
            this.$store.dispatch('addUser', data)
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    changeView(view) {
      this.viewState = view
      this.isShowByProps = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '/@src/scss/abstracts/all';

.is-navbar {
  .account-wrapper {
    margin-top: 30px;
  }
}

.account-wrapper {
  padding-bottom: 60px;

  .account-box {
    @include vuero-s-card;

    &.is-navigation {
      .media-flex-center {
        padding-bottom: 20px;

        .flex-meta {
          span {
            &:first-child {
              font-size: 1.3rem;
            }
          }
        }
      }

      .account-menu {
        .account-menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid transparent;
          border-radius: 8px;
          margin-bottom: 5px;
          transition: all 0.3s; // transition-all test

          &.router-link-exact-active {
            box-shadow: var(--light-box-shadow);
            border-color: var(--fade-grey-dark-3);

            span,
            i {
              color: var(--white);
            }

            .end {
              display: block;
            }
          }

          &:not(.router-link-exact-active) {
            &:hover {
              background: var(--fade-grey-light-3);
            }
          }

          i {
            margin-inline-end: 8px;
            font-size: 1.1rem;
            color: var(--light-text);

            &.fas,
            .fal,
            .far {
              font-size: 0.9rem;
            }
          }

          span {
            font-family: var(--font-alt);
            font-size: 0.95rem;
            color: var(--dark-text);
          }

          .end {
            margin-inline-start: auto;
            display: none;
          }
        }
      }
    }

    &.is-form {
      padding: 0;

      &.is-footerless {
        padding-bottom: 20px;
      }

      .form-head,
      .form-foot {
        padding: 12px 20px;

        .form-head-inner,
        .form-foot-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .form-head {
        border-bottom: 1px solid var(--fade-grey-dark-3);
        transition: all 0.3s; // transition-all test

        &.is-stuck {
          background: var(--white);
          padding-inline-end: 80px;
          border-inline-start: 1px solid var(--fade-grey-dark-3);
        }

        .left {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            line-height: 1.3;
          }

          p {
            font-size: 0.95rem;
          }
        }
      }

      .form-foot {
        border-top: 1px solid var(--fade-grey-dark-3);
      }

      .form-body {
        padding: 20px;

        .is-left {
          float: left;
        }

        .fieldset {
          padding: 20px 0;
          max-width: 480px;
          margin: 0 auto;

          .fieldset-heading {
            margin-bottom: 20px;

            h4 {
              font-family: var(--font-alt);
              font-weight: 600;
              font-size: 1rem;
            }

            p {
              font-size: 0.9rem;
            }
          }

          .v-avatar {
            position: relative;
            display: block;
            margin: 0 auto;

            .edit-button {
              position: absolute;
              bottom: 0;
              inset-inline-end: 0;
            }
          }

          .setting-list {
            .setting-form {
              text-align: center;

              .filepond-profile-wrap {
                margin: 0 auto 10px !important;
              }
            }

            .setting-item {
              display: flex;
              align-items: center;
              margin-bottom: 24px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                background: var(--fade-grey-light-2);
                border: 1px solid var(--fade-grey-dark-3);
                color: var(--light-text);

                &.has-img {
                  border-color: var(--primary);

                  img {
                    width: 36px;
                    min-width: 36px;
                    height: 36px;
                  }
                }

                i {
                  font-size: 1.4rem;
                }
              }

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid transparent;
              }

              .meta {
                margin-inline-start: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }

              .end {
                margin-inline-start: auto;
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .account-wrapper {
    .account-box {
      @include vuero-card--dark;

      &.is-navigation {
        .account-menu {
          .account-menu-item {
            &.router-link-exact-active {
              background: var(--dark-sidebar-light-8);
              border-color: var(--dark-sidebar-light-12);

              i,
              span {
                color: var(--white);
              }
            }

            &:not(.router-link-exact-active) {
              &:hover {
                background: var(--dark-sidebar-light-10);
              }
            }

            span {
              color: var(--dark-dark-text);
            }
          }
        }
      }

      &.is-form {
        .form-head,
        .form-foot {
          border-color: var(--dark-sidebar-light-12);
        }

        .form-head {
          &.is-stuck {
            background: var(--dark-sidebar);
            border-color: var(--dark-table-color);
          }

          .left {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }

        .form-body {
          .fieldset {
            .fieldset-heading {
              h4 {
                color: var(--dark-dark-text);
              }
            }

            .setting-list {
              .setting-item {
                > img,
                > .icon-wrap,
                > .icon-wrap img {
                  border-color: var(--dark-sidebar-light-12);
                }

                > .icon-wrap {
                  background: var(--dark-sidebar-light-2);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
