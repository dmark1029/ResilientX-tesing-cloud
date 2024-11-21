<template>
  <div class="columns is-vcentered">
    <div class="column is-narrow">
      <div
        v-if="data?.meta?.last_page !== 1"
        class="v-flex flex-pagination pagination is-rounded mb-1"
        role="navigation"
        aria-label="pagination"
        style="
          --2bb32f35: flex;
          --70bdd17b: row;
          --0a2a8e64: nowrap;
          --1fc1dc74: space-between;
          --66f185e6: normal;
          --2b3be11f: normal;
          --6d71a372: normal;
          --4ba38015: normal;
        "
      >
        <RenderlessPagination
          v-slot="slotProps"
          :data="data"
          :limit="limit"
          :keep-length="keepLength"
          @pagination-change-page="onPaginationChangePage"
        >
          <ul
            v-if="slotProps.computed.total > slotProps.computed.perPage"
            class="pagination-list"
            v-bind="$attrs"
            aria-label="Pagination"
          >
            <li>
              <a
                v-for="(page, key) in slotProps.computed.pageRange"
                :key="key"
                :aria-current="slotProps.computed.currentPage ? 'page' : null"
                :class="
                  slotProps.computed.currentPage === page
                    ? 'router-link-active router-link-exact-active pagination-link is-current'
                    : 'pagination-link'
                "
                v-on="slotProps.pageButtonEvents(page)"
              >
                {{ page }}
              </a>
            </li>
          </ul>
        </RenderlessPagination>
      </div>
    </div>
    <div class="column is-narrow is-hidden-mobile">
      <div v-if="data && data?.meta && data?.meta?.last_page !== 1">
        <p>{{ data.meta.total }} records found</p>
      </div>
    </div>
    <div
      v-if="data && data?.meta && data?.meta?.last_page !== 1 && perPage !== ''"
      class="column is-hidden-mobile"
    >
      <div class="is-flex is-justify-content-end">
        <div class="is-flex is-justify-content-end" style="max-width: 300px">
          <p class="mt-2 mr-4">Items per page:</p>
          <div class="select d-inline-block" style="width: 80px">
            <select
              v-model="limitPerPage"
              style="width: 80px"
              class="input v-input"
              @change="onPerPageChange($event)"
            >
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RenderlessPagination from 'laravel-vue-pagination/src/RenderlessPagination.vue'

export default {
  components: {
    RenderlessPagination,
  },
  inheritAttrs: false,

  props: {
    data: {
      type: Object,
      default: () => {},
    },
    limit: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: String,
      default: '',
    },
    keepLength: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['pagination-change-page', 'per-page-change'],
  data() {
    return {
      limitPerPage: this.perPage,
    }
  },
  methods: {
    onPaginationChangePage(page) {
      this.$emit('pagination-change-page', page)
    },
    onPerPageChange(event) {
      this.$emit('per-page-change', event.target.value)
    },
  },
}
</script>