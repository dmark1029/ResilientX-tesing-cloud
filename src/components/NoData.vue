<template>
  <div v-if="meta?.total === 0" class="search-results-body">
    <!--Search Placeholder -->
    <VPlaceholderPage
      :title="
        search
          ? `We couldn't find any matching results.`
          : `We couldn't find any results.`
      "
      :subtitle="
        search
          ? `Too bad. Looks like we couldn't find any matching results for the search terms you've entered. Please try different search terms or criteria.`
          : `Too bad. Looks like we couldn't find any results.`
      "
      larger
    >
      <template #image>
        <img
          class="light-image"
          src="/@src/assets/illustrations/placeholders/search-7.svg"
          alt=""
        />
        <img
          class="dark-image"
          src="/@src/assets/illustrations/placeholders/search-7-dark.svg"
          alt=""
        />
      </template>
    </VPlaceholderPage>
  </div>
</template>

<script>
import VPlaceholderPage from '/@src/components/base/placeholder/VPlaceholderPage.vue'

export default {
  components: { VPlaceholderPage },
  props: ['meta', 'search'],
}
</script>