<template>
  <div :class="badgeClass">
    {{ status }}
  </div>
  <div
    v-if="status === 'pending' && glow"
    v-tooltip="`Checking scan status`"
    role="status"
  >
    <span class="spinner-grow spinner-grow-xs has-text-warning ml-2"></span>
  </div>
  <div
    v-if="status === 'started' && glow"
    v-tooltip="`Checking scan status`"
    role="status"
  >
    <span class="spinner-grow spinner-grow-xs has-text-info ml-2"></span>
  </div>
</template>

<script>
export default {
  props: ['status', 'glow'],
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
        this.badgeClass = 'tag is-warning is-capitalized is-hidden-mobile'
      } else if (this.status === 'started') {
        this.badgeClass = 'tag is-info is-capitalized is-hidden-mobile'
      } else if (this.status === 'success') {
        this.badgeClass = 'tag is-success is-capitalized is-hidden-mobile'
      } else if (this.status === 'failed') {
        this.badgeClass = 'tag is-danger is-capitalized is-hidden-mobile'
      } else if (this.status === 'queued') {
        this.badgeClass = 'tag is-capitalized is-hidden-mobile'
      } else {
        this.badgeClass = 'tag is-danger is-capitalized is-hidden-mobile'
      }
    },
  },
}
</script>
