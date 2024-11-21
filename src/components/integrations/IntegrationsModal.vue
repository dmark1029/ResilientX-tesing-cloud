<template>
  <VModal is="div" :open="true" :title="title" size="big" @close="$emit('closeModal')">
    <template #content>
      <Component
        :is="component"
        v-if="component"
        :project="project"
        :integration="integration"
      />
    </template>
  </VModal>
</template>

<script>
import { mapGetters } from 'vuex'
import { defineAsyncComponent } from 'vue'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: { VModal },
  props: ['integration', 'project', 'title'],
  emits: ['closeModal'],
  computed: {
    ...mapGetters(['general']),
    component() {
      return defineAsyncComponent(
        () => import(`./integrations/${this.integration.value}.vue`)
      )
    },
  },
  mounted() {},
  methods: {
    save() {
      this.send()
        .then(() => {
          this.$emit('closeModal')
        })
        .catch(() => {})
    },
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/asset/' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/asset')
      }
      return new Promise((resolve, reject) => {
        form
          .then((res) => {
            const { data } = res.data
            resolve(data)
          })
          .catch(() => {
            reject()
          })
      })
    },
    handleChangeTag(tags) {
      this.form.tags = tags
    },
    classSelected(value) {
      if (value === 'low') {
        value = 'info'
      }
      if (value === 'normal') {
        value = 'warning'
      }
      if (value === 'high') {
        value = 'danger'
      }

      return 'btn btn-' + value + ' d-block mb-2'
    },
    classUnselected(value) {
      if (value === 'low') {
        value = 'info'
      }
      if (value === 'normal') {
        value = 'warning'
      }
      if (value === 'high') {
        value = 'danger'
      }

      return 'btn btn-outline-' + value + ' d-block mb-2'
    },
  },
}
</script>
