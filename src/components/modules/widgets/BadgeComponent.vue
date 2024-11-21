<template>
  <div class="card" />
</template>

<script>
export default {
  props: ['cvss'],
  data() {
    return {
      sortDirection: 1,
      sortBy: 'name',
      tableResponsiveStyle: {
        'max-height': '600px',
      },
    }
  },
  mounted() {
    if (this.height) {
      this.tableResponsiveStyle = {
        'max-height': this.height + 'px',
      }
    }
  },
  methods: {
    sort(head) {
      this.sortBy = head
      this.sortDirection *= -1
    },
    sortMethods(type, head, direction) {
      switch (type) {
        case 'String': {
          return direction === 1
            ? (a, b) => (b[head] > a[head] ? -1 : a[head] > b[head] ? 1 : 0)
            : (a, b) => (a[head] > b[head] ? -1 : b[head] > a[head] ? 1 : 0)
        }
        case 'Number': {
          return direction === 1
            ? (a, b) => Number(b[head]) - Number(a[head])
            : (a, b) => Number(a[head]) - Number(b[head])
        }
      }
    },
  },
}
</script>
