<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <a
        role="menuitem"
        class="dropdown-item is-media"
        @click.stop.prevent="navigateToProject(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-eye" />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View project</span>
        </div>
      </a>

      <a
        role="menuitem"
        :class="
          canPerformAction('projects', 'update', item.workspace)
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
          <span>{{ $t('Edit') }}</span>
          <span>Edit project</span>
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
    canViewProject(project) {
      if (this.user.type === 'LicenseManager') {
        return true
      }

      if (project.workspace.owner) {
        return true
      }

      if (project.users.length) {
        if (project.users.filter((e) => e.id === this.user.id).length === 0) {
          return false
        }
      }

      return true
    },
    navigateToProject(project) {
      if (!this.canViewProject(project)) {
        return false
      }

      this.$router.push({
        name: 'ProjectOverview',
        params: { id: project.id },
      })
    },
    editWorkspace(item) {
      this.$emit('edit', item)
    },
  },
}
</script>
