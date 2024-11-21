<template>
  <v-chip :class="badgeClass" class="badge">
    {{ priority }}
  </v-chip>
</template>

<script>
export default {
  props: ['priority'],
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
      if (this.priority.toLowerCase() === 'critical') {
        this.badgeClass = 'tag is-critical is-capitalized'
      } else if (this.priority.toLowerCase() === 'high') {
        this.badgeClass = 'tag is-danger is-capitalized'
      } else if (this.priority.toLowerCase() === 'medium') {
        this.badgeClass = 'tag is-warning is-capitalized has-text-white'
      } else if (this.priority.toLowerCase() === 'low') {
        this.badgeClass = 'tag is-info is-capitalized'
      } else if (this.priority.toLowerCase() === 'noise') {
        this.badgeClass = 'tag is-light is-capitalized'
      }
    },
  },
}
</script>
