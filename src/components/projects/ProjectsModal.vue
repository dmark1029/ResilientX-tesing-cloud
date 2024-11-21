<template>
  <VModal
    is="div"
    :open="true"
    :title="editable ? `Edit project` : `Create project`"
    size="big"
    @close="$emit('closeModal')"
  >
    <template #content>
      <form @submit.prevent="save" @keydown="form.onKeydown($event)">
        <div class="field">
          <label class="label">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="input v-input"
            placeholder="Enter project name"
          />
          <HasError :form="form" field="name" />
          <HasError :form="form" field="projects_limit" />
        </div>
        <div class="columns">
          <div class="column is-6">
            <div class="field">
              <label class="label">Tags</label>
              <Vue3TagsInput
                :tags="form.tags"
                placeholder="Enter tags"
                @on-tags-changed="handleChangeTag"
              />
              <HasError :form="form" field="tags" />
            </div>
          </div>
        </div>
        <div class="modal-card-foot">
          <button
            type="button"
            class="button v-button is-white btn-sm"
            @click="$emit('closeModal')"
          >
            Close
          </button>
          <FormButton :form="form" class="button v-button is-primary btn-sm">
            {{ editable ? $t('Edit project') : $t('Create project') }}
          </FormButton>
        </div>
      </form>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { Button as FormButton, HasError } from 'vform/src/components/bootstrap5'
import { mapGetters } from 'vuex'
import Vue3TagsInput from 'vue3-tags-input'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    VModal,
    FormButton,
    HasError,
    Vue3TagsInput,
  },
  props: ['editable', 'workspace'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
  }),
  computed: {
    ...mapGetters(['general']),
  },
  mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.status = this.editable.status
      this.form.tags = this.editable.tags
    } else {
      this.form.workspace_id = this.workspace.id
      this.form.status = 'active'
    }
  },
  methods: {
    save() {
      this.send()
        .then(() => {
          window.location.reload()
          //this.$emit("closeModal");
        })
        .catch(() => {})
    },
    send() {
      let form
      if (this.editable) {
        form = this.form.post('/project/' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/project')
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
  },
}
</script>
