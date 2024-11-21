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
      if (this.status.toLowerCase() === 'fail') {
        this.badgeClass = 'tag is-danger is-capitalized'
      } else if (this.status.toLowerCase() === 'pass') {
        this.badgeClass = 'tag is-success is-capitalized'
      } else if (this.status.toLowerCase() === 'info') {
        this.badgeClass = 'tag is-info is-capitalized'
      }
    },
  },
}
</script>
