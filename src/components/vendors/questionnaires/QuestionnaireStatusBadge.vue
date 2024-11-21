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
      if (this.status === 'Active') {
        this.badgeClass = 'tag is-success is-capitalized'
      } else {
        this.badgeClass = 'tag is-capitalized'
      }
    },
  },
}
</script>
