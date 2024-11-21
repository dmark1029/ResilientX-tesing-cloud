<template>
  <div>
    <VModal
      is="form"
      :open="true"
      title="Manage assets"
      size="big"
      actions="right"
      @submit.prevent="false"
      @close="$emit('closeModal')"
    >
      <template #content>
        <CollectionsAssetsComponent :collection="editable" />
      </template>
    </VModal>
  </div>
</template>

<script>
import Form from '/@src/form'
import { mapGetters } from 'vuex'
import VModal from '/@src/components/base/modal/VModal.vue'
import CollectionsAssetsComponent from '/@src/components/collections/CollectionsAssetsComponent.vue'

export default {
  components: { CollectionsAssetsComponent, VModal },
  props: ['editable', 'project'],
  emits: ['closeModal'],
  data: () => ({
    form: new Form({}),
    set: false,
    showModal: false,
    q: '',
    watchTaskDelay: 4000,
    loading: false,
  }),
  computed: {
    ...mapGetters(['general']),
  },
  async mounted() {
    if (this.editable) {
      this.form.name = this.editable.name
      this.form.assets = this.editable.assets
      this.form.monitors = {}
      this.form.status = this.editable.status

      this.general.monitors.forEach((tool) => {
        const existing = this.editable.schedules.find(
          (item) => item.monitor === tool.slug
        )

        this.form.monitors[tool.slug] = {
          on: !!existing,
          schedule: existing ? existing.type : 'weeklyOn',
          discovery: existing ? existing.values?.discovery : false,
        }
      })
    } else {
      this.form.name = ''
      this.form.project_id = this.project.id
      this.form.monitors = {}
      this.form.assets = []
      this.form.status = 'active'
      this.form.business_impact = 'Moderate'

      this.general.monitors.forEach((tool) => {
        this.form.monitors[tool.slug] = {
          on: false,
          schedule: 'weeklyOn',
          discovery: false,
        }
      })
    }

    this.set = true
  },
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
        form = this.form.post('/collection/' + this.editable.id + '?_method=PUT')
      } else {
        form = this.form.post('/collection')
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
    hideModal() {
      this.showModal = false
      this.search()
    },
  },
}
</script>
