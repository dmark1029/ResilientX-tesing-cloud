<template>
  <div class="p-5">
    <p class="has-text-centered">
      If you don't find the tools you need, please don't hesitate to
      <router-link :to="{ name: 'Support' }" class="link has-text-white">
        contact us </router-link
      >.<br />
      We're here to assist you in integrating new features into our cybersecurity platform
      to better meet your requirements.
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['integration', 'project'],
  computed: {
    ...mapGetters(['general']),
  },
}
</script>
