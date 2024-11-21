<template>
  <v-chip :class="badgeClass" class="badge">
    {{ impact }}
  </v-chip>
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
      if (this.impact === 'Minimal') {
        this.badgeClass = 'tag is-capitalized'
      } else if (this.impact === 'Minor') {
        this.badgeClass = 'tag is-info is-capitalized'
      } else if (this.impact === 'Moderate') {
        this.badgeClass = 'tag is-warning is-capitalized'
      } else if (this.impact === 'Significant') {
        this.badgeClass = 'tag is-danger is-capitalized'
      } else if (this.impact === 'Severe') {
        this.badgeClass = 'tag is-critical is-capitalized'
      }
    },
  },
}
</script>
