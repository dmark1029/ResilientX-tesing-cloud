<template>
  <div v-if="needToShow() && !hide" class="is-relative processing-bar">
    <div class="columns mb-0 mt-3">
      <div class="column is-12">
        <VMessage closable class="" color="info" @close="handleClose">
          <i class="fa fa-exclamation-triangle mr-3"></i>
          <strong>ResilientX 2.0 BETA is Released.</strong> If you encounter any problems,
          let our team know! We appreciate your feedback!
        </VMessage>
      </div>
    </div>
  </div>
</template>

<script>
import VMessage from '/@src/components/base/message/VMessage.vue'
import permissionsMixin from '/@src/mixins/permissionsMixin'
import { mapGetters } from 'vuex'

export default {
  components: { VMessage },
  mixins: [permissionsMixin],
  data: () => ({
    hide: false,
  }),
  computed: {
    ...mapGetters(['workspace', 'general']),
  },
  methods: {
    needToShow() {
      return !window.localStorage.getItem('hideBetaMode')
    },
    handleClose() {
      this.hide = true
      window.localStorage.setItem('hideBetaMode', 'true')
    },
  },
}
</script>
