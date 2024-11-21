<template>
  <VModal is="div" :open="true" title="Assign user" size="big" @close="$emit('close')">
    <template #content>
      <div>
        <div class="app-search mb-3">
          <form role="search" @submit.prevent="search">
            <input
              v-model="q"
              type="search"
              name="search"
              class="input v-input top-search mb-0"
              placeholder="Type text to search..."
              @keypress="search"
            />
          </form>
        </div>

        <div v-if="items === null" class="has-text-centered mb-5 mt-5">
          <VLoader :active="true">
            <div style="height: 200px" />
          </VLoader>
        </div>
        <div v-if="items && items.meta && items.meta.total">
          <form
            class=""
            @submit.prevent="saveProjectAccess"
            @keydown="form.onKeydown($event)"
          >
            <div class="datatable-container">
              <table class="table datatable-table is-fullwidth mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in items.data" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td class="text-end">
                      <button
                        type="button"
                        :class="[
                          isSelected(item.id)
                            ? 'button v-button is-primary'
                            : 'button v-button',
                        ]"
                        @click="selectProjectUser(item)"
                      >
                        {{ isSelected(item.id) ? 'Unselect user' : 'Select user' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <FormButton
                :form="form"
                class="button v-button is-bold is-big is-raised is-primary mt-3"
                type="submit"
              >
                Save assignee
              </FormButton>
            </div>
          </form>
        </div>
        <div v-else>
          <p v-if="!loading">No items found</p>
        </div>
      </div>
    </template>
  </VModal>
</template>

<script>
import { axios } from '/@src/axios'
import Form from '/@src/form'
import { Button as FormButton } from 'vform/components/bootstrap5'
import { debounce } from 'vue-debounce'
import permissionsMixin from '../../mixins/permissionsMixin.js'
import VLoader from '/@src/components/base/loader/VLoader.vue'
import VModal from '/@src/components/base/modal/VModal.vue'

export default {
  components: {
    FormButton,
    VLoader,
    VModal,
  },
  mixins: [permissionsMixin],
  props: ['project', 'issue'],
  emits: ['close'],
  data: () => ({
    form: new Form({}),
    q: '',
    items: null,
    loading: false,
    selected: null,
  }),
  async mounted() {
    this.search = debounce(() => {
      var url = `/workspace/${this.project.workspace.id}/users?q=${this.q}`
      axios
        .get(url)
        .then((res) => {
          this.items = res.data
          // if (res.data.meta.total === 1 && !this.q) {
          // 	this.select(res.data.data[0])
          // }
        })
        .catch(() => {})
    }, '500ms')

    this.selected = this.issue.user_id

    this.search()
  },
  methods: {
    selectProjectUser(item) {
      if (this.selected === item.id) {
        this.selected = null
      } else {
        this.selected = item.id
      }
    },
    remove() {
      this.selected = null
    },
    isSelected(id) {
      return this.selected === id
    },
    saveProjectAccess() {
      return new Promise((resolve, reject) => {
        this.form.assignee = this.selected
        this.form.status = this.issue.status

        this.form
          .put('/issue/' + this.issue.id)
          .then(() => {
            this.$emit('close')
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
  },
}
</script>
