<template>
  <VDropdown icon="fas fa-ellipsis-v" spaced right>
    <template #content>
      <router-link
        v-if="$route.name !== 'ProjectCollectionView'"
        :to="{
          name: 'ProjectCollectionView',
          params: { id: item.project_id, collection: item.id },
        }"
        role="menuitem"
        href="#"
        class="dropdown-item is-media"
        @click.stop.prevent=""
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-eye" />
        </div>
        <div class="meta">
          <span>View</span>
          <span>View collection</span>
        </div>
      </router-link>
      <!--      <router-link-->
      <!--        :to="{-->
      <!--          name: 'ProjectCollectionReportView',-->
      <!--          params: { id: item.project_id, collection: item.id },-->
      <!--        }"-->
      <!--        role="menuitem"-->
      <!--        href="#"-->
      <!--        :class="-->
      <!--          item.scanned_date-->
      <!--            ? 'dropdown-item is-media'-->
      <!--            : 'dropdown-item is-media is-disabled'-->
      <!--        "-->
      <!--        @click.stop.prevent=""-->
      <!--      >-->
      <!--        <div class="icon">-->
      <!--          <i aria-hidden="true" class="fa fa-book" />-->
      <!--        </div>-->
      <!--        <div class="meta">-->
      <!--          <span>Report</span>-->
      <!--          <span>View collection report</span>-->
      <!--        </div>-->
      <!--      </router-link>-->
      <a
        :class="
          canPerformAction('collections', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="editCollection(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-pencil-alt" />
        </div>
        <div class="meta">
          <span>Edit</span>
          <span>Edit collection</span>
        </div>
      </a>
      <a
        :class="
          canPerformAction('collections', 'update')
            ? 'dropdown-item is-media'
            : 'dropdown-item is-media is-disabled'
        "
        @click.stop.prevent="manageAssets(item)"
      >
        <div class="icon">
          <i aria-hidden="true" class="fa fa-network-wired" />
        </div>
        <div class="meta">
          <span>Assets</span>
          <span>Manage assets</span>
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
  emits: ['editCollection', 'manageAssets'],
  methods: {
    manageAssets(item) {
      this.$emit('manageAssets', item)
    },
    editCollection(item) {
      this.$emit('editCollection', item)
    },
  },
}
</script>
