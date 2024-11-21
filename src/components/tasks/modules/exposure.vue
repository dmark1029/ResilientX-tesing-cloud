<template>
  <p class="v-label sub-1">Configuration</p>

  <div class="field">
    <div class="control is-agree">
      <label class="checkbox is-outlined p-0">
        <!-- eslint-disable-next-line vue/no-mutating-props -->
        <input v-model="values['discovery']" type="checkbox" />
        <span />
        <span>With asset discovery</span>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  props: ['form', 'project', 'values'],
  data: () => ({}),
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
