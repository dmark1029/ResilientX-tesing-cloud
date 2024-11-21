<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'
import VAvatar from '/@src/components/base/avatar/VAvatar.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown, VButton, VAvatar },
  computed: {
    ...mapGetters(['user', 'project', 'workspace']),
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
  },
}
</script>

<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a
        v-if="user"
        role="button"
        tabindex="0"
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @keydown.space.prevent="toggle"
        @click="toggle"
      >
        <VAvatar :picture="user.avatar" />

        <div class="meta">
          <div>{{ user.name }}</div>
          <div class="email">{{ user.email }}</div>
        </div>
      </a>
    </template>

    <template #content="{ toggle }">
      <div v-if="user" class="dropdown-head" @click="toggle">
        <VAvatar size="large" :picture="user.avatar" />

        <div class="meta">
          <span>{{ user.name }}</span>
          <span>{{ user.email }}</span>
        </div>
      </div>

      <router-link
        :to="{ name: 'Profile' }"
        role="menuitem"
        class="dropdown-item is-media"
        @click.capture="toggle"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-cogs" />
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <router-link
        v-if="workspace"
        :to="{ name: 'WorkspacesView', params: { id: workspace.id } }"
        role="menuitem"
        class="dropdown-item is-media"
        @click.capture="toggle"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-archive" />
        </div>
        <div class="meta">
          <span>Projects</span>
          <span>View all your projects</span>
        </div>
      </router-link>

      <router-link
        v-if="workspace"
        :to="{ name: 'Workspaces' }"
        role="menuitem"
        class="dropdown-item is-media"
        @click.capture="toggle"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-globe" />
        </div>
        <div class="meta">
          <span>Workspaces</span>
          <span>View all your workspaces</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <div class="pl-5 pr-5 pb-2 pt-2">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="logout"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
