<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <router-link
        :to="{ name: 'WorkspacesView', params: { id: item.id } }"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-eye" />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View workspace</span>
        </div>
      </router-link>
      <a
        role="menuitem"
        :class="
          canPerformAction('workspaces', 'update', item)
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="
          ($event) => {
            $event.target.blur()
            editWorkspace(item)
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-pencil-alt" />
        </div>
        <div class="meta">
          <span>Edit</span>
          <span>Edit workspace</span>
        </div>
      </a>
      <hr class="dropdown-divider" />
      <a
        role="menuitem"
        :class="
          canPerformAction('users', 'update', item)
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="
          ($event) => {
            navigateToWorkspaceUsers(item)
            $event.target.blur()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-user" />
        </div>
        <div class="meta">
          <span>Access</span>
          <span>Manage workspace access</span>
        </div>
      </a>
      <a
        role="menuitem"
        :class="
          canPerformAction('licenses', 'view', item)
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="
          ($event) => {
            navigateToWorkspaceLicenses(item)
            $event.target.blur()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-file" />
        </div>
        <div class="meta">
          <span>Licenses</span>
          <span>Manage workspace license</span>
        </div>
      </a>
      <a
        role="menuitem"
        :class="
          canPerformAction('workspaces', 'update', item)
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="
          ($event) => {
            navigateToWorkspaceSettings(item)
            $event.target.blur()
          }
        "
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-cog" />
        </div>
        <div class="meta">
          <span>Settings</span>
          <span>Manage workspace settings</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown },
  mixins: [permissionsMixin],
  props: ['item'],
  emits: ['edit'],
  methods: {
    navigateToWorkspace(workspace) {
      this.$router.push({
        name: 'WorkspacesView',
        params: { id: workspace.id },
      })
    },
    navigateToWorkspaceUsers(workspace) {
      this.$router.push({
        name: 'WorkspaceUsersView',
        params: { id: workspace.id },
      })
    },
    navigateToWorkspaceLicenses(workspace) {
      this.$router.push({
        name: 'WorkspaceLicensesView',
        params: { id: workspace.id },
      })
    },
    navigateToWorkspaceSettings(workspace) {
      this.$router.push({
        name: 'WorkspaceSettingsView',
        params: { id: workspace.id },
      })
    },
    editWorkspace(item) {
      this.$emit('edit', item)
    },
  },
}
</script>
