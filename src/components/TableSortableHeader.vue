<template>
  <th class="is-clickable" @click="changeSort">
    {{ title }}
    <i
      :class="
        sort === slug || sort === '-' + slug
          ? sort.includes('-')
            ? 'ms-1 fa fa-sort-down'
            : 'ms-1 fa fa-sort-up'
          : 'ms-1 fa fa-sort'
      "
    />
  </th>
</template>

<script>
export default {
  props: ['sort', 'title', 'slug'],
  emits: ['change-sort'],
  methods: {
    changeSort() {
      this.$emit('change-sort', this.sort.includes('-') ? this.slug : '-' + this.slug)
    },
  },
}
</script>
<style lang="scss" scoped>
th {
  font-family: Poppins;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
  text-transform: capitalize;
}
</style>