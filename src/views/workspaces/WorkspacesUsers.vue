<template>
  <div v-if="loading || !workspace" class="app-init-wrapper">
    <VLoader class="is-grey" :active="true">
      <div />
    </VLoader>
  </div>
  <div v-else>
    <div class="page-content-inner">
      <!--Edit Profile-->
      <div class="account-wrapper">
        <div class="columns">
          <!--Navigation-->
          <div class="column is-4">
            <div class="account-box is-navigation">
              <div class="account-menu">
                <a
                  :class="'account-menu-item button v-button is-primary mb-3'"
                  @click="showInviteModal = true"
                >
                  <i aria-hidden="true" class="fa fa-envelope-open has-text-white" />
                  <span class="has-text-white">Send invite</span>
                  <span class="end">
                    <i aria-hidden="true" class="fas fa-arrow-right" />
                  </span>
                </a>

                <a
                  :class="[
                    view === 'users'
                      ? 'router-link-active router-link-exact-active account-menu-item'
                      : 'account-menu-item',
                  ]"
                  @click="view = 'users'"
                >
                  <i aria-hidden="true" class="fa fa-lock" /><span>User Management</span
                  ><span class="end"
                    ><i aria-hidden="true" class="fas fa-arrow-right"
                  /></span>
                </a>

                <a
                  :class="[
                    view === 'roles'
                      ? 'router-link-active router-link-exact-active account-menu-item'
                      : 'account-menu-item',
                  ]"
                  @click="view = 'roles'"
                >
                  <i aria-hidden="true" class="fa fa-user" /><span>Role Management</span
                  ><span class="end"
                    ><i aria-hidden="true" class="fas fa-arrow-right"
                  /></span>
                </a>

                <!--                <a-->
                <!--                  :class="[-->
                <!--                    view === 'projects'-->
                <!--                      ? 'router-link-active router-link-exact-active account-menu-item'-->
                <!--                      : 'account-menu-item',-->
                <!--                  ]"-->
                <!--                  @click="view = 'projects'"-->
                <!--                >-->
                <!--                  <i aria-hidden="true" class="fa fa-user" /><span>Project access</span-->
                <!--                  ><span class="end"-->
                <!--                    ><i aria-hidden="true" class="fas fa-arrow-right"-->
                <!--                  /></span>-->
                <!--                </a>-->

                <a
                  :class="[
                    view === 'invites'
                      ? 'router-link-active router-link-exact-active account-menu-item'
                      : 'account-menu-item',
                  ]"
                  @click="view = 'invites'"
                >
                  <i aria-hidden="true" class="fa fa-envelope-open" /><span
                    >User Invitation</span
                  ><span class="end"
                    ><i aria-hidden="true" class="fas fa-arrow-right"
                  /></span>
                </a>

                <a
                  :class="[
                    view === 'managers'
                      ? 'router-link-active router-link-exact-active account-menu-item'
                      : 'account-menu-item',
                  ]"
                  @click="view = 'managers'"
                >
                  <i aria-hidden="true" class="fa fa-paperclip" /><span
                    >License managers</span
                  ><span class="end"
                    ><i aria-hidden="true" class="fas fa-arrow-right"
                  /></span>
                </a>
              </div>
            </div>
          </div>
          <div class="column is-8">
            <Transition name="translate-page-y" mode="in-out">
              <div v-if="view === 'projects'" class="account-box is-form is-footerless">
                <div class="form-head stuck-header">
                  <div class="form-head-inner">
                    <div class="left">
                      <h3>Project access</h3>
                      <p>Manage user access to specific project</p>
                    </div>
                  </div>
                </div>
                <div class="form-body">
                  <div v-if="projects && projects.meta && projects.meta.total">
                    <div class="datatable-container">
                      <table class="table datatable-table is-fullwidth mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Access</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in projects.data" :key="item.id">
                            <td>{{ item.name }}</td>
                            <td>
                              {{
                                item.users.length
                                  ? 'Limited to users: ' +
                                    item.users.map((item) => {
                                      return item.name
                                    })
                                  : 'All users can access this project'
                              }}
                            </td>
                            <td class="text-end">
                              <a
                                :class="
                                  canPerformAction('users', 'update')
                                    ? 'button v-button is-raised is-primary'
                                    : 'button v-button is-raised is-primary is-disabled'
                                "
                                @click="selectProject(item)"
                                >Manage access</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <Pagination :data="projects" @pagination-change-page="getProjects" />
                  </div>
                  <div v-else>
                    <p class="mt-3">No active projects found</p>
                  </div>
                </div>
              </div>
            </Transition>
            <Transition name="translate-page-y" mode="in-out">
              <div v-if="view === 'users'" class="account-box is-form is-footerless">
                <div class="form-head stuck-header">
                  <div class="form-head-inner">
                    <div class="left">
                      <h3>Users</h3>
                      <p>Manage users how have access to workspace</p>
                    </div>
                  </div>
                </div>
                <div class="form-body">
                  <div
                    v-if="
                      workspaceUsers && workspaceUsers.meta && workspaceUsers.meta.total
                    "
                  >
                    <div class="datatable-container">
                      <table class="table datatable-table is-fullwidth mb-0">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in workspaceUsers.data" :key="item.id">
                            <td>
                              <div class="flex-media">
                                <div class="v-avatar" alt="Avatar">
                                  <img class="avatar" :src="item.avatar" alt="" />
                                </div>
                                <div class="meta">
                                  <h3>{{ item.name }}</h3>
                                </div>
                              </div>
                            </td>
                            <td>{{ item.email }}</td>
                            <td>
                              <div
                                class="select is-flex is-justify-content-center is-align-items-center"
                              >
                                <select
                                  v-if="!item.owner"
                                  :disabled="!canPerformAction('users', 'update')"
                                  class="input v-input input v-input-sm"
                                  :value="item.role_id"
                                  @change="updateUserRole($event, item.id)"
                                >
                                  <option
                                    v-for="role in roles"
                                    :key="role.id"
                                    :value="role.id"
                                  >
                                    {{ role.title }}
                                  </option>
                                </select>
                                <select
                                  v-else
                                  v-tooltip="
                                    'Owner of workspace (Role can\'t be changed)'
                                  "
                                  class="input v-input input v-input-sm"
                                  disabled
                                >
                                  <option selected>Owner</option>
                                </select>
                              </div>
                            </td>
                            <td class="text-end">
                              <a
                                v-if="!item.owner"
                                :class="
                                  canPerformAction('users', 'delete')
                                    ? 'is-clickable'
                                    : 'disabled'
                                "
                                @click="deleteUser(item)"
                                ><i class="fa fa-trash has-text-danger"
                              /></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <Pagination
                        :data="workspaceUsers"
                        @pagination-change-page="getUsers"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <p class="mt-3">No users found</p>
                  </div>
                </div>
              </div>
            </Transition>
            <Transition name="translate-page-y" mode="in-out">
              <div v-if="view === 'invites'" class="account-box is-form is-footerless">
                <div class="form-head stuck-header">
                  <div class="form-head-inner">
                    <div class="left">
                      <h3>User invitation</h3>
                      <p>List of invited user statuses</p>
                    </div>
                  </div>
                </div>
                <div class="form-body">
                  <div
                    v-if="
                      workspaceInvites &&
                      workspaceInvites.meta &&
                      workspaceInvites.meta.total
                    "
                    class="datatable-container"
                  >
                    <table class="table datatable-table is-fullwidth mb-0">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Activated</th>
                          <th>Expired</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in workspaceInvites.data" :key="item.id">
                          <td>{{ item.email }}</td>
                          <td>{{ item.role ? item.role.title : '-' }}</td>
                          <td>{{ item.activated ? 'Yes' : 'No' }}</td>
                          <td>
                            {{ item.expired || item.activated ? 'Yes' : 'No' }}
                          </td>
                          <td class="text-end">
                            <a
                              v-if="!item.activated"
                              :class="
                                canPerformAction('users', 'delete')
                                  ? 'is-clickable'
                                  : 'disabled'
                              "
                              @click="deleteInvite(item)"
                              ><i class="fa fa-trash has-text-danger"
                            /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="mt-3">
                      <Pagination
                        :data="workspaceInvites"
                        @pagination-change-page="getInvites"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <p class="mt-3">No invitations found</p>
                  </div>
                </div>
              </div>
            </Transition>
            <Transition name="translate-page-y" mode="in-out">
              <div v-if="view === 'roles'" class="account-box is-form is-footerless">
                <div class="form-head stuck-header">
                  <div class="form-head-inner">
                    <div class="left">
                      <h3>Roles</h3>
                      <p>Manage roles for your workspace</p>
                    </div>
                    <div>
                      <button
                        :class="
                          canPerformAction('users', 'create')
                            ? 'button v-button is-bold is-big is-primary btn-sm'
                            : 'button v-button is-bold is-big is-primary btn-sm is-disabled'
                        "
                        style="flex: initial"
                        @click="selectRole(null)"
                      >
                        Add role
                      </button>
                    </div>
                  </div>
                </div>
                <div class="form-body">
                  <div class="datatable-container">
                    <table class="table datatable-table is-fullwidth mb-0">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in roles" :key="item.id">
                          <td>{{ item.title }}</td>
                          <td class="text-end">
                            <a
                              :class="
                                item.editable && canPerformAction('users', 'update')
                                  ? 'has-text-primary mr-2'
                                  : 'has-text-primary is-disabled mr-2'
                              "
                              @click="selectRole(item)"
                              ><i class="fa fa-pencil-alt"
                            /></a>
                            <a
                              :class="
                                item.editable && canPerformAction('users', 'delete')
                                  ? 'has-text-danger'
                                  : 'has-text-danger is-disabled'
                              "
                              @click="deleteRole(item)"
                              ><i class="fa fa-trash"
                            /></a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Transition>
            <Transition name="translate-page-y" mode="in-out">
              <div v-if="view === 'managers'" class="account-box is-form is-footerless">
                <div class="form-head stuck-header">
                  <div class="form-head-inner">
                    <div class="left">
                      <h3>License managers</h3>
                      <p>View information about your license managers</p>
                    </div>
                  </div>
                </div>
                <div class="form-body managers">
                  <div class="columns">
                    <div v-for="item in manager.users" :key="item.id" class="column is-3">
                      <div class="grid-item">
                        <VAvatar :picture="item.avatar" size="big" />
                        <h3 class="dark-inverted">
                          {{ item.name }}
                        </h3>
                        <p>{{ item.email }}</p>
                        <div class="button-wrap has-text-centered">
                          <router-link
                            class="button v-button is-dark-outlined is-raised"
                            :to="{
                              name: 'Support',
                            }"
                          >
                            Contact
                          </router-link>
                          <div v-if="workspace.user_id === item.id">
                            <a class="dark-inverted-hover">Primary manager</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div class="breadcrumb-wrapper">
      <VBreadcrumb :items="links" :center="true" />
    </div>

    <div v-if="showInviteModal">
      <VModal
        is="div"
        :open="true"
        :title="`Invite user to workspace: ` + workspace.name"
        size="big"
        @close="showInviteModal = false"
      >
        <template #content>
          <form class="my-4" @submit.prevent="invite" @keydown="form.onKeydown($event)">
            <div class="field mb-3 row">
              <label class="col-xl-3 col-lg-3 text-end mb-lg-0 has-text-left label"
                >Email</label
              >
              <div class="col-lg-9 col-xl-8">
                <input
                  v-model="form.email"
                  class="input v-input"
                  type="email"
                  placeholder="Enter email to send invite"
                />
                <HasError :form="form" field="email" />
                <HasError :form="form" field="users_limit" />
              </div>
            </div>

            <div class="field mb-3">
              <label class="col-xl-3 col-lg-3 text-end mb-lg-0 has-text-left label"
                >Role</label
              >
              <div class="col-lg-9 col-xl-8">
                <div class="select">
                  <select v-model="form.role_id" class="input v-input">
                    <option
                      v-for="selectRole in roles"
                      :key="selectRole.id"
                      :value="selectRole.id"
                    >
                      {{ selectRole.title }}
                    </option>
                  </select>
                </div>
                <HasError :form="form" field="role_id" />
              </div>
            </div>

            <FormButton
              :form="form"
              class="button v-button is-bold is-big is-raised is-primary mt-3"
              type="submit"
            >
              Send invite
            </FormButton>
          </form>
        </template>
      </VModal>
    </div>

    <div v-if="showRoleModal">
      <VModal
        is="div"
        :open="true"
        :title="formRole.id ? 'Edit role' : 'Create role'"
        size="big"
        @close="showRoleModal = false"
      >
        <template #content>
          <form
            class=""
            @submit.prevent="updateRole"
            @keydown="formRole.onKeydown($event)"
          >
            <div class="field">
              <label class="label">{{ $t('Name') }}</label>
              <input
                v-model="formRole.title"
                type="text"
                class="input v-input"
                placeholder="Enter role name"
              />
              <HasError :form="formRole" field="title" />
            </div>

            <div class="datatable-container">
              <table class="table datatable-table is-fullwidth mb-0">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>
                      View
                      <span
                        v-tooltip.bottom="'User will be able to view items'"
                        class="is-capitalized"
                      >
                        <i class="fa fa-question-circle" />
                      </span>
                    </th>
                    <th>
                      Create
                      <span
                        v-tooltip.bottom="'User will be able to create items'"
                        class="is-capitalized"
                      >
                        <i class="fa fa-question-circle" />
                      </span>
                    </th>
                    <th>
                      Update
                      <span
                        v-tooltip.bottom="'User will be able to update items'"
                        class="is-capitalized"
                      >
                        <i class="fa fa-question-circle" />
                      </span>
                    </th>
                    <th class="has-text-left">
                      Delete
                      <span
                        v-tooltip.bottom="'User will be able to delete items'"
                        class="is-capitalized"
                      >
                        <i class="fa fa-question-circle" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in formRole.permissions" :key="item.id">
                    <td>
                      {{ item.title }}
                    </td>
                    <td>
                      <label v-if="item.permissions.view.enabled" class="checkbox">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.view.value"
                          class="form-check-input"
                          type="checkbox"
                        />
                        <span />
                      </label>
                      <label v-else class="checkbox is-disabled">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.delete.value"
                          class="is-disabled"
                          type="checkbox"
                          disabled
                        />
                        <span />
                      </label>
                    </td>
                    <td>
                      <label v-if="item.permissions.create.enabled" class="checkbox">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.create.value"
                          class="form-check-input"
                          type="checkbox"
                        />
                        <span />
                      </label>
                      <label v-else class="checkbox is-disabled">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.delete.value"
                          class="is-disabled"
                          type="checkbox"
                          disabled
                        />
                        <span />
                      </label>
                    </td>
                    <td>
                      <label v-if="item.permissions.update.enabled" class="checkbox">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.update.value"
                          class="form-check-input"
                          type="checkbox"
                        />
                        <span />
                      </label>
                      <label v-else class="checkbox is-disabled">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.delete.value"
                          class="is-disabled"
                          type="checkbox"
                          disabled
                        />
                        <span />
                      </label>
                    </td>
                    <td class="has-text-left">
                      <label v-if="item.permissions.delete.enabled" class="checkbox">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.delete.value"
                          class="form-check-input"
                          type="checkbox"
                        />
                        <span />
                      </label>
                      <label v-else class="checkbox is-disabled">
                        <input
                          id="flexSwitchCheckDefault"
                          v-model="item.permissions.delete.value"
                          class="is-disabled"
                          type="checkbox"
                          disabled
                        />
                        <span />
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <FormButton
              :form="formRole"
              class="button v-button is-bold is-big is-raised is-primary btn-sm mt-3"
            >
              {{ formRole.id ? $t('Edit role') : $t('Create role') }}
            </FormButton>
          </form>
        </template>
      </VModal>
    </div>

    <div v-if="showProjectModal">
      <VModal
        is="div"
        :open="true"
        :title="formProject.name + ` access`"
        size="big"
        @close="showProjectModal = false"
      >
        <template #content>
          <div>
            <div class="app-search mb-3">
              <form role="search" @submit.prevent="search">
                <input
                  v-model="q"
                  type="search"
                  name="search"
                  class="input v-input top-search mb-0"
                  placeholder="Type text to search..."
                  @keypress="search"
                />
              </form>
            </div>

            <div v-if="items === null" class="has-text-centered mb-5 mt-5">
              <VLoader class="is-grey" :active="true">
                <div style="height: 200px" />
              </VLoader>
            </div>
            <div v-if="items && items.meta && items.meta.total">
              <form
                class=""
                @submit.prevent="saveProjectAccess"
                @keydown="formProject.onKeydown($event)"
              >
                <div class="datatable-container">
                  <table class="table datatable-table is-fullwidth mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items.data" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td class="text-end">
                          <button
                            type="button"
                            :class="[
                              isSelected(item.id)
                                ? 'button v-button is-primary'
                                : 'button v-button',
                            ]"
                            @click="selectProjectUser(item)"
                          >
                            {{ isSelected(item.id) ? 'Unselect user' : 'Select user' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <FormButton
                    :form="formProject"
                    class="button v-button is-bold is-big is-raised is-primary mt-3"
                    type="submit"
                  >
                    Save access
                  </FormButton>
                </div>
              </form>
            </div>
            <div v-else>
              <p v-if="!loading">No items found</p>
            </div>
          </div>
        </template>
      </VModal>
    </div>

    <AreYouSureModal ref="confirmDialogue" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '/@src/axios'

import { useMeta } from 'vue-meta'
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/components/bootstrap5'
import AreYouSureModal from '/@src/components/AreYouSureModal.vue'
import { debounce } from 'vue-debounce'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VBreadcrumb from '/@src/components/base/breadcrumb/VBreadcrumb.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VModal from '/@src/components/base/modal/VModal.vue'
import Pagination from '/@src/components/Pagination.vue'

export default {
  components: {
    VBreadcrumb,
    VAvatar,
    FormButton,
    HasError,
    AreYouSureModal,
    VLoader,
    VModal,
    Pagination,
  },
  mixins: [permissionsMixin],
  props: ['workspace'],
  setup() {
    useMeta({
      title: `Access`,
      bodyAttrs: {},
    })
  },
  data: () => ({
    links: [],
    roles: [],
    projects: [],
    selected: [],
    view: 'users',
    role: null,
    manager: null,
    items: null,
    showInviteModal: false,
    showRoleModal: false,
    showProjectModal: false,
    form: new Form({}),
    formRole: new Form({}),
    formUserRole: new Form({}),
    formProject: new Form({}),
    q: '',
  }),
  computed: {
    ...mapGetters(['workspaceInvites', 'workspaceUsers', 'loading', 'isMobile']),
  },
  async mounted() {
    this.$store.dispatch('showLoading')

    await Promise.all([
      this.getInvites(),
      this.getUsers(),
      this.getProjects(),
      this.getRoles(),
      this.getManagers(),
    ])
      .then(() => {
        this.links = [
          {
            label: 'Home',
            to: {
              name: 'Home',
            },
            active: false,
          },
          {
            label: 'Workspaces',
            to: {
              name: 'Workspaces',
            },
            active: false,
          },
          {
            label: this.workspace.name,
            to: {
              name: 'WorkspacesView',
              params: { id: this.workspace.id },
            },
            active: false,
          },
          {
            label: 'Access',
            to: {},
            active: true,
          },
        ]
      })
      .finally(() => {
        this.form.role_id = this.roles[0].id

        this.$store.dispatch('hideLoading')
      })

    this.search = debounce(() => {
      var url = `/workspace/${this.workspace.id}/users?q=${this.q}`
      axios
        .get(url)
        .then((res) => {
          this.items = res.data
          // if (res.data.meta.total === 1 && !this.q) {
          // 	this.select(res.data.data[0])
          // }
        })
        .catch(() => {})
    }, '500ms')
  },
  methods: {
    selectRole(data) {
      if (data) {
        this.formRole.id = data.id
        this.formRole.title = data.title
        this.formRole.permissions = data.permissions
      } else {
        this.formRole.id = null
        this.formRole.title = null
        this.formRole.permissions = this.roles[0].permissions
      }
      this.showRoleModal = true
    },
    selectProject(data) {
      if (data) {
        this.formProject.id = data.id
        this.formProject.name = data.name
      } else {
        this.formProject.id = null
        this.formProject.name = null
      }

      this.search()

      this.selected = data.users.map((item) => {
        return item.id
      })

      this.showProjectModal = true
    },

    selectProjectUser(item) {
      if (!this.isSelected(item.id)) {
        this.selected.push(item.id)
      } else {
        this.remove(this.selected.indexOf(item.id))
      }
      this.$forceUpdate()
    },
    remove(index) {
      this.selected.splice(index, 1)
    },
    isSelected(id) {
      let has = false
      this.selected.forEach((selected) => {
        if (id === selected) {
          has = true
        }
      })
      return has
    },
    getProjects(page = 1) {
      return axios
        .get('/project/?id=' + this.$route.params.id + '&filter=active&page=' + page)
        .then((res) => {
          this.projects = res.data
        })
        .catch(() => {})
    },
    getInvites(page = 1) {
      return axios
        .get('/workspace/' + this.$route.params.id + '/invites?page=' + page)
        .then((res) => {
          this.$store.dispatch('addWorkspaceInvites', res.data)
        })
        .catch(() => {})
    },
    getUsers(page = 1) {
      return axios
        .get('/workspace/' + this.$route.params.id + '/users?page=' + page)
        .then((res) => {
          this.$store.dispatch('addWorkspaceUsers', res.data)
        })
        .catch(() => {})
    },
    getRoles(page = 1) {
      return axios
        .get('/workspace/' + this.$route.params.id + '/roles?page=' + page)
        .then((res) => {
          this.roles = res.data.data
        })
        .catch(() => {})
    },
    getManagers() {
      return axios
        .get('/workspace/' + this.$route.params.id + '/license-manager')
        .then((res) => {
          this.manager = res.data.data
        })
        .catch(() => {})
    },

    async deleteInvite(item) {
      if (!this.canPerformAction('users', 'delete')) {
        return false
      }
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
          axios
            .delete('/workspace/' + this.$route.params.id + '/invites/' + item.id)
            .then(() => {
              this.getInvites()
            })
        }
      }
    },
    async deleteUser(item) {
      if (!this.canPerformAction('users', 'delete')) {
        return false
      }
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
          axios
            .delete('/workspace/' + this.$route.params.id + '/users/' + item.id)
            .then(() => {
              this.getUsers()
            })
            .catch((e) => {
              if (e.response.data.message) {
                alert(e.response.data.message)
              }
            })
        }
      }
    },
    async deleteRole(item) {
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
          axios
            .delete('/workspace/' + this.$route.params.id + '/roles/' + item.id)
            .then(() => {
              this.getRoles()
            })
            .catch((e) => {
              if (e.response.data.message) {
                alert(e.response.data.message)
              }
            })
        }
      }
    },
    invite() {
      return new Promise((resolve, reject) => {
        this.form
          .post('/workspace/' + this.$route.params.id + '/invites')
          .then(() => {
            this.showInviteModal = false
            this.form.email = ''
            this.getInvites()
            this.view = 'invites'
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    saveProjectAccess() {
      return new Promise((resolve, reject) => {
        this.formProject.users = this.selected

        this.formProject
          .put('/project/' + this.formProject.id + '/users')
          .then(() => {
            this.showProjectModal = false
            this.formProject.reset()
            this.getProjects()
            this.selected = []
            this.view = 'projects'
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    updateRole() {
      return new Promise((resolve, reject) => {
        let form
        if (this.formRole.id) {
          form = this.formRole.put(
            '/workspace/' + this.$route.params.id + '/roles/' + this.formRole.id
          )
        } else {
          form = this.formRole.post('/workspace/' + this.$route.params.id + '/roles')
        }

        form
          .then(() => {
            this.showRoleModal = false
            this.formRole.reset()
            this.getRoles()
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    updateUserRole(event, userId) {
      return new Promise((resolve, reject) => {
        this.formUserRole.role_id = event.target.value

        let form = this.formUserRole.put(
          '/workspace/' + this.$route.params.id + '/users/' + userId
        )

        form
          .then(() => {
            this.formUserRole.reset()
            this.getUsers()
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
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

.managers {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }

  .grid-item {
    position: relative;

    @include vuero-card--dark;

    text-align: center;

    padding: 25px 20px 10px 20px;

    border: 1px solid var(--dark-sidebar-light-12);

    &:hover,
    &:focus {
      .button-wrap {
        > div {
          a {
            opacity: 1;
            pointer-events: all;
          }
        }
      }
    }

    > .v-avatar {
      display: block;
      margin: 0 auto 4px;
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.85rem;
    }

    .button-wrap {
      margin: 20px 0 0;

      .v-button {
        width: 100%;
        max-width: 140px;
        margin: 0 auto;
      }

      > div {
        margin: 6px 0 0;

        a {
          opacity: 0;
          pointer-events: none;
          color: var(--light-text);
          font-weight: 500;
          font-size: 0.9rem;
          transition:
            opacity 0.3s,
            color 0.3s;

          &:hover,
          &:focus {
            color: var(--primary);
          }
        }
      }
    }
  }
}

.account-wrapper {
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

