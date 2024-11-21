<template>
  <div :class="badgeClass">
    {{ status }}
  </div>
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
      if (this.status.toLowerCase() === 'opened') {
        this.badgeClass = 'tag is-danger is-capitalized'
      } else if (this.status.toLowerCase() === 'closed') {
        this.badgeClass = 'tag is-light is-capitalized'
      }
    },
  },
}
</script>
