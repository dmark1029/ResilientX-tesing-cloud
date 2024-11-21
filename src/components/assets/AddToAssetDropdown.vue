<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <a
        :class="
          canPerformAction('assets', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click="add"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-plus" />
        </div>
        <div class="meta">
          <span>{{ loading ? 'Adding..' : 'Add' }}</span>
          <span>{{ text }}</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown },
  mixins: [permissionsMixin],
  props: ['item', 'type'],
  data: () => ({
    form: new Form({}),
    loading: false,
    success: false,
    text: 'Add to assets',
  }),
  computed: {
    ...mapGetters(['project']),
  },
  methods: {
    add() {
      this.form.project_id = this.project.id
      this.form.tags = []
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'
      this.form.priority = 'normal'
      this.form.name = this.item[this.type]
      this.form.type = this.type

      if (this.type === 'ip') {
        this.form.type = 'ipv4'
        this.form.value = this.item[this.type]
      }

      if (this.type === 'subdomain') {
        this.form.type = 'domain'
        this.form.value = this.item[this.type]
      }

      this.loading = true

      return new Promise((resolve, reject) => {
        this.form
          .post('/asset')
          .then((res) => {
            const { data } = res.data
            this.text = 'Asset added'
            this.success = true

            setTimeout(() => {
              this.loading = false
              this.text = 'Add to assets'
            }, 2000)
            resolve(data)
          })
          .catch((e) => {
            this.success = false
            if (e.response.status === 422) {
              this.text = 'Asset already exists'
            } else {
              this.text = 'Error occured'
            }

            setTimeout(() => {
              this.loading = false
              this.text = 'Add to assets'
            }, 2000)
            reject()
          })
      })
    },
  },
}
</script>
