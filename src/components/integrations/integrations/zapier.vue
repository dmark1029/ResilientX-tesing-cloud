<template>
  <div class="p-5 has-text-centered">
    <p class="mb-5">
      Integrate ResilientX with leading tools via Zapier.<br />
      Integration requires you to generate long lived personal access token in
      <router-link to="/profile">profile section.</router-link>
    </p>
    <a
      href="https://zapier.com/apps/resilientx/integrations"
      target="_blank"
      class="button v-button is-primary"
      >Add integration</a
    >
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
