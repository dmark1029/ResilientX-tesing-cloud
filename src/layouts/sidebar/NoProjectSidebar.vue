<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [permissionsMixin],
  props: ['module'],
  emits: ['close'],
  computed: {
    ...mapGetters(['user', 'workspace', 'general', 'isOpened', 'openedSide', 'isMobile']),
  },
}
</script>

<template>
  <li>
    <a> No project selected </a>
  </li>
</template>

<style lang="scss">
@import '/@src/scss/layout/sidebar-panel';
</style>
