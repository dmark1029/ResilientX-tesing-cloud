<script setup lang="ts">
import { useDropdown } from '/@src/composable/useDropdown'
import { ref } from 'vue'

const dropdownElement = ref<HTMLElement>()
const dropdown = useDropdown(dropdownElement)
</script>

<template>
  <div class="toolbar-notifications is-hidden-mobile">
    <div
      ref="dropdownElement"
      class="dropdown is-spaced is-dots is-right dropdown-trigger"
    >
      <div
        tabindex="0"
        class="is-trigger"
        aria-haspopup="true"
        @click="dropdown.toggle"
        @keydown.space.prevent="dropdown.toggle"
      >
        <i aria-hidden="true" class="fa fa-bell" />
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <div class="heading">
            <div class="heading-left">
              <h6 class="heading-title">Notifications</h6>
            </div>
          </div>
          <ul class="notification-list">
            <li>
              <a class="notification-item">
                <div class="user-content">
                  <p class="time">No notifications found</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
