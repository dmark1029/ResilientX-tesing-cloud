<template>
  <v-chip :class="badgeClass" class="badge">
    {{ severity }}
  </v-chip>
</template>

<script>
export default {
  props: ['severity'],
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
      if (this.severity.toLowerCase() === 'critical') {
        this.badgeClass = 'tag is-critical is-capitalized'
      } else if (this.severity.toLowerCase() === 'high') {
        this.badgeClass = 'tag is-danger is-capitalized'
      } else if (this.severity.toLowerCase() === 'medium') {
        this.badgeClass = 'tag is-warning is-capitalized has-text-white'
      } else if (this.severity.toLowerCase() === 'low') {
        this.badgeClass = 'tag is-info is-capitalized'
      } else if (this.severity.toLowerCase() === 'noise') {
        this.badgeClass = 'tag is-light is-capitalized'
      }
    },
  },
}
</script>
