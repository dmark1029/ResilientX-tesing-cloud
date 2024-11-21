<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <a
        :class="
          canPerformAction('vendors', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="editAsset(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-pencil-alt" />
        </div>
        <div class="meta">
          <span>Edit</span>
          <span>Edit company</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>

<script>
import permissionsMixin from '/@src/mixins/permissionsMixin'
import VDropdown from '/@src/components/base/dropdown/VDropdown.vue'

export default {
  components: { VDropdown },
  mixins: [permissionsMixin],
  props: ['item'],
  emits: ['editAsset'],
  methods: {
    editAsset(item) {
      this.$emit('editAsset', item)
    },
  },
}
</script>
