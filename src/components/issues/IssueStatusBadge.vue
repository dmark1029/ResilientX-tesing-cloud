<template>
  <v-chip :class="badgeClass" class="badge">
    {{ status }}
  </v-chip>
</template>

<script>
export default {
  props: ['status'],
  data: () => ({
    badgeClass: null,
  }),
  watch: {
    status: function () {
      this.setClass()
    },
  },
  mounted() {
    this.setClass()
  },
  methods: {
    setClass() {
      if (this.status.toLowerCase() === 'open') {
        this.badgeClass = 'tag is-danger is-capitalized has-text-white'
      } else if (this.status.toLowerCase() === 'in progress') {
        this.badgeClass = 'tag is-progress is-capitalized'
      } else if (this.status.toLowerCase() === 'risk accepted') {
        this.badgeClass = 'tag is-warning is-capitalized'
      } else if (this.status.toLowerCase() === 'closed') {
        this.badgeClass = 'tag is-closed is-capitalized'
      } else if (this.status.toLowerCase() === 'false positive') {
        this.badgeClass = 'tag is-light is-capitalized'
      }
    },
  },
}
</script>
