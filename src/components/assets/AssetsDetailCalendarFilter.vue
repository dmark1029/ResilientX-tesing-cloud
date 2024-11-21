<template>
  <div v-if="data?.length" class="mr-3">
    <div class="select">
      <select v-model="pickedDate" class="form-select">
        <option v-for="item in data" :key="item.date" :value="item.date">
          {{ convertDateFormat(item.date) }}
        </option>
      </select>
    </div>
  </div>
  <div v-else class="mr-3">
    <div class="select">
      <select class="form-select" disabled>
        <option>-</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data', 'selectedDate'],
  emits: ['taskDateChanged'],
  data: () => ({
    showModal: false,
    pickedDate: null,
  }),
  watch: {
    pickedDate: function () {
      if (this.selectedDate !== this.pickedDate) {
        this.$emit('taskDateChanged', this.pickedDate)
      }
    },
  },
  async mounted() {
    this.pickedDate = this.selectedDate
  },
  methods: {
    convertDateFormat(dateString) {
      const parts = dateString.split('-')

      return parts[2] + '.' + parts[1] + '.' + parts[0]
    },
    formatDateToYMD(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },
}
</script>

<style lang="scss" scoped>
.v3dp__input_wrapper {
  display: none !important;
}
</style>