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
      if (this.status === 'pending') {
        this.badgeClass = 'tag is-info is-capitalized'
      } else if (this.status === 'completed') {
        this.badgeClass = 'tag is-success is-capitalized'
      } else {
        this.badgeClass = 'tag is-warning is-capitalized'
      }
    },
  },
}
</script>
