<template>
  <div class="mb-3">
    <p class="v-label sub-1">Configuration</p>

    <div class="columns">
      <div class="column is-8">
        <div class="field">
          <label class="label">VM ID</label>
          <div class="select">
            <!-- eslint-disable-next-line vue/no-mutating-props -->
            <select v-model="values['vm_id']" class="form-select">
              <option :value="undefined">Select type</option>
              <option v-for="vm in vms" :key="vm.id" :value="vm.id">
                [{{ vm?.external?.is_online ? 'Online' : 'Offline' }}]
                {{ vm?.external?.vm_name }} - {{ vm?.data?.vm_id ?? '-' }}, last online
                {{ vm?.external?.last_online ? vm.external.last_online : 'Never' }}
              </option>
            </select>
          </div>
          <HasError :form="form" field="values.vm_id" />
        </div>
      </div>
      <div class="column is-4">
        <div class="field">
          <label class="label">Scan mode</label>
          <div class="select">
            <!-- eslint-disable-next-line vue/no-mutating-props -->
            <select v-model="values['mode']" class="form-select">
              <option :value="undefined">Select mode</option>
              <option value="light">Light</option>
              <option value="full">Full</option>
            </select>
          </div>
          <HasError :form="form" field="values.scan_mode" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { HasError } from 'vform/src/components/bootstrap5'
import { axios } from '@/axios'

export default {
  components: { HasError },
  props: ['form', 'project', 'values'],
  data: () => ({
    vms: [],
  }),
  async mounted() {
    if (!this.values['mode']) {
      // eslint-disable-next-line vue/no-mutating-props
      this.values['mode'] = 'light'
    }
    if (!this.values['aggression']) {
      // eslint-disable-next-line vue/no-mutating-props
      this.values['aggression'] = 'medium'
    }
    if (!this.values['vm_id']) {
      // eslint-disable-next-line vue/no-mutating-props
      this.values['vm_id'] = undefined
    }

    this.getIntegrations()
  },
  methods: {
    getIntegrations() {
      return axios
        .get(`/integration/nss/${this.project.id}`)
        .then((res) => {
          this.vms = res.data.data.sort((a, b) => {
            if (a.external?.is_online && !b.external?.is_online) {
              return -1
            }
            if (!a.external?.is_online && b.external?.is_online) {
              return 1
            }
            return 0
          })
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped>
.sub-1 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.33;
  letter-spacing: normal;
  margin-bottom: 10px;
}
</style>
