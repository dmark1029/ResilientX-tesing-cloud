<template>
  <span
    v-tooltip="'Favorite'"
    class="favorite mr-2 d-inline is-clickable"
    @click.stop.prevent="$event.target.blur()"
  >
    <i :class="[value ? 'fas fa-star' : 'far fa-star']" @click="toggleStatus" />
  </span>
</template>

<script>
import { axios } from '/@src/axios'
import { mapGetters } from 'vuex'

export default {
  props: ['type', 'id', 'value'],
  emits: ['saved'],
  computed: {
    ...mapGetters(['workspace']),
  },
  methods: {
    toggleStatus() {
      return new Promise((resolve, reject) => {
        if (this.value) {
          axios
            .delete('/favorite/' + this.type + '/' + this.value)
            .then(() => {
              this.$emit('saved')
              resolve()
            })
            .catch(() => {
              reject()
            })
        } else {
          axios
            .post('/favorite', {
              type: this.type,
              id: this.id,
              workspace_id: this.workspace.id,
            })
            .then(() => {
              this.$emit('saved')
              resolve()
            })
            .catch(() => {
              reject()
            })
        }
      })
    },
  },
}
</script>
