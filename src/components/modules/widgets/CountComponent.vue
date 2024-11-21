<template>
  <div :class="badgeClass">
    <div class="card-body card-body-count" style="border-color: transparent">
      <h5 class="mt-0 mb-2">
        {{ title }}
      </h5>
      <h6 v-if="loading" class="placeholder-glow">
        <span class="placeholder is-2 column p-0" />
      </h6>
      <h6 v-else class="mb-0 fw-bold">
        {{ count }}
      </h6>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'count', 'status', 'loading'],
  data: () => ({
    badgeClass: null,
  }),
  mounted() {
    if (this.status === 'medium') {
      this.badgeClass = 'card has-background-warning'
    } else if (this.status === 'low') {
      this.badgeClass = 'card has-background-info'
    } else if (this.status === 'success') {
      this.badgeClass = 'card has-background-success'
    } else if (this.status === 'high') {
      this.badgeClass = 'card has-background-danger'
    } else if (this.status === 'critical') {
      this.badgeClass = 'card has-background-critical'
    } else if (this.status === 'info') {
      this.badgeClass = 'card has-background-light'
    } else {
      this.badgeClass = 'card'
    }
  },
}
</script>
