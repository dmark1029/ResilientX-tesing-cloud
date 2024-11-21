<template>
  <div v-if="needToShow() && !hide" class="is-relative processing-bar">
    <div class="columns mb-0 mt-3">
      <div class="column is-12">
        <VMessage closable class="" color="danger" @close="hide = true">
          <i class="fa fa-exclamation-triangle mr-3"></i>
          <strong>Your license need attention.</strong> {{ text }}
          <router-link class="text-danger" :to="{ name: 'Sales' }">
            Contact us
          </router-link>
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
    text: 'Please contact us to renew your license.',
  }),
  computed: {
    ...mapGetters(['workspace', 'general']),
  },
  methods: {
    needToShow() {
      if (!this.workspace.activeLicense) {
        this.text =
          'You have not activated your license. Please contact us to activate your license.'
        return true
      }

      if (this.workspace.activeLicense.expired) {
        this.text = 'Your license has expired. Please contact us to renew your license.'
        return true
      }

      let text = 'Your license has reached the scan limit for Security App(s): '
      this.workspace.activeLicense.modules.forEach((module) => {
        if (!this.licenseCanCreateScan(this.workspace, module)) {
          text += module.name + ', '
        }
      })

      if (text !== 'Your license has reached the scan limit for Security App(s): ') {
        this.text = text.slice(0, -2) + '.'
        return true
      }

      if (!this.licenseCanCreateAsset(this.workspace)) {
        this.text =
          'Your license has reached the asset limit. Please contact us to increase it.'
        return true
      }

      if (!this.licenseCanCreateUser(this.workspace)) {
        this.text =
          'Your license has reached the user limit. Please contact us to increase it.'
        return true
      }

      if (!this.licenseCanCreateProject(this.workspace)) {
        this.text =
          'Your license has reached the project limit. Please contact us to increase it.'
        return true
      }

      if (!this.licenseCanCreateVendor(this.workspace)) {
        this.text =
          'Your license has reached the companies limit. Please contact us to increase it.'
        return true
      }

      return false
    },
  },
}
</script>
