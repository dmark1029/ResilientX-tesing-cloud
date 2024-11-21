<template>
  <v-chip v-if="impact" :class="badgeClass" class="badge">
    {{ impact }}
  </v-chip>
  <div v-else>{{ impact ?? '-' }}</div>
</template>

<script>
export default {
  props: ['impact'],
  data: () => ({
    badgeClass: null,
  }),
  watch: {
    impact: function () {
      this.setClass()
    },
  },
  mounted() {
    this.setClass()
  },
  methods: {
    setClass() {
      if (this.impact === 'Poor') {
        this.badgeClass = 'tag is-progress'
      } else if (this.impact === 'Fair') {
        this.badgeClass = 'tag is-warning'
      } else if (this.impact === 'Good') {
        this.badgeClass = 'tag is-closed'
      } else if (this.impact === 'Excellent') {
        this.badgeClass = 'tag is-capitalized has-text-white'
      } else if (this.impact === 'Bad') {
        this.badgeClass = 'tag is-danger has-text-white'
      }

      this.badgeClass = this.badgeClass + '  has-background-' + this.impact?.toLowerCase()
    },
  },
}
</script>