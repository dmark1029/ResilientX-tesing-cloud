<template>
  <VModal
    is="form"
    :open="true"
    title="Add to assets"
    size="big"
    actions="right"
    @close="$emit('closeModal')"
  >
    <template #content>
      <VLoader v-if="loading" :active="true">
        <div style="height: 300px"></div>
      </VLoader>
      <div>
        <form
          v-if="data && data.meta && data.meta.total"
          @submit.prevent="save"
          @keydown="form.onKeydown($event)"
        >
          <div class="datatable-container">
            <table class="table datatable-table is-fullwidth mb-0">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>
                    <a @click="selectAll()">{{
                      items.length ? 'Unselect all' : 'Select all'
                    }}</a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data.data" :key="item.id">
                  <td>{{ item.data[type] }}</td>
                  <td>
                    <label class="checkbox">
                      <input v-model="items" :value="item.data[type]" type="checkbox" />
                      <span />
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!data.meta.total">
            <p>No data available</p>
          </div>

          <div class="mt-3">
            <Pagination :limit="1" :data="data" @pagination-change-page="getData" />
          </div>

          <div v-if="text">
            <p class="mb-0 mt-5"><b>Results:</b></p>
            <p class="mb-5">{{ text }}</p>
          </div>

          <div class="modal-card-foot">
            <FormButton :form="form" class="button v-button is-primary btn-sm">
              {{ $t('Add to assets') }}
            </FormButton>
          </div>
        </form>
      </div>
    </template>
  </VModal>
</template>

<script>
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import { Button as FormButton } from 'vform/src/components/bootstrap5'
import VModal from '/@src/components/base/modal/VModal.vue'
import Pagination from '/@src/components/Pagination.vue'
import VLoader from '/@src/components/base/loader/VLoader.vue'

export default {
  components: {
    Pagination,
    VModal,
    FormButton,
    VLoader,
  },
  props: {
    url: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    items: [],
    data: null,
    loading: true,
    text: '',
  }),
  computed: {
    ...mapGetters(['general', 'project']),
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData(page = 1) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.form
          .get(this.url + '&page=' + page)
          .then((res) => {
            this.data = res.data
            this.loading = false
            resolve(res)
          })
          .catch(() => {
            reject()
          })
      })
    },
    selectAll() {
      if (this.items.length) {
        this.items = []
      } else {
        this.items = []

        this.data.data.forEach((item) => {
          this.items.push(item.data[this.type])
        })
      }
    },
    save() {
      this.text = ''

      if (!this.items.length) {
        return
      }

      this.items.forEach((item) => {
        this.form.project_id = this.project.id
        this.form.tags = []
        this.form.status = 'active'
        this.form.business_impact = 'Moderate'
        this.form.priority = 'normal'
        this.form.name = item
        this.form.type = this.type

        if (this.type === 'ip') {
          this.form.type = 'ipv4'
          this.form.value = item
        }

        if (this.type === 'subdomain') {
          this.form.type = 'domain'
          this.form.value = item
        }

        this.loading = true

        this.form
          .post('/asset')
          .then(() => {
            // this.text = `${this.text}, Add to assets: ${item}`
          })
          .catch((e) => {
            if (e.response.status === 422) {
              // this.text = `${this.text}, Asset already exists: ${item}`
            } else {
              this.text = `${this.text}, Error occurred: ${item}`
            }
          })
      })

      if (!this.text) {
        this.text = 'Assets synchronized successfully'
      }

      setTimeout(() => {
        this.items = []
        this.text = ''
      }, 8000)

      this.loading = false
    },
  },
}
</script>
