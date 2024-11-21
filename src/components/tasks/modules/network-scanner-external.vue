<template>
  <div class="mb-3">
    <p class="v-label sub-1">Configuration</p>

    <div class="columns">
      <div class="column is-half m-auto">
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

export default {
  components: { HasError },
  props: ['form', 'project', 'values'],
  async mounted() {
    if (!this.values['mode']) {
      // eslint-disable-next-line vue/no-mutating-props
      this.values['mode'] = 'light'
    }
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
