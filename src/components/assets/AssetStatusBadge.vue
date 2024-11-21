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
      if (this.status === 'normal') {
        this.badgeClass = 'tag is-warning is-capitalized'
      } else if (this.status === 'low') {
        this.badgeClass = 'tag is-info is-capitalized'
      } else if (this.status === 'high') {
        this.badgeClass = 'tag is-danger is-capitalized'
      }
    },
  },
}
</script>
